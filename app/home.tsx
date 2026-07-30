import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Masthead } from '@/components/AppShell';
import { Bust, EmptySeat } from '@/components/Bust';
import { Box, Mono, Rule, Sans } from '@/components/Prim';
import { EarnedItem, PurchasedItem } from '@/components/Provenance';
import { RailStrip } from '@/components/RailStrip';
import { Screen } from '@/components/Screen';
import { LOADOUT, RECORD } from '@/data/fixtures';
import { CONSTRAINT, HOME_NOW, RAIL_ROSTER, UNREAD_EDITION } from '@/data/social';
import { useCountdown } from '@/state/meters';
import { amber, chips, ink, INK, SURFACE } from '@/design/tokens';

/**
 * §5 — HOME.
 *
 * The door, not the dashboard. It answers one question — are my people playing,
 * and do I walk in — with one numeral, one sentence and one press, then tells you
 * where you stand. It reports nothing TABLES, FEED or FRIENDS reports and it is
 * never a list: the moment the hero grows a roster it has eaten FRIENDS, and the
 * moment it grows a second room it has eaten TABLES. So the top of the screen is
 * people and the clock they are playing against, and the only place figures pile
 * up is the one zone that is about you.
 *
 * DENSITY, named. Dense zone: D, `YOU, TONIGHT` (380 → 684) — six figures, three
 * provenance tiles with the dashed empty fourth, and three routes in 300 units. Empty zone: B (56 → 300) —
 * 244 units carrying five objects, and the foot (684 → 880) again, which ends on
 * 76 units of nothing. If B looks too empty it is right.
 *
 * ONE LARGE NUMERAL, defended: the hero is `4` — how many of your people are at
 * a table right now. It is the only figure on the screen that decides anything
 * (walk in, or don't), it is a count of *people* rather than of your own
 * performance, and it is the one number that is worthless five minutes from now,
 * which is why it is set at 78 and your career totals are set at 8. Every other
 * candidate was rejected as a statistic: a chip stack is a scoreboard, hands
 * played is the record's job, and a pot belongs to the room that is building it.
 *
 * ReactionMark is deliberately not drawn here. §5 and §9 fix HOME's amber at
 * exactly one figure — the clock — and specify the crowd at the door as a mono
 * figure in the slab's figure slot (`238 WATCHING`), so a second amber crowd
 * mark on this screen would be a defect rather than a reuse.
 *
 * The throw allowance is the same quantity /rail paints amber, and it is bone
 * here on purpose: amber marks an allowance at the moment you can spend it —
 * on the rail it sits under the tray, live, beside its reset clock. Recalled
 * here it is a statistic about you in a block of statistics, and a statistic
 * that borrows the signal colour is how an accent stops meaning anything.
 */

/** The record's own figures, read from the record so the two cannot disagree. */
const career = (label: string) => RECORD.career.find(([k]) => k === label)?.[1] ?? '';

/**
 * Your rail is your roster, and only your roster. It is read from `RAIL_ROSTER`
 * rather than from `CROWD` — `CROWD` is table 12's anonymous crowd and two of its
 * faces are pending requests, i.e. people explicitly *not* on your rail, so drawing
 * it under `N ON YOUR RAIL` counted strangers as yours. The count, the faces and
 * the remainder now come from one array, so they cannot contradict each other.
 */
const RAIL_SIZE = RAIL_ROSTER.length;
const RAIL_FACES = RAIL_ROSTER.slice(0, HOME_NOW.railShown).map((p) => p.face);
const RAIL_MORE = RAIL_SIZE - RAIL_FACES.length;

/** The ownership screens hang off zone D: they are pushed screens, not destinations. */
const OWN: { label: string; route: string; l: number; w: number }[] = [
  { label: 'The record', route: '/profile', l: 20, w: 127 },
  { label: 'Loadout', route: '/loadout', l: 147, w: 127 },
  { label: 'The counter', route: '/shop', l: 274, w: 126 },
];

