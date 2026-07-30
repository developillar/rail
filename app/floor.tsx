import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Masthead } from '@/components/AppShell';
import { Bust, EmptySeat } from '@/components/Bust';
import { Box, Mono, Rule, Sans } from '@/components/Prim';
import { RailStrip } from '@/components/RailStrip';
import { ReactionMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { CROWD, FLOOR } from '@/data/fixtures';
import { amber, chips, ink, INK, SURFACE } from '@/design/tokens';

/**
 * 7a — the floor.
 *
 * A lobby becomes a dashboard the moment stakes, players and waitlist turn into
 * sortable columns, so there are none: tables are *drawn*, using the same broken
 * hairline boundary and the same busts at their notches as the seated view, and
 * the sort order is noise — how many people are watching, never how much money
 * is on the felt. Your people's table gets the plan's full width; everything
 * else is the identical object at a third the size.
 *
 * INTEGRATION — the plan is not a room of its own, it is TABLES at a different
 * distance, so its masthead is the shared one and the way back is the register
 * pair rather than a mark: `LISTINGS · PLAN` with the 2px rule notched under the
 * half you are standing in. That is the nav's own device at masthead scale, which
 * is why this screen carries no LeaveMark and no bar — one screen with two ways
 * back would be two devices for one act, and the notch already says where you
 * are. `LISTINGS` returns to the register you came from, and replaces to
 * `/tables` on a cold start where there is nothing to go back to.
 */
export default function FloorScreen() {
  const router = useRouter();
  const hero = FLOOR.hero;

  return (
    <Screen height={900} mode="scroll">
      <Masthead
        title="THE FLOOR"
        meta={`${FLOOR.live} LIVE · ${chips(FLOOR.onRails)} ON RAILS`}
        register={{
          labels: ['LISTINGS', 'PLAN'],
          active: 1,
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace('/tables');
          },
        }}
      />

      <Box l={20} t={70}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          WHERE YOUR PEOPLE ARE
        </Mono>
      </Box>
      <Box l={20} t={88} w={376}>
        <Sans size={16} weight={500} tracking={-0.01} lh={1.3}>
          {FLOOR.headline}
        </Sans>
      </Box>

      {/* The same drawn table as the seated view, at plan scale. */}
      <Rule l={20} t={154} w={36} color={ink(0.3)} />
      <Rule l={104} t={154} w={196} color={ink(0.3)} />
      <Rule l={348} t={154} w={52} color={ink(0.3)} />
      <Rule l={20} t={284} w={36} color={ink(0.3)} />
      <Rule l={104} t={284} w={296} color={ink(0.3)} />
      <Rule l={20} t={154} h={42} vertical color={ink(0.3)} />
      <Rule l={20} t={240} h={44} vertical color={ink(0.3)} />
      <Rule l={400} t={154} h={42} vertical color={ink(0.3)} />
      <Rule l={400} t={240} h={44} vertical color={ink(0.3)} />

      <Bust l={60} t={136} size={36} emoji={hero.seats[0].face} frame="bone" />
      <Box l={104} t={140} style={{ gap: 4 }}>
        <Sans size={8} tracking={0.2}>
          {hero.seats[0].name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(hero.seats[0].stack)}
        </Mono>
      </Box>
      <Bust l={304} t={136} size={36} emoji={hero.seats[1].face} frame="rest" />
      <Box l={212} t={140} w={84} style={{ alignItems: 'flex-end', gap: 4, opacity: 0.7 }}>
        <Sans size={8} tracking={0.2}>
          {hero.seats[1].name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(hero.seats[1].stack)}
        </Mono>
      </Box>
      <Bust l={60} t={266} size={36} emoji={hero.seats[2].face} frame="rest" />
      <Box l={104} t={270} style={{ gap: 4, opacity: 0.7 }}>
        <Sans size={8} tracking={0.2}>
          {hero.seats[2].name}
        </Sans>
        <Mono size={12} weight={500}>
          {chips(hero.seats[2].stack)}
        </Mono>
      </Box>
      <EmptySeat l={2} t={200} size={36} index="01" />
      <Bust l={382} t={200} size={36} emoji={hero.seats[3].face} frame="crowd" opacity={0.65} />

      <Box l={0} t={188} w={420} style={{ alignItems: 'center', gap: 6 }}>
        <Sans size={7} tracking={0.3} color={ink(0.4)}>
          POT
        </Sans>
        <Mono size={30} weight={700} tracking={-0.04} lh={0.9}>
          {chips(hero.pot)}
        </Mono>
      </Box>
      <Box l={0} t={244} w={420} style={{ alignItems: 'center' }}>
        <Mono size={7} tracking={0.24} color={ink(0.35)}>
          TABLE {hero.table} · {hero.stakes} · {hero.street}
        </Mono>
      </Box>

      <RailStrip
        l={20}
        t={308}
        faces={CROWD.slice(0, hero.railShown)}
        more={hero.railMore}
        size={22}
        weight={2}
        ruleWidth={380}
        youIndex={-1}
      />
      <ReactionMark r={20} t={314} count={hero.watching} />

      <Box l={20} t={350} w={380} h={44} style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => router.push('/table')}
          accessibilityRole="button"
          accessibilityLabel={`Take seat 1 at table ${hero.table}, minimum buy-in ${chips(hero.minBuyIn)}`}
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
            Take seat 1
          </Sans>
          <Mono size={9} tracking={0.1} color={ink(0.6)}>
            MIN {chips(hero.minBuyIn)}
          </Mono>
        </Pressable>
        <Pressable
          onPress={() => router.push('/rail')}
          accessibilityRole="button"
          accessibilityLabel={`Just watch table ${hero.table} from the rail`}
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
            Just watch
          </Sans>
        </Pressable>
      </Box>

      <Rule l={0} t={420} w={420} color={ink(0.2)} />
      <Box l={20} t={434}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          THE REST OF THE FLOOR
        </Mono>
      </Box>
      <Box r={20} t={434}>
        <Mono size={7} tracking={0.1} color={ink(0.32)}>
          LOUDEST FIRST
        </Mono>
      </Box>

      {FLOOR.rest.map((room, i) => (
        <MiniTable
          key={room.table}
          l={i % 2 === 0 ? 20 : 222}
          t={i < 2 ? 462 : 612}
          room={room}
          onPress={() => router.push('/rail')}
        />
      ))}

      <Rule l={0} t={768} w={420} color={ink(0.2)} />
      <Box l={20} t={784} w={380} h={44} style={{ flexDirection: 'row' }}>
        {['Open a table', 'Private room'].map((label, i) => (
          // Drawn but not wired yet, and it says so to a screen reader rather
          // than presenting as a live control. Same treatment as /tables.
          <Pressable
            key={label}
            disabled
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: true }}
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
          </Pressable>
        ))}
      </Box>
      <Box l={20} t={848} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          SORTED BY NOISE, NOT STAKES · A TABLE WITH NO CROWD IS DRAWN AT 45%{'\n'}
          YOUR FRIENDS&apos; TABLE IS ALWAYS THE PLAN&apos;S FULL WIDTH
        </Mono>
      </Box>
    </Screen>
  );
}

