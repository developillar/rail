# RAIL — APP SHELL SPEC

Canonical. Four implementers build from this file and nothing else. Every number is in design
units on the 420-wide canvas unless a `pt`/`px` suffix says otherwise. Colours are token calls
from `src/design/tokens.ts`. Durations are stops on `MS`; curves are `EASE` names.

**Reconciled against the build.** This file was written before the shell existed and the shell now
exists, so every figure below has been checked against the code and corrected where it was wrong.
Where the build made a different structural choice, the choice is recorded here as **BUILT** with
the argument, because the build is what ships and a spec that describes a different app is worse
than no spec. Four of those are load-bearing:

- **HOME is `/home`, not `/`** — §2, §3, §5. `/` is the boot.
- **The boot is a route, not an overlay** — §4.
- **`app/screens.tsx` was never built**, and the route is gone — §3.
- **Four canvases run taller than the heights budgeted here** — §3, and the reason in each case is
  written copy that would otherwise have been cut.

The three components this file specifies as separate files all live in `src/components/AppShell.tsx`
— §8.

---

## 1. THE DECISION

**The nav device is THE RAIL — one 2px hairline across the bottom of the app, broken by a
58-unit notch cut where you are standing, with four mono words hanging off it.** It is a
sibling of `<Screen>`, not part of any screen's canvas: a 420-unit-wide band scaled by
`width / 420` (Screen's own `widthScale`), pinned to the bottom of the viewport, opaque
`GROUND` with `Grain` continuing through the safe-area inset. The active destination is drawn
as a *subtraction* — the line makes room for you, exactly as `src/data/tableLayout.ts` cuts a
notch in the table boundary for every seat and exactly as the app icon is one boundary hairline
broken by one notch. The same 58-unit gap is the app icon, the boot mark, and "you are here":
one object in three places. There is no fill, no pill, no underline, no bar, no icon, no amber.
Selection is carried on two channels so a subtraction is not doing the work alone: the notch,
plus the label stepping from `ink(0.34)`/400 to `ink()`/500.

I took **proposal 3's spine** — bottom placement, the notch as the selected state, unequal
cells sized to their words, its own canvas at `widthScale`, and 58 units with the lower band
left empty so no ink enters the home-indicator strip. Bottom, because 5a is literally a rule
across the bottom of the frame with the crowd hanging off it: a persistent bottom rule puts the
whole app above the rail and the viewer where the product says the viewer stands, and it is the
only position that honours the brief's "everything interactive inside thumb reach".

From **proposal 1** I took the notch itself (proposal 3 arrived at the same idea; 1 argued it
better and proved the geometry), the register pair `LISTINGS · PLAN` in the TABLES masthead
with the notch cut at a *second scale* under the active half, the boot mark's gap travelling to
where you are standing, and the whole shape of FRIENDS. I rejected 1's placement of the index
under the masthead at y=64: 1's own risk note concedes it is out of thumb reach and that the
device works identically at the foot, and its compensating gesture (a horizontal pan) collides
with three gestures the app already owns.

From **proposal 2** I took one load-bearing correction and one semantic: (a) the splash must be
scaled at `widthScale`, top-anchored — proposal 3's "420 × 912 fit canvas" splash would land
13% off the masthead, because fit-mode scale is smaller than scroll-mode scale on every
ordinary phone, so the pixel-exact handoff would visibly jump; (b) on a pushed screen the
selected-state mark inverts — a notch *subtracted* says "you are here", so returning is an
**added** 2px stub, never a notch. I rejected 2's cell fill (`SURFACE.quickBet` behind the
active segment): a filled cell in a four-cell row is a card, in the one place this app has
never drawn one. I rejected 2's mono figures under every label — the bar counts what is live
with ticks, and never counts what is unread.

One improvement on all three: **`src/components/Screen.tsx` is not edited.** All three
proposals reached into its scroll branch to reserve the bar's height. Instead the reserve is
authored in design units, in the canvas, where law 7 says composition lives: every destination
canvas ends with **≥64 units of empty ground below its last ink** (§2). Nothing shared changes,
and the reserve is a composition value an implementer can see rather than a padding term they
cannot.

Also rejected, explicitly: an icon tab bar (law 4 bans generic icon sets and emoji-as-icons,
and the app has no drawn icon language to extend); a masthead dropdown behind the wordmark (a
wordmark does not read as a control without a caret, which is an icon and a lie); home-as-hub
(two taps between FEED and TABLES in an app opened twenty times a night); swipe-between-tabs
(/rail owns swipe-up-for-the-tape, /clip owns a drag scrub, /table owns drag-to-throw — a
global pan teaches that one gesture means four things); four equal 105-unit cells (a symmetric
four-column grid is the loudest generic tell in the app).

---

## 2. NAVIGATION — `NavRail`

### Placement and scaling

Rendered by `app/_layout.tsx` as a **sibling of and above the `<Stack>`**, inside
`SafeAreaProvider`. Not inside any `<Screen>`.

```
s          = width / 420                    // identical to Screen's widthScale
NAV_H      = 58                             // design units of drawn band
bar canvas = 420 wide × (58 + insets.bottom / s) tall
outer view = position absolute, left 0, right 0, bottom 0,
             height (58 * s) + insets.bottom, backgroundColor GROUND
inner view = width 420, height 58 + insets.bottom / s,
             transform [{ scale: s }], transformOrigin 'top left'
grain      = <Grain height={58 + insets.bottom / s} />
```

Physical size: 58 × (393/420) = **54.2pt** on a 393pt viewport, **51.8pt** at 375pt, **44.2pt**
at 320pt — so the smallest cell clears 44pt on the narrowest viewport the app can meet, and the
number never depends on the device.

### The line

One rule at y=0, `weight={2}`, `color={ink(0.8)}` — the exact object and value as every masthead
rule in the app, so a document is bracketed by two identical rails. It bleeds off both edges
(x 0 and x 420); it is never inset, because an inset line is a container. It is drawn as **two
segments** with the active notch between them:

| active | left segment | right segment |
|---|---|---|
| HOME | `l=0 w=23` | `l=81 w=339` |
| TABLES | `l=0 w=135` | `l=193 w=227` |
| FEED | `l=0 w=241` | `l=299 w=121` |
| FRIENDS | `l=0 w=339` | `l=397 w=23` |

No rule at the bottom of the band. The app just stops.

### Cells

Sized to their words, not to 420/4. The whole cell rect is the target.

| label | l | w | centre | notch (58 wide) |
|---|---|---|---|---|
| HOME | 0 | 104 | 52 | 23 → 81 |
| TABLES | 104 | 120 | 164 | 135 → 193 |
| FEED | 224 | 92 | 270 | 241 → 299 |
| FRIENDS | 316 | 104 | 368 | 339 → 397 |

Cells sum to exactly 420. Rule segments between notches are 54 / 48 / 40 units and the outer
margins 23 — measured, never gridded. Smallest target 92 × 58 units = **86.1 × 54.3pt** at
393pt wide.

### Type

`<Mono size={8} tracking={0.18}>`, uppercase, `lh={1}`, in a `<Box l={cellL} t={12} w={cellW}>`
with `textAlign: 'center'`.

- active: `weight={500}`, `color={ink()}`
- inactive: `weight={400}`, `color={ink(0.34)}`

Mono uppercase, not Helvetica, because these are eyebrows naming territories — the same
register as `WHERE YOUR PEOPLE ARE`, `THE REST OF THE FLOOR`, `BAD BEATS`. Helvetica
sentence-case in this app is what you press to *do* a thing (`Take seat 1`, `Just watch`).
Moving between rooms of the app is not doing a thing.