export default function HomeScreen() {
  const router = useRouter();

  // A declared meter: it runs on elapsed time, not on the ladder, because a clock
  // cannot lie. No track and no fill bar — a running meter anywhere but the table
  // would cheapen the table's own clock. It loops (the fourth argument), because a
  // clock that counted to 0:00 and then froze there for the rest of the session,
  // under a line still saying somebody is to act, was the one lie on the screen.
  const { remaining } = useCountdown(HOME_NOW.clockSeconds, true, undefined, true);
  const clock = `0:${String(Math.ceil(remaining)).padStart(2, '0')}`;

  return (
    <Screen height={880} mode="scroll">
      {/* ZONE A · masthead, 0 → 56. The component owns it — the wordmark, the agate
          meta and the 2px rule are one object, and HOME is not allowed to be the
          screen that drifts from it. No second register: HOME has one. */}
      <Masthead
        title="RAIL"
        meta={`${HOME_NOW.roomsLive} TABLES LIVE · ${chips(HOME_NOW.onRails)} ON RAILS`}
      />

      {/* ZONE B · THE EMPTY ZONE, 56 → 300. Five objects in 244 units. The eyebrow
          sits 14 under the rule above it, which is the house offset everywhere. */}
      <Box l={20} t={70}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          YOUR PEOPLE, AT TABLES, RIGHT NOW
        </Mono>
      </Box>
      <Box l={20} t={96}>
        <Mono size={78} weight={700} tracking={-0.05} lh={0.9}>
          {HOME_NOW.atTables}
        </Mono>
      </Box>
      <Box l={80} t={118}>
        <Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>
          OF {RAIL_SIZE} ON YOUR RAIL{'\n'}
          ACROSS {HOME_NOW.tablesLive} TABLES
        </Mono>
      </Box>

      {/* The one headline, in the rail's voice. No digit ever enters a Helvetica
          sentence on this screen — the figures beside it carry them. */}
      <Box l={20} t={208} w={340}>
        <Sans size={17} weight={500} tracking={-0.01} lh={1.3}>
          {HOME_NOW.sentence}
        </Sans>
      </Box>

      {/* The only amber on HOME, right-ranged above the door: amber is time, and
          this is a clock. ≈0.2% of the screen. */}
      <Box r={20} t={256}>
        <Mono size={7} tracking={0.24} color={ink(0.4)}>
          {HOME_NOW.toAct} TO ACT
        </Mono>
      </Box>
      <Box r={20} t={270}>
        <Mono size={13} weight={700} color={amber()}>
          {clock}
        </Mono>
      </Box>

      {/* ZONE C · the decision, 300 → 344. The floor's paired slab, reused exactly
          — one button object at one size: 44 tall with both halves' labels at Sans
          12, as on /floor and /feed. Watching first, because watching is the thesis;
          the table's number stays in the mono figure slot and never inside Helvetica
          button text. */}
      <Box l={20} t={300} w={380} h={44} style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => router.push('/rail')}
          accessibilityRole="button"
          style={({ pressed }) => ({
            width: 240,
            height: 44,
            borderWidth: 1,
            borderColor: INK,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={12} weight={500}>
            {HOME_NOW.door.label}
          </Sans>
          <Mono size={9} tracking={0.1} color={ink(0.6)}>
            {chips(HOME_NOW.door.watching)} WATCHING
          </Mono>
        </Pressable>
        <Pressable
          onPress={() => router.push('/table')}
          accessibilityRole="button"
          style={({ pressed }) => ({
            width: 140,
            height: 44,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderColor: ink(0.3),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={12} weight={500} color={ink(0.8)}>
            Take a seat
          </Sans>
        </Pressable>
      </Box>

      {/* The edition, named and dated and nothing else — HOME never draws an
          unread count, so this is a route in the seam between the decision and
          your record, not a report of what FEED already reports. The 28-unit fill
          stays inside the seam between the slab's foot at 344 and the rule at 380,
          so it can never cross a rule or clip the slab above it; hitSlop does the
          reaching, exactly as LeaveMark's does. */}
      <Pressable
        onPress={() => router.navigate('/feed')}
        accessibilityRole="button"
        hitSlop={10}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 0,
          top: 352,
          // 250, not 200: the line is 35 mono-8 characters at .14 tracking —
          // about 207 units — and a 200-unit cell wrapped it, orphaning the date
          // on a second line that a flex-end container then ranged left.
          width: 250,
          height: 28,
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingRight: 20,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Mono size={8} tracking={0.14} color={ink(0.45)}>
          TONIGHT&apos;S EDITION · ED {UNREAD_EDITION.number} · {UNREAD_EDITION.date}
        </Mono>
      </Pressable>

      {/* ZONE D · THE DENSE ZONE — YOU, TONIGHT, 380 → 684. */}
      <Rule l={0} t={380} w={420} color={ink(0.2)} />
      <Box l={20} t={394}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          YOU, TONIGHT
        </Mono>
      </Box>
      <Box r={20} t={394}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          {HOME_NOW.credits}
        </Mono>
      </Box>

      <Bust
        l={20}
        t={418}
        size={48}
        emoji={HOME_NOW.face}
        frame="bone"
        headStrip="ink"
        headStripAlpha={0.75}
      />
      <Box l={80} t={422}>
        <Mono size={16} weight={700} tracking={0.18}>
          {HOME_NOW.handle}
        </Mono>
      </Box>
      {/* Hands watched is set first, and in the same size as hands played. */}
      <Box l={80} t={448}>
        <Mono size={8} tracking={0.14} color={ink(0.5)}>
          {career('HANDS WATCHED')} WATCHED · {career('HANDS PLAYED')} PLAYED
        </Mono>
      </Box>
      <Box l={80} t={466}>
        <Mono size={8} tracking={0.14} color={ink(0.35)}>
          {HOME_NOW.freeThrows} OF {HOME_NOW.freeThrowCap} FREE THROWS LEFT
        </Mono>
      </Box>

      <Rule l={20} t={496} w={380} color={ink(0.1)} />
      <Box l={20} t={510}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          EQUIPPED
        </Mono>
      </Box>
      <Box r={20} t={510}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          {HOME_NOW.slotsUsed} OF {HOME_NOW.slots} SLOTS
        </Mono>
      </Box>

      {/* Three equipped tiles and the dashed empty fourth slot, on a 96-unit pitch,
          from the loadout's own slots so earned and purchased stay distinguishable at
          a glance and cannot drift from /loadout. Earned wears the measurement ticks;
          purchased wears its maker's mark. */}
      {LOADOUT.slots.map((slot, i) =>
        slot.origin === 'EARNED' ? (
          <EarnedItem key={slot.title} l={20 + i * 96} t={540} w={62} h={62} face={slot.face} />
        ) : (
          <PurchasedItem
            key={slot.title}
            l={20 + i * 96}
            t={540}
            w={62}
            h={62}
            face={slot.face}
            maker={slot.maker}
          />
        ),
      )}
      <EmptySeat l={308} t={540} size={62} index={LOADOUT.emptySlot.index} />

      {/* Three routes, divided by two vertical hairlines — never boxed as cards. */}
      <Rule l={20} t={622} w={380} color={ink(0.1)} />
      {OWN.map((cell) => (
        <Pressable
          key={cell.route}
          onPress={() => router.push(cell.route)}
          accessibilityRole="button"
          style={({ pressed }) => ({
            position: 'absolute',
            left: cell.l,
            top: 626,
            width: cell.w,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={11} weight={500} color={ink(0.85)}>
            {cell.label}
          </Sans>
        </Pressable>
      ))}
      <Rule l={147} t={626} h={44} vertical color={ink(0.14)} />
      <Rule l={274} t={626} h={44} vertical color={ink(0.14)} />
      <Rule l={0} t={684} w={420} color={ink(0.14)} />

      {/* ZONE E · the foot, 684 → 880 — near-empty again. The rail as the object
          it is: ONE rule with your people hanging off it — the strip's own 2px line,
          which is why the zone opens on the 684 rule and nothing is drawn at 700.
          The count beside it is the way through to them. */}
      <RailStrip
        l={20}
        t={716}
        faces={RAIL_FACES}
        more={RAIL_MORE}
        moreSuffix=" MORE"
        size={22}
        weight={2}
        ruleWidth={380}
        youIndex={-1}
      />
      {/* The count is the way through to the people on the rule. It is drawn last
          so the rail strip cannot swallow the tap, and its fill begins one unit
          under the 2px rail so a press never breaks the line. */}
      <Pressable
        onPress={() => router.navigate('/friends')}
        accessibilityRole="button"
        hitSlop={12}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 0,
          top: 719,
          width: 160,
          height: 29,
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          paddingTop: 3,
          paddingRight: 20,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Mono size={8} tracking={0.14} color={ink(0.45)}>
          {RAIL_SIZE} ON YOUR RAIL
        </Mono>
      </Pressable>

      <Box l={20} t={780} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          {CONSTRAINT.home[0]}
          {'\n'}
          {CONSTRAINT.home[1]}
        </Mono>
      </Box>
      {/* Last ink ends ≈804: 76 units of empty ground to the canvas foot at 880,
          which is the rail's reserve. */}
    </Screen>
  );
}
