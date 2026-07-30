import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NAV_H, NAV_NOTCH } from '@/components/AppShell';
import { Grain } from '@/components/Grain';
import { Box, Mono, Ticks } from '@/components/Prim';
import { EASE } from '@/design/motion';
import { CANVAS_W, GROUND, ink, MS } from '@/design/tokens';

/**
 * THE BOOT SCREEN — §4 of docs/APP-SHELL-SPEC.md.
 *
 * The app draws the object it is named after, then hands off by *becoming the
 * navigation*: the line you boot on walks down to the foot of the screen, its
 * 58-unit notch travelling to where you will be standing, while the wordmark
 * walks up to 20/20 where HOME's masthead sets it at the same tracking. The line
 * goes down and the word goes up — the boot mark splits into the app's two
 * brackets and the app opens between them. The one teaching moment is the gap
 * arriving at "you are here": the same gap as the app icon's and the nav cell's.
 *
 * COMPOSITION — not a logo centred in nothing. The mark is left-ranged at x=20
 * and set low: 428 units of empty ground above it, some 350 below, and one tight
 * dense band from 428 to 560 carrying four objects — mono 44/700 over the 2px
 * rail, an agate positioning line, a fourteen-tick meter. Type range 7 → 44 is
 * 6.3×. The rule bleeds off both edges, because an inset line is a container and
 * because this line is not the lockup's rule — it is the rail.
 *
 * AMBER — none, anywhere on this screen. 10a's fifth wordmark rule bans amber
 * from the mark, and the meter does not get to smuggle it back in: amber is the
 * *table's* time — a clock counting a person's decision — and expression, the
 * crowd and a throw. This meter measures the app's own readiness, which is
 * neither, and it stands 42 units under the mark, inside its clear space. So
 * bone at ink(0.3), consistent with §4's "no amber": the shell's amber is HOME's
 * 0:11 clock and the crowd marks, and the boot has neither.
 *
 * ROUTE — the boot is the route at '/', and it ends in router.replace('/home'),
 * so back never returns here. §4 describes it as an overlay above the Stack;
 * this is the deliberate deviation, and it is the shape the nav is built for.
 *
 * NEVER BLOCKS — the boot runs on mount and always reaches /home. It is not
 * gated on AccessibilityInfo: that answer only chooses between the animated path
 * and the cut, so a slow, hung or rejected query costs the animation, never the
 * app. The tap is armed at declaration, before any effect runs.
 *
 * FRAME — not a <Screen>. Scroll-mode scaling (width / 420), top-anchored under
 * the top inset, because fit-mode scale is smaller than widthScale on every
 * ordinary phone and a fit-mode splash could not land pixel-exact on HOME's
 * masthead. Grain runs the whole viewport so the texture does not pop on the
 * handoff, and the native splash is flat GROUND with no image (app.json), so
 * frame one is this same ground with nothing to pop into it.
 */

/** The mark, in design units on the 420 canvas. */
const MARK = {
  wordL: 20,
  wordT: 428,
  wordSize: 44,
  /** Where the wordmark lands: HOME's masthead, Mono 20/700/.26 at (20, 20). */
  mastheadT: 20,
  mastheadSize: 20,
  /** 10a: the cap of mono 44 is ≈32, so the rule sits 1.5 × cap — 48 units — below the baseline. */
  railY: 510,
  /** The 58-unit notch, centred on x=210: gap 181 → 239. */
  notchL: 181,
  /** HOME's notch, 23 → 81. The gap travels to where you are standing. */
  homeNotchL: 23,
  positioningT: 530,
  meterT: 552,
  meterW: 126,
  /**
   * The meter's span: the dwell, so it fills exactly as the dwell ends. It runs
   * on elapsed time, which is what makes it a declared meter and exempt from the
   * ladder (law 6) — MS.skip is the length it measures, not a curve it is on.
   */
  meterMs: MS.skip,
} as const;

/** 44 → HOME's 20. Letter-spacing scales with the transform, so .26em holds exactly. */
const WORD_SCALE = MARK.mastheadSize / MARK.wordSize;

const RULE_WEIGHT = 2;
const RULE_INK = ink(0.8);

const POSITIONING = 'SOCIAL POKER ROOMS WITH FRIENDS · PLAY CHIPS ONLY';

