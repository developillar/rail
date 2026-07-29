import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { Screen } from '@/components/Screen';
import { ink, SURFACE } from '@/design/tokens';

/**
 * The index.
 *
 * This one screen is not in the handoff: the designs connect to each other
 * through their own content (take a seat, just watch, watch clip, open table),
 * and none of them carries navigation chrome, on purpose. A prototype still has
 * to be enterable from somewhere, so this is a plain contents page set in the
 * app's own vocabulary — masthead, hairline rules, mono labels — rather than a
 * tab bar the design deliberately does without.
 */

const SCREENS: { ask: string; route: string; name: string; note: string }[] = [
  { ask: '7a', route: '/floor', name: 'THE FLOOR', note: 'The lobby, drawn as a plan. Noise is the sort order.' },
  {
    ask: '1a · 2 · 3b · 4',
    route: '/table',
    name: 'THE TABLE',
    note: 'Six-max, mid-hand. Action bar, slide rule, targeting, showdown.',
  },
  { ask: '5a · 5b · 5c', route: '/rail', name: 'THE RAIL', note: 'Watching from outside the line. Swipe up for the tape.' },
  { ask: '6a', route: '/feed', name: 'THE EDITION', note: 'The feed as an edition, not a dashboard.' },
  { ask: '6b', route: '/clip', name: 'THE CLIP', note: 'Reactions pinned to the second they landed.' },
  { ask: '8a', route: '/profile', name: 'THE RECORD', note: 'Hands watched counted alongside hands played.' },
  { ask: '8b', route: '/loadout', name: 'LOADOUT', note: 'Four slots. Earned and purchased, adjacent.' },
  { ask: '8c', route: '/shop', name: 'THE COUNTER', note: 'Dated stock, flat prices, and what money cannot buy.' },
];

export default function IndexScreen() {
  const router = useRouter();

  return (
    <Screen height={720} mode="scroll">
      <Box l={20} t={20}>
        <Mono size={20} weight={700} tracking={0.26}>
          RAIL
        </Mono>
      </Box>
      <Box r={20} t={26}>
        <Mono size={8} tracking={0.14} color={ink(0.5)}>
          TERMINAL · 1A
        </Mono>
      </Box>
      <Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />

      <Box l={20} t={72}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          SOCIAL POKER ROOMS WITH FRIENDS · PLAY CHIPS ONLY
        </Mono>
      </Box>
      <Box l={20} t={92} w={376}>
        <Sans size={16} weight={500} tracking={-0.01} lh={1.3}>
          The rail is where the spectators stand. Watching is the product.
        </Sans>
      </Box>
      <Ticks l={20} t={146} w={126} h={8} pitch={9} color={ink(0.3)} />

      <Rule l={0} t={178} w={420} color={ink(0.2)} />
      <Box l={20} t={192}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          SCREENS
        </Mono>
      </Box>
      <Box r={20} t={192}>
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          ASKS 1–8
        </Mono>
      </Box>

      {SCREENS.map((s, i) => {
        const top = 216 + i * 60;
        return (
          <Pressable
            key={s.route}
            onPress={() => router.push(s.route as never)}
            style={({ pressed }) => ({
              position: 'absolute',
              left: 0,
              top,
              width: 420,
              height: 58,
              backgroundColor: pressed ? SURFACE.press : undefined,
            })}
          >
            <View style={{ position: 'absolute', left: 20, top: 10 }}>
              <Sans size={13} weight={500} tracking={0.02}>
                {s.name}
              </Sans>
            </View>
            <View style={{ position: 'absolute', left: 20, top: 32 }}>
              <Mono size={7} tracking={0.1} color={ink(0.4)}>
                {s.note}
              </Mono>
            </View>
            <View style={{ position: 'absolute', right: 20, top: 12 }}>
              <Mono size={8} tracking={0.12} color={ink(0.45)}>
                {s.ask}
              </Mono>
            </View>
            <Rule l={20} t={57} w={380} color={ink(0.1)} />
          </Pressable>
        );
      })}

      <Box l={20} t={706} w={380}>
        <Mono size={7} tracking={0.1} color={ink(0.35)} lh={1.7}>
          CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT
        </Mono>
      </Box>
    </Screen>
  );
}
