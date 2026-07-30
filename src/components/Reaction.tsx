import { View, ViewStyle } from 'react-native';
import { amber, ink } from '@/design/tokens';
import { abs, AbsBox, Mono, Ticks } from './Prim';

/**
 * 6c — the reaction system's density registers, so one friend's cooler never
 * renders like a mob:
 *
 *   1       named in full
 *   2–39    counted, one tick each — 4px pitch, 2px in agate
 *   40+     massed into one bar — caps at 96px, 48px in agate
 *
 * The same object governs the lobby's crowd mark in 7c.
 */
export function ReactionMark({
  count,
  scale = 'full',
  showCount = true,
  name,
  color = amber(),
  style,
  ...pos
}: AbsBox & {
  count: number;
  scale?: 'full' | 'agate';
  showCount?: boolean;
  name?: string;
  color?: string;
  style?: ViewStyle;
}) {
  const agate = scale === 'agate';
  const pitch = agate ? 2 : 4;
  const cap = agate ? 48 : 96;
  const height = agate ? 8 : 14;
  // A thin crowd is drawn dimmer than a loud one, and that judgement is made
  // here rather than at each call site, so a strip can never disagree with the
  // figure beside it.
  const tone = count > 8 ? color : amber(0.85);

  return (
    <View style={[abs(pos), { flexDirection: 'row', alignItems: 'center', gap: agate ? 6 : 8 }, style]}>
      {count === 1 ? (
        <>
          <View style={{ width: 1, height, backgroundColor: tone }} />
          {name ? (
            <Mono size={9} color={ink(0.7)}>
              {name}
            </Mono>
          ) : null}
        </>
      ) : count >= 40 ? (
        <View style={{ width: cap, height, backgroundColor: tone }} />
      ) : (
        <Ticks
          l={0}
          t={0}
          w={Math.min(cap, count * pitch)}
          h={height}
          pitch={pitch}
          color={tone}
          style={{ position: 'relative' }}
        />
      )}
      {showCount && count > 1 ? (
        <Mono size={agate ? 9 : 13} weight={700} color={tone}>
          {count.toLocaleString('en-US')}
        </Mono>
      ) : null}
    </View>
  );
}

/** 6c — provenance is drawn, never labelled. Filled from a seat, hollow from the rail. */
export function ThrowMark({
  fromSeat,
  size = 11,
  style,
  ...pos
}: AbsBox & { fromSeat: boolean; size?: number; style?: ViewStyle }) {
  return (
    <View
      style={[
        abs({ ...pos, w: size, h: size }),
        {
          transform: [{ rotate: '45deg' }],
          backgroundColor: fromSeat ? amber() : undefined,
          borderWidth: fromSeat ? 0 : 1,
          borderColor: amber(),
        },
        style,
      ]}
    />
  );
}
