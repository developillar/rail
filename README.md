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

**Twelve routes: one boot, four destinations, seven pushed screens.**

You enter at `/` — `app/index.tsx`, the boot mark, which draws the object the app is named after and
hands off by *becoming the navigation*. The line walks down to the foot of the screen and is the rail;
the wordmark walks up to (20, 20) and is HOME's masthead; the 58-unit gap in the line travels to
23 → 81, which is HOME's notch in the nav bar. Then it `router.replace()`s to `/home`, so back never
returns to a splash. `/` is a route rather than an overlay, and it is not a place you can stand.

**The nav device is the notch, and the app owns no other selected state.** The four destinations carry
the rail: one 2px hairline across the bottom of the app, broken by a 58-unit gap cut where you are
standing, with four mono words hanging off it. Selection is a *subtraction* — the line makes room for
you — plus the label stepping from `ink(0.34)`/400 to `ink()`/500. There is no pill, no fill, no
underline, no dot, no badge, no icon and no amber. The gap exists at **three scales and nowhere else**:
58 units in the nav bar (and the same 58 in the app icon and the boot mark), 53 or 30 units in a
masthead rule under the active half of `LISTINGS · PLAN`, and the seat cut into the table boundary.

The seven pushed screens hide the bar and carry a `LeaveMark` instead: a 2px stub **added** to their
own top hairline — the notch inverted, because a subtraction says *you are here*. No arrow, no
chevron. `src/components/AppShell.tsx` owns the bar, the masthead and the leave mark; it reads the
pathname itself, so nothing can be placed or notched wrongly.

| Route | Ask | What it is |
|---|---|---|
| `/` | shell §4 | The boot mark. Not a place you can stand — it hands off to `/home` and leaves no history. |
| `/home` | shell §5 | **Destination.** The door, not the dashboard: are my people playing, and do I walk in. One figure, one sentence, one press. |
| `/tables` | shell §6 | **Destination.** The listings. Noise is the sort order; `PLAN` in its masthead is `/floor`. |
| `/feed` | 6a | **Destination.** The edition — a masthead, one lead hand with a verdict, everything else in agate. |
| `/friends` | shell §7 | **Destination.** Your rail as an object: presence drawn on the line, and the ledger of who stood there under it. |
| `/floor` | 7a | The lobby, drawn as a plan you walk — TABLES' second register, not a screen of its own, so the way back is the notch in its own masthead. |
| `/table` | 1a, 2a–2f, 3b, 4a/4b | Six-max mid-hand: action bar in four states, the slide rule, drag-to-throw, the showdown. |
| `/rail` | 5a, 5b, 5c | Watching from outside the line. Swipe up for the tape, take a seat to join. |
| `/clip` | 6b | Reactions pinned to the second they landed. The scrub is the bet slider again, at 6b's own tick pitch. |
| `/profile` | 8a | The record: hands **watched** is the one large figure, and hands played opens the list under it. |
| `/loadout` | 8b | Four slots where earned and purchased sit adjacent, and a live preview of what lands on a face. |
| `/shop` | 8c | The counter — dated stock, flat prices, and a section for what money cannot buy. |

The four destinations are **HOME, TABLES, FEED and FRIENDS**, in that order across the bar, in cells
of 104 / 120 / 92 / 104 units sized to their words rather than to 420/4. Every destination's canvas
ends with at least 64 units of empty ground below its last ink, which is how the bar is paid for
without `Screen.tsx` knowing it exists.

## How it is built

```
app/                 one file per screen, expo-router
src/design/          tokens (colour, type, the motion ladder) and easing curves
src/components/      the shared objects: Bust, PlayingCard, Ticks, Rule, RailStrip,
                     ReactionMark, EarnedItem / PurchasedItem, Grain, Screen
src/components/AppShell.tsx  the rail, the masthead and the LeaveMark — the notch at three scales
src/components/table/ the table's own pieces: Surface, Instruments, Targeting, Flight
src/state/           the scripted hand, the meters, the showdown clock
src/data/            fixtures (every figure the design was reviewed with), the social
                     fixtures behind the four destinations, and table geometry
docs/                PRD.md, DESIGN.md, APP-SHELL-SPEC.md — see below
project/             the original design handoff — read `project/RAIL Table.dc.html`
chats/               the conversation the design came out of
```

Every screen is authored in the design's own units on a fixed 420-wide canvas and scaled to
the device by `<Screen>`, so hairlines land where they were drawn. Screens taller than the
viewport scroll; the table, the rail and the showdown scale to fit so their composition never
reflows.

**Motion** comes from ask 9's spec rather than from taste: five named curves and an
eleven-stop duration ladder in `src/design/tokens.ts`, used through `src/design/motion.ts`. A
transition outside the ladder is a bug. Meters — a clock, a cooldown, a loading progress — run on
elapsed time and are exempt, because a clock cannot lie. Nothing in the app is animated on a loop; the
one looping meter is HOME's door clock, which re-arms at zero because the room it stands outside always
has somebody to act.

**State** is a scripted hand (`src/state/useTable.ts`), not a poker engine. The handoff
specifies one hand drawn to the chip, and a prototype that dealt random cards would stop
matching the screens it exists to prove. So: fold and you sit out as a railbird at your own
table; call and you take the 4a win; shove and you run into the straight flush of 4b. Each new
hand re-deals the same scripted hand.

## The three documents, and what each is for

- **`docs/PRD.md`** — what the product is, screen by screen, and what it refuses to be. §6 says what
  every route does; §13 is the non-goals; §15 is honest about the distance to a shippable build, where
  the hand engine is the blocker.
- **`docs/DESIGN.md`** — the design law and the argument underneath it: ten rules, the token system,
  the recurring objects, the motion ladder. **§6.10 is the section to read before you "fix" anything.**
  It records the seven places the handoff, the shell spec and the law disagree, with the argument on
  both sides, so a deliberate deviation is not mistaken for drift. §9 lists the drift nobody has
  decided yet.
- **`docs/APP-SHELL-SPEC.md`** — the canonical geometry, in design units, of the parts the handoff did
  not draw: the navigation bar, the boot, and HOME, TABLES and FRIENDS. It was written before the shell
  existed and has since been reconciled against the build; where the build chose differently the line
  is marked `BUILT` with the reason.

Where a document and the code disagree, the code is what ships and the document is the bug.

## Decisions worth knowing about

Three translation calls are worth knowing before you read any screen. `docs/DESIGN.md` §6 carries all
ten, and §6.10 carries the seven declared deviations — including the six places an audit read the law
without the handoff in front of it and flagged something the handoff explicitly specifies. All of them
are commented at the point they apply.

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

It is stated rather than disclaimed: **all four destinations end on it**, in mono agate at the foot of
the document, in the app's own voice — two lines read from one `CONSTRAINT` object in
`src/data/social.ts`, so no screen can word it differently. Credits (`CR`) buy objects and never
chips, and the invite field on FRIENDS carries `NOBODY CAN SEND CHIPS` in its own corner, which is
exactly where somebody would expect to be able to violate it.
