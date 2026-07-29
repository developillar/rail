# RAIL — APP SHELL SPEC

Canonical. Four implementers build from this file and nothing else. Every number is in design
units on the 420-wide canvas unless a `pt`/`px` suffix says otherwise. Colours are token calls
from `src/design/tokens.ts`. Durations are stops on `MS`; curves are `EASE` names.

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
- FRIENDS: `n` = people on your rail on now (4 → 12 units)
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
'/'            HOME
'/tables'      TABLES
'/feed'        FEED
'/friends'     FRIENDS
```

`NavRail` reads `usePathname()` itself and returns `null` on any other route. It takes no props,
so no implementer can place it wrongly or notch it wrongly.

Hides on `/table`, `/rail`, `/clip`, `/floor`, `/profile`, `/loadout`, `/shop`, and during the
boot overlay. **The law: the bar shows where you are AT a destination. It hides on every screen
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

| Route | File | Title (masthead) | Kind | Screen | In | Out |
|---|---|---|---|---|---|---|
| `/` | `app/index.tsx` | `RAIL` | destination | `height={880} mode="scroll"` | boot handoff; nav HOME | nav |
| `/tables` | `app/tables.tsx` | `TABLES` | destination | `height={976} mode="scroll"` | nav TABLES; `LISTINGS` on /floor | nav |
| `/feed` | `app/feed.tsx` | `THE RAIL` | destination | `height={900} mode="scroll"` (unchanged) | nav FEED | nav |
| `/friends` | `app/friends.tsx` | `YOUR RAIL` | destination | `height={1000} mode="scroll"` | nav FRIENDS; `11 ON YOUR RAIL` on / | nav |
| `/floor` | `app/floor.tsx` | `THE FLOOR` | pushed (register) | `height={900} mode="scroll"` (unchanged) | `PLAN` in /tables masthead | `LISTINGS` in its own masthead → `/tables` |
| `/table` | `app/table.tsx` | — (`CHROME.header`) | pushed | `height={912} mode="fit"` (unchanged) | `Take a seat` on /; `Take seat 1` on /floor; `Take a seat` on /rail | LeaveMark `LEAVE THE TABLE`, fallback `/tables` |
| `/rail` | `app/rail.tsx` | — (own header, rule y=44) | pushed | `height={720} mode="fit"` (unchanged) | `Walk in on Bea's table` on /; `Just watch` on /floor; a listing on /tables | LeaveMark `LEAVE THE RAIL`, fallback `/tables` |
| `/clip` | `app/clip.tsx` | — (own header) | pushed | `height={760} mode="fit"` (unchanged) | `Watch clip` on /feed | LeaveMark `CLOSE THE CLIP`, fallback `/feed` |
| `/profile` | `app/profile.tsx` | `THE RECORD` | pushed | `height={870} mode="scroll"` (unchanged) | `The record` on / | LeaveMark `LEAVE THE RECORD`, fallback `/` |
| `/loadout` | `app/loadout.tsx` | `LOADOUT` | pushed | `height={700} mode="scroll"` (unchanged) | `Loadout` on /; `Change loadout` on /profile | LeaveMark `LEAVE THE LOADOUT`, fallback `/` |
| `/shop` | `app/shop.tsx` | `THE COUNTER` | pushed | `height={720} mode="scroll"` (unchanged) | `The counter` on /; `Buy` on /loadout | LeaveMark `LEAVE THE COUNTER`, fallback `/` |
| `/screens` | `app/screens.tsx` | `RAIL` | review only | `height={720} mode="scroll"` | typed URL only | LeaveMark, fallback `/` |

Notes.

- **HOME takes over `app/index.tsx`.** The developer contents page moves verbatim to
  `app/screens.tsx` and is never linked from the shell — it stays only so four implementers can
  reach every screen in `npm run web`. It is not part of the product.
