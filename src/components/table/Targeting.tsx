import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { type SeatId, THROWABLES } from '@/data/fixtures';
import { CHROME, headStrip } from '@/data/tableLayout';
import { amber, ink } from '@/design/tokens';

/**
 * 3b — drag and release. The recommended mechanic, and the only one that is a
 * single continuous gesture: the commit point is physical (you let go) rather
 * than a second tap that can be mis-hit, and your thumb never leaves the bottom
 * third, so the board is never covered.
 *
 * Press a throwable, drag, and a hairline leader tracks your thumb and snaps to
 * the nearest bust. Release fires. Drag off the table and it retracts, silently
 * and for free.
 */

const TRAY_Y = CHROME.tray.y;
const TRAY_H = CHROME.tray.h;
const SNAP_RADIUS = 92;

export type DragState = {
  throwable: (typeof THROWABLES)[number];
  x: number;
  y: number;
  target: SeatId | null;
};

export function Targeting({
  targets,
  cooldown,
  onFire,
  onClose,
  onDragChange,
}: {
  targets: SeatId[];
  cooldown: { active: boolean; seconds: number; progress: number };
  onFire: (seat: SeatId, throwable: (typeof THROWABLES)[number]) => void;
  onClose: () => void;
  onDragChange: (drag: DragState | null) => void;
}) {
  const [drag, setDrag] = useState<DragState | null>(null);

  const anchors = useMemo(
    () => targets.map((seat) => ({ seat, ...headStrip(seat) })),
    [targets],
  );

  const update = useCallback(
    (x: number, y: number, begin: boolean) => {
      const cellWidth = 420 / THROWABLES.length;
      let next: DragState | null = drag;

      if (begin) {
        if (y < TRAY_Y || y > TRAY_Y + TRAY_H) return;
        const item = THROWABLES[Math.max(0, Math.min(THROWABLES.length - 1, Math.floor(x / cellWidth)))];
        if (!item.owned) return;
        next = { throwable: item, x, y, target: null };
      }
      if (!next) return;

      // Snap is discrete — a reticle jumps, it is never interpolated.
      let target: SeatId | null = null;
      let best = SNAP_RADIUS;
      for (const a of anchors) {
        const d = Math.hypot(a.x - x, a.y - y);
        if (d < best) {
          best = d;
          target = a.seat;
        }
      }
      if (target !== next.target && target !== null) Haptics.selectionAsync().catch(() => {});

      const state = { ...next, x, y, target };
      setDrag(state);
      onDragChange(state);
    },
    [anchors, drag, onDragChange],
  );

  const release = useCallback(() => {
    if (drag?.target && !cooldown.active) onFire(drag.target, drag.throwable);
    setDrag(null);
    onDragChange(null);
  }, [cooldown.active, drag, onDragChange, onFire]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((e) => runOnJS(update)(e.x, e.y + TRAY_Y, true))
        .onUpdate((e) => runOnJS(update)(e.x, e.y + TRAY_Y, false))
        .onFinalize(() => runOnJS(release)()),
    [release, update],
  );

  const anchor = drag?.target ? headStrip(drag.target) : null;

  return (
    <>
      <Rule l={0} t={CHROME.tray.rule} w={420} color={ink(0.14)} />
      <Box l={20} t={CHROME.tray.hint}>
        <Sans size={8} tracking={0.22} color={ink(0.35)}>
          {drag ? 'DRAG OFF THE TABLE TO CANCEL' : 'PRESS AND DRAG ONTO A SEAT'}
        </Sans>
      </Box>
      <Pressable
        onPress={onClose}
        hitSlop={16}
        accessibilityRole="button"
        accessibilityLabel="Close the throw tray"
        style={{ position: 'absolute', right: 20, top: CHROME.tray.hint }}
      >
        <Sans size={8} tracking={0.22} color={ink(0.5)}>
          CLOSE
        </Sans>
      </Pressable>

      {/* The leader. Dashed, exactly the path the throwable will travel. */}
      {drag && anchor ? (
        <DashedLeader from={{ x: drag.x, y: drag.y }} to={anchor} />
      ) : null}

      {drag ? (
        <>
          <View
            style={{
              position: 'absolute',
              left: drag.x - 28,
              top: drag.y - 28,
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: amber(0.3),
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: drag.x - 18,
              top: drag.y - 18,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: amber(),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mono size={16}>{drag.throwable.face}</Mono>
          </View>
          <Box l={Math.min(drag.x + 58, 250)} t={drag.y + 6} style={{ gap: 5 }}>
            <Mono size={10} weight={500} tracking={0.1}>
              {drag.throwable.name}
              {drag.target ? ` → ${SEAT_NAME[drag.target]}` : ''}
            </Mono>
            <Sans size={8} tracking={0.16} color={ink(0.45)}>
              {cooldown.active
                ? `${cooldown.seconds.toFixed(1)}S UNTIL YOU CAN THROW`
                : drag.target
                  ? 'RELEASE TO THROW'
                  : 'NO SEAT UNDER THE LEADER'}
            </Sans>
          </Box>
        </>
      ) : null}

      {/* The gesture starts in the tray and keeps tracking once it leaves it, so
          the leader can reach a bust without a second view swallowing the touch. */}
      <GestureDetector gesture={pan}>
        <Box l={0} t={TRAY_Y} w={420} h={TRAY_H}>
          <Box l={0} t={0} w={420} h={TRAY_H} style={{ flexDirection: 'row' }}>
            {THROWABLES.map((item, i) => {
              const lifted = drag?.throwable.id === item.id;
              return (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    borderRightWidth: i === THROWABLES.length - 1 ? 0 : 1,
                    borderColor: ink(0.1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: !item.owned ? 0.22 : lifted ? 1 : drag ? 0.4 : 1,
                  }}
                >
                  {lifted ? (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: amber(0.7),
                      }}
                    />
                  ) : (
                    <Mono size={20}>{item.face}</Mono>
                  )}
                  <Sans size={7} tracking={0.14} color={lifted ? amber() : ink(0.42)}>
                    {lifted ? 'LIFTED' : item.owned ? item.name : 'LOCKED'}
                  </Sans>
                </View>
              );
            })}
          </Box>
        </Box>
      </GestureDetector>

      <Box l={0} t={CHROME.tray.cooldown} w={420} h={2} style={{ backgroundColor: ink(0.1) }}>
        <View
          style={{
            width: `${(cooldown.active ? cooldown.progress : 1) * 100}%`,
            height: 2,
            backgroundColor: amber(cooldown.active ? 0.55 : 0.35),
          }}
        />
      </Box>
      <Box l={20} t={CHROME.tray.cooldown + 13}>
        <Mono size={7} tracking={0.18} color={ink(0.3)}>
          {cooldown.active ? `${cooldown.seconds.toFixed(1)} SEC` : 'READY'}
        </Mono>
      </Box>
    </>
  );
}

const SEAT_NAME: Record<SeatId, string> = {
  1: 'YOU',
  2: 'DERYA',
  3: 'OKONKWO',
  4: 'BEA',
  5: 'TOMÁS',
  6: 'SVEN',
};

/** A dashed hairline between two points — the leader, and the throw's path. */
export function DashedLeader({
  from,
  to,
  color = amber(0.85),
  pitch = 10,
  dash = 4,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  pitch?: number;
  dash?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <View
      style={{
        position: 'absolute',
        left: from.x,
        top: from.y,
        width: length,
        height: 1,
        transform: [{ rotate: `${angle}deg` }],
        transformOrigin: 'left center',
      }}
      pointerEvents="none"
    >
      <Ticks l={0} t={0} w={length} h={1} pitch={pitch} tickWidth={dash} color={color} />
    </View>
  );
}
