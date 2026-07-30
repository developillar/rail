import { useCallback, useMemo, useRef } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { BET, HAND } from '@/data/fixtures';
import { CHROME } from '@/data/tableLayout';
import { amber, chips, GROUND, ink, INK, SURFACE } from '@/design/tokens';

/**
 * The most-touched surface in the app. It has to feel like an instrument, so
 * every cell is a hairline-divided plate rather than a rounded button and the
 * primary is a filled bone slab — no accent on a chip action: FOLD, CALL,
 * RAISE TO and the amount they carry are all bone.
 *
 * Amber appears four times here and each one is time or expression, never a
 * stake: your clock and its urgency ticks (never another player's, which runs
 * as a bone hairline), the throw key's diamond and its cooldown gauge, and the
 * slide rule's thumb — which marks *where your finger is*, not what the bet is
 * worth, and goes with the finger. The bet itself is bone at 44px. The ALL IN
 * stop label turns amber only once the thumb is seated on it (2f).
 */

const BAR_Y = CHROME.actionBar.y;
const BAR_H = CHROME.actionBar.h;

/**
 * A press state that is never just an opacity change.
 *
 * It is also the one place the instrument's presses are announced. Every cell in
 * the action bar, the quick-bet row and the raise footer goes through here, so
 * the role and the disabled state are declared once: an unlabelled text group is
 * not a button, and the table's controls are the ones it is least acceptable on.
 * `label` is only needed where the drawn child is not a readable phrase.
 */
function Cell({
  onPress,
  disabled,
  style,
  pressedStyle,
  children,
  flex,
  width,
  label,
}: {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  pressedStyle?: ViewStyle;
  children: React.ReactNode;
  flex?: number;
  width?: number;
  /** Overrides the child text for assistive tech. Omit when the child says it. */
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...(label ? { accessibilityLabel: label } : null)}
      style={({ pressed }) => [
        { flex, width, alignItems: 'center', justifyContent: 'center' },
        style,
        pressed && !disabled ? (pressedStyle ?? { backgroundColor: SURFACE.press }) : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

/** Your clock is amber. Another player's runs as a bone hairline. */
export function Clock({
  label,
  seconds,
  progress,
  mine,
}: {
  label: string;
  seconds: number;
  progress: number;
  mine: boolean;
}) {
  const urgent = mine && seconds <= 5;
  return (
    <>
      <Box l={20} t={CHROME.clock.label + 4}>
        <Sans size={8} tracking={0.22} color={ink(0.4)}>
          {label}
        </Sans>
      </Box>
      <Box r={20} t={CHROME.clock.label} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
        <Mono size={13} weight={mine ? 700 : 500} color={mine ? amber() : ink(0.7)}>
          {seconds.toFixed(1)}
        </Mono>
        <Mono size={8} tracking={0.18} color={ink(0.35)}>
          SEC
        </Mono>
      </Box>
      <Box l={0} t={CHROME.clock.rule} w={420} h={2} style={{ backgroundColor: ink(mine ? 0.1 : 0.08) }}>
        <View
          style={{
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            height: 2,
            backgroundColor: mine ? amber() : ink(0.38),
          }}
        />
      </Box>
      {urgent ? (
        // Under 5s the tick pitch halves. No colour change, no sound.
        <Ticks l={0} t={CHROME.clock.rule + 3} w={420} h={3} pitch={6} color={amber(0.45)} />
      ) : null}
    </>
  );
}

export function ThrowKey({
  onPress,
  cooldown,
  height = BAR_H,
  borderLeft = true,
}: {
  onPress: () => void;
  cooldown: { active: boolean; seconds: number; progress: number };
  height?: number;
  borderLeft?: boolean;
}) {
  return (
    <Cell
      width={62}
      onPress={onPress}
      disabled={cooldown.active}
      style={{
        height,
        borderLeftWidth: borderLeft ? 1 : 0,
        borderColor: ink(0.14),
        backgroundColor: GROUND,
        gap: cooldown.active ? 7 : 8,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: cooldown.active ? amber(0.28) : amber(),
          transform: [{ rotate: '45deg' }],
        }}
      />
      {cooldown.active ? (
        <Mono size={8} weight={500} color={ink(0.35)}>
          {cooldown.seconds.toFixed(1)}
        </Mono>
      ) : (
        <Sans size={7} tracking={0.16} color={ink(0.5)}>
          THROW
        </Sans>
      )}
      {cooldown.active ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: `${cooldown.progress * 100}%`,
            height: 2,
            backgroundColor: amber(0.55),
          }}
        />
      ) : null}
    </Cell>
  );
}