- Router shape: **the existing flat root `<Stack>`, unchanged.** No `Tabs` navigator, no route
  groups, no file moves beyond `index.tsx` → `screens.tsx`. Every existing
  `router.push('/table')` and `router.push('/rail')` keeps working untouched.
- Destination-to-destination uses `router.navigate(route)`, which reuses the route if it is
  already in the stack instead of stacking a second copy. Android hardware back therefore pops
  to the previous destination, which is what a person expects.
- Pushed screens use `router.push`. Returning is `router.back()` when there is history, and
  `router.replace(fallback)` when there is not (deep link, cold start).
- `/rail`'s `router.replace('/table')` on seating is unchanged and correct — you did not push a
  screen, you sat down.

---

## 4. SPLASH — `Boot`

Not a route. A full-bleed overlay rendered by `app/_layout.tsx` **above** the `<Stack>`,
replacing today's `if (!loaded) return <View/>` gate:

```tsx
{loaded ? <Stack …/> : null}
<Boot ready={loaded} onDone={() => setBooted(true)} />   // unmounted once booted
```

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
4. **Dwell** until `elapsed ≥ MS.skip (900)` **and** `ready === true`.
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
7. **The overlay's ground and grain** fade 1 → 0 over `MS.exit` (180) / `EASE.out`, starting at
   handoff + 140 so it lands with the travel. Beneath it, HOME's masthead wordmark
   (`Mono 20/700/.26` at 20,20) and `NavRail`'s rule (2px `ink(0.8)`, notch 23 → 81) are already
   painted at identical values, so the substitution is unseeable. `Boot` then unmounts.

Total cold path ≈ 620 + dwell + 320 ≈ **1.24s**; the whole boot is shorter than a showdown.

### Interruption and reduced motion

A tap anywhere skips the remaining dwell and jumps to step 5; if the rail is still building it
completes over `MS.punch` (90) / `EASE.out` first. Nothing in this app blocks input, including
this.

With `AccessibilityInfo.isReduceMotionEnabled()`: draw the rest frame (rail complete, notch at
181 → 239, wordmark set, positioning line, meter full), hold `MS.skip` (900), hand off on a
single `MS.exit` (180) ground fade. No build, no travel.

Every shared value is written inside `useEffect`, never during render.

---

## 5. HOME — `app/index.tsx`, `<Screen height={880} mode="scroll">`

**Thesis: HOME is the door, not the dashboard — it answers "are my people playing, and do I walk
in" with one numeral, one sentence and one press, then tells you where you stand; it reports
nothing that TABLES, FEED or FRIENDS reports, and it is never a list.**

The discipline that keeps it a door: HOME's hero is **one figure and one sentence, forever.** The
moment zone B grows a roster it has eaten FRIENDS; the moment it grows a second room it has
eaten TABLES.

### ZONE A · masthead, 0 → 56

- `RAIL` `<Mono size={20} weight={700} tracking={0.26}>` at `l=20 t=20`
- `r=20 t=26` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `6 TABLES LIVE · 1,240 ON RAILS`
- `<Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />` — full, unnotched; HOME has no
  second register.

### ZONE B · THE EMPTY ZONE, 56 → 300

244 units carrying five objects and otherwise nothing. This is the confidence-in-emptiness
zone. If it looks too empty it is right.

- eyebrow `l=20 t=78` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `YOUR PEOPLE, AT TABLES, RIGHT NOW`
- **the hero** `l=20 t=96` `<Mono size={78} weight={700} tracking={-0.05} lh={0.9}>` `4`
  (≈43 units wide, ends x≈63)
- `l=80 t=118` `<Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>` two lines:
  `OF 11 ON YOUR RAIL` / `ACROSS 3 TABLES`
- the sentence `l=20 t=208 w=340` `<Sans size={17} weight={500} tracking={-0.01} lh={1.3}>`
  **"Bea sat down before dinner and has not given a chip back since."**
  No digit ever appears in a Helvetica sentence on this screen.
