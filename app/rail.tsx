import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Bust, EmptySeat } from '@/components/Bust';
import { Board } from '@/components/Card';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { RailStrip } from '@/components/RailStrip';
import { ReactionMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { Flight } from '@/components/table/Flight';
import { CAST, CROWD, PRIYA, RAIL, type SeatId, TAPE, THROWABLES } from '@/data/fixtures';
import { EASE } from '@/design/motion';
import { amber, chips, ink, INK, MS } from '@/design/tokens';

/**
 * Ask 5 — the rail. The screen that earns the name.
 *
 * You are outside the line: the table is drawn closed, six notches and none of
 * them yours, and you stand at a literal 1px rule with the crowd hanging off it.
 * 5a keeps the table as the subject and 5b makes the record the subject — the
 * designer's call was to ship 5a and make the tape a swipe-up on the same
 * screen, since they are the same data at two distances, so that is what this
 * is: swipe up for the tape, down for the table.
 */

/** Where each drawn seat sits on the rail's plan. */
const RAIL_SEATS: Record<number, { x: number; y: number }> = {
  3: { x: 64, y: 76 },
  4: { x: 316, y: 76 },
  5: { x: 4, y: 228 },
  6: { x: 316, y: 376 },
  7: { x: 4, y: 228 },
};

export default function RailScreen() {
  const router = useRouter();
  const [view, setView] = useState<'table' | 'tape'>('table');
  const [free, setFree] = useState(RAIL.freeThrows);
  const [joining, setJoining] = useState(false);
  const [flight, setFlight] = useState<{ id: number; face: string; to: { x: number; y: number } } | null>(null);
  const [landed, setLanded] = useState<{ seat: number; face: string } | null>(null);

  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-20, 20])
        .onEnd((e) => {
          if (e.translationY < -50) runOnJS(setView)('tape');
          if (e.translationY > 50) runOnJS(setView)('table');
        }),
    [],
  );

  const throwAt = (face: string, seat: SeatId) => {
    if (free <= 0 || flight) return;
    const anchor = RAIL_SEATS[seat] ?? RAIL_SEATS[3];
    setFlight({ id: Date.now(), face, to: { x: anchor.x + 20, y: anchor.y - 8 } });
    setFree((n) => n - 1);
  };

  return (
    <GestureDetector gesture={swipe}>
      <View style={{ flex: 1 }}>
        <Screen height={720}>
          <Box l={20} t={18}>
            <Mono size={9} tracking={0.18} color={ink(0.55)}>
              TABLE {RAIL.table} · {view === 'table' ? RAIL.stakes : `HAND ${chips(TAPE.handNo)}`}
            </Mono>
          </Box>
          <Box r={20} t={18}>
            <Mono size={9} tracking={0.14} color={ink(0.55)}>
              {chips(RAIL.watching)} WATCHING
            </Mono>
          </Box>
          <Rule l={0} t={44} w={420} color={ink(0.14)} />

          {view === 'table' ? (
            <Vantage landed={landed} joining={joining} />
          ) : (
            <Tape />
          )}

          {/* The rail. One rule, the crowd hanging off it, yours lit. */}
          <Box l={20} t={view === 'table' ? 488 : 472}>
            <Mono size={8} tracking={0.24} color={ink(0.45)}>
              THE RAIL
            </Mono>
          </Box>
          {view === 'table' ? (
            <Box r={20} t={488}>
              <Mono size={8} tracking={0.1} color={ink(0.45)}>
                {chips(RAIL.watching - (joining ? 1 : 0))}
              </Mono>
            </Box>
          ) : null}
          <RailStrip
            l={20}
            t={view === 'table' ? 504 : 488}
            faces={[CAST[1].face, ...CROWD.slice(0, view === 'table' ? 6 : 3)]}
            more={RAIL.watching - (view === 'table' ? 7 : 4)}
            size={joining ? 20 : 26}
            ruleWidth={400}
            youIndex={joining ? -1 : 0}
          />
          {view === 'table' && !joining ? (
            <Box l={20} t={538}>
              <Mono size={7} tracking={0.16} color={ink(0.5)}>
                YOU
              </Mono>
            </Box>
          ) : null}

          <Rule l={0} t={560} w={420} color={ink(0.12)} />
          <Box l={20} t={572}>
            <Mono size={7} tracking={0.2} color={ink(0.4)}>
              {view === 'table' ? 'THROW · HOLLOW FROM THE RAIL' : 'REACT TO OKONKWO’S DECISION'}
            </Mono>
          </Box>
          <Box r={20} t={572}>
            <Mono size={7} tracking={0.1} color={amber()}>
              {free} / {RAIL.freeThrowCap} FREE{view === 'table' ? ` · RESETS ${RAIL.resets}` : ''}
            </Mono>
          </Box>

          <Box l={20} t={590} w={368} h={52} style={{ flexDirection: 'row' }}>
            {THROWABLES.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => item.owned && throwAt(item.face, 3)}
                disabled={!item.owned || free <= 0}
                style={({ pressed }) => ({
                  width: 92,
                  height: 52,
                  borderWidth: 1,
                  borderLeftWidth: i === 0 ? 1 : 0,
                  borderColor: ink(0.3),
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  opacity: item.owned ? 1 : 0.4,
                  backgroundColor: pressed && item.owned ? amber(0.1) : undefined,
                })}
              >
                <Mono size={20}>{item.face}</Mono>
                <Mono size={7} tracking={0.14} color={ink(0.5)}>
                  {item.name}
                </Mono>
              </Pressable>
            ))}
          </Box>

          {/* Join. Under either watch model. */}
          {view === 'table' ? (
            <Pressable
              onPress={() => setJoining(true)}
              disabled={joining}
              style={({ pressed }) => ({
                position: 'absolute',
                left: 20,
                top: 660,
                width: 380,
                height: 44,
                borderWidth: 1,
                borderLeftWidth: 3,
                borderColor: INK,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 14,
                paddingRight: 12,
                backgroundColor: pressed ? '#17181a' : undefined,
              })}
            >
              <Sans size={13} weight={500} tracking={0.02}>
                Take seat 1
              </Sans>
              <Mono size={9} tracking={0.1} color={ink(0.6)}>
                MIN {chips(RAIL.minBuyIn)}
              </Mono>
            </Pressable>
          ) : (
            <>
              <Box
                l={20}
                t={642}
                w={380}
                h={44}
                style={{
                  borderWidth: 1,
                  borderColor: ink(0.4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 14,
                  paddingRight: 12,
                }}
              >
                <Sans size={13} weight={500} tracking={0.02} color={ink(0.75)}>
                  Join waitlist
                </Sans>
                <Mono size={9} tracking={0.1} color={ink(0.5)}>
                  {TAPE.waitlist.ahead} AHEAD · {TAPE.waitlist.eta}
                </Mono>
              </Box>
              <Box l={20} t={698}>
                <Mono size={7} tracking={0.16} color={ink(0.3)}>
                  TABLE FULL · SEAT 1 OPENS WHEN TOMÁS SITS OUT
                </Mono>
              </Box>
            </>
          )}

          {flight ? (
            <Flight
              key={flight.id}
              from={{ x: 60, y: 505 }}
              to={flight.to}
              face={flight.face}
              hollow
              onLand={() => {
                setLanded({ seat: 3, face: flight.face });
                setFlight(null);
              }}
            />
          ) : null}

          {joining ? <Join onSeated={() => router.replace('/table')} /> : null}

          {!joining ? (
            <Box l={0} t={view === 'table' ? 712 : 712} w={420} style={{ alignItems: 'center' }}>
              <Mono size={6.5} tracking={0.2} color={ink(0.25)}>
                {view === 'table' ? 'SWIPE UP FOR THE TAPE' : 'SWIPE DOWN FOR THE TABLE'}
              </Mono>
            </Box>
          ) : null}
        </Screen>
      </View>
    </GestureDetector>
  );
}

