import { ReactNode } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { amber, GROUND, ink, mono, SURFACE } from '@/design/tokens';
import { abs, AbsBox, Box, Mono } from './Prim';
import { Ticks } from './Prim';

/**
 * The bust — a seat's avatar frame, set outside the hairline boundary.
 *
 * It is the app's load-bearing object: the throwable's target, the win's
 * destination, the rail's crowd chip and the join's traveller are all this
 * component at different sizes. The ticked strip above the head is the landing
 * zone; the seat index is chipped outboard of the corner so it never crops the
 * face.
 */

export type BustFrame = 'lit' | 'rest' | 'dim' | 'crowd' | 'target' | 'bone' | 'slot';

const FRAME: Record<BustFrame, ViewStyle> = {
  lit: { borderColor: ink(0.55), backgroundColor: SURFACE.lit },
  bone: { borderColor: ink(), backgroundColor: SURFACE.lit },
  rest: { borderColor: ink(0.34), backgroundColor: SURFACE.card },
  dim: { borderColor: ink(0.18), backgroundColor: SURFACE.dark },
  crowd: { borderColor: ink(0.2), backgroundColor: SURFACE.dim },
  target: { borderColor: amber(), backgroundColor: amber(0.14) },
  slot: { borderColor: ink(0.45), borderStyle: 'dashed' },
};

/** Emoji size and baseline drop, per frame size, exactly as drawn. */
const FACE: Record<number, [number, number]> = {
  72: [48, 6],
  62: [32, 7],
  56: [30, 6],
  48: [32, 5],
  44: [23, 5],
  40: [26, 4],
  36: [24, 3],
  32: [21, 3],
  28: [19, 2],
  26: [18, 2],
  24: [17, 2],
  22: [15, 1],
  20: [14, 1],
};

export type BustProps = AbsBox & {
  size: number;
  emoji?: string;
  frame?: BustFrame;
  /** The landing strip above the head. Amber once something has landed on it. */
  headStrip?: false | 'ink' | 'amber';
  headStripAlpha?: number;
  seat?: number | string;
  seatChip?: 'amber' | 'bone' | 'quiet' | 'none';
  /** Reticles never interpolate — they snap. */
  reticle?: 'corners' | 'aim' | 'crosshair' | 'none';
  reticleColor?: string;
  /** 3b's preview of where the throwable will land on this avatar. */
  landing?: boolean;
  /** Hole cards tucked behind the frame. */
  holeCards?: 'left' | 'right' | false;
  /** The single rule drawn across a folded seat. */
  folded?: boolean;
  opacity?: number;
  style?: ViewStyle;
  children?: ReactNode;
};

export function Bust({
  size,
  emoji,
  frame = 'rest',
  headStrip = false,
  headStripAlpha,
  seat,
  seatChip = 'none',
  reticle = 'none',
  reticleColor,
  landing = false,
  holeCards = false,
  folded = false,
  opacity,
  style,
  children,
  ...pos
}: BustProps) {
  const [faceSize, drop] = FACE[size] ?? [Math.round(size * 0.55), Math.round(size * 0.1)];
  const corner = size >= 56 ? 8 : 7;
  const stripColor =
    headStrip === 'amber' ? amber(headStripAlpha ?? 0.85) : ink(headStripAlpha ?? 0.3);

  return (
    <View style={[abs({ ...pos, w: size, h: size }), { opacity }, style]}>
      {headStrip ? (
        <Ticks l={-1} t={-9} w={size + 2} h={5} pitch={6} color={stripColor} />
      ) : null}

      {holeCards ? <TuckedCards side={holeCards} /> : null}

      <View
        style={[
          { position: 'absolute', inset: 0, borderWidth: 1, overflow: 'hidden' },
          FRAME[frame],
          { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
        ]}
      >
        {emoji ? (
          <Text
            style={{
              fontSize: faceSize,
              lineHeight: faceSize,
              paddingBottom: drop,
            }}
          >
            {emoji}
          </Text>
        ) : null}
        {children}
      </View>

      {folded ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: Math.round(size / 2) - 1,
            width: size,
            height: 1,
            backgroundColor: ink(0.34),
          }}
        />
      ) : null}

      {reticle !== 'none' ? (
        <Corners inset={corner} color={reticleColor ?? amber()} />
      ) : null}
      {reticle === 'aim' ? (
        <View
          style={{
            position: 'absolute',
            left: size / 2 - 7,
            top: size / 2,
            width: 15,
            height: 1,
            backgroundColor: amber(0.5),
          }}
        />
      ) : null}
      {reticle === 'crosshair' ? (
        <>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: Math.round(size / 2),
              width: size,
              height: 1,
              backgroundColor: amber(0.35),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: Math.round(size / 2) - 1,
              top: 0,
              width: 1,
              height: size,
              backgroundColor: amber(0.35),
            }}
          />
        </>
      ) : null}

      {landing ? (
        <>
          <View
            style={{
              position: 'absolute',
              left: size - 25,
              top: -13,
              width: 26,
              height: 26,
              borderRadius: 13,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: amber(0.8),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: size - 15,
              top: -3,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: amber(),
            }}
          />
        </>
      ) : null}

      {seat !== undefined && seatChip !== 'none' ? <SeatChip seat={seat} kind={seatChip} /> : null}
    </View>
  );
}

