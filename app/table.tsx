import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LeaveMark } from '@/components/AppShell';
import { Bust } from '@/components/Bust';
import { PlayingCard } from '@/components/Card';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { Screen } from '@/components/Screen';
import { Flight } from '@/components/table/Flight';
import {
  AllInBar,
  BetSlider,
  Clock,
  FoldedBar,
  WaitingBar,
  YourTurnBar,
} from '@/components/table/Instruments';
import { Boundary, Community, Header, HeroRow, Pot, Seat } from '@/components/table/Surface';
import { type DragState, Targeting } from '@/components/table/Targeting';
import { CAST, HAND, LOSS, type SeatId, type Throwable, WIN } from '@/data/fixtures';
import { CHROME, headStrip, SEATS } from '@/data/tableLayout';
import { EASE } from '@/design/motion';
import { amber, chips, ink, MS } from '@/design/tokens';
import { useCooldown, useCountdown } from '@/state/meters';
import { useCount, useShowdown } from '@/state/useShowdown';
import { useTable } from '@/state/useTable';

/**
 * Ask 1a, 2a–2f, 3b and 4a/4b, on one surface.
 *
 * The states are not separate screens: the action bar swaps, the instrument
 * takes the bottom third, the tray replaces the bar, and the showdown plays
 * over the live table without covering the board — which is the whole point of
 * the sequence. Nothing here is a modal.
 */
/** Between hands the board is drawn as five empty streets. */
const EMPTY_BOARD = [null, null, null, null, null];

