import { Easing, type EasingFunctionFactory, withTiming } from 'react-native-reanimated';
import { CURVE, type CurveName, MS } from './tokens';

/**
 * The five named curves of the motion spec, as Reanimated easings.
 *
 * LINEAR  clocks, meters, every count
 * SLIDE   panels, rules, slots, plans
 * ARC     anything that travels the table
 * SETTLE  the two overshoots — 90 punch and 240 open
 * OUT     every exit in the app
 */
export const EASE: Record<CurveName, EasingFunctionFactory> = {
  linear: Easing.bezier(...CURVE.linear),
  slide: Easing.bezier(...CURVE.slide),
  arc: Easing.bezier(...CURVE.arc),
  settle: Easing.bezier(...CURVE.settle),
  out: Easing.bezier(...CURVE.out),
};

/** `timing(1, 'arrive', 'slide')` — duration comes from the ladder, never a literal. */
export function timing(toValue: number, duration: keyof typeof MS, curve: CurveName = 'slide') {
  'worklet';
  return withTiming(toValue, { duration: MS[duration], easing: EASE[curve] });
}

/** Every object leaves the same way: opacity plus a 4px translate, 180ms, OUT. */
export const EXIT_TRANSLATE = 4;
