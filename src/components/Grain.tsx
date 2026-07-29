import { Image, StyleSheet, View } from 'react-native';
import { CANVAS_W } from '@/design/tokens';

/**
 * Texture. The brief asks for grain somewhere — it does more to kill the
 * plastic look than anything else — and the prototype paints it as a tiling
 * noise layer over the whole screen.
 *
 * The tile carries its own alpha (see scripts/make-grain.js), so no blend mode
 * is required and the result is identical on both platforms.
 */
export function Grain({ height = 2000 }: { height?: number }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.layer]} pointerEvents="none">
      <Image
        source={require('../../assets/grain.png')}
        style={{ width: CANVAS_W, height }}
        resizeMode="repeat"
        fadeDuration={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { opacity: 0.5 },
});
