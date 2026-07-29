import { View } from 'react-native';
import { Bust } from './Bust';
import { abs, AbsBox, Mono } from './Prim';
import { chips, ink } from '@/design/tokens';

/**
 * The rail itself: a real rule spanning the screen with the crowd's faces
 * hanging off it. A railbird is outside the line, and this is the line.
 *
 * 7c scales the weight to the room — a loud rail is a 2px rule with five busts,
 * a quiet one is a hairline at 16% with one.
 */
export function RailStrip({
  faces,
  more,
  size = 26,
  weight = 1,
  ruleColor = ink(0.42),
  ruleWidth = 420,
  youIndex = 0,
  moreSuffix = '',
  ...pos
}: AbsBox & {
  faces: string[];
  more?: number;
  size?: number;
  weight?: number;
  ruleColor?: string;
  ruleWidth?: number;
  /** Your own face is the lit one on the rule. -1 for a stranger's rail. */
  youIndex?: number;
  moreSuffix?: string;
}) {
  return (
    <View style={abs(pos)}>
      <View style={{ width: ruleWidth, height: weight, backgroundColor: ruleColor }} />
      <View style={{ flexDirection: 'row', gap: size >= 26 ? 6 : 5 }}>
        {faces.map((face, i) => (
          <Bust
            key={`${face}-${i}`}
            l={undefined}
            t={undefined}
            size={size}
            emoji={face}
            frame={i === youIndex ? 'bone' : 'crowd'}
            opacity={i === youIndex ? 1 : 0.7}
            style={{ position: 'relative' }}
          />
        ))}
        {more ? (
          <View style={{ height: size, justifyContent: 'center', paddingLeft: 4 }}>
            <Mono size={9} color={ink(0.35)}>
              +{chips(more)}
              {moreSuffix}
            </Mono>
          </View>
        ) : null}
      </View>
    </View>
  );
}
