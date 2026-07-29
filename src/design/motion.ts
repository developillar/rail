import { Easing, type EasingFunctionFactory } from 'react-native-reanimated';
import { CURVE, type CurveName } from './tokens';

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