/** 2a — your turn. Fold, call, the bone slab, and the throw key. */
export function YourTurnBar({
  toCall,
  raiseTo,
  onFold,
  onCall,
  onRaise,
  onThrow,
  cooldown,
}: {
  toCall: number;
  raiseTo: number;
  onFold: () => void;
  onCall: () => void;
  onRaise: () => void;
  onThrow: () => void;
  cooldown: { active: boolean; seconds: number; progress: number };
}) {
  return (
    <Box l={0} t={BAR_Y} w={420} h={BAR_H} style={{ flexDirection: 'row' }}>
      <Cell flex={1} onPress={onFold} style={{ borderRightWidth: 1, borderColor: ink(0.14), backgroundColor: GROUND }}>
        <Sans size={11} tracking={0.2} color={ink(0.6)}>
          FOLD
        </Sans>
      </Cell>
      <Cell
        flex={1.15}
        onPress={onCall}
        style={{ borderRightWidth: 1, borderColor: ink(0.14), backgroundColor: GROUND, gap: 7 }}
      >
        <Sans size={10} tracking={0.2} color={ink(0.5)}>
          CALL
        </Sans>
        <Mono size={21} weight={700} tracking={-0.03}>
          {chips(toCall)}
        </Mono>
      </Cell>
      <Cell
        flex={1.35}
        onPress={onRaise}
        style={{ backgroundColor: INK, gap: 7 }}
        pressedStyle={{ backgroundColor: SURFACE.pressLight }}
      >
        <Sans size={10} tracking={0.2} color="rgba(10,10,11,.55)">
          RAISE TO
        </Sans>
        <Mono size={21} weight={700} tracking={-0.03} color={GROUND}>
          {chips(raiseTo)}
        </Mono>
      </Cell>
      <ThrowKey onPress={onThrow} cooldown={cooldown} />
    </Box>
  );
}

/** 2b — waiting. Resting orders, and throw is never blocked by turn order. */
export function WaitingBar({
  queued,
  onQueue,
  onThrow,
  cooldown,
}: {
  queued: string | null;
  onQueue: (order: string) => void;
  onThrow: () => void;
  cooldown: { active: boolean; seconds: number; progress: number };
}) {
  const order = (id: string, label: string, flex: number) => (
    <Cell
      flex={flex}
      onPress={() => onQueue(id)}
      style={{ borderRightWidth: 1, borderColor: ink(0.14), backgroundColor: GROUND, gap: 9 }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: queued === id ? INK : undefined,
          borderWidth: queued === id ? 0 : 1,
          borderColor: ink(0.3),
        }}
      />
      <Sans size={10} tracking={0.2} color={queued === id ? ink(0.8) : ink(0.42)}>
        {label}
      </Sans>
    </Cell>
  );

  return (
    <>
      <Box l={0} t={BAR_Y} w={420} h={BAR_H} style={{ flexDirection: 'row' }}>
        {order('fold', 'FOLD', 1)}
        {order('call-any', 'CALL ANY', 1.55)}
        {order('check', 'CHECK', 0.95)}
        <ThrowKey onPress={onThrow} cooldown={cooldown} borderLeft={false} />
      </Box>
      <Box l={20} t={BAR_Y + 98}>
        <Mono size={7} tracking={0.2} color={ink(0.3)}>
          QUEUED ORDER CANCELS IF THE BET SIZE CHANGES
        </Mono>
      </Box>
    </>
  );
}

/** 2c — folded. The controls leave; the space stays empty on purpose. */
export function FoldedBar({
  nextHandIn,
  onThrow,
  cooldown,
}: {
  nextHandIn: number;
  onThrow: () => void;
  cooldown: { active: boolean; seconds: number; progress: number };
}) {
  return (
    <>
      <Box l={20} t={706} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Sans size={8} tracking={0.22} color={ink(0.28)}>
          NEXT HAND IN
        </Sans>
        <Mono size={8} color={ink(0.28)}>
          {Math.max(0, Math.ceil(nextHandIn))}
        </Mono>
      </Box>
      <Rule l={0} t={754} w={420} color={ink(0.1)} />
      <Box l={0} t={755} w={420} h={55} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingLeft: 20 }}>
          <Sans size={9} tracking={0.18} color={ink(0.4)}>
            SITTING OUT THIS HAND
          </Sans>
        </View>
        <ThrowKey onPress={onThrow} cooldown={cooldown} height={55} />
      </Box>
    </>
  );
}

