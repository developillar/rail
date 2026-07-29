import { ReactNode } from 'react';
import { View } from 'react-native';
import { GROUND, ink, SURFACE } from '@/design/tokens';
import { abs, AbsBox, Mono, Ticks } from './Prim';

/**
 * Ask 8's one binary, drawn structurally rather than decoratively:
 *
 *   earned     wears the measurement ticks, cut into the top edge — the app's
 *              own language of record (head strip, slide rule, reaction lane)
 *   purchased  wears a maker's mark on a plate wrapped in an offset hairline —
 *              packaging, applied to the object rather than cut into it
 *
 * Measurement versus manufacture, not two tiers of one thing. Nothing sold ever
 * carries ticks, and earned ticks are bone so amber stays reserved for crowd
 * and clock.
 */

export function EarnedItem({
  w,
  h,
  face,
  glyph,
  label,
  children,
  ...pos
}: AbsBox & {
  w: number;
  h: number;
  face?: string;
  glyph?: string;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <View style={abs({ ...pos, w, h })}>
      <Ticks l={-1} t={-9} w={w + 2} h={5} pitch={6} color={ink(0.75)} />
      <View
        style={{
          position: 'absolute',
          inset: 0,
          borderWidth: 1,
          borderColor: ink(0.6),
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
        }}
      >
        {face ? <Mono size={Math.round(h * 0.32)}>{face}</Mono> : null}
        {glyph ? (
          <Mono size={Math.round(h * 0.24)} tracking={-0.04} color={ink(0.75)}>
            {glyph}
          </Mono>
        ) : null}
        {label ? (
          <Mono size={7} tracking={0.16} color={ink(0.6)}>
            {label}
          </Mono>
        ) : null}
        {children}
      </View>
    </View>
  );
}

export function PurchasedItem({
  w,
  h,
  face,
  glyph,
  label,
  maker,
  markSize,
  dim,
  ...pos
}: AbsBox & {
  w: number;
  h: number;
  face?: string;
  glyph?: string;
  label?: string;
  maker?: string;
  markSize?: number;
  dim?: number;
}) {
  const mark = markSize ?? (w > 100 ? 15 : w > 40 ? 12 : 10);
  const offset = w > 100 ? 5 : 4;
  return (
    <View style={[abs({ ...pos, w, h }), { opacity: dim }]}>
      <View
        style={{
          position: 'absolute',
          left: -offset,
          top: -offset,
          width: w + offset * 2,
          height: h + offset * 2,
          borderWidth: 1,
          borderColor: ink(0.14),
        }}
      />
      <View
        style={{
          position: 'absolute',
          inset: 0,
          borderWidth: 1,
          borderColor: ink(0.3),
          backgroundColor: SURFACE.dim,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
        }}
      >
        {face ? <Mono size={Math.round(h * 0.32)}>{face}</Mono> : null}
        {glyph ? (
          <Mono size={Math.round(h * 0.24)} tracking={-0.04} color={ink(0.7)}>
            {glyph}
          </Mono>
        ) : null}
        {label ? (
          <Mono size={7} tracking={0.16} color={ink(0.5)}>
            {label}
          </Mono>
        ) : null}
      </View>
      {maker !== undefined ? (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: mark,
            height: mark,
            backgroundColor: ink(),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mark >= 10 ? (
            <Mono size={mark >= 15 ? 8 : 7} weight={700} color={GROUND}>
              {maker}
            </Mono>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
