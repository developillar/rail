import { ReactNode } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CANVAS_H, CANVAS_W, GROUND } from '@/design/tokens';
import { Grain } from './Grain';

/**
 * Every screen in the handoff is drawn on a fixed 420-wide portrait canvas, so
 * every screen here is authored in those same units and scaled to the device.
 *
 *  fit     the whole canvas is scaled to fit inside the safe area, so the
 *          composition never reflows — the table, the showdown, the rail.
 *  scroll  the canvas keeps device width and scrolls past the bottom of the
 *          screen — the edition, the floor, the record, the counter.
 *
 * The prototype's mock status bar and home indicator are dropped: on a device
 * the real ones occupy that space, which is what the 44px band and the 878px
 * pill were standing in for.
 */
export function Screen({
  height = CANVAS_H,
  mode = 'fit',
  grain = true,
  children,
}: {
  height?: number;
  mode?: 'fit' | 'scroll';
  grain?: boolean;
  children: ReactNode;
}) {
  const { width, height: winHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const available = winHeight - insets.top - insets.bottom;
  const widthScale = width / CANVAS_W;
  const scale = mode === 'scroll' ? widthScale : Math.min(widthScale, available / height);

  const canvas = (
    <View style={{ width: CANVAS_W * scale, height: height * scale, overflow: 'hidden' }}>
      <View
        style={{
          width: CANVAS_W,
          height,
          transform: [{ scale }],
          transformOrigin: 'top left',
        }}
      >
        {children}
        {grain ? <Grain height={height} /> : null}
      </View>
    </View>
  );

  if (mode === 'scroll') {
    return (
      <View style={{ flex: 1, backgroundColor: GROUND }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {canvas}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: GROUND,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {canvas}
    </View>
  );
}