/** 2d — all in. The bar stops being a control and becomes a readout. */
export function AllInBar({
  runout,
  onThrow,
  cooldown,
}: {
  runout: number;
  onThrow: () => void;
  cooldown: { active: boolean; seconds: number; progress: number };
}) {
  return (
    <>
      <Box l={20} t={700}>
        <Sans size={8} tracking={0.22} color={ink(0.4)}>
          RIVER TO COME
        </Sans>
      </Box>
      <Box l={0} t={CHROME.clock.rule} w={420} h={2} style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <View key={i} style={{ flex: 1, height: 2, backgroundColor: i < runout ? ink(0.5) : ink(0.1) }} />
        ))}
      </Box>
      <Box l={0} t={BAR_Y} w={420} h={BAR_H} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingLeft: 20, gap: 8 }}>
          <Sans size={9} tracking={0.18} color={ink(0.4)}>
            NO ACTION REQUIRED
          </Sans>
          <Mono size={7} tracking={0.16} color={ink(0.28)}>
            SHOWDOWN WHEN THE RIVER LANDS
          </Mono>
        </View>
        <ThrowKey onPress={onThrow} cooldown={cooldown} />
      </Box>
    </>
  );
}

/**
 * 2e / 2f — the slide rule.
 *
 * Not a pill. A measured rail: minor ticks every 100 chips, four named stops,
 * a 2px thumb with a diamond head, and the amount set at 44px against a 9px
 * label. Dragging is 1:1 with no inertia; stops seat with a 120ms settle.
 */
const RULE = { x: 20, y: 696, w: 380, span: 379 };

const STOPS = [
  { id: 'min', label: 'MIN', labelX: 0, value: BET.min },
  { id: 'half', label: '½', labelX: 88, value: BET.halfPot },
  { id: 'pot', label: 'POT', labelX: 308, value: BET.pot },
  { id: 'allin', label: 'ALL IN', labelX: 352, value: BET.allIn },
] as const;

const xOf = (value: number) => ((value - BET.min) / (BET.allIn - BET.min)) * RULE.span;
const valueOf = (x: number) => {
  const raw = BET.min + (Math.max(0, Math.min(RULE.span, x)) / RULE.span) * (BET.allIn - BET.min);
  return Math.round(raw / BET.step) * BET.step;
};

