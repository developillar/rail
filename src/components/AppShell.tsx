import type { ReactElement } from 'react';
import { Pressable, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RAIL_NOW, TABLES_META } from '@/data/social';
import { EASE } from '@/design/motion';
import { CANVAS_W, GROUND, ink, INK, MS, SURFACE } from '@/design/tokens';
import { Grain } from './Grain';
import { Box, Mono, Rule, Ticks } from './Prim';

/**
 * THE APP SHELL — the rail, the masthead, and the mark you leave by.
 *
 * The nav device is the object the app is named after: one 2px hairline across
 * the bottom, broken by a 58-unit notch cut where you are standing, with four
 * mono words hanging off it. The active destination is drawn as a *subtraction*
 * — the line makes room for you, exactly as `src/data/tableLayout.ts` cuts a
 * notch in the table boundary for every seat, and exactly as the app icon is one
 * boundary hairline broken by one notch. The same gap is the icon, the boot
 * mark and "you are here": one object in three places.
 *
 * The same notch therefore exists at three scales and the app owns no other
 * selected-state device: the nav cell (58 units), the masthead register half
 * (53 / 30 units), and the seat cut in the table boundary. No pill, no fill, no
 * underline, no dot, no badge — and no amber anywhere in here. Amber is time
 * and expression; moving between rooms of the app is neither.
 *
 * The shell is a sibling of `<Screen>`, never part of a screen's canvas: it is
 * its own 420-unit-wide band scaled by `width / 420` — Screen's own widthScale —
 * so the bar's 2px rule is the same physical weight as the masthead rule of the
 * document above it. `Screen.tsx` is not touched: the room the bar needs is
 * authored in design units, in each destination's canvas (see NAV_RESERVE).
 */

/** Design units of drawn band. Physical: 54.2pt at 393pt wide, 44.2pt at 320pt. */
export const NAV_H = 58;
/** The gap. Identical to the app icon's and the boot mark's. */
export const NAV_NOTCH = 58;
/** Empty units every destination canvas must end with, below its last ink. */
export const NAV_RESERVE = 64;

/**
 * The four destinations. Everything else in the app is a screen you were pushed
 * into. HOME is `/home`, not `/`: `app/index.tsx` is the boot mark, which
 * `router.replace()`s into `/home` and is never a place you can stand — a nav
 * cell pointing at `/` would replay the splash every time you pressed HOME.
 */
export type NavRoute = '/home' | '/tables' | '/feed' | '/friends';

export type NavCell = {
  /** ≤ 7 chars, uppercase — the invariant that keeps a label inside its notch. */
  label: string;
  route: NavRoute;
  l: number;
  w: number;
  centre: number;
  /** [left lip, right lip] of the 58-unit cut in the rule. */
  notch: [number, number];
  /** Which live count draws its ticks; absent = no ticks. */
  live?: 'rooms' | 'people';
};

/**
 * Cells are sized to their words, not to 420/4 — a symmetric four-column grid is
 * the loudest generic tell in the app. They sum to exactly 420; the rule
 * segments between notches are 54 / 48 / 40 units and the outer margins 23,
 * measured rather than gridded. Smallest target 92 × 58 units = 86 × 54pt.
 */
export const NAV_CELLS: readonly NavCell[] = [
  { label: 'HOME', route: '/home', l: 0, w: 104, centre: 52, notch: [23, 81] },
  { label: 'TABLES', route: '/tables', l: 104, w: 120, centre: 164, notch: [135, 193], live: 'rooms' },
  { label: 'FEED', route: '/feed', l: 224, w: 92, centre: 270, notch: [241, 299] },
  { label: 'FRIENDS', route: '/friends', l: 316, w: 104, centre: 368, notch: [339, 397], live: 'people' },
];

/**
 * The bar's only figures, and they count what is *live now* — never what is
 * unread. An unread count is an engagement metric wearing measurement's
 * clothes; the edition already dates itself on its own masthead.
 *
 * Both figures come from the same place the mastheads read them, so a tick
 * strip cannot disagree with the document it sits under: rooms is TABLES'
 * `6 LIVE`, people is FRIENDS' `4 ON NOW`.
 */
