import { Platform, TextStyle } from 'react-native';

/**
 * RAIL — Terminal (direction 1a).
 *
 * Every value here is lifted from `project/RAIL Table.dc.html`. The prototype
 * was authored in CSS, so a few things are translated rather than copied:
 *
 *  - oklch() has no React Native equivalent, so the two chromatic values are
 *    converted to their exact sRGB hex (see scripts/oklch note below).
 *  - `letter-spacing` is em-relative in CSS and absolute in RN, so the type
 *    helpers multiply the tracking by the size.
 *  - `font-variant-numeric: tabular-nums` is unnecessary: JetBrains Mono is
 *    monospaced, so every figure is already tabular.
 *
 * oklch(.72 .185 47)  -> #fe7825   the amber signal
 * oklch(.84 .1  62)   -> #fabc86   the lighter amber, used only for a named target
 */

export const GROUND = '#0a0a0b';
export const INK = '#e8e7e4';
export const AMBER = '#fe7825';
export const AMBER_LIGHT = '#fabc86';

/** Bone ink at an alpha — the app's only neutral. */
export const ink = (alpha = 1) => (alpha >= 1 ? INK : `rgba(232,231,228,${alpha})`);
/** The signal colour. Reserved for time and expression: the clock and the crowd. */
export const amber = (alpha = 1) => (alpha >= 1 ? AMBER : `rgba(254,120,37,${alpha})`);
/** Ground at an alpha — used to punch a notch through a boundary hairline. */
export const ground = (alpha = 1) => (alpha >= 1 ? GROUND : `rgba(10,10,11,${alpha})`);

/** Surfaces. Four steps only; they are backgrounds, never cards. */
export const SURFACE = {
  lit: '#17181c', // a bust that is live
  card: '#15161a', // a face-down card, a resting bust
  live: '#1b1c20', // the newest board card
  dim: '#131418', // a crowd chip
  dark: '#101113', // a folded seat
  press: '#17181a', // the pressed state of a dark cell
  pressLight: '#c9c8c4', // the pressed state of the bone slab
  quickBet: '#101113', // a selected quick-bet cell
} as const;

export const CARD_RED = '#e8dcd2'; // hearts and diamonds are warm bone, never red
export const CARD_BLACK = '#dfe3e4';

export const FONT = {
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
  sans: Platform.select({
    ios: 'Helvetica',
    web: 'Helvetica, Arial, sans-serif',
    default: 'sans-serif',
  }) as string,
  sansMedium: Platform.select({
    ios: 'Helvetica',
    web: 'Helvetica, Arial, sans-serif',
    default: 'sans-serif-medium',
  }) as string,
  serif: Platform.select({ ios: 'Georgia', web: 'Georgia, serif', default: 'serif' }) as string,
} as const;

type Weight = 400 | 500 | 700;

const MONO_BY_WEIGHT: Record<Weight, string> = {
  400: FONT.mono,
  500: FONT.monoMedium,
  700: FONT.monoBold,
};

const leading = (size: number, mult: number) => Math.round(size * Math.max(mult, 0.8) * 100) / 100;

/**
 * Mono type. `mono(15, 500, 0.06)` is `font:500 15px/1 'JetBrains Mono'` with
 * `letter-spacing:.06em`.
 */
export function mono(size: number, weight: Weight = 400, tracking = 0, lineHeight = 1): TextStyle {
  return {
    fontFamily: MONO_BY_WEIGHT[weight],
    fontSize: size,
    lineHeight: leading(size, lineHeight),
    letterSpacing: size * tracking,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
}

/** Helvetica. Labels and headlines only — never a figure. */
export function sans(size: number, weight: 400 | 500 = 400, tracking = 0, lineHeight = 1): TextStyle {
  return {
    fontFamily: weight === 500 ? FONT.sansMedium : FONT.sans,
    fontSize: size,
    fontWeight: Platform.OS === 'ios' ? (weight === 500 ? '500' : '400') : undefined,
    lineHeight: leading(size, lineHeight),
    letterSpacing: size * tracking,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
}

/**
 * The motion spec, ask 9. Five named curves; a transition outside the ladder is
 * a bug. Meters (the clock, the cooldown) run on elapsed time and are exempt.
 */
export const CURVE = {
  linear: [0, 0, 1, 1],
  slide: [0.2, 0.9, 0.25, 1],
  arc: [0.35, 0, 0.2, 1],
  settle: [0.2, 1.15, 0.3, 1],
  out: [0.4, 0, 1, 1],
} as const;

export type CurveName = keyof typeof CURVE;

/** Eleven stops, nothing between them. */
export const MS = {
  track: 0, // 1:1 finger-following
  punch: 90,
  mark: 120,
  exit: 180,
  arrive: 220,
  open: 240,
  travel: 320,
  count: 420,
  join: 620,
  skip: 900,
  whole: 1400,
} as const;

/** The design canvas. Every screen is authored at this width. */
export const CANVAS_W = 420;
export const CANVAS_H = 912;

/** Formats a chip count the way every numeral in the app is set. */
export const chips = (n: number) => n.toLocaleString('en-US');
