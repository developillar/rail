import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Mono } from '@/components/Prim';
import { EASE } from '@/design/motion';
import { amber, MS } from '@/design/tokens';
import { DashedLeader } from './Targeting';

/**
 * A thrown object travels the table on a 320ms arc, with a dashed trail that
 * decays behind it, and arrives on the target's head strip. Emotes are objects
 * with physics, not stickers: the flight has a real trajectory and spin, and it
 * lands — it does not fade in over the target.
 *
 * Filled came from a seat. Hollow came from the rail.
 */
export function Flight({
  from,
  to,
  face,
  hollow = false,
  onLand,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  face: string;
  hollow?: boolean;
  onLand: () => void;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = 0;
    t.value = withTiming(1, { duration: MS.travel, easing: EASE.arc }, (done) => {
      if (done) runOnJS(onLand)();
    });
    // The flight is fired once, for one throw; a re-run would be a second throw.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lift = Math.min(120, Math.hypot(to.x - from.x, to.y - from.y) * 0.28);

  const style = useAnimatedStyle(() => {
    const p = t.value;
    return {
      transform: [
        { translateX: from.x + (to.x - from.x) * p - 11 },
        // A parabola, so it arcs over the table rather than sliding across it.
        { translateY: from.y + (to.y - from.y) * p - 4 * lift * p * (1 - p) - 11 },
        { rotate: `${p * 220}deg` },
        { scale: 1 - 0.25 * p },
      ],
      opacity: 1,
    };
  });

  const trail = useAnimatedStyle(() => ({ opacity: 0.9 * (1 - t.value) }));

  return (
    <>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, trail]} pointerEvents="none">
        <DashedLeader from={from} to={to} color={amber(0.6)} />
      </Animated.View>
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
          style,
        ]}
        pointerEvents="none"
      >
        <View
          style={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: hollow ? undefined : amber(),
            borderWidth: hollow ? 1 : 0,
            borderColor: amber(),
          }}
        />
        <Mono size={12}>{face}</Mono>
      </Animated.View>
    </>
  );
}