Ink advance at 8/0.18 is 6.24 units/char: HOME 24.96, TABLES 37.44, FEED 24.96, FRIENDS 43.68.
The widest label sits with 7.2 units clear inside its 58-unit notch. **Invariant: notch 58
units, labels ≤ 7 characters at mono 8 / 0.18.** Tracked mono is centred as-drawn (a trailing
letter-space of 1.44 units is accepted, as it already is on `/floor`'s centred `TABLE 12 · 2/5 NL`).

### Live marks — the only figures in the bar

`<Ticks t={30} h={4} pitch={3} tickWidth={1} color={ink(0.5)} />`, centred in the cell inside a
`<Box l={cellL} t={30} w={cellW} style={{ alignItems: 'center' }}>`, with
`w = Math.min(n, 8) * 3`.

- TABLES: `n` = rooms live now (6 → 18 units)
- FRIENDS: `n` = people on your rail on now (5 → 15 units; derived from the roster, not a constant)
- HOME and FEED: nothing.

**Ticks count what is live, never what is unread.** An unread count is an engagement metric
wearing measurement's clothes; the edition already dates itself on its own masthead. Bone, not
amber: a count of rooms is measurement, not expression.

Ink ends at y=34. **24 units of empty ground from y=34 to y=58, always.** That band does three
jobs: it hangs the labels off the rule instead of centring them in a panel, it keeps all ink
out of the iOS home-indicator and Android gesture strips, and when `insets.bottom === 0` (older
Android, `npm run web`) it is the fallback inset with no conditional code.

### Press

The pressed cell's full rect — `l=cellL, t=1, w=cellW, h=57` — fills `SURFACE.press`, applied
at `MS.track` (0) via `Pressable`'s `({ pressed })` style callback and cleared over
`MS.exit` (180) / `EASE.out`. Never an opacity change. `Haptics.selectionAsync()` on a change of
destination only (`expo-haptics` is already a dependency).

Re-tapping the notched cell is **inert**: it shows the press fill and does not navigate. It
does not scroll the document to top, because `<Screen>` owns the `ScrollView` and the shell does
not reach into it.

### Motion

**Nothing in the bar interpolates.** The notch, the label colour and the label weight all snap
at `MS.track` (0) on the frame the route changes — reticles never interpolate, and the Stack's
own transition is already a fade. The only timed value in the whole component is the press
fill's release. Consequence: `NavRail` needs no Reanimated shared value, so it cannot mutate one
during render.

### Where it shows, where it hides

Shows on the four destinations and nowhere else:

```
'/home'        HOME
'/tables'      TABLES
'/feed'        FEED
'/friends'     FRIENDS
```

**BUILT: the HOME cell points at `/home`.** `/` is the boot (§4), and a cell pointing at `/` would
replay the splash every time somebody pressed HOME. `NavRoute` is therefore
`'/home' | '/tables' | '/feed' | '/friends'` and `/` is not in the cell list at all.

`NavRail` reads `usePathname()` itself and returns `null` on any other route. It takes no props,
so no implementer can place it wrongly or notch it wrongly. It also trims one trailing slash, so
`/tables/` and `/tables` are the same room.

Hides on `/table`, `/rail`, `/clip`, `/floor`, `/profile`, `/loadout`, `/shop`, and on the boot
route `/`. **The law: the bar shows where you are AT a destination. It hides on every screen
you were pushed into to do one thing.** Those screens keep the exact geometry the handoff drew —
the table especially, whose bottom 190 units are the instrument (clock rule 720, action bar
722–810, cooldown to 858); a destination press one thumb-width from ALL IN, inside a second 2px
meter, is not a trade worth making. `/floor` is the one screen that looks like an exception and
is not: it is TABLES' second register, and it carries the register notch in its masthead (§6)
rather than the bar.

### Safe area and the reserve

- The bar's outer view height is `(58 * s) + insets.bottom`. `GROUND` continues through the
  inset so the line reads as the true bottom edge of the app.
- **Every destination canvas ends with ≥64 units of empty ground below its last ink.** At
  s=0.936 that is 60px of clearance against the bar's 54.2pt band, on top of Screen's existing
  `paddingBottom: insets.bottom + 24`. Nothing lands under the bar and `Screen.tsx` is untouched.
- **Every destination is `mode="scroll"`.** This is what makes the bar's 2px rule exactly the
  same physical weight as the masthead rule of the document above it — both at `widthScale`. On
  a `fit` screen it would not be, which is one more reason `fit` screens do not show it.

### Gestures

None. There is no swipe between destinations, no edge gesture, no pan. Nothing anywhere in the
app is reachable only by gesture.

---

## 3. ROUTE MAP

Twelve routes. Four destinations, seven pushed screens, and the boot.

| Route | File | Title (masthead) | Kind | Screen | In | Out |
|---|---|---|---|---|---|---|
| `/` | `app/index.tsx` | — (the mark itself) | boot route | own frame at `width / 420` | cold start | `router.replace('/home')` |
| `/home` | `app/home.tsx` | `RAIL` | destination | `height={880} mode="scroll"` | boot handoff; nav HOME | nav |
| `/tables` | `app/tables.tsx` | `TABLES` | destination | `height={1032} mode="scroll"` (spec 976) | nav TABLES; `LISTINGS` on /floor | nav |
| `/feed` | `app/feed.tsx` | `THE RAIL` | destination | `height={948} mode="scroll"` (spec 900) | nav FEED | nav |
| `/friends` | `app/friends.tsx` | `YOUR RAIL` | destination | `height={1620} mode="scroll"` (spec 1000) | nav FRIENDS; `11 ON YOUR RAIL` on /home | nav |
| `/floor` | `app/floor.tsx` | `THE FLOOR` | pushed (register) | `height={900} mode="scroll"` | `PLAN` in /tables masthead | `LISTINGS` in its own masthead → `/tables` |
| `/table` | `app/table.tsx` | — (`CHROME.header`) | pushed | `height={912} mode="fit"` | `Take a seat` on /home; `Take seat 1` on /floor; `Sit first` on /tables; the join on /rail | LeaveMark `LEAVE THE TABLE`, fallback `/tables` |
| `/rail` | `app/rail.tsx` | — (own header, rule y=44) | pushed | `height={720} mode="fit"` | `Walk in on Bea's table` on /home; `Just watch` on /floor; a listing on /tables; a presence bust on /friends | LeaveMark `LEAVE THE RAIL`, fallback `/tables` |
| `/clip` | `app/clip.tsx` | — (own header, rule y=44) | pushed | `height={760} mode="fit"` | `Watch clip` on /feed | LeaveMark `CLOSE THE CLIP`, fallback `/feed` |
| `/profile` | `app/profile.tsx` | `THE RECORD` | pushed | `height={870} mode="scroll"` | `The record` on /home; a ledger row on /friends | LeaveMark `LEAVE THE RECORD`, fallback `/home` |
| `/loadout` | `app/loadout.tsx` | `LOADOUT` | pushed | `height={852} mode="scroll"` (spec 700) | `Loadout` on /home; `Change loadout` on /profile | LeaveMark `LEAVE THE LOADOUT`, fallback `/home` |
| `/shop` | `app/shop.tsx` | `THE COUNTER` | pushed | `height={720} mode="scroll"` | `The counter` on /home; `The counter` on /loadout | LeaveMark `LEAVE THE COUNTER`, fallback `/home` |

Notes.

- **BUILT: HOME is `app/home.tsx` at `/home`, and `app/index.tsx` is the boot.** This file
  originally had HOME take over `app/index.tsx` with the boot as an overlay. The build inverted it,
  and the inversion is the shape the nav is built for: the boot ends in `router.replace('/home')`,
  which leaves no history, so back never returns to a splash and the nav's HOME cell has a real
  destination to point at. *Against it:* `/` is the app's entry URL and it is now a screen you
  cannot stand on, which is slightly odd for a deep link, and the overlay shape would have made the
  boot unmountable rather than replaced. *For it:* the boot is genuinely a screen — it has a
  composition, a canvas and a tap target — and an overlay that renders above a `<Stack>` while the
  Stack's first route is also drawing HOME means two screens paint on frame one. The build's shape
  is one screen at a time.
- **BUILT: `app/screens.tsx` does not exist.** The developer contents page was dropped rather than
  moved when `index.tsx` became the boot. `npm run web` plus a typed path reaches any screen, so the
  page bought nothing the URL bar does not, and a review-only route inside a shipping app is a route
  somebody eventually links.
- **BUILT: four canvases are taller than the heights above.** `/tables` 976 → 1032 (pitch 100 holds
  two lines of Sans 13 in 248 units; every room sentence runs to three), `/friends` 1000 → 1620 (§7
  predates requests in both directions), `/feed` 900 → 948 (the destination's constraint foot plus
  `NAV_RESERVE`), `/loadout` 700 → 852 (a near-empty zone, so the screen holds law 5 and law 3).
  Each keeps its reserve. The precedent is deliberate: **shrinking written copy or the primary
  object to hit a canvas number is worse than a taller document on a screen that scrolls.**
- Router shape: **the existing flat root `<Stack>`, unchanged.** No `Tabs` navigator, no route
  groups, no file moves. Every existing `router.push('/table')` and `router.push('/rail')` keeps
  working untouched.
- Destination-to-destination uses `router.navigate(route)`, which reuses the route if it is
  already in the stack instead of stacking a second copy. Android hardware back therefore pops
  to the previous destination, which is what a person expects.
- Pushed screens use `router.push`. Returning is `router.back()` when there is history, and
  `router.replace(fallback)` when there is not (deep link, cold start).
- `/rail`'s `router.replace('/table')` on seating is unchanged and correct — you did not push a
  screen, you sat down.

---

## 4. SPLASH — `app/index.tsx`

**BUILT: the boot is the route at `/`, not an overlay.** This section originally specified a
full-bleed `<Boot>` overlay rendered by `app/_layout.tsx` above the `<Stack>`, unmounted once
booted. The build made it `app/index.tsx` instead — the Stack's first route — ending in
`router.replace('/home')`. Everything drawn, every beat and every duration below is the spec's and
is built as written; only the mounting changed.

*The argument for the overlay:* it is unambiguous about the boot not being a place, it can cover a
route that is already painted, and it disappears from the graph entirely when it is done.
*The argument for the route, which is what shipped:* `_layout.tsx` already holds the font gate
(`if (!loaded) return <View style={{flex:1, backgroundColor: GROUND}} />`), so the boot has nothing
left to wait on and no readiness to report — the `ready` prop the overlay needed does not exist.
`replace()` leaves no history, so back never returns here, which is the only behaviour the overlay
was buying. And the Stack's own `animation: 'fade'` cross-dissolves boot → HOME, over a masthead
wordmark and a nav rule already painted at identical values, which is the handoff this section is
about. One screen paints at a time.

Consequence to know: the handoff target is `/home`, and `NAV_CELLS`' HOME cell is `/home` (§2), so
the notch the boot's gap travels into is the one HOME actually draws.

The boot screen is the app drawing the object it is named after, and it hands off by **becoming
the navigation** — the line you boot on walks down to the bottom of the screen and is the rail
you navigate by for the rest of the session.

### Frame

Not a `<Screen>`. `View` at `flex: 1`, `backgroundColor: GROUND`, `paddingTop: insets.top`,
containing an inner `View` of `width: 420`, `transform: [{ scale: s }]`,
`transformOrigin: 'top left'`, where `s = width / 420` — **scroll-mode scaling, top-anchored.**
This is load-bearing: fit-mode scale is `min(widthScale, available/height)`, which is smaller
than `widthScale` on every ordinary phone, so a fit-mode splash could not land pixel-exact on
HOME's masthead. `<Grain height={(winHeight - insets.top) / s} />` so the texture does not pop
on the handoff. The native splash is already `GROUND` with no logo (`app.json`), so frame one is
the same ground.

### Drawn

| object | geometry |
|---|---|
| the rail | y=510, `weight={2}`, `color={ink(0.8)}`, two segments around a **58-unit notch centred at x=210** → gap 181 → 239. Left `l = 181 - Lw, w = Lw`; right `l = 239, w = Rw`. |
| the wordmark | `RAIL`, `<Mono size={44} weight={700} tracking={0.26}>` at `l=20 t=428`, in a Box with `transformOrigin: 'top left'`. 10a's construction: cap of mono 44 ≈ 32, so the rule sits 1.5 × cap (48 units) below the baseline. |
| the positioning | `l=20 t=530`, `<Mono size={7} tracking={0.3} color={ink(0.35)}>` `SOCIAL POKER ROOMS WITH FRIENDS · PLAY CHIPS ONLY` (309 units wide) |
| the meter | `<Ticks l={20} t={552} h={8} pitch={9} tickWidth={1} color={ink(0.3)} w={126 * p} />` |

Nothing else. No spinner, no percentage, no progress bar, no logo animation, no amber.

### Moves

1. **0 → `MS.join` (620) / `EASE.slide`** — the rail builds **outward from the notch**: `Lw` and
   `Rw` both 0 → 181, one shared progress value. Final segments 0..181 and 239..420, bleeding off
   both edges. Nothing else animates. This beat needs no font, which is exactly why it is first.
   **The notch never fills. It is the gap, and the gap is the point.**
2. **Type is set, never faded.** The wordmark and the positioning line appear on the frame
   JetBrains Mono resolves, at full ink. Type does not animate in this app.
3. **The meter** runs on elapsed time from first paint, `w = 126 * min(1, elapsed/900)`,
   monotonic, updated on a 100ms interval. It is a declared meter and therefore exempt from the
   ladder (law 6). On a warm start you barely see it, which is correct behaviour for a loading
   indicator.
4. **Dwell** until `elapsed ≥ MS.skip (900)`. There is no `ready` term: `app/_layout.tsx` renders
   flat `GROUND` until JetBrains Mono has resolved, so by the time this screen mounts the font is
   already available and there is nothing left to wait on.
5. **Ephemera leave** — positioning line and meter, opacity 1 → 0 over `MS.exit` (180) /
   `EASE.out`.
6. **HANDOFF — one `MS.travel` (320) / `EASE.slide` move, three values, no overshoot:**
   - the rule's y: `510 → NAV_RULE_Y`, where
     `NAV_RULE_Y = (winHeight - insets.bottom - NAV_H * s - insets.top) / s`
   - the notch's left lip: `gapL: 181 → 23`, so the gap lands at 23 → 81 — **HOME's notch**.
     Left rule `w = gapL`; right rule `l = gapL + 58, w = 420 - gapL - 58`.
   - the wordmark: `translateY 428 → 20`, `scale 1 → 0.454545` (44px → HOME's 20px), `l` stays
     20, `transformOrigin: 'top left'`. Because letter-spacing scales with the transform, 0.26em
     holds exactly.

   The line goes down and the wordmark goes up: the boot mark splits into the app's two
   brackets, and the app opens between them. The one teaching moment is the gap travelling to
   where you are standing.
7. **The route change is the fade.** `router.replace('/home')` fires at handoff + `MS.travel`, and
   the Stack's own `animation: 'fade'` cross-dissolves. HOME's masthead wordmark
   (`Mono 20/700/.26` at 20,20) and `NavRail`'s rule (2px `ink(0.8)`, notch 23 → 81) are already
   painted at identical values, so the substitution is unseeable. **BUILT:** the spec's separate
   ground-and-grain fade at handoff + 140 is the overlay's version of this beat, and a route that
   replaces itself has no ground left to fade under — the Stack owns the dissolve.

Total cold path ≈ 620 + dwell + 320 ≈ **1.24s**; the whole boot is shorter than a showdown.

### Interruption and reduced motion

A tap anywhere skips the remaining dwell and jumps to step 5; if the rail is still building it
completes over `MS.punch` (90) / `EASE.out` first. Nothing in this app blocks input, including
this. **The tap is armed at declaration, before any effect runs**, so there is no frame in which
it is inert.

With `AccessibilityInfo.isReduceMotionEnabled()`: draw the rest frame (rail complete, notch at
181 → 239, wordmark set, positioning line, meter full), hold `MS.skip` (900), and cut. No build,
no travel.

**Nothing waits on the accessibility query.** The beats run on mount and the query's only outcome
is "yes": it snaps the rail whole, draws the meter full and turns the travel into a cut. A slow,
hung, rejected or throwing query costs the animation and never the app — the boot always reaches
`/home`.

Every shared value is written inside `useEffect`, never during render.

---

## 5. HOME — `app/home.tsx`, `<Screen height={880} mode="scroll">`

**BUILT: `app/home.tsx` at `/home`.** See §3 and §4 — `app/index.tsx` is the boot. Nothing about
the composition below changes; the file and the route do.

**Thesis: HOME is the door, not the dashboard — it answers "are my people playing, and do I walk
in" with one numeral, one sentence and one press, then tells you where you stand; it reports
nothing that TABLES, FEED or FRIENDS reports, and it is never a list.**

The discipline that keeps it a door: HOME's hero is **one figure and one sentence, forever.** The
moment zone B grows a roster it has eaten FRIENDS; the moment it grows a second room it has
eaten TABLES.

### ZONE A · masthead, 0 → 56

Drawn by `<Masthead title="RAIL" meta={…} />`, not by hand — the component *is* these three values
and HOME is not allowed to be the screen that drifts from it.

- `RAIL` `<Mono size={20} weight={700} tracking={0.26}>` at `l=20 t=20`
- `r=20 t=26` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `6 TABLES LIVE · 1,240 ON RAILS`
- `<Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />` — full, unnotched; HOME has no
  second register.

### ZONE B · THE EMPTY ZONE, 56 → 300

244 units carrying five objects and otherwise nothing. This is the confidence-in-emptiness
zone. If it looks too empty it is right.

- eyebrow `l=20 t=70` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `YOUR PEOPLE, AT TABLES, RIGHT NOW`
  — **14 under the rule above it, which is the house offset on every eyebrow in the app.** (This
  file originally said 78. The +14 was normalised across all twelve screens; the three sets of
  offsets that existed — 14, 16 and 22 — are now one.)
- **the hero** `l=20 t=96` `<Mono size={78} weight={700} tracking={-0.05} lh={0.9}>` `4`
  (≈43 units wide, ends x≈63)
- `l=80 t=118` `<Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>` two lines:
  `OF 11 ON YOUR RAIL` / `ACROSS 3 TABLES`
- the sentence `l=20 t=208 w=340` `<Sans size={17} weight={500} tracking={-0.01} lh={1.3}>`
  **"Bea sat down before dinner and has not given a chip back since."**
  No digit ever appears in a Helvetica sentence on this screen.
- **the only amber on HOME**, right-ranged above the door — amber is time, and this is a clock:
  - `r=20 t=256` `<Mono size={7} tracking={0.24} color={ink(0.4)}>` `OKONKWO TO ACT`
  - `r=20 t=270` `<Mono size={13} weight={700} color={amber()}>` **`0:11`** — eleven seconds, which
    is `RAIL.clock` and therefore the same clock the rail and the table are counting. Driven by
    `useCountdown(HOME_NOW.clockSeconds, true, undefined, true)` from `src/state/meters.ts` and
    formatted `` `0:${String(Math.ceil(remaining)).padStart(2, '0')}` ``. A declared meter, exempt
    from the ladder. No track, no fill bar — a running meter anywhere but the table cheapens the
    table's clock. **The fourth argument is `loop`**: HOME stands outside a room where somebody is
    always to act, so the meter re-arms at zero rather than freezing on `0:00` under a line still
    saying `OKONKWO TO ACT`. A hand clock does not loop; a door clock does. (This file said `0:06`
    twice; the fixture has always been 11.)

Type contrast on this screen: 7 → 78 = **11.1×**.

### ZONE C · the decision, 300 → 344

`/floor`'s paired slab, reused exactly, at `h=44` with both halves' labels at Sans 12 — **one
button object at one size**, the same as `/floor` and `/feed` draw it.
`<Box l={20} t={300} w={380} h={44} style={{ flexDirection: 'row' }}>`

- left `Pressable w=240 h=44`, `borderWidth: 1`, `borderColor: INK`,
  `paddingHorizontal: 12`, `justifyContent: 'space-between'`, pressed `SURFACE.press`:
  `<Sans size={12} weight={500}>Walk in on Bea's table</Sans>` +
  `<Mono size={9} tracking={0.1} color={ink(0.6)}>238 WATCHING</Mono>` → `router.push('/rail')`.
  Watching first, because watching is the thesis.
- right `Pressable w=140 h=44`, `borderWidth: 1`, `borderLeftWidth: 0`,
  `borderColor: ink(0.3)`, centred: `<Sans size={12} weight={500} color={ink(0.8)}>Take a seat</Sans>`
  → `router.push('/table')`.

This file originally specified `h=52` with the primary label at Sans 13, which gave the app's
signature paired slab three heights and two sizes of button text inside one 380-unit rect. 44 and
Sans 12 is the value `/floor` was already drawn at.

The table's number lives in mono in the slab's figure slot, never as a numeral inside Helvetica
button text.

Between the slab's foot at 344 and the rule at 380 sits one more object, in the seam: the edition,
named and dated and nothing else. `Pressable r=0 t=352 w=250 h=28`, `hitSlop={10}`, right-ranged,
`<Mono size={8} tracking={0.14} color={ink(0.45)}>` `TONIGHT'S EDITION · ED 412 · 29 JUL` →
`router.navigate('/feed')`. It is a route, never a report of what FEED already reports, and **never
an unread count.**

### ZONE D · THE DENSE ZONE — `YOU, TONIGHT`, 380 → 684

300 units holding six figures, **three equipped provenance tiles plus the dashed empty fourth
slot**, and three routes. This is also where the ownership screens hang off, since they are not
destinations. (`LOADOUT.slots` has three entries and the screen prints `3 OF 4 SLOTS`, so "four
provenance tiles" was never what it drew.)

- `<Rule l={0} t={380} w={420} color={ink(0.2)} />`
- `l=20 t=394` `<Mono size={7} tracking={0.3} color={ink(0.55)}>` `YOU, TONIGHT` — +14 again
- `r=20 t=394` `<Mono size={7} tracking={0.12} color={ink(0.32)}>` `4,050 CR`, read from
  `COUNTER.balance` so HOME and `/shop` cannot print two of it
- `<Bust l={20} t={418} size={48} emoji="🐙" frame="bone" headStrip="ink" headStripAlpha={0.75} />`
- `l=80 t=422` `<Mono size={16} weight={700} tracking={0.18}>` `OKTA`
- `l=80 t=448` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `12,940 WATCHED · 4,812 PLAYED`
- `l=80 t=466` `<Mono size={8} tracking={0.14} color={ink(0.35)}>` `3 OF 5 FREE THROWS LEFT`
- `<Rule l={20} t={496} w={380} color={ink(0.1)} />`
- `l=20 t=510` eyebrow `EQUIPPED`; `r=20 t=510` `<Mono size={7} tracking={0.12} color={ink(0.32)}>`
  `3 OF 4 SLOTS`, derived from `LOADOUT.slots.length` and `+1` for the dashed fourth
- **three equipped tiles and the dashed empty fourth**, `w=62 h=62` at `t=540`, 96-unit pitch from
  `l=20` → 20 / 116 / 212 / 308, mapped from `LOADOUT.slots` and reused verbatim from
  `src/components/Provenance.tsx` so earned and purchased stay distinguishable at a glance:
  `<EarnedItem face="💀">`, `<PurchasedItem face="🔥" maker="M">`, `<EarnedItem face="👑">`, then
  `<EmptySeat size={62} index="04">`. (EarnedItem draws its own ticks at t=531; PurchasedItem its
  own offset hairline.)
- `<Rule l={20} t={622} w={380} color={ink(0.1)} />`
- three route cells, `h=44` at `t=626`, spanning 20 → 400, **divided by two vertical rules, never
  boxed as cards**: `<Rule l={147} t={626} h={44} vertical color={ink(0.14)} />` and
  `<Rule l={274} t={626} h={44} vertical color={ink(0.14)} />`. Cells 20–147 / 147–274 / 274–400.
  Each `<Sans size={11} weight={500} color={ink(0.85)}>` centred, pressed `SURFACE.press`:
  `The record` → `/profile`, `Loadout` → `/loadout`, `The counter` → `/shop`.
- `<Rule l={0} t={684} w={420} color={ink(0.14)} />`

### ZONE E · the foot, 684 → 880 — near-empty again

The zone opens on the 684 rule and **nothing is drawn at 700.** The rail here is ONE rule with your
people hanging off it — the strip's own 2px line — and this file's extra `ink(0.28)` rule at 700
made three parallel horizontal rules in 32 units under a caption claiming there was one. `/floor`
draws the same object with the strip's rule alone.

- `<RailStrip l={20} t={716} faces={RAIL_ROSTER.slice(0, 6).map(p => p.face)} more={5} moreSuffix=" MORE" size={22} weight={2} ruleWidth={380} youIndex={-1} />`
  — 🦩 🦌 🐺 🐢 🦉 🦡 and `+5 MORE`. **Your roster, not `CROWD`.** `CROWD` is table 12's anonymous
  crowd, and two of its faces (🦁 Teodor, 🐷 Noor) are pending *requests* — people explicitly not on
  your rail — so drawing it under `N ON YOUR RAIL` counted strangers as yours.
- `r=0 t=719 w=160 h=29`, `hitSlop={12}`, right-ranged, drawn last so the strip cannot swallow the
  tap and beginning one unit under the 2px rail so a press never breaks the line:
  `<Mono size={8} tracking={0.14} color={ink(0.45)}>` `11 ON YOUR RAIL` → `router.navigate('/friends')`.
  The figure is `RAIL_ROSTER.length`, and the remainder beside the faces is computed from the slice,
  so the count, the faces and the `+N MORE` are one quantity and cannot contradict each other.
- `l=20 t=780 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT` /
  `CREDITS BUY OBJECTS, NEVER CHIPS`
- last ink ends ≈804. **76 units of empty ground to the canvas foot at 880** — the bar's reserve.

**Dense zone: D (380 → 684). Empty zone: B (56 → 300), and the foot again.** Amber: one clock
figure, ≈0.2% of the screen. `ReactionMark` is deliberately not drawn here — the crowd at the door
is a mono figure in the slab's figure slot (`238 WATCHING`), so a second amber crowd mark on HOME
would be a defect rather than a reuse.

Figures this screen needs: **`HOME_NOW` in `src/data/social.ts`**, not `TONIGHT` in `fixtures.ts` —
the four destinations turned out to need a social register of their own, and it seeds itself from
`fixtures.ts` so the two registers of the floor cannot disagree. `atTables: 4`, `tablesLive: 3`,
`roomsLive: FLOOR.live`, `onRails: FLOOR.onRails`, `door.watching: FLOOR.hero.watching`,
`toAct: 'OKONKWO'`, `clockSeconds: 11` (`= RAIL.clock`), `sentence`, `credits: COUNTER.balance`,
`freeThrows: RAIL.freeThrows`, `freeThrowCap: RAIL.freeThrowCap`,
`slotsUsed: LOADOUT.slots.length`, `slots: LOADOUT.slots.length + 1`, `railShown: 6`. The rail's
size comes off `RAIL_ROSTER.length`; the career figures come off `RECORD.career`.

---

## 6. TABLES — `app/tables.tsx`, `<Screen height={1032} mode="scroll">`

7b's register: every live room as **one listing, one sentence, one pot**, sorted by noise. It is
the same content `/floor` draws as a plan; the register switch lives in the masthead.

### Masthead, 0 → 56, with the notch at a second scale

- `TABLES` `<Mono size={20} weight={700} tracking={0.26}>` at `l=20 t=20`
- `r=20 t=22` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `6 LIVE · 1,240 ON RAILS`
- **the register pair**, `<Mono size={7} tracking={0.2}>` at `t=40`, fixed positions (never a
  flex row — nothing may reflow):
  - `LISTINGS` at `l=317` (44.8 units wide, ends 362)
  - `·` at `l=368`, `color={ink(0.25)}`
  - `PLAN` at `l=378` (22.4 units, ends 400)
  - active: `weight={500} color={ink(0.9)}`; inactive: `weight={400} color={ink(0.34)}`, pressable
    with a 40-unit-tall hit area at `t=28`
- **the masthead rule is notched under the active half** — the nav's device at a second scale,
  `weight={2} color={ink(0.8)}` at `t=56`:

| register | left segment | right segment |
|---|---|---|
| `LISTINGS` (on `/tables`) | `l=0 w=313` | `l=366 w=54` |
| `PLAN` (on `/floor`) | `l=0 w=374` | `l=404 w=16` |

`PLAN` → `router.push('/floor')`. On `/floor`, the identical pair is drawn with `PLAN` active and
`LISTINGS` pressable → `router.back()`, falling back to `router.replace('/tables')`. `/floor`
carries no LeaveMark and no nav bar: it is the same destination at a different distance, and the
notch in its masthead says so. **The selected-state notch therefore exists at three scales: the
nav cell, the register half, and the seat cut in the table boundary. The app owns no other
selected-state device.**

### THE EMPTY ZONE, 56 → 190

- `l=20 t=70` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `SORTED BY NOISE, NEVER BY STAKES`
  (+14, per §5)
- `l=20 t=90 w=376` `<Sans size={19} weight={500} tracking={-0.01} lh={1.28}>`
  **"The loudest room tonight is the one nobody is leaving."**
- `<Ticks l={20} t={152} w={126} h={8} pitch={9} color={ink(0.3)} />`
- `<Rule l={0} t={190} w={420} color={ink(0.2)} />`

### THE DENSE ZONE — the listings, 190 → 866

Six listings, **pitch 110**, first eyebrow at `HEAD = 204`, so tops
`204 / 314 / 424 / 534 / 644 / 754` and the row rect is 102 tall from `T-6`. Every listing is drawn
identically — it is a register, not a ranking. **BUILT: pitch 110, not 100** — 100 holds two lines
of Sans 13 in 248 units and every room sentence in `src/data/social.ts` runs to three — the shortest
is 78 characters and the longest 100 — so at pitch 100 the third line was struck through by the
room's own rail. Every other
value in the anatomy below is this file's. Per listing at top `T`:

- `l=20 t=T` `<Mono size={7} tracking={0.24} color={ink(0.5)}>` room eyebrow, carrying room,
  stakes and seats: `TABLE 12 · 2/5 NL · 2 SEATS`
- `l=20 t=T+16 w=248` `<Sans size={13} weight={500} lh={1.3}>` one sentence about the room, **no
  digits**
- the pot, right-ranged, the edition's anatomy: `<Box r={20} t={T+2} style={{ alignItems: 'flex-end', gap: 6 }}>`
  → `<Sans size={7} tracking={0.3} color={ink(0.4)}>POT</Sans>` +
  `<Mono size={30} weight={700} tracking={-0.04} lh={0.9}>` the figure. At 6 digits the block is
  ≈101 units and ends at x=400, clear of the sentence's 268 by 31.
- **the room's rail, drawn as a rail**, at `t=80` inside the row rect (canvas `T+74`):
  `<RailStrip l={20} faces={room.railFaces.slice(0, band.faces)} more={room.watching - faces.length}
  moreSuffix=" MORE" size={22} weight={band.railWeight} ruleColor={band.railInk} ruleWidth={380}
  youIndex={-1} />`. **The faces and the remainder are one slice** — `+N MORE` is arithmetic on the
  busts drawn beside it — so a band that truncates the fixture cannot make a row print a remainder
  for a five-face strip under a three-face one.
- `<ReactionMark r={20} t={T+80} count={watching} scale="agate" />` — amber, the crowd, legal, and
  **drawn only when `watching > 0`**. No `color` prop: `ReactionMark` owns the density register in
  one place (2–39 one tick each, 40+ massed and capped, a small crowd dimmer), so the mark's length
  *is* the crowd and this screen passes it nothing but the figure.
- `<Rule l={20} t={T+102} w={380} color={ink(0.1)} />` on the first five only
- the whole row is one `Pressable` at `l=0 t=T-6 w=420 h=102`, `opacity` from the band, pressed
  `SURFACE.press`, → `router.push('/rail')`. **One target per listing.** You watch first; the seat
  is taken from the rail or the plan, which is the thesis and also keeps a mis-tap from seating you.

**THE DARK ROOM** is the one exception, and it is a sibling of the listing rather than a child so
the room's 45% band cannot dim the one thing on it worth pressing: where the crowd would hang off
table 30's bare rail, `Sit first` hangs instead — `Pressable r=20 t=T+76 w=150 h=26`,
`borderColor: INK`, `<Sans size={12} weight={500}>Sit first</Sans>` +
`<Mono size={8} tracking={0.1} color={ink(0.6)}>MIN 4,000</Mono>` → `router.push('/table')`. It is
the only call to action in the register and the only press in it that seats you.

**7c's four tone bands**, and the four channels each one drives. This is the table the build
actually uses (`BAND` in `app/tables.tsx`):

| band | watching | listing opacity | rail weight | rail ink | busts | pot ink |
|---|---|---|---|---|---|---|
| LOUD | ≥ 40 | 1 | 2px | `ink(0.42)` | 3 | `ink()` |
| WARM | ≥ 4 | 0.8 | 1px | `ink(0.3)` | 2 | `ink()` |
| QUIET | ≥ 1 | 0.55 | 1px | `ink(0.22)` | 1 | `ink(0.75)` |
| EMPTY | 0 | 0.45 | 1px | `ink(0.16)` | 0 | `ink(0.5)` — `NO POT YET` |

**BUILT: three busts at LOUD, not five, and QUIET's rule is 22% not 16%.** Ask 7c's caption says a
loud rail is five busts and a quiet one a hairline at 16%. A 22-unit bust on a 380-unit strip beside
a `+N MORE` figure fits five, so this is a composition call and not a constraint: at 100 units of
listing the five faces plus the remainder crowded the crowd mark on the same line, and 3 / 2 / 1 / 0
gives the four bands four *distinguishable* counts, which is the channel's job. 16% under a 1px rule
on this ground is very nearly not a line at all next to `ink(0.1)` dividers; 22% reads as a rail.
The band table above is the one to trust — `src/components/RailStrip.tsx`'s docstring still repeats
the caption's five and 16%, and it is wrong.

Rails come off `ROOM_FACES` through a cursor, disjointly, so **no face stands on two rails at once**
is true by construction rather than by inspection — `/tables` draws all six rails on one canvas.
Faces drawn per room: 12 → 3, 7 → 3, 9 → 2, 3 → 2, 21 → 1, 30 → 0.

`<Rule l={0} t={866} w={420} color={ink(0.2)} />`

### FOOT, 866 → 1032

- `<Box l={20} t={882} w={380} h={44} style={{ flexDirection: 'row' }}>` — two 190-unit cells,
  `borderWidth: 1`, `borderLeftWidth: 0` on the second, `borderColor: ink(0.35)`,
  `<Sans size={12} weight={500} color={ink(0.85)}>`: `Open a table` · `Private room`. **Neither
  opens anything yet, so both are `<Pressable disabled accessibilityState={{ disabled: true }}>`** —
  drawn at the same ink, but a control that does nothing has to say so to the one reader who cannot
  see that it is inert, and two bordered `<View>`s read to a screen reader as two unlabelled text
  groups.
- `l=20 t=940 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `EVERY ROOM IS PLAY CHIPS ONLY · SORTED BY NOISE, NEVER BY STAKES` /
  `CHIPS CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT`
- last ink ≈964. **68 units of empty ground to 1032.**

Type range 7 → 30 = **4.3×**. Dense zone 190 → 866; empty zone 56 → 190 (three objects in 134
units) plus the foot. Amber: one crowd mark per room that has a crowd — five of the six — well
under 1% of the canvas.

Figures (`ROOMS` in `src/data/social.ts`, not `fixtures.ts`): six rooms, seeded from `FLOOR.hero`
and `FLOOR.rest` so the two registers cannot disagree — table 7 / 5/10 NL / pot 21,400 / 412
watching, table 12 / 2/5 NL / 7,890 / 238, table 9 / 5/10 NL / 6,240 / 64 (the sixth room, written
in the same voice and landing between 238 and 20 so the bands spread across all four), table 3 /
1/2 NL / 3,150 / 20, table 21 / 1/2 NL / 880 / 3, table 30 / 2/5 NL / opens at 2. `railMore` is
always `watching − railFaces.length`. **`/floor` and `/tables` read from the same array. A room that
shows a different pot in the two registers is a defect.** The listings are also *sorted* here by
`watching`, descending, rather than trusting the order the fixture is written in.

---

## 7. FRIENDS — `app/friends.tsx`, `<Screen height={1620} mode="scroll">`

**Why this shape.** "Your friends are your rail" is not a slogan to print, it is a structure to
draw. So FRIENDS is not a follower list with follow buttons: it is (a) the rail as a literal
object — one 2px rule with your people hanging *below* it, 5a's grammar, because a railbird is
outside the line and this is the line — and (b) a **ledger of reciprocity**, two figures per
person: hands of yours they watched, hands of theirs you watched. The quantity the screen is
about is *hands watched together*, and it is drawn as a tick strip whose **length** encodes it,
6c's density register, so it reads as measurement instead of a sortable column. There is no
follower count, no mutual badge, no rank. The right shape for "your friends are your rail" is
the rail, with names on it, and a record of who stood there.

### Masthead, 0 → 56

- `YOUR RAIL` `<Mono size={20} weight={700} tracking={0.26}>` at `l=20 t=20`
- `r=20 t=26` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` **`11 PEOPLE · 5 ON NOW`**
- `<Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />`

**BUILT: five on now, not four.** On-now is the roster's own definition — every person at a table or
on a rail — and that is five: Bea, Sven, Okonkwo and Tomás at tables, Priya on a rail at 12. This
file said four because `FEATURED_RAIL` is four, but `FEATURED_RAIL` is the four *rooms* of your rail;
Okonkwo is on now at the table you are already standing at, so he is not a fifth room. A figure over
a ledger has to be the count of the ledger, and the ledger draws five rows lit. The nav bar's
FRIENDS ticks read the same derived figure, so the bar cannot disagree with the document above it.

### THE EMPTY ZONE, 56 → 250

- `l=20 t=70` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `WHO IS ON YOUR RAIL TONIGHT` (+14)
- **the hero** `l=20 t=96` `<Mono size={62} weight={700} tracking={-0.05} lh={0.9}>` `340`
  (≈102 units, ends x≈122)
- `l=134 t=118` `<Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>` two lines:
  `HANDS OF YOURS` / `SVEN HAS WATCHED`
- `l=20 t=180 w=340` `<Sans size={16} weight={500} tracking={-0.01} lh={1.3}>`
  **"Sven has watched you play more hands than anyone and has never taken a seat at your table."**

### THE RAIL, AS AN OBJECT, 250 → 356

The rule is at **`RAIL_Y = 272`** and the whole band is derived from the roster rather than typed,
so the line cannot disagree with the people standing on it. Presence has four states and three
objects, and never a coloured dot:

- **at a table** — the rule *breaks* and the bust sits astride the notch, `frame="lit"`, exactly as
  `src/data/tableLayout.ts` cuts the table boundary for a seat. Top `272 - 36/2`.
- **on a rail** — the line stays whole and the bust hangs *below* it at `276`, `frame="crowd"` at
  0.7. Outside the line, which is what a railbird is.
- **around** — no line at all: a 22-unit bust at `t=328`, `frame="dim"` at 0.55, on a 36-unit pitch
  from `l=20`, with `IN THE APP, IN NO ROOM` stated 34 units clear of the last one.
- **away** — no bust. `r=20 t=339` `<Mono size={8} tracking={0.14} color={ink(0.35)}>` `+4 AWAY
  TONIGHT`. A face you cannot stand next to tonight is not a presence.

- the five on now, `size={36}`, at **measured x positions `44 / 112 / 180 / 236 / 304`** — segments
  of 20 / 24 / 80 / 24 / 56 with a notch (`x-4` → `x+40`) cut for each of the four who are seated.
  The accessor is total, so a sixth presence continues the last pitch rather than resolving to
  `left: NaN`.
- each one's room beneath it at `t=320`, `<Mono size={7} tracking={0.12} color={ink(0.4)}>`:
  `TABLE 12` · `TABLE 7` · `RAIL 12` · `TABLE 3` · `TABLE 12`. `RAIL 12`, not `ON RAIL 12`: ten
  mono-7 characters wrap under a 36-unit face and orphan the room number, and the app already says
  *on* structurally, by drawing a railbird below the line.
- the whole presence — face through room label — is one press, `l=x-6 t=busttop w=48`, running to
  `332`, → `/rail`.

**BUILT: five on the line, not four, and the band accounts for all eleven people.** Okonkwo was on
now and drawn nowhere: not on the line, not in AROUND, not inside `+4 AWAY`. Five on the line + two
standing clear + four away = eleven.

**THE SAME HAND, 372 → 496.** The one state worth a band of its own: somebody standing where you are
standing. Priya folded early at table 12 and stayed, and you are on that rail too.

- `<Rule l={0} t={372} w={420} color={ink(0.2)} />`, eyebrow `l=20 t=386` `WATCHING THE SAME HAND AS
  YOU` at `<Mono 7/.3/ink(0.55)>`, and `r=20 t=386` `TABLE 12 · HAND 1,286 · OKONKWO TO ACT` at
  `<Mono 7/.12/ink(0.32)>` — the hand number is `TAPE.handNo`, so it is the hand `/rail` is running
- one `Pressable l=0 t=400 w=420 h=94` → `/rail`, carrying
  `<RailStrip l={20} t={10} faces={[YOU.face, watching.face]} size={28} weight={2}
  ruleColor={ink(0.62)} ruleWidth={380} youIndex={0} />` — the crowd component at the smallest crowd
  it can hold, two, with yours bone
- `<ReactionMark r={20} t={20} count={1240} scale="agate" />` — **the only amber on the screen**,
  legal because it is the crowd
- `l=20 t=52 w=356` `<Sans size={13} weight={500} lh={1.35}>` the sentence

### THE LEDGER — THE DENSE ZONE, 496 → 907

- `<Rule l={0} t={496} w={420} color={ink(0.2)} />`
- `l=20 t=510` `<Mono size={7} tracking={0.3} color={ink(0.55)}>` `THE LEDGER`
- `l=230 t=510` `<Mono size={7} tracking={0.24} color={ink(0.32)}>` `RAIL CARD`
- `r=20 t=510` `<Mono size={7} tracking={0.12} color={ink(0.32)}>` `HANDS WATCHED TOGETHER`
- six rows, **pitch 66**, tops `536 / 602 / 668 / 734 / 800 / 866`. Per row at top `T`:
  - `<Bust l={20} t={T} size={28} emoji={face} frame={onNow ? 'lit' : 'rest'} opacity={onNow ? 1 : 0.7} />`
  - `l=58 t=T+2` `<Sans size={12} weight={500}>` the name — Sans 12 for a row you can open
  - `l=58 t=T+20` `<Mono size={7} tracking={0.12} color={ink(0.4)}>` `RAILED YOU 340 · YOU RAILED 96`.
    **Mono 7, not 7.5** — 7.5 appeared nowhere else in the app.
  - `l=58 t=T+34` `<Mono size={7} tracking={0.12} color={ink(0.26)}>` where they are, or their
    last-seen
  - `<Box l={236} t={T+4}>` the rail card at 22 units: `<EarnedItem>` or `<PurchasedItem>`, straight
    out of `Provenance.tsx`, proving the class survives at the size most people will see it
  - `<Box r={20} t={T+2}>` `<Mono size={12} weight={500} color={ink(0.85)}>` the hands-watched-
    together figure
  - `<Ticks r={20} t={T+22} w={Math.min(96, Math.round(n / 8))} h={8} pitch={4} color={ink(0.3)} />`
    — the length is the figure; caps at 96 units (n ≥ 768)
  - `<Rule l={20} t={T+50} w={380} color={ink(0.1)} />` on the first five only
  - the row is one `Pressable l=0 t=T-6 w=420 h=62`, pressed `SURFACE.press`, → `/profile`.
    **BUILT: one target, one meaning.** This file gave the row both jobs — `/rail` when the person is
    in a room, `/profile` when they are not — and a row that means two things depending on data you
    cannot see is a coin toss. A *room* is entered from the drawn rail above (a bust on the line →
    `/rail`); a *person* is opened from their row in the ledger.
  - every repeated row is **keyed on the row component and returns a fragment carrying its own
    divider**, never wrapped in a `<Box l={0} t={0} w={420}>`. Every part of a row is already drawn
    in canvas units, so a wrapper can only be a parent 420 × 0 units tall with its children hundreds
    of units below it — a row you can see and cannot press, because Android finds the parent under
    the finger first. A fragment puts the press rect on the canvas, which is the one view that does
    contain it.

### THE REST, 907 → 1554

**BUILT: the canvas runs to 1620, not 1000.** §7's layout was drawn before `src/data/social.ts`
carried `REQUESTS_IN`, `REQUESTS_OUT` and per-person `SUGGESTIONS` reasons, and requests in both
directions cannot be drawn honestly in the 230 units its foot reserved. The masthead, the hero, the
rail object and the ledger keep this file's geometry to the unit.

- **THE RELIEF, 928 → 1016.** Two objects and thirty units of ground between two dense registers,
  because the product's whole claim fits in one figure: `<Rule l={0} t={928} …>`, then
  `l=20 t=948` `<Mono size={34} weight={700} tracking={-0.04} lh={0.9}>` `58` and `l=70 t=956`
  `SEATS YOU HAVE TAKEN / AFTER WATCHING FIRST` in agate. Watching is not the waiting room.
- **REQUESTS, BOTH DIRECTIONS, 1016 → 1236.** Rule at 1016, eyebrow `ASKED TO STAND ON YOUR RAIL` at
  1030 with `REQUESTS RUN BOTH WAYS` right-ranged; two in-rows at pitch 46 from 1054, each ending in
  a `Let them in` cell you press; the sub-head `YOU ASKED TO STAND ON THEIRS` at 1150 (`ink(0.5)`,
  the one true sub-head on the screen) and two out-rows at pitch 42 from 1172, each ending in
  `ASKED · YESTERDAY` — **direction is carried by what the row hands you, never by an arrow.**
  No badge, no counter, no amber.
- **NOT YET ON YOUR RAIL, 1256 → 1402.** Rule, eyebrow at 1270, `THEY HAVE SAT AT YOUR TABLE, NEVER
  ON YOUR RAIL` right-ranged, three suggestion rows at pitch 42 from 1294. Each carries a fact about
  a room you were both standing in — a suggestion with no reason is an algorithm asking for trust.
  The row opens the person; the `Ask` cell asks them.
- **ADD SOMEONE BY HANDLE, 1420 → 1554.** Rule 1420, eyebrow 1434 with `NOBODY CAN SEND CHIPS`
  right-ranged, the `@` in mono 18 at `l=20`, the field at `l=38 w=232` set in mono 15/500, and
  **the rule underneath *is* the input** — `l=20 t=1486 w=250`, a hairline at `ink(0.3)` that steps
  to 2px `INK` the moment there is something to send. No capsule, no fill, no magnifier. `Invite`
  is a 104 × 32 cell at `r=20`, and `returnKeyType="send"` runs the same function, so the invite is
  one gesture from either path.
- `l=20 t=1530 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `A RAIL IS PEOPLE, NOT A FOLLOWER COUNT` /
  `CHIPS CANNOT BE SENT, RECEIVED OR CASHED OUT`
- last ink ≈1554. **66 units of empty ground to 1620** — the bar's reserve, which is the constraint
  the height exists to serve.

Type range 7 → 62 = **8.9×**. Dense zone 496 → 1236; empty zones the hero (56 → 250) and the relief
band at 928.

Figures (`RAIL_ROSTER` in `src/data/social.ts`, not `PEOPLE` in `fixtures.ts`): eleven people, five
on now, each with `railedYou`, `youRailed`, `together` (always the sum of the two — the ledger is one
quantity read two ways, never a score), `status`, and `where`. The six of `CAST` keep the figures
this file fixed — Bea 210 / 388 / 598; Sven 340 / 96 / 436; Okonkwo 96 / 240 / 336; Tomás 180 / 74 /
254; Priya 64 / 150 / 214; Derya 41 / 88 / 129 — and the five additions sit below Derya on
`together`, so sorting by hands-watched-together puts this file's six in the ledger's six rows.

---

## 8. SHARED COMPONENTS

**BUILT: the three shell components are one file, `src/components/AppShell.tsx`.** It exports
`NAV_H`, `NAV_NOTCH`, `NAV_RESERVE`, `NavRoute`, `NavCell`, `NAV_CELLS`, `NavRail`,
`MastheadRegister`, `Masthead` and `LeaveMark`. They are one file because they are one object seen
three times — the notch at three scales, plus the press fill all three share (`PressFill`, and the
`rgba(23,24,26,0)` clear value it releases to). Splitting them across three files duplicated that
fill three ways, which is exactly the drift the shell is supposed to prevent. There is no
`Boot.tsx`: the boot is `app/index.tsx` (§4).

*The argument against:* one 493-line file is where three components go to grow into six, and the
route-shaped names (`NavRail.tsx`) are easier to find. *For:* the file's own docstring is the shell's
argument, and it is worth reading once rather than three times.

Nothing else is added, and **`Prim.tsx`, `Bust.tsx`, `RailStrip.tsx`, `Reaction.tsx`,
`Provenance.tsx` and `tokens.ts` are not modified.** `Screen.tsx` took one edit that this file did
not anticipate: `keyboardShouldPersistTaps="handled"` and (on iOS) `automaticallyAdjustKeyboardInsets`
on the scroll-mode `ScrollView`. With the default `"never"`, the first tap on FRIENDS' `Invite` —
reachable only while the soft keyboard is up — is spent dismissing the keyboard, so the invite needed
two taps on a device. The scaling, the insets and the reserve are untouched.

### `NavRail` — in `src/components/AppShell.tsx`

```ts
export const NAV_H = 58;          // design units of drawn band
export const NAV_NOTCH = 58;      // the gap, identical to the icon's and the boot mark's
export const NAV_RESERVE = 64;    // empty units every destination canvas must end with

export type NavRoute = '/home' | '/tables' | '/feed' | '/friends';

export type NavCell = {
  label: string;              // ≤ 7 chars, uppercase
  route: NavRoute;
  l: number;
  w: number;
  centre: number;
  notch: [number, number];   // [left lip, right lip]
  live?: 'rooms' | 'people'; // which live count draws its ticks; absent = no ticks
};

export const NAV_CELLS: readonly NavCell[];

/**
 * The bar. Takes no props: it reads usePathname() and returns null on any route
 * that is not a destination. Rendered once, by app/_layout.tsx, above the Stack.
 */
export function NavRail(): React.ReactElement | null;
```

### `Masthead` — in `src/components/AppShell.tsx`

Every document's top 56 units, and **the single source for all of them.** It renders exactly what
`/feed`, `/floor` and `/profile` hand-drew, so they were converted to it; HOME, TABLES, FRIENDS,
`/loadout` and `/shop` call it too. Eight screens, one object. Do not hand-draw a masthead.

```ts
export type MastheadRegister = {
  labels: [string, string];        // e.g. ['LISTINGS', 'PLAN'] — fixed positions, never a row
  active: 0 | 1;
  onPress: (index: 0 | 1) => void; // called only for the inactive half
};

export function Masthead(props: {
  /** Mono 20 / 700 / .26 at (20, 20). Uppercase. */
  title: string;
  /** Mono 8 / .14 / ink(0.5), right-ranged at (r 20, t 26) — or t 22 when a register is present. */
  meta?: string;
  /** Optional right-hand register pair; cuts the notch in the rule under the active half. */
  register?: MastheadRegister;
  /** 'full' (default) draws x 0→420 at y=56, weight 2, ink(0.8). 'none' draws no rule. */
  rule?: 'full' | 'none';
}): React.ReactElement;
```

Register geometry is internal and fixed: labels at `t=40`, `<Mono size={7} tracking={0.2}>`,
first at `l=317`, separator `·` at `l=368` `ink(0.25)`, second at `l=378`; rule segments per the
table in §6; hit areas 40 units tall from `t=28`.

### `LeaveMark` — in `src/components/AppShell.tsx`

The nav's mark inverted. A notch subtracted says *you are here*; returning is a stub **added**.
No arrow, no chevron, no icon, no "<".

```ts
export function LeaveMark(props: {
  /** Mono 7 / .24 / ink(0.5), uppercase, at (20, ruleY + 8). Names what you are leaving. */
  label: string;
  /** The y of this screen's own top hairline. The 2px INK stub is drawn on it at l=20, w=16. */
  ruleY: number;
  /** Where router.replace() goes when there is no history (deep link, cold start). */
  fallback: NavRoute;
  /** Which side of the hairline the label hangs off. Default 'below'. */
  place?: 'below' | 'above';
}): React.ReactElement;
```

Hit target: `l=0, t=ruleY - 12, w=140, h=40` (`place="above"`: `t=ruleY - 24, h=30`),
`hitSlop={12}`, pressed `SURFACE.press`. Press calls `router.back()` when `canGoBack()`, else
`router.replace(fallback)`. **The stub never moves — it is always on the rule** — so the mark reads
the same in both placements.

**BUILT: `place`.** `'above'` exists for one screen. The table's own header already sets `ON THE
RAIL` at y=104 over a rule at 88, and two agate lines two units apart, one of them pressable, is
neither legible nor honest about what you can press. `/table` therefore hangs its label above its
rule; every other pushed screen has empty ground under its rule and uses `'below'`.

**BUILT: `fallback` is `NavRoute`, so the cold-start fallback is `/home`, never `/`.** With the boot
at `/`, `fallback="/"` would have landed a deep-linked user on the splash. `/table` and `/rail`
fall back to `/tables`, `/clip` to `/feed`, and `/profile`, `/loadout` and `/shop` to `/home`.

Per-screen values: `/table` `ruleY={CHROME.header.rule}` = 88, `place="above"`, `LEAVE THE TABLE`;
`/rail` `ruleY={44}`, `LEAVE THE RAIL`; `/clip` `ruleY={44}`, `CLOSE THE CLIP`; `/profile`
`ruleY={56}`, `LEAVE THE RECORD`; `/loadout` `ruleY={56}`, `LEAVE THE LOADOUT`; `/shop`
`ruleY={56}`, `LEAVE THE COUNTER`. `/floor` gets no LeaveMark — it has the register notch instead.

### `app/_layout.tsx` — the only edit to an existing shared file

```tsx
const [loaded] = useFonts({ /* unchanged */ });
if (!loaded) return <View style={{ flex: 1, backgroundColor: GROUND }} />;
…
<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: GROUND }, animation: 'fade' }} />
<NavRail />
```

`NavRail` after `Stack` so it paints over scrolling content. It needs no `booted` flag: it reads the
pathname and returns `null` on `/`, which is the boot. **BUILT:** the spec's `{booted ? … }` pair and
the `<Boot>` overlay both disappear with §4's decision — the font gate stays, because every figure in
the app is mono and there is no frame in which a half-drawn bar beats the ground it sits on.

---

## 9. WHAT THIS IS NOT

Ruled out by name. Any of these appearing in a build is a defect, not a preference.

- **No icons.** Not in the nav, not in a masthead, not as a back affordance. No chevrons, no
  arrows, no house/list/bell/person glyphs, no icon library, and no emoji standing in for one —
  emoji are avatars and throwables only.
- **No five equal cells at equal spacing**, and no four. Nav cells are 104 / 120 / 92 / 104,
  sized to their words.
- **No pill, capsule, fill, tint, dot, badge or underline for the selected state.** Selection is
  a 58-unit notch plus an ink step. Nothing else in the app may invent a second one.
- **No amber on navigation.** Not the notch, not a label, not a tick, not a mark. `NavRail`,
  `Masthead` and `LeaveMark` contain no call to `amber()` at all. Amber is time (the clock, the
  cooldown) and expression (the crowd, a throw).

  The honest inventory across the boot and the four destinations, counted in the code: **eleven
  marks.** One is time — HOME's `0:11` clock. Ten are the crowd: five on TABLES (one `ReactionMark`
  per room that has a crowd; table 30 has none), four on FEED (the lead hand plus one per bad beat),
  one on FRIENDS. The boot has none. Every one is legal, and this file used to claim two, which was
  a count of the two screens the shell *added* rather than a count of the shell.
- **No red dot, no unread badge, no "3 NEW" anywhere** — not in the bar and not in a document.
  Ticks count what is live now, and a section that wants a figure gets a measurement of itself
  (FEED's `BAD BEATS` is answered by `3 TONIGHT`, read from `EDITION.badBeats.length`).
- **No rounded corners, drop shadows, gradients, blur, translucency or frosted bars.** The bar is
  opaque `GROUND` with `Grain`, and it is the bottom edge of the app.
- **No cards.** Not a listing card, not a friend card, not a nested panel. Sections are divided
  by 1px and 2px rules, and the three route cells on HOME are divided by two vertical hairlines,
  not boxed.
- **No opacity fade as a press state, anywhere.** Press is `SURFACE.press` on a dark cell and
  `SURFACE.pressLight` on a bone slab.
- **No 14/16/20/24 type ramp.** Every screen in the shell holds ≥4× between its smallest and
  largest type: HOME 7 → 78 = 11.1×, FRIENDS 7 → 62 = 8.9×, TABLES 7 → 30 = 4.3×, FEED 7 → 30 =
  4.3×, the boot 7 → 44 = 6.3×.
- **No numeral set in Helvetica.** Not in a headline, not in a sentence, not in button text.
  Figures live in the mono slot beside the Sans phrase — which is why the door reads
  "Walk in on Bea's table / 238 WATCHING" and not "Walk in on table 12". Every string this file
  specifies holds this — TABLES' six room sentences are written with no digit in any of them, on
  purpose. **The places in the app that do not hold it are six headlines** — the edition's five and
  `/floor`'s one ("Bea is up 9,400 at table 12 and will not leave.") — which are Helvetica sentences
  with figures inside them because they are prose in the rail's voice. Unresolved, and argued both
  ways in `docs/DESIGN.md` §6.10.
- **No flex-flow layout at screen level.** Absolute `<Box l= t= r= w= h=>` in design units inside
  `<Screen>`, on the 420 canvas. Flex only inside a slab or a row of tiles.
- **No duration off the ladder.** The shell uses `MS.track` (0), `MS.punch` (90), `MS.mark` (120),
  `MS.exit` (180), `MS.travel` (320), `MS.join` (620), `MS.skip` (900). The boot meter and HOME's
  clock run on elapsed time and are declared meters. No shared value is written during render.
- **No screen is reachable only by gesture, and no gesture is added to the shell.**
- **No dashboard.** No sortable columns, no stakes as a sort key, no six-metric summary, no
  chart. Noise is the sort order.
- **No language that implies money.** Nothing deposits, cashes out, withdraws, transfers, gifts,
  sends, wins real money, or names a balance in currency. Credits (CR) buy objects only; chips
  are play chips, non-transferable and worthless. Every destination carries the constraint in its
  foot, in mono agate, as a statement of fact rather than a disclaimer.
- **No placeholder.** No lorem, no "Coming soon", no empty state that has not been written. Every
  string in this spec is the string that ships.