- **the only amber on HOME**, right-ranged above the door — amber is time, and this is a clock:
  - `r=20 t=256` `<Mono size={7} tracking={0.24} color={ink(0.4)}>` `OKONKWO TO ACT`
  - `r=20 t=270` `<Mono size={13} weight={700} color={amber()}>` `0:06`, driven by
    `useCountdown(11, true)` from `src/state/meters.ts` and formatted
    `` `0:${String(Math.ceil(remaining)).padStart(2, '0')}` ``. A declared meter, exempt from the
    ladder. No track, no fill bar — a running meter anywhere but the table cheapens the table's
    clock.

Type contrast on this screen: 7 → 78 = **11.1×**.

### ZONE C · the decision, 300 → 352

`/floor`'s paired slab, reused exactly, at `h=52` because it is the only press on the screen.
`<Box l={20} t={300} w={380} h={52} style={{ flexDirection: 'row' }}>`

- left `Pressable w=240 h=52`, `borderWidth: 1`, `borderColor: INK`,
  `paddingHorizontal: 12`, `justifyContent: 'space-between'`, pressed `SURFACE.press`:
  `<Sans size={13} weight={500}>Walk in on Bea's table</Sans>` +
  `<Mono size={9} tracking={0.1} color={ink(0.6)}>238 WATCHING</Mono>` → `router.push('/rail')`.
  Watching first, because watching is the thesis.
- right `Pressable w=140 h=52`, `borderWidth: 1`, `borderLeftWidth: 0`,
  `borderColor: ink(0.3)`, centred: `<Sans size={12} weight={500} color={ink(0.8)}>Take a seat</Sans>`
  → `router.push('/table')`.

The table's number lives in mono in the slab's figure slot, never as a numeral inside Helvetica
button text.

### ZONE D · THE DENSE ZONE — `YOU, TONIGHT`, 380 → 684

300 units holding six figures, four provenance tiles and three routes. This is also where the
ownership screens hang off, since they are not destinations.

- `<Rule l={0} t={380} w={420} color={ink(0.2)} />`
- `l=20 t=396` `<Mono size={7} tracking={0.3} color={ink(0.55)}>` `YOU, TONIGHT`
- `r=20 t=396` `<Mono size={7} tracking={0.12} color={ink(0.32)}>` `4,050 CR`
- `<Bust l={20} t={418} size={48} emoji="🐙" frame="bone" headStrip="ink" headStripAlpha={0.75} />`
- `l=80 t=422` `<Mono size={16} weight={700} tracking={0.18}>` `OKTA`
- `l=80 t=448` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `12,940 WATCHED · 4,812 PLAYED`
- `l=80 t=466` `<Mono size={8} tracking={0.14} color={ink(0.35)}>` `3 OF 5 FREE THROWS LEFT`
- `<Rule l={20} t={496} w={380} color={ink(0.1)} />`
- `l=20 t=510` eyebrow `EQUIPPED`; `r=20 t=510` `<Mono size={7} tracking={0.12} color={ink(0.32)}>` `3 OF 4 SLOTS`
- four tiles `w=62 h=62` at `t=540`, 96-unit pitch from `l=20` → 20 / 116 / 212 / 308, reused
  verbatim from `src/components/Provenance.tsx` so earned and purchased stay distinguishable at
  a glance: `<EarnedItem face="💀">`, `<PurchasedItem face="🔥" maker="M">`,
  `<EarnedItem face="👑">`, `<EmptySeat size={62} index="04">`. (EarnedItem draws its own ticks
  at t=531; PurchasedItem its own offset hairline.)