export default function BootScreen() {
  const router = useRouter();
  const { width, height: winHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /** The rail building outward from the notch: both segments, one progress value. */
  const build = useSharedValue(0);
  /** The handoff: one MS.travel move carrying three values, with no overshoot. */
  const hand = useSharedValue(0);
  /** The positioning line and the meter — ephemera, and they leave first. */
  const ephemera = useSharedValue(1);

  /** The meter is not a shared value: it runs on elapsed time, in state, at 100ms. */
  const [meter, setMeter] = useState(0);
  /**
   * The rest frame: drawn complete the moment the OS says it wants reduced
   * motion. State, because it is a render decision (the meter is drawn full).
   */
  const [restFrame, setRestFrame] = useState(false);
  /**
   * The same answer as a ref, because the beats read it at each decision point
   * rather than being scheduled by it. It starts false — the animated path — so
   * the boot never waits, and an answer that arrives mid-build still lands on
   * the cut.
   */
  const reduceMotion = useRef(false);
  /** The handoff, once, from whichever path reaches it first. */
  const entered = useRef(false);
  const enter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    router.replace('/home');
  }, [router]);
  /**
   * A tap anywhere skips the dwell. Armed at declaration with the handoff
   * itself, so it is never inert — not before the effects run, not ever.
   */
  const skip = useRef<() => void>(enter);

  const s = width / CANVAS_W;
  const canvasUnits = s > 0 ? (winHeight - insets.top) / s : 0;
  /**
   * Where the rail lands — the y NavRail draws its own line on: the top of a
   * 58-unit band pinned above the bottom inset, in this canvas's units.
   */
  const navRuleY = s > 0 ? (winHeight - insets.bottom - NAV_H * s - insets.top) / s : MARK.railY;

  /**
   * The accessibility query, asked alongside the boot rather than in front of it.
   * A "no" and a rejection are the same thing here — the animated path, which is
   * already running — so only a "yes" does anything: it snaps the rail whole and
   * the meter full, and the travel becomes a cut. Nothing waits on this.
   */
  useEffect(() => {
    let alive = true;
    try {
      Promise.resolve(AccessibilityInfo.isReduceMotionEnabled()).then(
        (on) => {
          if (!alive || !on) return;
          reduceMotion.current = true;
          setRestFrame(true);
          // Assigning cancels the build in flight: the rest frame, drawn complete.
          build.value = 1;
        },
        () => {},
      );
    } catch {
      // A query that throws is still just "no": it must not take the boot with it.
    }
    return () => {
      alive = false;
    };
  }, [build]);

  /**
   * The meter. Elapsed time from the frame the screen starts, monotonic, and
   * exempt from the ladder (law 6) because it is a declared meter rather than a
   * transition. On a warm start you barely see it, which is correct behaviour for
   * a loading indicator. With reduced motion it is drawn full, as part of the
   * rest frame.
   */
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / MARK.meterMs);
      setMeter(p);
      if (p >= 1) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);

  /**
   * The beats. Every shared value is written in here, never during render.
   *
   *  1  the rail builds outward from the notch over MS.join / EASE.slide, one
   *     shared progress for both segments. The notch never fills: it is the gap,
   *     and the gap is the point.
   *  2  type is set, never faded — JetBrains Mono resolves in app/_layout.tsx
   *     before any route mounts, so the wordmark and the positioning line are at
   *     full ink on frame one and there is no readiness left to wait on here.
   *  3  the meter runs, on elapsed time (above).
   *  4  dwell until MS.skip.
   *  5  the ephemera leave over MS.exit / EASE.out, inside the travel.
   *  6  the handoff: one MS.travel / EASE.slide move over three values — the
   *     rule's y, the notch's left lip, and the wordmark's translate and scale —
   *     then router.replace, so back never returns to the splash. The Stack's own
   *     fade cross-dissolves to HOME, whose masthead wordmark and whose rail rule
   *     are already painted at identical values: the substitution is unseeable.
   *
   * Reduced motion: the rest frame is drawn complete — rail whole, notch on
   * centre, wordmark set, positioning line, meter full — it holds MS.skip, and
   * the travel becomes a cut. The handoff still happens, on one route fade and
   * nothing else. No build, no travel.
   *
   * This runs once, on mount, and depends on nothing that can fail to arrive.
   */
  useEffect(() => {
    const start = Date.now();
    let dwell: ReturnType<typeof setTimeout> | undefined;
    let travel: ReturnType<typeof setTimeout> | undefined;
    let exiting = false;

    const leave = () => {
      if (exiting || entered.current) return;
      exiting = true;
      if (dwell) clearTimeout(dwell);
      dwell = undefined;
      if (reduceMotion.current) {
        enter();
        return;
      }
      ephemera.value = withTiming(0, { duration: MS.exit, easing: EASE.out });
      hand.value = withTiming(1, { duration: MS.travel, easing: EASE.slide });
      travel = setTimeout(enter, MS.travel);
    };

    skip.current = () => {
      if (exiting || entered.current) return;
      // If the rail is still building it completes over MS.punch / EASE.out first.
      if (!reduceMotion.current && Date.now() - start < MS.join) {
        build.value = withTiming(1, { duration: MS.punch, easing: EASE.out });
        if (dwell) clearTimeout(dwell);
        dwell = setTimeout(leave, MS.punch);
        return;
      }
      leave();
    };

    build.value = withTiming(1, { duration: MS.join, easing: EASE.slide });
    dwell = setTimeout(leave, MS.skip);

    return () => {
      // Nothing may hand off, or start an exit, after this screen is gone.
      exiting = true;
      skip.current = () => {};
      if (dwell) clearTimeout(dwell);
      if (travel) clearTimeout(travel);
    };
  }, [enter, build, hand, ephemera]);

  /** The rule's y: 510 → the y the nav draws its line on. */
  const railStyle = useAnimatedStyle(() => ({
    top: interpolate(hand.value, [0, 1], [MARK.railY, navRuleY]),
  }));

  /** Left segment: it grows left off the notch's left lip, and that lip travels to 23. */
  const leftStyle = useAnimatedStyle(() => {
    const gapL = interpolate(hand.value, [0, 1], [MARK.notchL, MARK.homeNotchL]);
    const w = build.value * gapL;
    return { left: gapL - w, width: w };
  });

  /** Right segment: it grows right off the right lip, bleeding off the edge at 420. */
  const rightStyle = useAnimatedStyle(() => {
    const gapL = interpolate(hand.value, [0, 1], [MARK.notchL, MARK.homeNotchL]);
    return {
      left: gapL + NAV_NOTCH,
      width: build.value * (CANVAS_W - gapL - NAV_NOTCH),
    };
  });

  /** The wordmark walks up to the masthead as the line walks down. */
  const wordStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(hand.value, [0, 1], [MARK.wordT, MARK.mastheadT]) },
      { scale: interpolate(hand.value, [0, 1], [1, WORD_SCALE]) },
    ],
  }));

  const ephemeraStyle = useAnimatedStyle(() => ({ opacity: ephemera.value }));

  return (
    <Pressable
      onPress={() => skip.current()}
      accessibilityRole="button"
      accessibilityLabel="Enter RAIL"
      style={{ flex: 1, backgroundColor: GROUND, paddingTop: insets.top }}
    >
      <View style={{ width: CANVAS_W * s, height: winHeight - insets.top, overflow: 'hidden' }}>
        <View
          style={{
            width: CANVAS_W,
            height: canvasUnits,
            transform: [{ scale: s }],
            transformOrigin: 'top left',
          }}
        >
          {/*
            THE RAIL. The same object and the same value as every masthead rule
            and as the nav's own line — 2px at ink(0.8) — drawn as two segments
            around the 58-unit notch. An animated pair rather than <Rule> because
            only the widths and the lip move. No fill, no track, no rounded end.
          */}
          <Animated.View
            pointerEvents="none"
            style={[
              { position: 'absolute', left: 0, width: CANVAS_W, height: RULE_WEIGHT },
              railStyle,
            ]}
          >
            <Animated.View
              style={[
                { position: 'absolute', top: 0, height: RULE_WEIGHT, backgroundColor: RULE_INK },
                leftStyle,
              ]}
            />
            <Animated.View
              style={[
                { position: 'absolute', top: 0, height: RULE_WEIGHT, backgroundColor: RULE_INK },
                rightStyle,
              ]}
            />
          </Animated.View>

          {/* The mark. 10a: mono 700 at .26em, bone on near-black, never another face. */}
          <Animated.View
            pointerEvents="none"
            style={[
              { position: 'absolute', left: MARK.wordL, top: 0, transformOrigin: 'top left' },
              wordStyle,
            ]}
          >
            <Mono size={MARK.wordSize} weight={700} tracking={0.26}>
              RAIL
            </Mono>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }, ephemeraStyle]}
          >
            <Box l={MARK.wordL} t={MARK.positioningT}>
              <Mono size={7} tracking={0.3} color={ink(0.35)}>
                {POSITIONING}
              </Mono>
            </Box>

            {/*
              The meter: determinate, and made of the app's own measurement
              language instead of a spinner or a percentage. Fourteen ticks at
              pitch 9 fill left to right across 126 units — the same strip the
              slide rule, the head strips and every earned item are made of.
            */}
            <Ticks
              l={MARK.wordL}
              t={MARK.meterT}
              w={MARK.meterW * (restFrame ? 1 : meter)}
              h={8}
              pitch={9}
              tickWidth={1}
              color={ink(0.3)}
            />
          </Animated.View>

          <Grain height={canvasUnits} />
        </View>
      </View>
    </Pressable>
  );
}
