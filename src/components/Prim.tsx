import { ReactNode } from 'react';
import { Text, TextProps, View, ViewProps, ViewStyle } from 'react-native';
import { ink, mono, sans } from '@/design/tokens';

/**
 * Absolute placement, in design units. The prototype positions almost
 * everything absolutely inside a 420-wide frame, and so does this — it is the
 * only way to keep hairlines landing on the same pixel they were drawn on.
 */
export type AbsBox = {
  l?: number;
  t?: number;
  r?: number;
  b?: number;
  w?: number | `${number}%`;
  h?: number;
};

export const abs = (o: AbsBox): ViewStyle => ({
  position: 'absolute',
  left: o.l,
  top: o.t,
  right: o.r,
  bottom: o.b,
  width: o.w,
  height: o.h,
});

export function Box({ style, children, ...rest }: ViewProps & { children?: ReactNode } & AbsBox) {
  const { l, t, r, b, w, h, ...viewProps } = rest as ViewProps & AbsBox;
  return (
    <View style={[abs({ l, t, r, b, w, h }), style]} {...viewProps}>
      {children}
    </View>
  );
}

type TypeProps = TextProps & {
  size: number;
  tracking?: number;
  lh?: number;
  color?: string;
  children?: ReactNode;
};

/** JetBrains Mono. Every figure in the app is set in this. */
export function Mono({
  size,
  weight = 400,
  tracking = 0,
  lh = 1,
  color = ink(),
  style,
  children,
  ...rest
}: TypeProps & { weight?: 400 | 500 | 700 }) {
  return (
    <Text style={[mono(size, weight, tracking, lh), { color }, style]} {...rest}>
      {children}
    </Text>
  );
}

/** Helvetica. Labels, headlines, button text — never a number. */
export function Sans({
  size,
  weight = 400,
  tracking = 0,
  lh = 1,
  color = ink(),
  style,
  children,
  ...rest
}: TypeProps & { weight?: 400 | 500 }) {
  return (
    <Text style={[sans(size, weight, tracking, lh), { color }, style]} {...rest}>
      {children}
    </Text>
  );
}

/** A hairline. The recurring structural device: the rail is a line. */
export function Rule({
  color = ink(0.14),
  weight = 1,
  vertical = false,
  length,
  style,
  ...pos
}: AbsBox & { color?: string; weight?: number; vertical?: boolean; length?: number; style?: ViewStyle }) {
  return (
    <View
      style={[
        abs({
          ...pos,
          w: vertical ? weight : (pos.w ?? length),
          h: vertical ? (pos.h ?? length) : weight,
        }),
        { backgroundColor: color },
        style,
      ]}
    />
  );
}

/**
 * A measurement tick strip — `repeating-linear-gradient(90deg, C 0 1px, transparent 1px Npx)`.
 * The app's language of record: the head strip, the slide rule, the reaction
 * lane and every earned item are all made of these.
 */
export function Ticks({
  w,
  h = 5,
  pitch = 6,
  tickWidth = 1,
  color = ink(0.3),
  vertical = false,
  style,
  ...pos
}: AbsBox & {
  pitch?: number;
  tickWidth?: number;
  color?: string;
  vertical?: boolean;
  style?: ViewStyle;
}) {
  const span = (vertical ? h : (w as number)) ?? 0;
  const count = Math.max(0, Math.ceil(span / pitch));
  return (
    <View style={[abs({ ...pos, w, h }), { overflow: 'hidden' }, style]} pointerEvents="none">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: vertical ? 0 : i * pitch,
            top: vertical ? i * pitch : 0,
            width: vertical ? '100%' : tickWidth,
            height: vertical ? tickWidth : '100%',
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

/** The throw mark: filled from a seat, hollow from the rail. */
export function Diamond({
  size = 10,
  color,
  hollow = false,
  style,
  ...pos
}: AbsBox & { size?: number; color: string; hollow?: boolean; style?: ViewStyle }) {
  return (
    <View
      style={[
        abs({ ...pos, w: size, h: size }),
        {
          transform: [{ rotate: '45deg' }],
          ...(hollow
            ? { borderWidth: 1, borderColor: color }
            : { backgroundColor: color }),
        },
        style,
      ]}
    />
  );
}
