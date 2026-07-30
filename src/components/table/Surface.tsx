import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Bust } from '@/components/Bust';
import { Board, PlayingCard } from '@/components/Card';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { CAST, HAND, type SeatId } from '@/data/fixtures';
import { BET_CHIP, BOUNDARY, CHROME, SEATS } from '@/data/tableLayout';
import { amber, AMBER_LIGHT, chips, GROUND, ink } from '@/design/tokens';
import type { Residue } from '@/state/useTable';

/**
 * The table itself: chrome, boundary, seats, pot, board and your row.
 * Everything is drawn — there is no felt, no oval and no simulated surface.
 */

export function Header({ watching, reacted = true }: { watching: number; reacted?: boolean }) {
  return (
    <>
      {/*
        The mark's size is per canvas — 14 here against the masthead's 20 — but
        its letterfit is not: 10a rule 01 is "MONO 700, TRACKING .26EM, NEVER
        ANOTHER FACE", so the table's header sets the same .26 the masthead and
        the boot mark do. (The 1a panel drew this one at .36, before 10a named
        the mark as a system.)
      */}
      <Box l={20} t={CHROME.header.wordmark.y}>
        <Mono size={14} weight={700} tracking={0.26}>
          RAIL
        </Mono>
      </Box>
      <Box r={20} t={CHROME.header.stakes.y}>
        <Mono size={9} tracking={0.16} color={ink(0.42)}>
          {HAND.blinds} · PLAY CHIPS ONLY
        </Mono>
      </Box>
      <Rule l={0} t={CHROME.header.rule} w={420} color={ink(0.32)} />

      <Box l={20} t={CHROME.rail.label}>
        <Sans size={8} tracking={0.22} color={ink(0.4)}>
          ON THE RAIL
        </Sans>
      </Box>
      <Ticks
        l={CHROME.rail.strip.x}
        t={CHROME.rail.strip.y}
        w={CHROME.rail.strip.w}
        h={10}
        pitch={9}
        color={ink(0.3)}
      />
      <Rule l={65} t={116} w={1} h={14} vertical color={amber()} />
      {reacted ? (
        <Box r={20} t={CHROME.rail.reacted} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Mono size={9} tracking={0.06} color={ink(0.62)}>
            @kestrel reacted
          </Mono>
          <RailLift />
        </Box>
      ) : null}
      <Box r={20} t={CHROME.rail.watching}>
        <Mono size={9} weight={500} tracking={0.1} color={ink(0.34)}>
          {chips(watching)} WATCHING
        </Mono>
      </Box>
      <Rule l={0} t={CHROME.rail.rule} w={420} color={ink(0.09)} />
    </>
  );
}

/** The crowd's mark. The one amber thing that moves, besides the clock. */
function RailLift() {
  return <View style={{ width: 7, height: 7, backgroundColor: amber(), transform: [{ rotate: '45deg' }] }} />;
}

/** Six hairline segments with a notch cut for every seat. */
export function Boundary() {
  return (
    <>
      {BOUNDARY.segments.map((s, i) => (
        <Rule key={`h${i}`} l={s.x} t={s.y} w={s.w} color={ink(0.16)} />
      ))}
      {BOUNDARY.verticals.map((v, i) => (
        <Rule key={`v${i}`} l={v.x} t={v.y} h={v.h} vertical color={ink(0.16)} />
      ))}
      <Ticks
        l={BOUNDARY.ticks.x}
        t={BOUNDARY.ticks.y}
        w={BOUNDARY.ticks.w}
        h={6}
        pitch={BOUNDARY.ticks.pitch}
        color={ink(0.14)}
      />
    </>
  );
}

export type SeatView = {
  seat: SeatId;
  tone: 'live' | 'rest' | 'folded';
  action?: string;
  bet?: number;
  dealer?: boolean;
  stack?: number;
  residue?: Residue;
  reticle?: 'corners' | 'aim' | 'crosshair' | 'none';
  reticleColor?: string;
  landing?: boolean;
  targeted?: boolean;
  dimmed?: number;
};

/**
 * One seat: a bust outside the hairline, a name block reading away from it,
 * and — while the money is still out there — a chip on the felt.
 */