const NAV_LIVE: Record<NonNullable<NavCell['live']>, number> = {
  rooms: TABLES_META.live,
  people: RAIL_NOW.onNow,
};

/** The rule, and every rule that brackets a document: the app's structural constant. */
const RULE_WEIGHT = 2;
const RULE_INK = ink(0.8);

/** SURFACE.press with the alpha out, so the release ramps in colour, not opacity. */
const PRESS_CLEAR = 'rgba(23,24,26,0)';

/**
 * A press state that changes more than opacity: SURFACE.press fills the whole
 * cell rect on the frame the finger lands (MS.track) and clears over MS.exit on
 * EASE.out. This is the only timed value in the bar — the notch, the label
 * colour and the label weight all snap on the frame the route changes, because
 * reticles never interpolate. No shared value exists, so none can be written
 * during render.
 */
function PressFill({ pressed, rect }: { pressed: boolean; rect: ViewStyle }) {
  const style = useAnimatedStyle(() => ({
    backgroundColor: pressed
      ? SURFACE.press
      : withTiming(PRESS_CLEAR, { duration: MS.exit, easing: EASE.out }),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', backgroundColor: PRESS_CLEAR }, rect, style]}
    />
  );
}

/** `/tables/` and `/tables` are the same room; anything else is not a destination. */
function destinationOf(pathname: string): NavCell | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return NAV_CELLS.find((cell) => cell.route === path) ?? null;
}

function NavCellView({
  cell,
  active,
  onPress,
}: {
  cell: NavCell;
  active: boolean;
  onPress: () => void;
}) {
  const live = cell.live ? NAV_LIVE[cell.live] : 0;
  const tickW = Math.min(live, 8) * 3;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={cell.label}
      accessibilityState={{ selected: active }}
      style={{ position: 'absolute', left: cell.l, top: 0, width: cell.w, height: NAV_H }}
    >
      {({ pressed }) => (
        <>
          <PressFill
            pressed={pressed}
            rect={{ left: 0, top: 1, width: cell.w, height: NAV_H - 1 }}
          />
          {/*
            Mono uppercase, not Helvetica: these are eyebrows naming territories,
            the same register as WHERE YOUR PEOPLE ARE. Helvetica sentence-case
            in this app is what you press to *do* a thing.
          */}
          <Box l={0} t={12} w={cell.w}>
            <Mono
              size={8}
              weight={active ? 500 : 400}
              tracking={0.18}
              lh={1}
              color={active ? ink() : ink(0.34)}
              style={{ textAlign: 'center' }}
            >
              {cell.label}
            </Mono>
          </Box>
          {tickW > 0 ? (
            <Ticks
              l={cell.centre - cell.l - tickW / 2}
              t={30}
              w={tickW}
              h={4}
              pitch={3}
              tickWidth={1}
              color={ink(0.5)}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

/**
 * THE RAIL. Takes no props — it reads `usePathname()` and returns null on any
 * route that is not one of the four destinations, so no implementer can place it
 * wrongly or notch it wrongly. Rendered once, by `app/_layout.tsx`, after the
 * `<Stack>` so it paints over scrolling content.
 *
 * It hides on /table, /rail, /clip, /floor, /profile, /loadout and /shop. The
 * law: the bar shows where you are AT a destination, and hides on every screen
 * you were pushed into to do one thing. Those screens keep the exact geometry
 * the handoff drew — the table especially, whose bottom 190 units are the
 * instrument (clock rule 720, action bar 722–810, cooldown to 858). A
 * destination press one thumb-width from ALL IN, inside a second 2px meter, is
 * not a trade worth making. /floor looks like an exception and is not: it is
 * TABLES' second register, and it carries the register notch in its masthead.
 *
 * Ink ends at y=34, leaving 24 units of empty ground to y=58 — that band hangs
 * the labels off the rule instead of centring them in a panel, keeps all ink out
 * of the home-indicator and gesture strips, and is the fallback inset with no
 * conditional code when insets.bottom is 0.
 */
export function NavRail(): ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const here = destinationOf(pathname);
  if (!here) return null;

  const s = width / CANVAS_W;
  const bandUnits = NAV_H + (s > 0 ? insets.bottom / s : 0);

  const go = (cell: NavCell) => {
    // Re-tapping the notched cell is inert: it shows the press fill and does not
    // navigate. It does not scroll to top either — <Screen> owns the ScrollView
    // and the shell does not reach into it.
    if (cell.route === here.route) return;
    Haptics.selectionAsync().catch(() => {});
    // navigate(), not push(): the route is reused if it is already in the stack,
    // so hardware back pops to the previous destination rather than a second copy.
    router.navigate(cell.route);
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: NAV_H * s + insets.bottom,
        backgroundColor: GROUND,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: CANVAS_W,
          height: bandUnits,
          transform: [{ scale: s }],
          transformOrigin: 'top left',
        }}
      >
        {NAV_CELLS.map((cell) => (
          <NavCellView
            key={cell.route}
            cell={cell}
            active={cell.route === here.route}
            onPress={() => go(cell)}
          />
        ))}

        {/*
          The line: one rule at y=0, the same object and value as every masthead
          rule in the app, so a document is bracketed by two identical rails. It
          bleeds off both edges — an inset line is a container — and is drawn as
          two segments with the notch between them. Over the press fills, and no
          rule at the foot of the band: the app just stops.
        */}
        <Box l={0} t={0} w={CANVAS_W} h={RULE_WEIGHT} pointerEvents="none">
          <Rule l={0} t={0} w={here.notch[0]} weight={RULE_WEIGHT} color={RULE_INK} />
          <Rule
            l={here.notch[1]}
            t={0}
            w={CANVAS_W - here.notch[1]}
            weight={RULE_WEIGHT}
            color={RULE_INK}
          />
        </Box>

        <Grain height={bandUnits} />
      </View>
    </View>
  );
}

/**
 * The register pair in a masthead: two words, fixed positions, and the same
 * notch cut in the masthead rule under the active half — the nav's device at a
 * second scale. Never a flex row; nothing in a masthead may reflow.
 */
export type MastheadRegister = {
  /** e.g. ['LISTINGS', 'PLAN'] — fixed positions, never a row. */
  labels: [string, string];
  active: 0 | 1;
  /** Called only for the inactive half. */
  onPress: (index: 0 | 1) => void;
};

/** Register geometry, fixed and internal. Measured to the two words it carries. */
const REGISTER = {
  labelT: 40,
  l: [317, 378] as const,
  separatorL: 368,
  /** 40-unit-tall hit areas from t=28, kept clear of the separator. */
  hit: [
    { l: 305, w: 60 },
    { l: 372, w: 48 },
  ] as const,
  /** The masthead rule, notched under the active half: [left width, right lip]. */
  notch: [
    { leftW: 313, rightL: 366 },
    { leftW: 374, rightL: 404 },
  ] as const,
};

const MASTHEAD_RULE_Y = 56;

/**
 * Every destination's top 56 units — the wordmark, the agate meta figure,
 * an optional register pair, and the 2px rule that brackets the document.
 *
 * It renders exactly what /feed, /floor and /profile already hand-draw, so
 * those three need no edit and cannot drift from it.
 */
export function Masthead({
  title,
  meta,
  register,
  rule = 'full',
}: {
  /** Mono 20 / 700 / .26 at (20, 20). Uppercase. */
  title: string;
  /** Mono 8 / .14 / ink(0.5), right-ranged at (r 20, t 26) — or t 22 with a register. */
  meta?: string;
  /** Optional right-hand register pair; cuts the notch in the rule under the active half. */
  register?: MastheadRegister;
  /** 'full' (default) draws the rule at y=56; 'none' draws none. */
  rule?: 'full' | 'none';
}): ReactElement {
  const notch = register ? REGISTER.notch[register.active] : null;

  return (
    <>
      <Box l={20} t={20}>
        <Mono size={20} weight={700} tracking={0.26}>
          {title}
        </Mono>
      </Box>

      {meta ? (
        <Box r={20} t={register ? 22 : 26}>
          <Mono size={8} tracking={0.14} color={ink(0.5)}>
            {meta}
          </Mono>
        </Box>
      ) : null}

      {register
        ? register.labels.map((label, i) => {
            const index = i as 0 | 1;
            const active = register.active === index;
            const text = (
              <Mono
                size={7}
                weight={active ? 500 : 400}
                tracking={0.2}
                color={active ? ink(0.9) : ink(0.34)}
              >
                {label}
              </Mono>
            );

            if (active) {
              return (
                <Box key={label} l={REGISTER.l[index]} t={REGISTER.labelT}>
                  {text}
                </Box>
              );
            }

            const hit = REGISTER.hit[index];
            return (
              <Pressable
                key={label}
                onPress={() => register.onPress(index)}
                accessibilityRole="button"
                accessibilityLabel={label}
                hitSlop={8}
                style={{ position: 'absolute', left: hit.l, top: 28, width: hit.w, height: 40 }}
              >
                {({ pressed }) => (
                  <>
                    <PressFill
                      pressed={pressed}
                      rect={{ left: 0, top: 0, width: hit.w, height: 40 }}
                    />
                    <Box l={REGISTER.l[index] - hit.l} t={REGISTER.labelT - 28}>
                      {text}
                    </Box>
                  </>
                )}
              </Pressable>
            );
          })
        : null}

      {register ? (
        <Box l={REGISTER.separatorL} t={REGISTER.labelT} pointerEvents="none">
          <Mono size={7} tracking={0.2} color={ink(0.25)}>
            ·
          </Mono>
        </Box>
      ) : null}

      {rule === 'none' ? null : notch ? (
        <>
          <Rule l={0} t={MASTHEAD_RULE_Y} w={notch.leftW} weight={RULE_WEIGHT} color={RULE_INK} />
          <Rule
            l={notch.rightL}
            t={MASTHEAD_RULE_Y}
            w={CANVAS_W - notch.rightL}
            weight={RULE_WEIGHT}
            color={RULE_INK}
          />
        </>
      ) : (
        <Rule l={0} t={MASTHEAD_RULE_Y} w={CANVAS_W} weight={RULE_WEIGHT} color={RULE_INK} />
      )}
    </>
  );
}

/**
 * The nav's mark inverted, for the screens the bar hides on. A notch
 * *subtracted* says you are here, so returning is a 2px stub **added** to the
 * screen's own top hairline. No arrow, no chevron, no icon, no "<".
 */
export function LeaveMark({
  label,
  ruleY,
  fallback,
  place = 'below',
}: {
  /** Mono 7 / .24 / ink(0.5), uppercase. Names what you are leaving. */
  label: string;
  /** The y of this screen's own top hairline. The stub is drawn on it at l=20, w=16. */
  ruleY: number;
  /** Where router.replace() goes when there is no history (deep link, cold start). */
  fallback: NavRoute;
  /**
   * Which side of the hairline the label hangs off. 'below' (default) is the
   * masthead case — /profile, /loadout, /shop, /clip, /rail all have empty ground
   * under their rule. 'above' is for a screen whose rule already has an eyebrow
   * eight units under it: the table's own header sets ON THE RAIL at y=104 over a
   * rule at 88, and two agate lines two units apart, one of them pressable, is
   * neither legible nor honest about what you can press. The stub never moves —
   * it is always on the rule — so the mark reads the same on both.
   */
  place?: 'below' | 'above';
}): ReactElement {
  const router = useRouter();

  const leave = () => {
    Haptics.selectionAsync().catch(() => {});
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  };

  /** Label 8 units under the rule, or 15 above it — one cap height clear either way. */
  const above = place === 'above';
  const rectT = above ? ruleY - 24 : ruleY - 12;
  const rectH = above ? 30 : 40;

  return (
    <Pressable
      onPress={leave}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      style={{ position: 'absolute', left: 0, top: rectT, width: 140, height: rectH }}
    >
      {({ pressed }) => (
        <>
          <PressFill pressed={pressed} rect={{ left: 0, top: 0, width: 140, height: rectH }} />
          <Rule l={20} t={ruleY - rectT} w={16} weight={RULE_WEIGHT} color={INK} />
          <Box l={20} t={above ? ruleY - 15 - rectT : ruleY + 8 - rectT}>
            <Mono size={7} tracking={0.24} color={ink(0.5)}>
              {label}
            </Mono>
          </Box>
        </>
      )}
    </Pressable>
  );
}
