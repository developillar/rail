# RAIL

A portrait, mobile, social poker app. No-Limit Hold'em, **play chips only**, six seats. It
monetizes expression — throwables, celebrations, table skins — never chips, ads or rake.

The name is the concept: in poker, the rail is where the spectators stand. Watching is a
first-class activity here, not a secondary feature, and a rail is a line — a single hairline
rule is the recurring structural device across every surface.

This is the React Native implementation of the design handed off from Claude Design. The
locked direction is **1a Terminal**: near-black ground, mono numerals, hairline geometry,
measurement ticks, one amber signal reserved for time and expression.

## Running it

```
npm install
npx expo start     # then scan the QR code with Expo Go
npm run ios        # or: npm run android
npm run web        # useful for reviewing every screen quickly
npm run typecheck
```

### On your phone, in Expo Go

1. Install **Expo Go** from the App Store / Play Store.
2. `npm install` then `npx expo start` in this directory.
3. Scan the QR code in the terminal — iOS with the Camera app, Android from inside Expo Go.
   Phone and computer need to be on the same network; if they are not, `npx expo start
   --tunnel` routes around it.

Everything here runs in Expo Go as-is — no native modules, no dev build, no config plugins
that need one. It is built on Expo SDK 57, so the Expo Go on your phone should be current.
The app is portrait-only and drawn on a fixed 420-wide canvas, so it scales to whatever
phone you are holding.

Fonts (JetBrains Mono) are fetched by `@expo-google-fonts/jetbrains-mono` and loaded before
first paint — every figure in the app is set in mono, so nothing renders until the face is
available.

## The screens

Enter at the index (`app/index.tsx`), which lists all eight and is the one screen not in the
handoff — the designs navigate through their own content and carry no nav chrome on purpose.

| Route | Ask | What it is |
|---|---|---|
| `/floor` | 7a | The lobby, drawn as a plan you walk. Noise is the sort order, never stakes. |
| `/table` | 1a, 2a–2f, 3b, 4a/4b | Six-max mid-hand: action bar in four states, the slide rule, drag-to-throw, the showdown. |
| `/rail` | 5a, 5b, 5c | Watching from outside the line. Swipe up for the tape, take a seat to join. |
| `/feed` | 6a | The edition — a masthead, one lead hand with a verdict, everything else in agate. |
| `/clip` | 6b | Reactions pinned to the second they landed. The scrub is the bet slider again. |
| `/profile` | 8a | The record: hands watched counted alongside hands played. |
| `/loadout` | 8b | Four slots where earned and purchased sit adjacent. |
| `/shop` | 8c | The counter — dated stock, flat prices, and a section for what money cannot buy. |

## How it is built

```
app/                 one file per screen, expo-router
src/design/          tokens (colour, type, the motion ladder) and easing curves
src/components/      the shared objects: Bust, PlayingCard, Ticks, Rule, RailStrip,
                     ReactionMark, EarnedItem / PurchasedItem, Grain, Screen
src/components/table/ the table's own pieces: Surface, Instruments, Targeting, Flight
src/state/           the scripted hand, the meters, the showdown clock
src/data/            fixtures (every figure the design was reviewed with) and table geometry
project/             the original design handoff — read `project/RAIL Table.dc.html`
chats/               the conversation the design came out of
```

Every screen is authored in the design's own units on a fixed 420-wide canvas and scaled to
the device by `<Screen>`, so hairlines land where they were drawn. Screens taller than the
viewport scroll; the table, the rail and the showdown scale to fit so their composition never
reflows.

**Motion** comes from ask 9's spec rather than from taste: five named curves and an
eleven-stop duration ladder in `src/design/tokens.ts`, used through `src/design/motion.ts`. A
transition outside the ladder is a bug. The clock and the cooldown are declared meters — they
run on elapsed time and are the only things that loop.

**State** is a scripted hand (`src/state/useTable.ts`), not a poker engine. The handoff
specifies one hand drawn to the chip, and a prototype that dealt random cards would stop
matching the screens it exists to prove. So: fold and you sit out as a railbird at your own
table; call and you take the 4a win; shove and you run into the straight flush of 4b. Each new
hand re-deals the same scripted hand.

## Decisions worth knowing about

Three places needed a judgement call rather than a transcription. All three are commented at
the point they apply.

**Seats are busts, and the name block reads under them.** 1a still draws seats as the flat
name plates it was built with; every panel from ask 3 onward draws them as busts, and the
designer's own note calls the plates the stale half. Drag-to-target only works if the seats
*are* the busts, so the busts win. They sit on 1a's boundary, whose notches already fall
exactly where a seat belongs — and the name block moved under its bust, because a bust plus a
five-figure stack set beside it runs straight through the pot's 54px numeral and the board.
The notch was widened to cover the whole seat, so no hairline is drawn through a numeral.

**Colour, texture and figures are translated, not copied.** `oklch()` has no React Native
equivalent, so the two chromatic values are converted to their exact sRGB hex. Letter-spacing
is em-relative in CSS and absolute in RN, so the type helpers multiply tracking by size.
`font-variant-numeric: tabular-nums` is unnecessary because JetBrains Mono is monospaced.
The grain is an SVG turbulence filter in the browser and a generated tiling PNG here
(`scripts/make-grain.js`), with the strength baked into the tile's alpha so it needs no blend
mode and looks the same on both platforms.

**The mock status bar and home indicator are dropped.** On a device the real ones occupy that
space, which is what the prototype's 44px band and 878px pill were standing in for.

## Copy constraint

Positioning is "social poker rooms with friends, play chips only". Chips are non-transferable
and have no value. No label, button or empty state implies money can be won, deposited or
withdrawn — this shapes what things are named, not just what disclaimers say.
