import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Bust } from '@/components/Bust';
import { Board } from '@/components/Card';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { ThrowMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { CLIP, THROWABLES } from '@/data/fixtures';
import { amber, AMBER_LIGHT, chips, ink, INK, SURFACE } from '@/design/tokens';

/**
 * 6b — the clip. Reactions live in time.
 *
 * The scrub is the bet slider again: minor ticks, named stops, diamond thumb.
 * The new idea is the lane *above* the track — every throw is a hairline at the
 * second it landed, so the crowd's judgement is a shape you read before you
 * watch. Throwing here pins to the frame, not the post.
 */

const TRACK = { x: 20, w: 380 };
const xOf = (t: number) => TRACK.x + (t / CLIP.length) * TRACK.w;
const tOf = (x: number) => Math.max(0, Math.min(CLIP.length, ((x - TRACK.x) / TRACK.w) * CLIP.length));
const clock = (t: number) => `0:${String(Math.round(t)).padStart(2, '0')}`;

export default function ClipScreen() {
  const router = useRouter();
  const [t, setT] = useState(CLIP.playhead);
  const [thrown, setThrown] = useState<string | null>(null);

  const scrub = useMemo(() => {
    const move = (x: number) => {
      const raw = tOf(x + TRACK.x);
      // Street stops snap; everything between them tracks the finger 1:1.
      const stop = CLIP.streets.find((s) => Math.abs(xOf(s.at) - xOf(raw)) < 8);
      if (stop) {
        setT(stop.at);
        Haptics.selectionAsync().catch(() => {});
      } else {
        setT(raw);
      }
    };
    return Gesture.Pan()
      .minDistance(0)
      .onBegin((e) => runOnJS(move)(e.x))
      .onUpdate((e) => runOnJS(move)(e.x));
  }, []);

  const nearPlayhead = CLIP.lane.filter((m) => Math.abs(m.at - t) < 1.5);
  const atOriginal = Math.abs(t - CLIP.playhead) < 1.2;
  const count = atOriginal ? CLIP.atPlayhead.count : nearPlayhead.length;
  const street = [...CLIP.streets].reverse().find((s) => t >= s.at) ?? CLIP.streets[0];

  return (
    <Screen height={760}>
      <Box l={20} t={18}>
        <Mono size={8} tracking={0.18} color={ink(0.55)}>
          CLIP · TABLE {CLIP.table} · HAND {chips(CLIP.handNo)}
        </Mono>
      </Box>
      <Box r={20} t={18}>
        <Mono size={8} tracking={0.1} color={ink(0.4)}>
          {chips(CLIP.reactions)} REACTIONS
        </Mono>
      </Box>
      <Rule l={0} t={44} w={420} color={ink(0.14)} />

      <Box l={0} t={76} w={420} style={{ alignItems: 'center', gap: 7 }}>
        <Sans size={8} tracking={0.3} color={ink(0.4)}>
          POT
        </Sans>
        <Mono size={30} weight={700} tracking={-0.04} lh={0.88}>
          {chips(CLIP.pot)}
        </Mono>
      </Box>
      <Board l={129} t={146} cards={CLIP.board} w={30} h={44} gap={3} />

      <Bust l={20} t={214} size={40} emoji={CLIP.actors[0].face} frame="lit" />
      <Box l={68} t={218} style={{ gap: 5 }}>
        <Sans size={8} tracking={0.2}>
          {CLIP.actors[0].name}
        </Sans>
        <Mono size={9} tracking={0.12} color={ink(0.5)}>
          {CLIP.actors[0].line}
        </Mono>
      </Box>
      <Bust r={20} t={214} size={40} emoji={CLIP.actors[1].face} frame="bone" />
      <Box r={68} t={218} style={{ alignItems: 'flex-end', gap: 5 }}>
        <Sans size={8} tracking={0.2}>
          {CLIP.actors[1].name}
        </Sans>
        <Mono size={9} weight={500} tracking={0.12}>
          {CLIP.actors[1].line}
        </Mono>
      </Box>
      <Rule l={0} t={288} w={420} color={ink(0.14)} />

      <Box l={20} t={306}>
        <Mono size={7} tracking={0.24} color={ink(0.4)}>
          REACTION LANE
        </Mono>
      </Box>
      {/* Every throw is a hairline at the second it landed. */}
      {CLIP.lane.map((m, i) => {
        const h = 4 + m.weight * 12;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: xOf(m.at),
              top: 332 - h,
              width: 1,
              height: h,
              backgroundColor: amber(Math.min(1, 0.4 + m.weight * 0.4)),
            }}
          />
        );
      })}
      <Box l={Math.min(xOf(t) + 16, 380)} t={306}>
        <Mono size={9} weight={700} color={amber()}>
          {count}
        </Mono>
      </Box>

      <GestureDetector gesture={scrub}>
        <Box l={TRACK.x} t={330} w={TRACK.w} h={30} hitSlop={20}>
          <Box l={0} t={14} w={TRACK.w} h={1} style={{ backgroundColor: ink(0.28) }}>
            <View style={{ width: `${(t / CLIP.length) * 100}%`, height: 1, backgroundColor: INK }} />
          </Box>
          <Ticks l={0} t={18} w={TRACK.w} h={5} pitch={13} color={ink(0.22)} />
          {CLIP.streets.map((s) => (
            <Rule
              key={s.label}
              l={xOf(s.at) - TRACK.x}
              t={6}
              h={17}
              vertical
              color={ink(s.label === street.label ? 0.5 : 0.35)}
            />
          ))}
          <Rule l={xOf(t) - TRACK.x} t={4} h={22} vertical weight={2} color={INK} />
          <View
            style={{
              position: 'absolute',
              left: xOf(t) - TRACK.x - 4,
              top: -2,
              width: 10,
              height: 10,
              backgroundColor: INK,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </Box>
      </GestureDetector>

      {CLIP.streets.map((s) => (
        <Box key={s.label} l={xOf(s.at)} t={362}>
          <Mono size={6.5} tracking={0.14} color={s.label === street.label ? INK : ink(0.35)}>
            {s.label}
          </Mono>
        </Box>
      ))}

      <Box l={20} t={382}>
        <Mono size={12} weight={700} color={amber()}>
          {clock(t)}
        </Mono>
      </Box>
      <Box r={20} t={382}>
        <Mono size={12} color={ink(0.4)}>
          {clock(CLIP.length)}
        </Mono>
      </Box>

      <Box l={20} t={414}>
        <Mono size={9} tracking={0.1} color={ink(0.75)}>
          {atOriginal ? CLIP.atPlayhead.label : `AT ${clock(t)} · ${street.label}`}
        </Mono>
      </Box>
      <Box l={20} t={434} w={380} h={2} style={{ backgroundColor: ink(0.1) }}>
        <View style={{ width: `${(t / CLIP.length) * 100}%`, height: 2, backgroundColor: INK }} />
      </Box>
      <Rule l={0} t={462} w={420} color={ink(0.14)} />

      <Box l={20} t={478}>
        <Mono size={7} tracking={0.2} color={ink(0.45)}>
          THROW AT THIS FRAME
        </Mono>
      </Box>
      <Box r={20} t={478}>
        <Mono size={7} tracking={0.1} color={ink(0.35)}>
          PINS TO {clock(t)}, NOT THE POST
        </Mono>
      </Box>
      <Box l={20} t={496} w={380} h={52} style={{ flexDirection: 'row' }}>
        {THROWABLES.map((item, i) => {
          const active = thrown === item.id;
          return (
            <Pressable
              key={item.id}
              disabled={!item.owned}
              onPress={() => {
                setThrown(item.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
              style={{
                width: 95,
                height: 52,
                borderWidth: 1,
                borderLeftWidth: i === 0 ? 1 : 0,
                borderColor: ink(0.3),
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: item.owned ? 1 : 0.4,
                backgroundColor: active ? amber(0.1) : undefined,
              }}
            >
              <Mono size={20}>{item.face}</Mono>
              <Mono size={7} tracking={0.14} color={active ? AMBER_LIGHT : ink(0.5)}>
                {item.name}
              </Mono>
            </Pressable>
          );
        })}
      </Box>

      <Box l={20} t={574}>
        <Mono size={7} tracking={0.2} color={ink(0.45)}>
          WHO THREW AT {clock(t)}
        </Mono>
      </Box>
      <Box l={20} t={594} style={{ flexDirection: 'row', gap: 10 }}>
        {CLIP.atPlayhead.throwers.map((p, i) => (
          <View key={i}>
            <Bust size={28} emoji={p.face} frame="rest" style={{ position: 'relative' }} />
            {/* Filled came from a seat; hollow came from the rail. */}
            <View
              style={{
                position: 'absolute',
                left: 4,
                top: -6,
                width: 12,
                height: 12,
                borderWidth: p.fromSeat ? 0 : 1,
                borderColor: amber(),
                backgroundColor: p.fromSeat ? amber() : '#0a0a0b',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mono size={7}>{p.mark}</Mono>
            </View>
          </View>
        ))}
        <View style={{ height: 28, justifyContent: 'center' }}>
          <Mono size={9} color={ink(0.4)}>
            +{CLIP.atPlayhead.more}
          </Mono>
        </View>
      </Box>
      <Box l={20} t={636} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThrowMark fromSeat style={{ position: 'relative' }} size={9} />
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          FILLED = FROM A SEAT
        </Mono>
        <ThrowMark fromSeat={false} style={{ position: 'relative' }} size={9} />
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          HOLLOW = FROM THE RAIL
        </Mono>
      </Box>

      <Rule l={0} t={666} w={420} color={ink(0.14)} />
      <Box l={20} t={684} w={380} h={44} style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 190,
            height: 44,
            borderWidth: 1,
            borderColor: ink(0.3),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sans size={12} weight={500} color={ink(0.85)}>
            Share clip
          </Sans>
        </View>
        <Pressable
          onPress={() => router.push('/rail')}
          style={({ pressed }) => ({
            width: 190,
            height: 44,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderColor: INK,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 11,
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={12} weight={500}>
            Open table {CLIP.table}
          </Sans>
          <Mono size={8} color={ink(0.55)}>
            1 SEAT
          </Mono>
        </Pressable>
      </Box>
    </Screen>
  );
}