/** 5a — the table is the subject. Drawn whole and closed: six notches, none yours. */
function Vantage({
  landed,
  joining,
}: {
  landed: { seat: number; face: string } | null;
  joining: boolean;
}) {
  const dim = joining ? 0.45 : 1;
  return (
    <View style={{ opacity: dim }} pointerEvents="none">
      <Rule l={20} t={96} w={36} color={ink(0.22)} />
      <Rule l={108} t={96} w={200} color={ink(0.22)} />
      <Rule l={360} t={96} w={40} color={ink(0.22)} />
      <Rule l={20} t={396} w={36} color={ink(0.22)} />
      <Rule l={108} t={396} w={200} color={ink(0.22)} />
      <Rule l={360} t={396} w={40} color={ink(0.22)} />
      <Rule l={20} t={96} h={132} vertical color={ink(0.22)} />
      <Rule l={20} t={284} h={112} vertical color={ink(0.22)} />
      <Rule l={400} t={96} h={132} vertical color={ink(0.22)} />
      <Rule l={400} t={284} h={112} vertical color={ink(0.22)} />

      <Bust
        l={64}
        t={76}
        size={40}
        emoji={CAST[3].face}
        frame="lit"
        seat={3}
        seatChip="bone"
        headStrip={landed ? 'amber' : false}
        headStripAlpha={0.8}
      />
      {/* A rail throw arrives hollow, so a seated player can always tell a table
          reaction from a crowd reaction. */}
      {landed ? (
        <View
          style={{
            position: 'absolute',
            left: 78,
            top: 46,
            width: 12,
            height: 12,
            borderWidth: 1,
            borderColor: amber(),
            transform: [{ rotate: '45deg' }],
          }}
        />
      ) : null}
      <Box l={112} t={80} style={{ gap: 4 }}>
        <Sans size={8} tracking={0.2}>
          {CAST[3].name}
        </Sans>
        <Mono size={13} weight={500}>
          {chips(RAIL.seats[0].stack)}
        </Mono>
      </Box>
      <Box l={112} t={110}>
        <Mono size={9} weight={500} tracking={0.1} color={ink(0.5)}>
          {RAIL.seats[0].action}
        </Mono>
      </Box>

      <Bust l={316} t={76} size={40} emoji={CAST[4].face} frame="rest" seat={4} seatChip="bone" />
      <Box r={112} t={80} style={{ alignItems: 'flex-end', gap: 4 }}>
        <Sans size={8} tracking={0.2}>
          {CAST[4].name}
        </Sans>
        <Mono size={13} weight={500}>
          {chips(RAIL.seats[1].stack)}
        </Mono>
      </Box>
      <Box r={112} t={110}>
        <Mono size={9} weight={500} tracking={0.1}>
          {RAIL.seats[1].action}
        </Mono>
      </Box>

      <Bust l={4} t={228} size={40} emoji={CAST[5].face} frame="dim" folded opacity={0.4} />
      <Box l={52} t={236} style={{ gap: 4, opacity: 0.34 }}>
        <Sans size={8} tracking={0.2}>
          {CAST[5].name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(CAST[5].stack)}
        </Mono>
      </Box>
      <Bust r={4} t={228} size={40} emoji={CAST[6].face} frame="dim" folded opacity={0.4} />
      <Box r={52} t={236} style={{ alignItems: 'flex-end', gap: 4, opacity: 0.34 }}>
        <Sans size={8} tracking={0.2}>
          {CAST[6].name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(CAST[6].stack)}
        </Mono>
      </Box>

      <Bust l={316} t={376} size={40} emoji={PRIYA.face} frame="dim" folded opacity={0.44} />
      <Box r={112} t={384} style={{ alignItems: 'flex-end', gap: 4, opacity: 0.34 }}>
        <Sans size={8} tracking={0.2}>
          {PRIYA.name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(PRIYA.stack)}
        </Mono>
      </Box>

      <EmptySeat l={64} t={376} size={40} index="01" reticle={joining} />
      <Box l={112} t={388}>
        <Mono size={8} tracking={0.2} color={ink(0.5)}>
          SEAT OPEN
        </Mono>
      </Box>

      <Box l={0} t={150} w={420} style={{ alignItems: 'center', gap: 7 }}>
        <Sans size={8} tracking={0.3} color={ink(0.4)}>
          POT
        </Sans>
        <Mono size={34} weight={700} tracking={-0.04} lh={0.86}>
          {chips(RAIL.pot)}
        </Mono>
      </Box>
      <Board l={129} t={218} cards={RAIL.board} w={30} h={44} gap={3} />
      <Box l={0} t={274} w={420} style={{ alignItems: 'center' }}>
        <Mono size={7} tracking={0.26} color={ink(0.35)}>
          {RAIL.street}
        </Mono>
      </Box>

      <Box l={20} t={426} w={380}>
        <Mono size={8} tracking={0.06} color={ink(0.42)} lh={1.6}>
          {RAIL.tape}
          <Mono size={8} color={amber()}>
            {RAIL.clock}
          </Mono>
        </Mono>
      </Box>
    </View>
  );
}

