import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Masthead } from '@/components/AppShell';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { RailStrip } from '@/components/RailStrip';
import { ReactionMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { CONSTRAINT, ROOMS, TABLES_META, type LiveRoom, type NoiseBand } from '@/data/social';
import { amber, chips, ink, INK, SURFACE } from '@/design/tokens';

/**
 * §6 — TABLES, 7b's register.
 *
 * The same six rooms `/floor` draws as a plan, drawn here as a document: one
 * listing per room, one sentence as the primary object, one pot as the only
 * large numeral in it. A lobby becomes a dashboard the moment stakes, players
 * and waitlist turn into sortable columns, so there are none — the stake is a
 * mono agate term in the room's eyebrow beside its number, the seats are
 * *stated* in the listing's corner rather than drawn as holes, and the sort key
 * is noise. That claim is made once, in agate, at the head of the register
 * (`SORTED BY NOISE, NEVER BY STAKES`); the foot's second appearance of the
 * phrase is the standing statement of fact every destination carries, in the
 * same breath as the play-chips constraint, not a second claim about the sort.
 *
 * NOISE IS THE SORT ORDER, in the code as well as in the copy: the listings are
 * sorted here by `watching`, descending, rather than trusting the order the
 * fixture happens to be written in.
 *
 * 7c's TONE BANDS govern the weight of every entry, exactly as `/floor`'s
 * MiniTable already applies them — one band per room, four channels each:
 * the listing's opacity, the thickness and ink of the room's own rail rule, how
 * many busts hang off it, and the density of the crowd mark (`ReactionMark`
 * counts 2–39 one tick each and masses 40+ into one bar, so the mark's length
 * *is* the crowd). A loud room is a 2px rail with three busts at full ink; a
 * quiet one is a hairline at 22% with one; the dark room is a bare line.
 *
 * THE EMPTY ROOM gets the only honest call to action in a lobby. Table 30 is not
 * dealing, so it has no pot to print and no crowd to mark — and where the crowd
 * would hang off its rail, a press hangs instead: `Sit first`, at full ink
 * inside its dimmed listing, with the buy-in in the mono figure slot. It is the
 * one place in the register where you take the seat rather than the rail, and it
 * is drawn as a sibling of the listing rather than a child so the room's 45% tone
 * band cannot dim the one thing on it that is worth pressing.
 *
 * DENSITY, named. Dense zone: the listings, 190 → 866 — six rooms, six pots,
 * six rails and thirty-odd figures. Empty zone: 56 → 190, three objects in 134
 * units, and the foot again, which ends on 68 units of nothing (the rail's
 * reserve). Type range 7 → 30 = 4.3×. Amber appears only as the crowd mark of a
 * room that has one, under 1% of the screen.
 *
 * ONE DEVIATION FROM THE SPEC'S NUMBERS, and it is why the canvas is 1032 rather
 * than 976: §6 budgets a listing at pitch 100, which holds two lines of Sans 13
 * in 248 units. Every sentence in `src/data/social.ts` runs to three (the
 * shortest is 77 characters, the longest 101), so at pitch 100 the third line
 * would be struck through by the room's own rail. Clipping written copy and
 * shrinking the register's primary object are both worse than a taller document
 * on a screen that scrolls, so the pitch is 110 and every other value — the
 * masthead, the empty zone, the anatomy of a listing, the foot, the 68-unit
 * reserve — is the spec's.
 */

/** The first listing's eyebrow, the pitch between listings, and the row's rect. */
const HEAD = 206;
const PITCH = 110;
const ROW_H = 102;
/** The rule that closes the register. */
const FOOT = 866;

/**
 * 7c's four tone bands. The same four steps `FLOOR.rest` carries, applied to the
 * four channels a listing has: its ink, its rail's weight and colour, the number
 * of busts on that rail, and the ink of its pot. Nothing here is a ranking — the
 * loudest room is not drawn *bigger*, it is drawn *louder*.
 *
 * `faces` never truncates the fixture: the rooms in each band carry at most that
 * many rail faces already, so the `+N MORE` remainder can never contradict the
 * strip it sits on.
 */
const BAND: Record<
  NoiseBand,
  { opacity: number; railWeight: number; railInk: string; faces: number; pot: string }
> = {
  LOUD: { opacity: 1, railWeight: 2, railInk: ink(0.42), faces: 3, pot: ink() },
  WARM: { opacity: 0.8, railWeight: 1, railInk: ink(0.3), faces: 2, pot: ink() },
  QUIET: { opacity: 0.55, railWeight: 1, railInk: ink(0.22), faces: 1, pot: ink(0.75) },
  EMPTY: { opacity: 0.45, railWeight: 1, railInk: ink(0.16), faces: 0, pot: ink(0.5) },
};

export default function TablesScreen() {
  const router = useRouter();

  // Loudest first, and sorted on the figure that says so.
  const rooms = [...ROOMS].sort((a, b) => b.watching - a.watching);
  const darkIndex = rooms.findIndex((room) => room.band === 'EMPTY');
  const dark = darkIndex < 0 ? null : rooms[darkIndex];

  return (
    <Screen height={1032} mode="scroll">
      {/*
        The masthead carries the register switch, and it is the nav's own device
        at a second scale: two mono words with the 2px rule notched under the one
        you are standing in. No segmented control, no pill, no toggle — the plan
        is the same destination at a different distance, so the notch says so.
      */}
      <Masthead
        title="TABLES"
        meta={`${TABLES_META.live} LIVE · ${chips(TABLES_META.onRails)} ON RAILS`}
        register={{
          labels: ['LISTINGS', 'PLAN'],
          active: 0,
          onPress: () => router.push('/floor'),
        }}
      />

      {/* THE EMPTY ZONE, 56 → 190. Three objects in 134 units. */}
      <Box l={20} t={72}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          {TABLES_META.eyebrow}
        </Mono>
      </Box>
      <Box l={20} t={90} w={376}>
        <Sans size={19} weight={500} tracking={-0.01} lh={1.28}>
          {TABLES_META.headline}
        </Sans>
      </Box>
      <Ticks l={20} t={152} w={126} h={8} pitch={9} color={ink(0.3)} />
      <Rule l={0} t={190} w={420} color={ink(0.2)} />

      {/* THE DENSE ZONE — the register, 190 → 866. Every listing drawn identically. */}
      {rooms.map((room, i) => (
        <Listing
          key={room.table}
          room={room}
          t={HEAD + i * PITCH}
          divider={i < rooms.length - 1}
          onOpen={() => router.push('/rail')}
        />
      ))}

      {/*
        The dark room's seat, hanging off its bare rail where the crowd would be.
        A sibling of the listing, at full ink: the only call to action in the
        register, and the only press in it that seats you.
      */}
      {dark ? (
        <Pressable
          onPress={() => router.push('/table')}
          accessibilityRole="button"
          accessibilityLabel={`Sit first at table ${dark.table}`}
          style={({ pressed }) => ({
            position: 'absolute',
            right: 20,
            top: HEAD + darkIndex * PITCH + 76,
            width: 150,
            height: 26,
            borderWidth: 1,
            borderColor: INK,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={12} weight={500}>
            Sit first
          </Sans>
          <Mono size={8} tracking={0.1} color={ink(0.6)}>
            MIN {chips(dark.minBuyIn)}
          </Mono>
        </Pressable>
      ) : null}

      <Rule l={0} t={FOOT} w={420} color={ink(0.2)} />

      {/* THE FOOT, 866 → 1032. Two cells divided by their own hairline, never boxed. */}
      <Box l={20} t={FOOT + 16} w={380} h={44} style={{ flexDirection: 'row' }}>
        {[TABLES_META.openLabel, TABLES_META.privateLabel].map((label, i) => (
          <View
            key={label}
            style={{
              width: 190,
              height: 44,
              borderWidth: 1,
              borderLeftWidth: i === 1 ? 0 : 1,
              borderColor: ink(0.35),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sans size={12} weight={500} color={ink(0.85)}>
              {label}
            </Sans>
          </View>
        ))}
      </Box>
      <Box l={20} t={FOOT + 74} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          {CONSTRAINT.tables[0]}
          {'\n'}
          {CONSTRAINT.tables[1]}
        </Mono>
      </Box>
    </Screen>
  );
}

/**
 * One room, one sentence, one pot. The whole row is a single target — you watch
 * first, and the seat is taken from the rail or the plan, which is the thesis and
 * also keeps a mis-tap from seating you.
 *
 * Coordinates inside are relative to the row's own rect, which starts six units
 * above the eyebrow.
 */
function Listing({
  room,
  t,
  divider,
  onOpen,
}: {
  room: LiveRoom;
  t: number;
  divider: boolean;
  onOpen: () => void;
}) {
  const band = BAND[room.band];
  const dark = room.band === 'EMPTY';

  return (
    <>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Table ${room.table}, ${room.stakes}, ${chips(room.watching)} watching`}
        style={({ pressed }) => ({
          position: 'absolute',
          left: 0,
          top: t - 6,
          width: 420,
          height: ROW_H,
          opacity: band.opacity,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        {/* The room, its stake and its open seats, all three in agate: a stake is
            a term in a sentence about a room, never a column you sort by, and an
            open seat is stated in the corner rather than drawn as a hole. */}
        <Box l={20} t={6}>
          <Mono size={7} tracking={0.24} color={ink(0.5)}>
            TABLE {room.table} · {room.stakes} · {room.seatsLabel}
          </Mono>
        </Box>

        {/* The primary object. No digit ever enters it. */}
        <Box l={20} t={21} w={248}>
          <Sans size={13} weight={500} lh={1.3}>
            {room.sentence}
          </Sans>
        </Box>

        {/* The edition's anatomy: a label, then the only large numeral in the
            entry. A room that is not dealing has no pot, and says so. */}
        {dark ? (
          <Box r={20} t={12}>
            <Mono size={7} tracking={0.3} color={ink(0.45)}>
              NO POT YET
            </Mono>
          </Box>
        ) : (
          <Box r={20} t={8} style={{ alignItems: 'flex-end', gap: 6 }}>
            <Sans size={7} tracking={0.3} color={ink(0.4)}>
              POT
            </Sans>
            <Mono size={30} weight={700} tracking={-0.04} lh={0.9} color={band.pot}>
              {chips(room.pot)}
            </Mono>
          </Box>
        )}

        {/* The room's rail, drawn as a rail — the crowd hangs below the line,
            because a railbird is outside it. Weight, ink and bust count are the
            room's tone band. */}
        <RailStrip
          l={20}
          t={80}
          faces={room.railFaces.slice(0, band.faces)}
          more={band.faces === 0 ? 0 : room.railMore}
          moreSuffix=" MORE"
          size={22}
          weight={band.railWeight}
          ruleColor={band.railInk}
          ruleWidth={380}
          youIndex={-1}
        />

        {/* The crowd, in the app's one accent — legal because it is expression.
            Its length is the count; a room with nobody in it draws none. */}
        {room.watching === 0 ? null : (
          <ReactionMark
            r={20}
            t={86}
            count={room.watching}
            scale="agate"
            color={room.watching < 4 ? amber(0.8) : amber()}
          />
        )}
      </Pressable>

      {divider ? <Rule l={20} t={t + 102} w={380} color={ink(0.1)} /> : null}
    </>
  );
}