/** The identical object at a third the size — the floor you walk. */
function MiniTable({
  room,
  onPress,
  l,
  t,
}: {
  room: (typeof FLOOR.rest)[number];
  onPress: () => void;
  l: number;
  t: number;
}) {
  const empty = room.watching === 0;
  const line = ink(empty ? 0.2 : room.opacity < 0.6 ? 0.24 : room.opacity < 0.9 ? 0.28 : 0.34);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Table ${room.table}, ${room.stakes}, ${room.watching} watching`}
      style={{ position: 'absolute', left: l, top: t, width: 178, height: 126, opacity: room.opacity }}
    >
      {empty ? (
        <>
          <Rule l={0} t={20} w={178} color={line} />
          <Rule l={0} t={96} w={178} color={line} />
        </>
      ) : (
        <>
          <Rule l={0} t={20} w={20} color={line} />
          <Rule l={56} t={20} w={122} color={line} />
          {room.faces.length > 1 ? (
            <>
              <Rule l={0} t={96} w={74} color={line} />
              <Rule l={110} t={96} w={68} color={line} />
            </>
          ) : (
            <Rule l={0} t={96} w={178} color={line} />
          )}
        </>
      )}
      <Rule l={0} t={20} h={76} vertical color={line} />
      <Rule l={177} t={20} h={76} vertical color={line} />

      {room.faces[0] ? <Bust l={26} t={8} size={24} emoji={room.faces[0]} frame="rest" /> : null}
      {room.faces[1] ? (
        <Bust l={80} t={84} size={24} emoji={room.faces[1]} frame="rest" />
      ) : 'openSlot' in room && room.openSlot ? (
        <EmptySeat l={80} t={84} size={24} index="05" />
      ) : null}

      <Box l={0} t={empty ? 50 : 44} w={178} style={{ alignItems: 'center' }}>
        <Mono
          size={empty ? 8 : 19}
          weight={empty ? 400 : 700}
          tracking={empty ? 0.24 : -0.03}
          color={empty ? ink(0.5) : room.opacity < 0.6 ? ink(0.75) : ink()}
        >
          {empty ? 'EMPTY' : chips(room.pot)}
        </Mono>
      </Box>
      <Box l={0} t={66} w={178} style={{ alignItems: 'center' }}>
        <Mono size={6.5} tracking={0.2} color={ink(empty ? 0.3 : 0.35)}>
          TABLE {room.table} · {room.stakes}
        </Mono>
      </Box>

      {empty ? null : <ReactionMark l={0} t={112} count={room.watching} scale="agate" />}
      <Box r={0} t={112}>
        <Mono size={7} tracking={0.1} color={ink(0.4)}>
          {room.seats}
        </Mono>
      </Box>
    </Pressable>
  );
}