/** 5b — the record is the subject. The hand becomes the page. */
function Tape() {
  let y = 130;
  return (
    <View pointerEvents="none">
      <Board l={20} t={62} cards={RAIL.board} w={26} h={36} gap={3} />
      <Box r={20} t={60} style={{ alignItems: 'flex-end', gap: 5 }}>
        <Sans size={7} tracking={0.3} color={ink(0.4)}>
          POT
        </Sans>
        <Mono size={24} weight={700} tracking={-0.03} lh={0.9}>
          {chips(RAIL.pot)}
        </Mono>
      </Box>
      <Rule l={0} t={118} w={420} color={ink(0.14)} />

      {TAPE.rows.map((row, i) => {
        const top = y;
        y += row.street ? 74 : 54;
        return (
          <View key={i}>
            {row.street ? (
              <Box l={48} t={top}>
                <Mono size={7} tracking={0.26} color={ink(0.3)}>
                  {row.street}
                </Mono>
              </Box>
            ) : null}
            <Bust
              l={48}
              t={top + (row.street ? 20 : 0)}
              size={24}
              emoji={CAST[row.seat].face}
              frame="rest"
            />
            <Box l={80} t={top + (row.street ? 22 : 2)} style={{ gap: 5 }}>
              <Sans size={8} tracking={0.2}>
                {CAST[row.seat].name}
              </Sans>
              <Mono size={8} tracking={0.14} color={row.loud ? ink() : ink(0.45)}>
                {row.action}
              </Mono>
            </Box>
            <Box r={20} t={top + (row.street ? 22 : 2)}>
              <Mono size={15} weight={row.loud ? 700 : 500}>
                {chips(row.amount)}
              </Mono>
            </Box>
            {/* Rail reactions are margin annotations, pinned to the action they answered. */}
            {row.reactions ? (
              <Box l={20} t={top + (row.street ? 24 : 4)} style={{ gap: 3 }}>
                <Ticks
                  l={0}
                  t={0}
                  w={14}
                  h={Math.min(23, 5 + row.reactions * 0.8)}
                  pitch={5}
                  color={row.reactions >= 24 ? amber() : amber(0.8)}
                  style={{ position: 'relative' }}
                />
                <Mono size={7} color={amber()}>
                  {row.reactions}
                </Mono>
              </Box>
            ) : null}
            <Box
              l={48}
              t={top + (row.street ? 56 : 36)}
              w={352}
              h={2}
              style={{ backgroundColor: ink(0.08) }}
            >
              <View
                style={{ width: `${row.pot}%`, height: 2, backgroundColor: row.loud ? INK : ink(0.5) }}
              />
            </Box>
          </View>
        );
      })}

      <Box l={48} t={386}>
        <Mono size={7} tracking={0.26} color={ink(0.3)}>
          {TAPE.current.street}
        </Mono>
      </Box>
      <Rule l={40} t={406} h={56} vertical weight={2} color={INK} />
      <Bust l={48} t={410} size={24} emoji={CAST[TAPE.current.seat].face} frame="lit" />
      <Box l={80} t={412} style={{ gap: 5 }}>
        <Sans size={8} tracking={0.2}>
          {CAST[TAPE.current.seat].name}
        </Sans>
        <Mono size={8} tracking={0.14} color={ink(0.6)}>
          {TAPE.current.note}
        </Mono>
      </Box>
      <Box r={20} t={410}>
        <Mono size={13} weight={700} color={amber()}>
          {TAPE.current.clock}
        </Mono>
      </Box>
      <Box l={48} t={446} w={352} h={2} style={{ backgroundColor: ink(0.1) }}>
        <View style={{ width: `${TAPE.current.pot}%`, height: 2, backgroundColor: amber() }} />
      </Box>
    </View>
  );
}