export default function TableScreen() {
  const api = useTable();
  const cooldown = useCooldown(api.cooldownUntil);
  const clock = useCountdown(HAND.clockSeconds, api.phase === 'your-turn', api.timeout);

  const [tray, setTray] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [flight, setFlight] = useState<{
    id: number;
    from: { x: number; y: number };
    to: { x: number; y: number };
    seat: SeatId;
    throwable: Throwable;
  } | null>(null);

  const isShowdown = api.phase === 'showdown';
  const lost = api.outcome === 'loss';
  const sd = lost ? LOSS : WIN;
  const { beat, skip } = useShowdown(isShowdown, api.nextHand);

  const potTravel = useSharedValue(0);
  const punch = usePunch(beat >= 3 && !lost);

  const potStyle = useAnimatedStyle(() => {
    const p = potTravel.value;
    const hero = SEATS[1];
    return {
      opacity: 1 - p * 0.65,
      transform: [
        { translateX: p * (hero.x + hero.size / 2 - 210) },
        { translateY: p * (hero.y + hero.size / 2 - 291) },
        { scale: 1 - p * 0.45 },
      ],
    };
  });

  // T+320 — the numeral is the only object that travels, and it takes 18ms of
  // anticipation upward before it goes.
  useEffect(() => {
    if (beat >= 2 && !lost) {
      potTravel.value = withSequence(
        withTiming(-0.02, { duration: 18 }),
        withTiming(1, { duration: 340, easing: EASE.arc }),
      );
    } else {
      potTravel.value = 0;
    }
  }, [beat, lost, potTravel]);

  const stackDisplay = useCount(
    lost ? LOSS.stackFrom : api.stack,
    lost ? LOSS.stackTo : WIN.stackTo,
    MS.count,
    beat >= 3,
    lost ? 0 : 0.03,
  );

  const targets = useMemo<SeatId[]>(() => [2, 3, 4, 5, 6], []);
  const residueFor = (seat: SeatId) => api.residue.find((r) => r.seat === seat);

  const fire = (seat: SeatId, throwable: Throwable) => {
    setFlight({ id: Date.now(), from: { x: 210, y: CHROME.tray.y }, to: headStrip(seat), seat, throwable });
  };

  const showBar = !isShowdown && !tray;
  const showdownLocked = beat >= 1;

  return (
    <Screen>
      {/* Nothing has to be dismissed; a tap anywhere skips to T+900. */}
      {isShowdown ? <Pressable style={{ position: 'absolute', inset: 0 }} onPress={skip} /> : null}

      <Header watching={HAND.watching + (api.phase === 'folded' ? 1 : 0)} reacted={!isShowdown} />
      {/*
        The way out, and the only piece of shell this screen takes. The table's
        own header is the design — the RAIL wordmark at mono 14/.36 on
        CHROME.header, over a 1px rule at y=88, sized so the surface below it
        keeps every unit the handoff drew — so the shared masthead is not used
        here: a 20/700 wordmark and a 2px rule at y=56 would push the boundary,
        the pot and the instrument down a fit canvas that cannot reflow.
        What replaces the old invisible 140×40 tap target over the wordmark is
        the mark itself: a 2px bone stub *added* to that header rule, because the
        bar's notch is a subtraction that says you are here, and returning is its
        inverse. It names what you are leaving in the same agate the eyebrows are
        set in, and it is the top of the screen on purpose — the bottom 190 units
        are the instrument (clock rule 720, action bar 722–810, cooldown to 858),
        and per §2 nothing that leaves the table may sit a thumb-width from ALL IN.
      */}
      <LeaveMark
        label="LEAVE THE TABLE"
        ruleY={CHROME.header.rule}
        fallback="/tables"
        place="above"
      />
      <Boundary />

      {/* The seats. Busts sit outside the hairline; the line breaks where one is. */}
      <Seat seat={2} tone="folded" action="FOLD" />
      <Seat
        seat={3}
        tone={lost && showdownLocked ? 'live' : 'live'}
        action={isShowdown ? undefined : 'BET 600'}
        bet={isShowdown ? undefined : HAND.bets[3]}
        stack={lost && beat >= 3 ? LOSS.winnerStackTo : undefined}
        residue={residueFor(3)}
        targeted={drag?.target === 3}
        reticle={drag?.target === 3 ? 'aim' : beat >= 2 && lost ? 'corners' : 'none'}
        reticleColor={beat >= 2 && lost ? amber() : undefined}
        landing={drag?.target === 3}
      />
      <Seat
        seat={4}
        tone="rest"
        action={isShowdown ? undefined : 'CALL 600'}
        bet={isShowdown ? undefined : HAND.bets[4]}
        residue={residueFor(4)}
        targeted={drag?.target === 4}
        reticle={drag?.target === 4 ? 'aim' : 'none'}
        landing={drag?.target === 4}
      />
      <Seat seat={5} tone="folded" action="FOLD" residue={residueFor(5)} targeted={drag?.target === 5} landing={drag?.target === 5} />
      <Seat
        seat={6}
        tone="folded"
        action="FOLD"
        dealer
        residue={residueFor(6)}
        targeted={drag?.target === 6}
        landing={drag?.target === 6}
      />

      {beat < 3 && api.phase !== 'dealing' ? (
        <Pot amount={isShowdown ? sd.pot : HAND.pot} style={potStyle} />
      ) : null}

      <Community
        cards={api.phase === 'dealing' ? EMPTY_BOARD : isShowdown ? sd.board : HAND.board}
        liveIndex={isShowdown ? undefined : 3}
        lockedIndexes={showdownLocked ? (lost ? LOSS.winnerPlayingFive : WIN.playingFive) : undefined}
        street={isShowdown || api.phase === 'dealing' ? undefined : HAND.street}
        opacity={beat >= 2 && !lost ? 0.5 : beat >= 3 ? 0.22 : undefined}
      />

      {/* T+140 — the hand is named in 7px mono, not a banner. */}
      {showdownLocked && beat < 5 ? (
        <Box l={0} t={CHROME.street.y} w={420} style={{ alignItems: 'center' }}>
          <Mono size={8} tracking={0.2} color={ink(0.55)}>
            {lost ? LOSS.winnerHand : WIN.hand}
          </Mono>
        </Box>
      ) : null}

      {beat === 5 ? (
        <Box l={0} t={CHROME.street.y} w={420} style={{ alignItems: 'center' }}>
          <Mono size={8} tracking={0.24} color={ink(0.3)}>
            HAND {chips(api.handNo)} · DEALING
          </Mono>
        </Box>
      ) : null}

      {/* Your row, in whichever state the hand has left you in. */}
      {api.phase === 'your-turn' ? <HeroRow stack={api.stack} /> : null}

      {api.phase === 'raising' ? (
        <>
          {HAND.hole.map((card, i) => (
            <PlayingCard
              key={i}
              l={CHROME.hole.x + i * (CHROME.hole.w + CHROME.hole.gap)}
              t={CHROME.hole.y}
              w={CHROME.hole.w}
              h={CHROME.hole.h}
              rank={card.rank}
              suit={card.suit}
              tone="face"
            />
          ))}
        </>
      ) : null}

      {api.phase === 'waiting' ? (
        <HeroRow stack={api.stack} cardsTone="faceMuted" dim={0.85} />
      ) : null}

      {api.phase === 'folded' ? <FoldedRow stack={api.stack} watching={HAND.watching + 1} /> : null}

      {api.phase === 'all-in' ? <AllInRow committed={api.amount} /> : null}

      {api.phase === 'dealing' ? (
        <>
          <Bust
            l={SEATS[1].x}
            t={SEATS[1].y}
            size={SEATS[1].size}
            emoji={CAST[1].face}
            frame="lit"
            seat={1}
            seatChip="bone"
          />
          <Box l={SEATS[1].labelX} t={SEATS[1].labelY} style={{ gap: 7 }}>
            <Sans size={9} tracking={0.24} color={ink(0.4)}>
              YOU · SEAT 1
            </Sans>
            <Mono size={26} weight={700} tracking={-0.03}>
              {chips(api.stack)}
            </Mono>
          </Box>
          <Box l={0} t={CHROME.street.y} w={420} style={{ alignItems: 'center' }}>
            <Mono size={8} tracking={0.24} color={ink(0.3)}>
              HAND {chips(api.handNo)} · DEALING
            </Mono>
          </Box>
        </>
      ) : null}

      {isShowdown ? (
        <ShowdownRow
          beat={beat}
          lost={lost}
          stack={stackDisplay}
          delta={WIN.delta}
          punchStyle={punch}
          fromTheRail={WIN.fromTheRail}
        />
      ) : null}

      {/* The instrument. */}
      {showBar && api.phase === 'your-turn' ? (
        <>
          <Clock label="YOUR ACTION" seconds={clock.remaining} progress={clock.progress} mine />
          <YourTurnBar
            toCall={HAND.toCall}
            raiseTo={HAND.raiseTo}
            onFold={api.fold}
            onCall={api.call}
            onRaise={api.openRaise}
            onThrow={() => setTray(true)}
            cooldown={cooldown}
          />
        </>
      ) : null}

      {showBar && api.phase === 'raising' ? (
        <BetSlider
          amount={api.amount}
          onChange={api.setAmount}
          onCommit={() => api.raise(api.amount)}
          onCancel={api.cancelRaise}
          stack={api.stack}
        />
      ) : null}

      {showBar && api.phase === 'waiting' ? (
        <>
          <Clock label={`${CAST[3].name} TO ACT`} seconds={4.8} progress={0.4} mine={false} />
          <WaitingBar queued={api.queued} onQueue={api.queue} onThrow={() => setTray(true)} cooldown={cooldown} />
        </>
      ) : null}

      {showBar && api.phase === 'folded' ? (
        <FoldedBar nextHandIn={12} onThrow={() => setTray(true)} cooldown={cooldown} />
      ) : null}

      {showBar && api.phase === 'all-in' ? (
        <AllInBar runout={4} onThrow={() => setTray(true)} cooldown={cooldown} />
      ) : null}

      {tray ? (
        <Targeting
          targets={targets}
          cooldown={cooldown}
          onFire={fire}
          onClose={() => setTray(false)}
          onDragChange={setDrag}
        />
      ) : null}

      {flight ? (
        <Flight
          key={flight.id}
          from={flight.from}
          to={flight.to}
          face={flight.throwable.face}
          onLand={() => {
            api.land(flight.seat, flight.throwable.face);
            setFlight(null);
          }}
        />
      ) : null}

      <Rule l={0} t={CHROME.actionBar.rule} w={420} color={ink(0.14)} />
    </Screen>
  );
}