- `<Rule l={20} t={622} w={380} color={ink(0.1)} />`
- three route cells, `h=44` at `t=626`, spanning 20 → 400, **divided by two vertical rules, never
  boxed as cards**: `<Rule l={147} t={626} h={44} vertical color={ink(0.14)} />` and
  `<Rule l={274} t={626} h={44} vertical color={ink(0.14)} />`. Cells 20–147 / 147–274 / 274–400.
  Each `<Sans size={11} weight={500} color={ink(0.85)}>` centred, pressed `SURFACE.press`:
  `The record` → `/profile`, `Loadout` → `/loadout`, `The counter` → `/shop`.
- `<Rule l={0} t={684} w={420} color={ink(0.14)} />`

### ZONE E · the foot, 684 → 880 — near-empty again

- `<Rule l={0} t={700} w={420} color={ink(0.28)} />`
- `<RailStrip l={20} t={716} faces={CROWD.slice(0, 6)} more={5} moreSuffix=" MORE" size={22} weight={2} ruleWidth={380} youIndex={-1} />`
- `r=20 t=722` `<Mono size={8} tracking={0.14} color={ink(0.45)}>` `11 ON YOUR RAIL` — pressable,
  44-unit hit area, → `router.navigate('/friends')`
- `l=20 t=780 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT` /
  `CREDITS BUY OBJECTS, NEVER CHIPS`
- last ink ends ≈804. **76 units of empty ground to the canvas foot at 880** — the bar's reserve.

**Dense zone: D (380 → 684). Empty zone: B (56 → 300), and the foot again.** Amber: one clock
figure, ≈0.2% of the screen.

Figures this screen needs (add to `src/data/fixtures.ts` as `TONIGHT`): `peopleOn: 4`,
`railSize: 11`, `tables: 3`, `watching: 238`, `toAct: 'OKONKWO'`, `clockSeconds: 11`,
`sentence`, `credits: '4,050 CR'`, `watched: 12940`, `played: 4812`, `freeThrows: 3`,
`freeThrowCap: 5`, `slotsUsed: 3`, `slots: 4`, `railMore: 5`.

---

## 6. TABLES — `app/tables.tsx`, `<Screen height={976} mode="scroll">`

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

- `l=20 t=72` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `SORTED BY NOISE, NEVER BY STAKES`
- `l=20 t=90 w=376` `<Sans size={19} weight={500} tracking={-0.01} lh={1.28}>`
  **"The loudest room tonight is the one nobody is leaving."**
- `<Ticks l={20} t={152} w={126} h={8} pitch={9} color={ink(0.3)} />`
- `<Rule l={0} t={190} w={420} color={ink(0.2)} />`

### THE DENSE ZONE — the listings, 190 → 810

Six listings, **pitch 100**, tops `206 / 306 / 406 / 506 / 606 / 706`. Every listing is drawn
identically — it is a register, not a ranking. Per listing at top `T`:

- `l=20 t=T` `<Mono size={7} tracking={0.24} color={ink(0.5)}>` room eyebrow, carrying room,
  stakes and seats: `TABLE 12 · 2/5 NL · 2 SEATS`
- `l=20 t=T+16 w=248` `<Sans size={13} weight={500} lh={1.3}>` one sentence about the room, **no
  digits**
- the pot, right-ranged, the edition's anatomy: `<Box r={20} t={T+2} style={{ alignItems: 'flex-end', gap: 6 }}>`
  → `<Sans size={7} tracking={0.3} color={ink(0.4)}>POT</Sans>` +
  `<Mono size={30} weight={700} tracking={-0.04} lh={0.9}>` the figure. At 6 digits the block is
  ≈101 units and ends at x=400, clear of the sentence's 268 by 31.
- **the room's rail, drawn as a rail**:
  `<RailStrip l={20} t={T+58} faces={…3} more={…} size={22} weight={1} ruleColor={ink(0.28)} ruleWidth={380} youIndex={-1} />`