/**
 * 5c — joining, 620ms. Your bust never teleports: it leaves the rail, travels
 * the dashed path the throwables use, and the hairline closes around it.
 */
function Join({ onSeated }: { onSeated: () => void }) {
  const [beat, setBeat] = useState(0);
  const travel = useSharedValue(0);
  const [buyIn] = useState(6000);

  useEffect(() => {
    travel.value = withSequence(
      withTiming(0.5, { duration: MS.exit, easing: EASE.slide }),
      withTiming(1, { duration: MS.open, easing: EASE.settle }),
    );
    const a = setTimeout(() => setBeat(1), MS.exit);
    const b = setTimeout(() => setBeat(2), MS.join);
    const c = setTimeout(onSeated, MS.join + 420);
    return () => [a, b, c].forEach(clearTimeout);
  }, [onSeated, travel]);

  const style = useAnimatedStyle(() => {
    const p = travel.value;
    return {
      transform: [
        { translateX: 20 + (64 - 20) * p },
        { translateY: 505 + (376 - 505) * p },
        { scale: 1 + 0.04 * Math.sin(Math.PI * p) },
      ],
    };
  });

  return (
    <>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, style]}>
        <Bust
          l={0}
          t={0}
          size={beat >= 2 ? 40 : 26}
          emoji={CAST[1].face}
          frame={beat >= 2 ? 'bone' : 'target'}
          headStrip={beat >= 2 ? 'ink' : false}
          seat={beat >= 2 ? 1 : undefined}
          seatChip={beat >= 2 ? 'bone' : 'none'}
          style={{ position: 'relative' }}
        />
      </Animated.View>

      {beat === 1 ? (
        <>
          <Box l={20} t={600} style={{ gap: 6 }}>
            <Sans size={7} tracking={0.24} color={ink(0.45)}>
              BUY IN
            </Sans>
            <Mono size={30} weight={700} tracking={-0.04}>
              {chips(buyIn)}
            </Mono>
          </Box>
          <Ticks l={20} t={656} w={380} h={5} pitch={11} color={ink(0.3)} />
          <Box l={20} t={650} w={380} h={1} style={{ backgroundColor: ink(0.28) }}>
            <View style={{ width: '26%', height: 1, backgroundColor: INK }} />
          </Box>
          <Rule l={118} t={642} h={18} vertical color={INK} />
          <View
            style={{
              position: 'absolute',
              left: 114,
              top: 636,
              width: 9,
              height: 9,
              backgroundColor: INK,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <Box l={20} t={664} w={380} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['MIN', '40BB', '100BB', 'MAX'].map((s, i) => (
              <Mono key={s} size={6.5} tracking={0.1} color={i === 1 ? INK : ink(0.35)}>
                {s}
              </Mono>
            ))}
          </Box>
        </>
      ) : null}

      {beat >= 2 ? (
        <>
          <Box l={112} t={382} style={{ gap: 5 }}>
            <Sans size={7} tracking={0.24} color={ink(0.45)}>
              YOU
            </Sans>
            <Mono size={20} weight={700} tracking={-0.03}>
              {chips(buyIn)}
            </Mono>
          </Box>
          <Box l={20} t={600}>
            <Mono size={8} tracking={0.16} color={ink(0.55)}>
              SEATED · POSTING BB NEXT HAND
            </Mono>
          </Box>
        </>
      ) : null}
    </>
  );
}