/** 2c — folded. You become a railbird at your own table. */
function FoldedRow({ stack, watching }: { stack: number; watching: number }) {
  return (
    <>
      {HAND.hole.map((_, i) => (
        <PlayingCard
          key={i}
          l={CHROME.hole.x + i * (CHROME.hole.w + CHROME.hole.gap)}
          t={CHROME.hole.y}
          w={CHROME.hole.w}
          h={CHROME.hole.h}
          tone="empty"
        />
      ))}
      <Box l={28} t={570}>
        <Mono size={7} tracking={0.2} color={ink(0.28)}>
          MUCKED
        </Mono>
      </Box>
      <Bust
        l={SEATS[1].x}
        t={SEATS[1].y + 18}
        size={SEATS[1].size}
        emoji={CAST[1].face}
        frame="dim"
        seat={1}
        seatChip="quiet"
        opacity={0.5}
      />
      <Box l={SEATS[1].labelX} t={594} style={{ gap: 7 }}>
        <Sans size={9} tracking={0.24} color={ink(0.3)}>
          YOU · FOLDED
        </Sans>
        <Mono size={26} weight={700} tracking={-0.03} color={ink(0.5)}>
          {chips(stack)}
        </Mono>
      </Box>

      <Box r={28} t={600} style={{ alignItems: 'flex-end', gap: 10 }}>
        <Sans size={8} tracking={0.22} color={ink(0.4)}>
          YOU ARE ON THE RAIL
        </Sans>
        <View style={{ width: 135, height: 10 }}>
          <Ticks l={0} t={0} w={135} h={10} pitch={9} color={ink(0.3)} />
          <Rule l={117} t={-2} h={14} vertical color={amber()} />
        </View>
        <Mono size={9} weight={500} tracking={0.1} color={ink(0.34)}>
          {watching} WATCHING
        </Mono>
      </Box>
    </>
  );
}