- `<ReactionMark r={20} t={T+64} count={watching} scale="agate" />` — amber, the crowd, legal
- `<Rule l={20} t={T+92} w={380} color={ink(0.1)} />` on the first five only
- the whole row is one `Pressable` at `l=0 t=T-6 w=420 h=92`, pressed `SURFACE.press`, →
  `router.push('/rail')`. **One target per listing.** You watch first; the seat is taken from
  the rail or the plan, which is the thesis and also keeps a mis-tap from seating you.

`<Rule l={0} t={810} w={420} color={ink(0.2)} />`

### FOOT, 810 → 976

- `<Box l={20} t={826} w={380} h={44} style={{ flexDirection: 'row' }}>` — two 190-unit cells,
  `borderWidth: 1`, `borderLeftWidth: 0` on the second, `borderColor: ink(0.35)`,
  `<Sans size={12} weight={500} color={ink(0.85)}>`: `Open a table` · `Private room`
- `l=20 t=884 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `EVERY ROOM IS PLAY CHIPS ONLY · SORTED BY NOISE, NEVER BY STAKES` /
  `CHIPS CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT`
- last ink ≈908. **68 units of empty ground to 976.**

Type range 7 → 30 = **4.3×**. Dense zone 190 → 810; empty zone 56 → 190 (three objects in 134
units) plus the foot.

Figures (`src/data/fixtures.ts`, `ROOMS`): six rooms, seeded from the existing `FLOOR.hero` and
`FLOOR.rest` so the two registers cannot disagree — table 12 / 2/5 NL / pot 7,890 / 238
watching, table 7 / 5/10 NL / 21,400 / 412, table 3 / 1/2 NL / 3,150 / 20, table 21 / 1/2 NL /
880 / 3, table 30 / 2/5 NL / opens at 2, plus one more room in the same voice. **`/floor` and
`/tables` read from the same array. A room that shows a different pot in the two registers is a
defect.**

---

## 7. FRIENDS — `app/friends.tsx`, `<Screen height={1000} mode="scroll">`

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
- `r=20 t=26` `<Mono size={8} tracking={0.14} color={ink(0.5)}>` `11 PEOPLE · 4 ON NOW`
- `<Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />`

### THE EMPTY ZONE, 56 → 250

- `l=20 t=78` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `WHO IS ON YOUR RAIL TONIGHT`
- **the hero** `l=20 t=96` `<Mono size={62} weight={700} tracking={-0.05} lh={0.9}>` `340`
  (≈102 units, ends x≈122)
- `l=134 t=118` `<Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>` two lines:
  `HANDS OF YOURS` / `SVEN HAS WATCHED`
- `l=20 t=180 w=340` `<Sans size={16} weight={500} tracking={-0.01} lh={1.3}>`
  **"Sven has watched you play more hands than anyone and has never taken a seat at your table."**

### THE RAIL, AS AN OBJECT, 250 → 330

- `<Rule l={20} t={258} w={380} weight={2} color={ink(0.42)} />`
- four named busts **hanging below the rule**, `size={36}` at `t={259}`, 46-unit pitch from
  `l=20` → 20 / 66 / 112 / 158; `frame="lit"` if seated, `frame="crowd" opacity={0.7}` if railing
- each one's room beneath it, `t=301`, same `l`, `<Mono size={7} tracking={0.12} color={ink(0.4)}>`:
  `TABLE 12` · `TABLE 7` · `ON RAIL 12` · `TABLE 3`
- the rest, smaller because they are further away: three busts `size={22}` at `t={266}`,
  `l=206 / 233 / 260`, `frame="crowd" opacity={0.55}`; then `l=288 t=272`
  `<Mono size={9} color={ink(0.35)}>` `+7`
- `<ReactionMark r={20} t={264} count={1240} scale="agate" />` — **the only amber on the screen**,
  legal because it is the crowd

### THE LEDGER — THE DENSE ZONE, 330 → 770

- `<Rule l={0} t={330} w={420} color={ink(0.2)} />`
- `l=20 t=346` `<Mono size={7} tracking={0.3} color={ink(0.55)}>` `THE LEDGER`
- `r=20 t=346` `<Mono size={7} tracking={0.12} color={ink(0.32)}>` `HANDS WATCHED TOGETHER`
- six rows, **pitch 66**, tops `370 / 436 / 502 / 568 / 634 / 700`. Per row at top `T`:
  - `<Bust l={20} t={T} size={28} emoji={face} frame={onNow ? 'lit' : 'rest'} opacity={onNow ? 1 : 0.7} />`
  - `l=58 t=T+2` `<Sans size={12} weight={500}>` the name
  - `l=58 t=T+20` `<Mono size={7.5} tracking={0.12} color={ink(0.4)}>` `RAILED YOU 340 · YOU RAILED 96`
  - `<Box r={20} t={T+2}>` `<Mono size={12} weight={500} color={ink(0.85)}>` the hands-watched-
    together figure
  - `<Ticks r={20} t={T+22} w={Math.min(96, Math.round(n / 8))} h={8} pitch={4} color={ink(0.3)} />`
    — the length is the figure; caps at 96 units (n ≥ 768)
  - `<Rule l={20} t={T+50} w={380} color={ink(0.1)} />` on the first five only
  - the row is one `Pressable l=0 t=T-6 w=420 h=62`, pressed `SURFACE.press` → `/rail` if that
    person is on a rail, `/profile` if they are not on now

### FOOT, 770 → 1000

- `<Rule l={0} t={770} w={420} color={ink(0.28)} />`
- `l=20 t=786` `<Mono size={7} tracking={0.3} color={ink(0.5)}>` `NOT YET ON YOUR RAIL`
- three busts `size={24} t={806}` at `l=20 / 50 / 80`, `frame="crowd" opacity={0.55}`
- `l=114 t=812` `<Mono size={8} tracking={0.14} color={ink(0.4)}>`
  `THEY HAVE SAT AT YOUR TABLE, NEVER ON YOUR RAIL` (≈278 units, ends 392)
- `<Box l={20} t={846} w={380} h={44}>` one cell, `borderWidth: 1`, `borderColor: ink(0.35)`,
  `paddingHorizontal: 12`, `justifyContent: 'space-between'`, pressed `SURFACE.press`:
  `<Sans size={12} weight={500} color={ink(0.85)}>Invite by handle</Sans>` +
  `<Mono size={9} tracking={0.1} color={ink(0.5)}>NOBODY CAN SEND CHIPS</Mono>`
- `l=20 t=906 w=380` `<Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>`
  `A RAIL IS PEOPLE, NOT A FOLLOWER COUNT` /
  `CHIPS CANNOT BE SENT, RECEIVED OR CASHED OUT`
- last ink ≈930. **70 units of empty ground to 1000.**

Type range 7 → 62 = **8.9×**. Dense zone 330 → 770; empty zone 56 → 250.

Figures (`src/data/fixtures.ts`, `PEOPLE`): eleven people drawn from `CAST` and `CROWD`, four on
now, each with `railedYou`, `youRailed`, `together`, and `where` (`TABLE 12` / `ON RAIL 12` /
`null`). Sven 340 / 96 / 436; Bea 210 / 388 / 598; Okonkwo 96 / 240 / 336; Tomás 180 / 74 / 254;
Priya 64 / 150 / 214; Derya 41 / 88 / 129.

---

## 8. SHARED COMPONENTS

Three new components. Nothing else is added, and **`Screen.tsx`, `Prim.tsx`, `Bust.tsx`,
`RailStrip.tsx`, `Reaction.tsx`, `Provenance.tsx` and `tokens.ts` are not modified.**

### `src/components/NavRail.tsx`

```ts
export const NAV_H = 58;          // design units of drawn band
export const NAV_NOTCH = 58;      // the gap, identical to the icon's and the boot mark's
export const NAV_RESERVE = 64;    // empty units every destination canvas must end with

