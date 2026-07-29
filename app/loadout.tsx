import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Bust } from '@/components/Bust';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { EarnedItem, PurchasedItem } from '@/components/Provenance';
import { Screen } from '@/components/Screen';
import { CAST, LOADOUT } from '@/data/fixtures';
import { EASE } from '@/design/motion';
import { amber, GROUND, ink, INK, MS, SURFACE } from '@/design/tokens';

/**
 * 8b — the loadout.
 *
 * Four slots where both classes sit adjacent, which is where the distinction
 * has to work hardest. The preview shows what an opponent actually sees when
 * your throw lands on their head strip, so equipping is a decision about how
 * you will read to other people. Swapping is free and instant — loadout is
 * expression, not commitment.
 */
export default function LoadoutScreen() {
  const router = useRouter();
  const [equipped, setEquipped] = useState<boolean[]>(LOADOUT.slots.map((s) => s.equipped));
  const [filled, setFilled] = useState(false);

  return (
    <Screen height={700} mode="scroll">
      <Box l={20} t={20}>
        <Mono size={20} weight={700} tracking={0.26}>
          LOADOUT
        </Mono>
      </Box>
      <Box r={20} t={26}>
        <Mono size={8} tracking={0.12} color={ink(0.5)}>
          4 SLOTS · 1 RAIL CARD
        </Mono>
      </Box>
      <Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />

      {LOADOUT.slots.map((slot, i) => {
        const top = 84 + i * 78;
        const on = equipped[i];
        return (
          <View key={slot.title}>
            {slot.origin === 'EARNED' ? (
              <EarnedItem l={20} t={top} w={56} h={56} face={slot.face} />
            ) : (
              <PurchasedItem l={20} t={top} w={56} h={56} face={slot.face} maker={slot.maker} markSize={14} />
            )}
            <Box l={92} t={top + 6}>
              <Sans size={12} weight={500} tracking={0.01}>
                {slot.title}
              </Sans>
            </Box>
            <Box l={92} t={top + 24}>
              <Mono size={7} tracking={0.18} color={ink(slot.origin === 'EARNED' ? 0.55 : 0.45)}>
                {slot.origin}
              </Mono>
            </Box>
            <Box l={92} t={top + 40}>
              <Mono size={6.5} tracking={0.1} color={ink(slot.origin === 'EARNED' ? 0.35 : 0.3)}>
                {slot.meta}
              </Mono>
            </Box>
            <Pressable
              onPress={() => setEquipped((e) => e.map((v, j) => (j === i ? !v : v)))}
              style={({ pressed }) => ({
                position: 'absolute',
                right: 20,
                top: top + 14,
                width: 78,
                height: 28,
                borderWidth: 1,
                borderColor: on ? INK : ink(0.35),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? SURFACE.press : undefined,
              })}
            >
              <Mono size={7} tracking={0.16} color={on ? ink() : ink(0.6)}>
                {on ? 'EQUIPPED' : 'EQUIP'}
              </Mono>
            </Pressable>
            <Rule l={20} t={top + 70} w={380} color={ink(0.1)} />
          </View>
        );
      })}

      {/* The fourth slot. A slot accepts either class, at the same size. */}
      {filled ? (
        <EarnedItem l={20} t={318} w={56} h={56} face="🧊" />
      ) : (
        <Box
          l={20}
          t={318}
          w={56}
          h={56}
          style={{
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: ink(0.3),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mono size={8} color={ink(0.35)}>
            {LOADOUT.emptySlot.index}
          </Mono>
        </Box>
      )}
      <Box l={92} t={330}>
        <Sans size={12} weight={500} tracking={0.01} color={filled ? ink() : ink(0.5)}>
          {filled ? 'Ice · Slow' : 'Empty slot'}
        </Sans>
      </Box>
      <Box l={92} t={350}>
        <Mono size={6.5} tracking={0.1} color={ink(0.3)}>
          {filled ? 'FOLDED 20 STRAIGHT · 11 JUN' : `${LOADOUT.emptySlot.unequipped} UNEQUIPPED ITEMS`}
        </Mono>
      </Box>
      <Pressable
        onPress={() => setFilled((f) => !f)}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          top: 332,
          width: 78,
          height: 28,
          borderWidth: 1,
          borderColor: filled ? INK : ink(0.35),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Mono size={7} tracking={0.16} color={ink(0.8)}>
          {filled ? 'EQUIPPED' : 'FILL'}
        </Mono>
      </Pressable>

      <Rule l={0} t={394} w={420} color={ink(0.2)} />
      <Box l={20} t={408}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          HOW IT LANDS
        </Mono>
      </Box>
      <Box r={20} t={408}>
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          WHAT THEY SEE
        </Mono>
      </Box>

      <Impact />

      <Box l={20} t={512}>
        <Mono size={6.5} tracking={0.1} color={ink(0.3)}>
          NEITHER CLASS CHANGES THE THROW — ONLY THE OBJECT THROWN
        </Mono>
      </Box>

      <Rule l={0} t={540} w={420} color={ink(0.2)} />
      <Box l={20} t={554}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          RAIL CARD
        </Mono>
      </Box>
      <Box r={20} t={554}>
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          HOW YOU SIT ON A STRANGER&apos;S RAIL
        </Mono>
      </Box>

      <View style={{ position: 'absolute', left: 20, top: 588, width: 26, height: 26 }}>
        <Ticks l={-1} t={-6} w={28} h={4} pitch={5} color={ink(0.75)} />
        <Bust l={0} t={0} size={26} emoji={CAST[1].face} frame="bone" />
      </View>
      <Box l={58} t={594}>
        <Mono size={7} tracking={0.12} color={ink(0.5)} lh={1.6}>
          TICKED · YOUR CARD IS EARNED{'\n'}VISIBLE AT 26PX AND 22PX
        </Mono>
      </Box>
      <PurchasedItem l={236} t={588} w={26} h={26} face={CAST[1].face} maker="M" markSize={10} />
      <Box l={278} t={594}>
        <Mono size={7} tracking={0.12} color={ink(0.4)} lh={1.6}>
          MARKED · PURCHASED{'\n'}PLATE, SAME SIZE
        </Mono>
      </Box>

      <Rule l={0} t={646} w={420} color={ink(0.14)} />
      <Box l={20} t={660} w={380}>
        <Mono size={7} tracking={0.1} color={ink(0.4)} lh={1.7}>
          A SLOT ACCEPTS EITHER CLASS · THE FRAME NEVER LIES ABOUT WHICH ONE IT IS{'\n'}
          SWAPPING IS FREE AND INSTANT — LOADOUT IS EXPRESSION, NOT COMMITMENT
        </Mono>
      </Box>

      <Pressable
        onPress={() => router.push('/shop')}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          top: 20,
          width: 84,
          height: 24,
          alignItems: 'flex-end',
          justifyContent: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Mono size={7} tracking={0.16} color={ink(0.55)}>
          THE COUNTER →
        </Mono>
      </Pressable>
    </Screen>
  );
}

/** The preview: what an opponent sees when your throw lands on their head strip. */
function Impact() {
  const punch = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: punch.value }] }));

  return (
    <>
      <Pressable
        onPress={() => {
          punch.value = withTiming(1.06, { duration: MS.punch, easing: EASE.settle }, () => {
            punch.value = withTiming(1, { duration: MS.mark, easing: EASE.out });
          });
        }}
        style={{ position: 'absolute', left: 20, top: 428, width: 60, height: 80 }}
      >
        <Animated.View style={[{ position: 'absolute', left: 0, top: 24, width: 48, height: 48 }, style]}>
          <Ticks l={-1} t={-9} w={50} h={5} pitch={6} color={amber(0.85)} />
          <Bust l={0} t={0} size={48} emoji={CAST[4].face} frame="rest" />
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            left: 16,
            top: 0,
            width: 14,
            height: 14,
            backgroundColor: amber(),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mono size={8} color={GROUND}>
            💀
          </Mono>
        </View>
      </Pressable>

      <Box l={84} t={456}>
        <Mono size={8} tracking={0.14} color={ink(0.6)}>
          FROM YOUR SEAT · FILLED
        </Mono>
      </Box>
      <Box l={84} t={476}>
        <Mono size={6.5} tracking={0.1} color={ink(0.35)}>
          LANDS ON THE HEAD STRIP, 1.06× PUNCH
        </Mono>
      </Box>
      <View
        style={{
          position: 'absolute',
          right: 20,
          top: 450,
          width: 14,
          height: 14,
          borderWidth: 1,
          borderColor: amber(),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Mono size={8}>💀</Mono>
      </View>
      <Box r={44} t={454}>
        <Mono size={6.5} tracking={0.1} color={ink(0.35)} lh={1.5} style={{ textAlign: 'right' }}>
          HOLLOW{'\n'}FROM THE RAIL
        </Mono>
      </Box>
    </>
  );
}