export function Seat({
  seat,
  tone,
  action,
  bet,
  dealer,
  stack,
  residue,
  reticle = 'none',
  reticleColor,
  landing,
  targeted,
  dimmed,
}: SeatView) {
  const g = SEATS[seat];
  const player = CAST[seat];
  const right = g.side === 'right';
  const folded = tone === 'folded';
  const opacity = dimmed ?? (folded ? (seat === 5 ? 0.3 : seat === 6 ? 0.34 : 0.32) : 1);

  if (g.side === 'center') {
    // Seat 2 straddles the top edge: the bust above the line, the plate punching
    // through it, which is how the notch is drawn.
    return (
      <>
        <Bust
          l={g.x}
          t={g.y}
          size={g.size}
          emoji={player.face}
          frame={folded ? 'dim' : 'rest'}
          folded={folded}
          opacity={opacity}
        />
        <Box
          l={g.labelX}
          t={g.labelY}
          w={120}
          h={48}
          style={{
            backgroundColor: GROUND,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            opacity,
          }}
        >
          <Sans size={9} tracking={0.2}>
            {player.name}
          </Sans>
          <Mono size={14} weight={500}>
            {chips(stack ?? player.stack)}
          </Mono>
          <Mono size={8} tracking={0.16}>
            {action ?? 'FOLD'}
          </Mono>
        </Box>
      </>
    );
  }

  const labelStyle = { alignItems: right ? ('flex-end' as const) : ('flex-start' as const), gap: 5 };

  return (
    <>
      <Bust
        l={right ? undefined : g.x}
        r={right ? 420 - g.x - g.size : undefined}
        t={g.y}
        size={g.size}
        emoji={player.face}
        frame={targeted ? 'target' : folded ? 'dim' : tone === 'live' ? 'lit' : 'rest'}
        headStrip={residue ? 'amber' : tone === 'live' ? 'ink' : false}
        headStripAlpha={residue ? 0.85 : 0.3}
        seat={seat}
        seatChip={targeted ? 'amber' : tone === 'live' ? 'bone' : 'quiet'}
        reticle={reticle}
        reticleColor={reticleColor}
        landing={landing}
        holeCards={folded ? false : right ? 'left' : 'right'}
        folded={folded}
        opacity={opacity}
      />

      <Box
        l={right ? undefined : g.labelX}
        r={right ? g.labelX : undefined}
        t={g.labelY}
        style={[labelStyle, { opacity }]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Sans size={9} tracking={0.2} color={targeted ? AMBER_LIGHT : ink()}>
            {player.name}
          </Sans>
          {residue ? <ResidueMark count={residue.count} /> : null}
          {dealer ? (
            <View
              style={{
                width: 13,
                height: 13,
                borderWidth: 1,
                borderColor: ink(0.5),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mono size={7} weight={700}>
                D
              </Mono>
            </View>
          ) : null}
        </View>
        <Mono size={g.size >= 56 ? 15 : 14} weight={500}>
          {chips(stack ?? player.stack)}
        </Mono>
        {action ? (
          <Mono size={8} tracking={0.16} color={folded ? ink() : ink(0.55)}>
            {action}
          </Mono>
        ) : null}
      </Box>

      {bet ? (
        <Box
          l={right ? undefined : BET_CHIP.inset}
          r={right ? BET_CHIP.inset : undefined}
          t={BET_CHIP.y}
          style={{ flexDirection: right ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}
        >
          <View style={{ width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: ink(0.4) }} />
          <Mono size={11} weight={500} color={ink(0.72)}>
            {chips(bet)}
          </Mono>
        </Box>
      ) : null}
    </>
  );
}

/** What a landed throwable leaves behind, until the hand ends. */
function ResidueMark({ count }: { count: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: amber(0.55) }}>
        <View
          style={{ position: 'absolute', left: 3, top: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: amber() }}
        />
        <View
          style={{ position: 'absolute', left: 9, top: 1, width: 3, height: 3, borderRadius: 2, backgroundColor: amber(0.7) }}
        />
      </View>
      {count > 1 ? (
        <Mono size={7} color={amber()}>
          ×{count}
        </Mono>
      ) : null}
    </View>
  );
}

/** The pot. The largest numeral on the screen, and the only object that travels. */
export function Pot({
  amount,
  style,
}: {
  amount: number;
  style?: React.ComponentProps<typeof Animated.View>['style'];
}) {
  return (
    <Animated.View style={[{ position: 'absolute', left: 0, top: CHROME.pot.y, width: 420, alignItems: 'center' }, style]}>
      <Sans size={10} tracking={0.34} color={ink(0.4)}>
        POT
      </Sans>
      <Mono size={54} weight={700} tracking={-0.03} lh={0.82} style={{ marginTop: 9 }}>
        {chips(amount)}
      </Mono>
      <View style={{ width: 52, height: 1, backgroundColor: ink(0.28), marginTop: 9 }} />
    </Animated.View>
  );
}

export function Community({
  cards,
  liveIndex,
  lockedIndexes,
  street,
  opacity,
}: {
  cards: (null | { rank: string; suit: 's' | 'h' | 'd' | 'c' })[];
  liveIndex?: number;
  lockedIndexes?: number[];
  street?: string;
  opacity?: number;
}) {
  const w = CHROME.board.w;
  const gap = CHROME.board.gap;
  const total = cards.length * w + (cards.length - 1) * gap;
  return (
    <>
      <Board
        l={(420 - total) / 2}
        t={CHROME.board.y}
        cards={cards}
        w={w}
        h={62}
        gap={gap}
        liveIndex={liveIndex}
        lockedIndexes={lockedIndexes}
        opacity={opacity}
      />
      {street ? (
        <Box l={0} t={CHROME.street.y} w={420} style={{ alignItems: 'center' }}>
          <Mono size={8} tracking={0.24} color={ink(0.3)}>
            {street}
          </Mono>
        </Box>
      ) : null}
    </>
  );
}

/** Your row: cards at the notch, bust below the line, readout on the right. */
export function HeroRow({
  stack,
  cardsTone = 'face',
  showReadout = true,
  label = 'YOU · SEAT 1',
  bustProps,
  dim,
}: {
  stack: number;
  cardsTone?: 'face' | 'faceMuted' | 'empty' | 'outline';
  showReadout?: boolean;
  label?: string;
  bustProps?: Partial<React.ComponentProps<typeof Bust>>;
  dim?: number;
}) {
  const { x, y, w, h, gap } = CHROME.hole;
  const g = SEATS[1];
  return (
    <>
      {HAND.hole.map((card, i) => (
        <PlayingCard
          key={i}
          l={x + i * (w + gap)}
          t={y}
          w={w}
          h={h}
          rank={cardsTone === 'empty' ? undefined : card.rank}
          suit={card.suit}
          tone={cardsTone}
          opacity={dim}
        />
      ))}

      <Bust
        l={g.x}
        t={g.y}
        size={g.size}
        emoji={CAST[1].face}
        frame="lit"
        seat={1}
        seatChip="bone"
        opacity={dim}
        {...bustProps}
      />

      <Box l={g.labelX} t={g.labelY} style={{ gap: 7, opacity: dim }}>
        <Sans size={9} tracking={0.24} color={ink(0.45)}>
          {label}
        </Sans>
        <Mono size={26} weight={700} tracking={-0.03}>
          {chips(stack)}
        </Mono>
      </Box>

      {showReadout ? (
        <Box l={CHROME.readout.x} t={CHROME.readout.y} w={CHROME.readout.w}>
          <Rule l={0} t={0} w={CHROME.readout.w} color={ink(0.16)} />
          {(
            [
              ['TO CALL', chips(HAND.toCall)],
              ['POT ODDS', HAND.potOdds],
              ['IN FRONT', String(HAND.inFront)],
            ] as [string, string][]
          ).map(([k, v], i) => (
            <View key={k}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingVertical: 7,
                }}
              >
                <Sans size={8} tracking={0.2} color={ink(0.42)}>
                  {k}
                </Sans>
                <Mono size={13} weight={500}>
                  {v}
                </Mono>
              </View>
              <View style={{ height: 1, backgroundColor: ink(0.16) }} />
            </View>
          ))}
        </Box>
      ) : null}
    </>
  );
}