export type NavRoute = '/' | '/tables' | '/feed' | '/friends';

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

### `src/components/Masthead.tsx`

Every new screen's top 56 units. Renders exactly what `/feed`, `/floor` and `/profile` already
hand-draw, so those three need no edit and cannot drift from it.

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

### `src/components/LeaveMark.tsx`

The nav's mark inverted. A notch subtracted says *you are here*; returning is a stub **added**.
No arrow, no chevron, no icon, no "<".

```ts
export function LeaveMark(props: {
  /** Mono 7 / .24 / ink(0.5), uppercase, at (20, ruleY + 8). Names what you are leaving. */
  label: string;
  /** The y of this screen's own top hairline. The 2px INK stub is drawn on it at l=20, w=16. */
  ruleY: number;
  /** Where router.replace() goes when there is no history (deep link, cold start). */
  fallback: '/' | '/tables' | '/feed' | '/friends';
}): React.ReactElement;
```

Hit target: `l=0, t=ruleY - 12, w=140, h=40`, `hitSlop={12}`, pressed `SURFACE.press`. Press
calls `router.back()` when `canGoBack()`, else `router.replace(fallback)`.

Per-screen values: `/table` `ruleY={CHROME.header.rule}` = 88, `LEAVE THE TABLE` (this replaces
`table.tsx`'s existing invisible 140×40 target at `(0, 40)` — relocate it to `(0, 76)`); `/rail`
`ruleY={44}`, `LEAVE THE RAIL`; `/clip` its own header rule, `CLOSE THE CLIP`; `/profile`
`ruleY={56}`, `LEAVE THE RECORD`; `/loadout` `LEAVE THE LOADOUT`; `/shop` `LEAVE THE COUNTER`.
`/floor` gets no LeaveMark — it has the register notch instead.

### `src/components/Boot.tsx`

```ts
export function Boot(props: {
  /** True once JetBrains Mono has resolved. The dwell will not end before it is true. */
  ready: boolean;
  /** Called after the handoff completes; the parent then unmounts Boot. */
  onDone: () => void;
}): React.ReactElement;
```

### `app/_layout.tsx` — the only edit to an existing shared file

```tsx
const [loaded] = useFonts({ /* unchanged */ });
const [booted, setBooted] = useState(false);
…
{loaded ? <Stack screenOptions={{ /* unchanged */ }} /> : null}
{booted ? <NavRail /> : null}
{booted ? null : <Boot ready={loaded} onDone={() => setBooted(true)} />}
```

`NavRail` after `Stack` so it paints over scrolling content; `Boot` last so it covers both.

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
- **No amber on navigation.** Not the notch, not a label, not a tick, not a mark. Amber is time
  (the clock, the cooldown) and expression (the crowd, a throw). On the whole shell it appears
  exactly twice: HOME's `0:06` and FRIENDS' single crowd mark.
- **No red dot, no unread badge, no "3 NEW" in the bar.** Ticks count what is live now.
- **No rounded corners, drop shadows, gradients, blur, translucency or frosted bars.** The bar is
  opaque `GROUND` with `Grain`, and it is the bottom edge of the app.
- **No cards.** Not a listing card, not a friend card, not a nested panel. Sections are divided
  by 1px and 2px rules, and the three route cells on HOME are divided by two vertical hairlines,
  not boxed.
- **No opacity fade as a press state, anywhere.** Press is `SURFACE.press` on a dark cell and
  `SURFACE.pressLight` on a bone slab.
- **No 14/16/20/24 type ramp.** Every screen in the shell holds ≥4× between its smallest and
  largest type: HOME 11.1×, FRIENDS 8.9×, TABLES 4.3×.
- **No numeral set in Helvetica.** Not in a headline, not in a sentence, not in button text.
  Figures live in the mono slot beside the Sans phrase — which is why the door reads
  "Walk in on Bea's table / 238 WATCHING" and not "Walk in on table 12".
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