/** The index, chipped outboard of the frame so it never crops the face. */
function SeatChip({ seat, kind }: { seat: number | string; kind: 'amber' | 'bone' | 'quiet' }) {
  const filled = kind !== 'quiet';
  return (
    <View
      style={{
        position: 'absolute',
        right: -1,
        bottom: -10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        backgroundColor: kind === 'amber' ? amber() : kind === 'bone' ? ink(0.85) : undefined,
        borderTopWidth: filled ? 0 : 1,
        borderLeftWidth: filled ? 0 : 1,
        borderColor: ink(0.3),
      }}
    >
      <Text
        style={[
          mono(8, filled ? 700 : 400),
          { color: filled ? GROUND : ink(0.55) },
        ]}
      >
        {seat}
      </Text>
    </View>
  );
}

function Corners({ inset, color }: { inset: number; color: string }) {
  const base: ViewStyle = { position: 'absolute', width: inset, height: inset };
  return (
    <>
      <View style={[base, { left: -3, top: -3, borderLeftWidth: 1, borderTopWidth: 1, borderColor: color }]} />
      <View style={[base, { right: -3, top: -3, borderRightWidth: 1, borderTopWidth: 1, borderColor: color }]} />
      <View style={[base, { left: -3, bottom: -3, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: color }]} />
      <View
        style={[base, { right: -3, bottom: -3, borderRightWidth: 1, borderBottomWidth: 1, borderColor: color }]}
      />
    </>
  );
}

/** Two hole cards tucked behind the frame, fanned. */
function TuckedCards({ side }: { side: 'left' | 'right' }) {
  const mirror = side === 'left' ? -1 : 1;
  return (
    <>
      <View
        style={{
          position: 'absolute',
          [side === 'right' ? 'right' : 'left']: -11,
          bottom: 5,
          width: 14,
          height: 20,
          borderWidth: 1,
          borderColor: ink(0.18),
          backgroundColor: '#0d0e10',
          transform: [{ rotate: `${-8 * mirror}deg` }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          [side === 'right' ? 'right' : 'left']: -5,
          bottom: 4,
          width: 14,
          height: 20,
          borderWidth: 1,
          borderColor: ink(0.24),
          backgroundColor: SURFACE.dark,
          transform: [{ rotate: `${6 * mirror}deg` }],
        }}
      />
    </>
  );
}

/** An empty seat: the only dashed frame on the table, so it reads as absence. */
export function EmptySeat({
  size,
  index,
  reticle = false,
  ...pos
}: AbsBox & { size: number; index: string; reticle?: boolean }) {
  return (
    <Box {...pos} w={size} h={size}>
      <View
        style={{
          position: 'absolute',
          inset: 0,
          borderWidth: 1,
          borderColor: reticle ? amber() : ink(0.45),
          borderStyle: reticle ? 'solid' : 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {reticle ? null : <Mono size={8} color={ink(0.5)}>{index}</Mono>}
      </View>
      {reticle ? (
        <>
          <View style={{ position: 'absolute', left: 0, top: size / 2 - 1, width: size, height: 1, backgroundColor: amber(0.5) }} />
          <View style={{ position: 'absolute', left: size / 2 - 1, top: 0, width: 1, height: size, backgroundColor: amber(0.5) }} />
          <Corners inset={7} color={amber()} />
        </>
      ) : null}
    </Box>
  );
}