/** 2d — all in. No decisions left, so the readout replaces the control. */
function AllInRow({ committed }: { committed: number }) {
  return (
    <>
      {HAND.hole.map((card, i) => (
        <PlayingCard
          key={i}
          l={CHROME.hole.x + i * (CHROME.hole.w + CHROME.hole.gap)}
          t={CHROME.hole.y}
          w={CHROME.hole.w}
          h={CHROME.hole.h}
          rank={card.rank}
          suit={card.suit}
          tone="face"
        />
      ))}
      <Bust
        l={SEATS[1].x}
        t={SEATS[1].y}
        size={SEATS[1].size}
        emoji={CAST[1].face}
        frame="lit"
        seat={1}
        seatChip="bone"
      />
      <Box l={SEATS[1].labelX} t={576} style={{ gap: 8 }}>
        <Sans size={10} tracking={0.32} color={ink(0.55)}>
          ALL IN
        </Sans>
        <Mono size={46} weight={700} tracking={-0.045} lh={0.86}>
          {chips(committed)}
        </Mono>
      </Box>
      <Box r={28} t={582} style={{ alignItems: 'flex-end', gap: 7 }}>
        <Sans size={8} tracking={0.2} color={ink(0.42)}>
          POT
        </Sans>
        <Mono size={20} weight={500} tracking={-0.02}>
          {chips(12090)}
        </Mono>
        <Mono size={8} tracking={0.14} color={ink(0.4)}>
          3 WAY
        </Mono>
      </Box>
    </>
  );
}

