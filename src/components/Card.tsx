import { View, ViewStyle } from 'react-native';
import { CARD_BLACK, CARD_RED, FONT, GROUND, ink, mono, SURFACE } from '@/design/tokens';
import { abs, AbsBox, Mono } from './Prim';
import { Text } from 'react-native';

export type Suit = 's' | 'h' | 'd' | 'c';
export type CardTone =
  | 'face' // yours, dealt and live
  | 'faceMuted' // yours, someone else is acting
  | 'board' // a community card
  | 'live' // the newest street
  | 'locked' // one of the winning five at showdown
  | 'dead' // not playing at showdown
  | 'outline' // yours, mucked
  | 'empty' // an empty outline, no rank
  | 'dashed'; // a street still to come

/** Text presentation, so the pips never render as colour emoji. */
const GLYPH: Record<Suit, string> = {
  s: '♠︎',
  h: '♥︎',
  d: '♦︎',
  c: '♣︎',
};

/** The exact metrics the prototype uses at each card width. */
const METRICS: Record<number, { rank: number; suit: number; pad: number; padBottom?: number }> = {
  54: { rank: 22, suit: 16, pad: 6, padBottom: 5 },
  44: { rank: 17, suit: 13, pad: 5, padBottom: 4 },
  40: { rank: 15, suit: 11, pad: 5 },
  38: { rank: 15, suit: 11, pad: 4 },
  30: { rank: 12, suit: 9, pad: 4 },
  26: { rank: 11, suit: 8, pad: 3 },
  16: { rank: 7, suit: 0, pad: 0 },
};

const toneStyle = (tone: CardTone): ViewStyle => {
  switch (tone) {
    case 'face':
      return { borderWidth: 1, borderColor: ink(0.6), backgroundColor: ink() };
    case 'faceMuted':
      return { borderWidth: 1, borderColor: ink(0.4), backgroundColor: '#cbcac6' };
    case 'board':
      return { borderWidth: 1, borderColor: ink(0.22), backgroundColor: SURFACE.card };
    case 'live':
      return { borderWidth: 1, borderColor: ink(0.42), backgroundColor: SURFACE.live };
    case 'locked':
      return { borderWidth: 1, borderColor: ink(0.5), backgroundColor: SURFACE.live };
    case 'dead':
      return { borderWidth: 1, borderColor: ink(0.1) };
    case 'outline':
      return { borderWidth: 1, borderColor: ink(0.35) };
    case 'empty':
      return { borderWidth: 1, borderColor: ink(0.14) };
    case 'dashed':
      return { borderWidth: 1, borderStyle: 'dashed', borderColor: ink(0.16) };
  }
};

/**
 * A card is a rectangle with a rank in the top-left and a pip in the
 * bottom-right. No rounded corners, no gloss, no bevel: the table is a drawn
 * form, not a simulated surface.
 */
export function PlayingCard({
  rank,
  suit,
  w = 44,
  h,
  tone = 'board',
  opacity,
  style,
  ...pos
}: AbsBox & {
  rank?: string;
  suit?: Suit;
  w?: number;
  h?: number;
  tone?: CardTone;
  opacity?: number;
  style?: ViewStyle;
}) {
  const height = h ?? Math.round(w * 1.41);
  const m = METRICS[w] ?? {
    rank: Math.round(w * 0.4),
    suit: Math.round(w * 0.295),
    pad: Math.round(w * 0.11),
  };
  const light = tone === 'face' || tone === 'faceMuted';
  const red = suit === 'h' || suit === 'd';
  const rankColor = light ? GROUND : red ? CARD_RED : CARD_BLACK;
  const showFace = tone !== 'empty' && tone !== 'dashed' && rank;
  const faded = tone === 'dead' ? (opacity ?? 0.24) : opacity;

  return (
    <View
      style={[
        abs({ ...pos, w, h: height }),
        toneStyle(tone),
        {
          paddingHorizontal: m.pad,
          paddingTop: m.pad,
          paddingBottom: m.padBottom ?? m.pad,
          justifyContent: 'space-between',
          opacity: faded,
        },
        style,
      ]}
    >
      {showFace ? (
        <>
          <Mono size={m.rank} weight={700} tracking={-0.045} color={rankColor}>
            {rank}
          </Mono>
          {suit && m.suit > 0 ? (
            <Text
              style={{
                fontFamily: FONT.serif,
                fontSize: m.suit,
                lineHeight: m.suit,
                color: rankColor,
                alignSelf: 'flex-end',
              }}
            >
              {GLYPH[suit]}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

/** The five-card row: board cards are centred, tight, and evenly gapped. */
export function Board({
  cards,
  w = 44,
  h,
  gap = 5,
  liveIndex,
  tone = 'board',
  lockedIndexes,
  opacity,
  ...pos
}: AbsBox & {
  cards: ({ rank: string; suit: Suit } | null)[];
  w?: number;
  h?: number;
  gap?: number;
  liveIndex?: number;
  tone?: CardTone;
  lockedIndexes?: number[];
  opacity?: number;
}) {
  const height = h ?? Math.round(w * 1.41);
  const total = cards.length * w + (cards.length - 1) * gap;
  return (
    <View style={[abs({ ...pos, w: total, h: height }), { opacity }]}>
      {cards.map((c, i) => {
        const locked = lockedIndexes?.includes(i);
        const cardTone: CardTone = !c
          ? 'dashed'
          : locked
            ? 'locked'
            : lockedIndexes && !locked
              ? 'dead'
              : i === liveIndex
                ? 'live'
                : tone;
        return (
          <PlayingCard
            key={i}
            l={i * (w + gap)}
            t={0}
            w={w}
            h={height}
            rank={c?.rank}
            suit={c?.suit}
            tone={cardTone}
          />
        );
      })}
    </View>
  );
}