export function BetSlider({
  amount,
  onChange,
  onCommit,
  onCancel,
  stack,
}: {
  amount: number;
  onChange: (value: number) => void;
  onCommit: () => void;
  onCancel: () => void;
  stack: number;
}) {
  const allIn = amount >= BET.allIn;
  const lastDetent = useRef<string | null>(null);

  const settle = useCallback(
    (value: number) => {
      // Detents: the thumb seats into a named stop rather than passing over it.
      const near = STOPS.find((s) => Math.abs(xOf(s.value) - xOf(value)) < 9);
      if (near) {
        if (lastDetent.current !== near.id) {
          lastDetent.current = near.id;
          Haptics.selectionAsync().catch(() => {});
        }
        onChange(near.value);
        return;
      }
      lastDetent.current = null;
      onChange(value);
    },
    [onChange],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((e) => runOnJS(settle)(valueOf(e.x)))
        .onUpdate((e) => runOnJS(settle)(valueOf(e.x))),
    [settle],
  );

  const thumbX = xOf(amount);
  const pctOfPot = Math.round((amount / HAND.pot) * 100);

  return (
    <>
      <Rule l={0} t={572} w={420} color={ink(0.14)} />
      <Box l={0} t={573} w={420} h={46} style={{ flexDirection: 'row' }}>
        {(
          [
            ['MIN', BET.min],
            ['HALF POT', BET.halfPot],
            ['POT', BET.pot],
            ['ALL IN', BET.allIn],
          ] as [string, number][]
        ).map(([label, value], i) => {
          const selected = amount === value;
          return (
            <Cell
              key={label}
              flex={1}
              onPress={() => onChange(value)}
              style={{
                borderRightWidth: i === 3 ? 0 : 1,
                borderColor: ink(0.1),
                borderTopWidth: selected ? 2 : 0,
                borderTopColor: INK,
                backgroundColor: selected ? SURFACE.quickBet : GROUND,
                gap: 5,
              }}
            >
              <Sans size={7} tracking={0.18} color={selected ? ink(0.55) : ink(0.4)}>
                {label}
              </Sans>
              <Mono size={12} weight={selected ? 700 : 500} color={selected ? ink() : ink(0.7)}>
                {chips(value)}
              </Mono>
            </Cell>
          );
        })}
      </Box>
      <Rule l={0} t={619} w={420} color={ink(0.1)} />

      <Box l={20} t={632} style={{ gap: 8 }}>
        <Sans size={9} tracking={0.26} color={ink(0.42)}>
          {allIn ? 'ALL IN · RAISE TO' : 'RAISE TO'}
        </Sans>
        <Mono size={44} weight={700} tracking={-0.045} lh={0.86}>
          {chips(amount)}
        </Mono>
      </Box>
      <Box r={20} t={636} style={{ alignItems: 'flex-end', gap: 6 }}>
        <Mono size={10} weight={500} tracking={0.06} color={ink(0.6)}>
          {pctOfPot}% OF POT
        </Mono>
        <Mono size={9} tracking={0.06} color={ink(0.4)}>
          STACK AFTER {chips(Math.max(0, stack - amount))}
        </Mono>
        <Mono size={9} tracking={0.06} color={ink(0.4)}>
          {allIn ? 'EVERY CHIP YOU HAVE' : `STEP ${BET.step}`}
        </Mono>
      </Box>

      <GestureDetector gesture={pan}>
        <Box l={RULE.x} t={RULE.y} w={RULE.w} h={46} style={{ paddingTop: 0 }} hitSlop={16}>
          <Ticks l={0} t={22} w={RULE.w} h={4} pitch={10} color={ink(0.16)} />
          {STOPS.map((s) => (
            <Rule key={s.id} l={xOf(s.value)} t={16} h={16} vertical color={ink(0.4)} />
          ))}
          {STOPS.map((s) => (
            <Box key={`l-${s.id}`} l={s.labelX} t={36} w={44}>
              <Mono
                size={7}
                tracking={0.14}
                numberOfLines={1}
                color={s.id === 'allin' && allIn ? amber() : ink(0.35)}
              >
                {s.label}
              </Mono>
            </Box>
          ))}
          <Rule l={thumbX} t={0} h={34} vertical weight={2} color={amber()} />
          <View
            style={{
              position: 'absolute',
              left: thumbX - 4,
              top: -5,
              width: 10,
              height: 10,
              backgroundColor: amber(),
              transform: [{ rotate: '45deg' }],
            }}
          />
        </Box>
      </GestureDetector>

      <Rule l={0} t={754} w={420} color={ink(0.14)} />
      <Box l={0} t={755} w={420} h={55} style={{ flexDirection: 'row' }}>
        <Cell
          width={112}
          onPress={onCancel}
          style={{ borderRightWidth: 1, borderColor: ink(0.14), backgroundColor: GROUND }}
        >
          <Sans size={10} tracking={0.2} color={ink(0.5)}>
            CANCEL
          </Sans>
        </Cell>
        {allIn ? (
          // Committing everything never fires on the press that selects it: the
          // cell arms, states the commitment in words, and waits for a second press.
          <Cell
            flex={1}
            onPress={onCommit}
            style={{
              borderWidth: 1,
              borderColor: INK,
              backgroundColor: GROUND,
              flexDirection: 'row',
              gap: 12,
            }}
            pressedStyle={{ backgroundColor: INK }}
          >
            <Sans size={10} tracking={0.2} color={ink(0.55)}>
              PRESS AGAIN
            </Sans>
            <Mono size={22} weight={700} tracking={-0.03}>
              ALL IN {chips(amount)}
            </Mono>
          </Cell>
        ) : (
          <Cell
            flex={1}
            onPress={onCommit}
            style={{ backgroundColor: INK, flexDirection: 'row', gap: 12 }}
            pressedStyle={{ backgroundColor: SURFACE.pressLight }}
          >
            <Sans size={10} tracking={0.2} color="rgba(10,10,11,.55)">
              RAISE TO
            </Sans>
            <Mono size={22} weight={700} tracking={-0.03} color={GROUND}>
              {chips(amount)}
            </Mono>
          </Cell>
        )}
      </Box>
    </>
  );
}