/** 4a / 4b — the win and the losing seat, on the same 1.4s clock. */
function ShowdownRow({
  beat,
  lost,
  stack,
  delta,
  punchStyle,
  fromTheRail,
}: {
  beat: number;
  lost: boolean;
  stack: number;
  delta: number;
  punchStyle: ReturnType<typeof useAnimatedStyle>;
  fromTheRail: number;
}) {
  const g = SEATS[1];
  const cleared = beat >= 5;
  const dropped = lost && beat >= 1;

  return (
    <>
      {HAND.hole.map((card, i) =>
        cleared ? null : (
          <PlayingCard
            key={i}
            l={CHROME.hole.x + i * (CHROME.hole.w + CHROME.hole.gap)}
            t={CHROME.hole.y}
            w={CHROME.hole.w}
            h={CHROME.hole.h}
            rank={card.rank}
            suit={card.suit}
            tone={dropped ? 'outline' : 'face'}
            opacity={dropped ? 0.3 : undefined}
          />
        ),
      )}

      <Animated.View
        style={[
          { position: 'absolute', left: g.x, top: g.y + (dropped ? 3 : 0), width: g.size, height: g.size },
          punchStyle,
        ]}
      >
        <Bust
          l={0}
          t={0}
          size={g.size}
          emoji={CAST[1].face}
          frame={!lost && beat >= 2 && beat < 5 ? 'target' : lost ? 'dim' : 'lit'}
          headStrip={!lost && beat >= 2 ? 'amber' : false}
          seat={1}
          seatChip={!lost && beat >= 2 && beat < 5 ? 'amber' : 'bone'}
          opacity={dropped ? 0.42 : undefined}
          style={dropped ? ({ filter: [{ grayscale: 1 }] } as never) : undefined}
        />
      </Animated.View>

      {/* T+900 — railbird reactions arrive on the same strip a throwable uses. */}
      {!lost && beat === 4 ? (
        <>
          <Box r={28} t={g.y - 34} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 6, height: 6, backgroundColor: amber(), transform: [{ rotate: '45deg' }] }} />
            <Mono size={8} tracking={0.06} color={ink(0.55)}>
              {fromTheRail} FROM THE RAIL
            </Mono>
          </Box>
          <Ticks l={g.x - 1} t={g.y - 16} w={126} h={8} pitch={9} color={amber(0.7)} />
        </>
      ) : null}

      {beat >= 2 && !lost && beat < 3 ? (
        <Box r={28} t={g.y - 26}>
          <Mono size={7} weight={500} tracking={0.14} color={amber()}>
            INBOUND
          </Mono>
        </Box>
      ) : null}

      <Box l={g.labelX} t={g.labelY} style={{ gap: 7 }}>
        {beat >= 3 && !lost ? (
          <Mono size={8} tracking={0.1} color={amber()} style={{ opacity: beat >= 5 ? 0 : 1 }}>
            +{chips(delta)}
          </Mono>
        ) : null}
        <Sans size={beat >= 2 && !lost && beat < 3 ? 8 : 9} tracking={0.24} color={ink(0.45)}>
          {beat >= 2 && !lost && beat < 3 ? 'YOU WIN' : 'YOU · SEAT 1'}
        </Sans>
        <Mono
          size={cleared ? 26 : beat >= 4 ? 42 : beat >= 3 ? 40 : beat >= 2 && !lost ? 34 : 26}
          weight={700}
          tracking={-0.04}
          lh={0.86}
        >
          {chips(beat >= 2 && !lost && beat < 3 ? delta : stack)}
        </Mono>
      </Box>

      {beat === 4 && !lost ? <Rule l={g.labelX} t={g.labelY + 76} w={204} color={ink()} /> : null}
    </>
  );
}

/**
 * The only squash in the app: the bust punches 1.06x on impact for 90ms.
 */
function usePunch(active: boolean) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = active
      ? withSequence(
          withTiming(1.06, { duration: MS.punch, easing: EASE.settle }),
          withTiming(1, { duration: MS.mark, easing: EASE.out }),
        )
      : 1;
  }, [active, scale]);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}
