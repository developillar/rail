import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LeaveMark, Masthead } from '@/components/AppShell';
import { Bust } from '@/components/Bust';
import { Box, Mono, Rule, Sans } from '@/components/Prim';
import { EarnedItem, PurchasedItem } from '@/components/Provenance';
import { Screen } from '@/components/Screen';
import { RECORD } from '@/data/fixtures';
import { ink, SURFACE } from '@/design/tokens';

/**
 * 8a — the record.
 *
 * A profile in a poker app is normally a trophy case. This one is a record:
 * what you did, in the order it happened, with the rail counted as play — hands
 * *watched* sit in the same column as hands played, and "seated from the rail
 * 58 times" is a statistic. Earned and purchased get separate shelves, not
 * because purchased is shameful but because a shared shelf would let the two
 * classes borrow each other's meaning.
 *
 * INTEGRATION — the record's masthead was already the app's masthead to the
 * unit, so it is now drawn by the shared one and cannot drift from it, and the
 * mark that leaves hangs off the same 2px rule. This is a pushed screen: the bar
 * is not drawn over it, because the record is a thing you came here to read
 * rather than a room you stand in. The two rooms it does open — the loadout, and
 * the counter through it — are pressed from inside it and hand you back here.
 *
 * THE FIGURE. The record is the one screen that is entirely about figures, and it
 * used to set its largest one at mono 14 — six career rows at one size, with the
 * screen's thesis buried in the second of them. So the career figure that carries
 * the thesis is set once, large, in the app's own grammar (mono eyebrow, then the
 * numeral): HANDS WATCHED, not played, right-ranged in the identity band where
 * the ground was already empty. It is lifted out of the row list rather than
 * duplicated in it, so the list below now opens on HANDS PLAYED and the contrast
 * between the two is the argument. Nothing else moved.
 */
/** The career figure the record is an argument about. */
const THESIS = 'HANDS WATCHED';

export default function ProfileScreen() {
  const router = useRouter();
  const watched = RECORD.career.find(([label]) => label === THESIS)?.[1] ?? '';
  const rows = RECORD.career.filter(([label]) => label !== THESIS);

  return (
    <Screen height={870} mode="scroll">
      <Masthead title="THE RECORD" meta={RECORD.handle} />
      <LeaveMark label="LEAVE THE RECORD" ruleY={56} fallback="/home" />

      {/*
        The identity block starts at 84, not 74: LeaveMark sets its label at
        ruleY + 8 — 64 to 71 — and a bust's head strip is cut nine units *above*
        its own top edge, so a bust at 74 draws bone ticks straight through that
        label. 84 is the clearance /loadout already uses for its first tile.
      */}
      <Bust l={20} t={84} size={72} emoji={RECORD.face} frame="bone" headStrip="ink" headStripAlpha={0.75} />
      <Box l={106} t={90}>
        <Mono size={18} weight={700} tracking={0.18}>
          {RECORD.handle}
        </Mono>
      </Box>
      <Box l={106} t={118}>
        <Mono size={8} tracking={0.14} color={ink(0.5)}>
          {RECORD.sessions} SESSIONS · {RECORD.hoursOnRail} H ON THE RAIL
        </Mono>
      </Box>
      <Box l={106} t={136}>
        <Mono size={8} tracking={0.14} color={ink(0.35)}>
          SEATED FROM THE RAIL {RECORD.seatedFromRail} TIMES
        </Mono>
      </Box>

      {/* The screen's one large figure, in the empty ground right of the identity
          block: the agate lines beside it end at x≈284 and this ranges from 400. */}
      <Box r={20} t={112}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          {THESIS}
        </Mono>
      </Box>
      <Box r={20} t={126}>
        <Mono size={30} weight={700} tracking={-0.04} lh={0.9}>
          {watched}
        </Mono>
      </Box>

      <Box l={20} t={170} w={376}>
        <Sans size={16} weight={500} tracking={-0.01} lh={1.32}>
          {RECORD.line}
        </Sans>
      </Box>

      <Rule l={0} t={230} w={420} color={ink(0.2)} />
      <Box l={20} t={244}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          CAREER
        </Mono>
      </Box>
      <Box r={20} t={244}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          SINCE MAR
        </Mono>
      </Box>

      {/* The dense zone: the rest of the career at one size, hands played first,
          so the figure above is the thing it is measured against. */}
      {rows.map(([label, value], i) => (
        <View key={label}>
          <Box l={20} t={271 + i * 28}>
            <Mono size={8} tracking={0.14} color={ink(0.45)}>
              {label}
            </Mono>
          </Box>
          <Box r={20} t={266 + i * 28}>
            <Mono size={14} weight={500}>
              {value}
            </Mono>
          </Box>
          {i < rows.length - 1 ? <Rule l={20} t={288 + i * 28} w={380} color={ink(0.1)} /> : null}
        </View>
      ))}

      <Rule l={0} t={436} w={420} color={ink(0.2)} />
      <Box l={20} t={450}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          EARNED · {RECORD.earnedCount}
        </Mono>
      </Box>
      <Box r={20} t={450}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          STRUCK FROM PLAY · NEVER FOR SALE
        </Mono>
      </Box>

      {RECORD.earned.map((item, i) => (
        <View key={item.name}>
          <EarnedItem l={20 + i * 131} t={482} w={118} h={96} face={item.face} label={item.name} />
          <Box l={20 + i * 131} t={588} w={118}>
            <Mono size={6.5} tracking={0.08} color={ink(0.45)} lh={1.65}>
              {item.from}
            </Mono>
          </Box>
        </View>
      ))}

      <Rule l={0} t={624} w={420} color={ink(0.2)} />
      <Box l={20} t={638}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          PURCHASED · {RECORD.purchasedCount}
        </Mono>
      </Box>
      <Box r={20} t={638}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          MAKER&apos;S MARK · NO PROVENANCE
        </Mono>
      </Box>

      {RECORD.purchased.map((item, i) => (
        <View key={item.name}>
          <PurchasedItem
            l={20 + i * 131}
            t={674}
            w={118}
            h={96}
            face={item.face ?? undefined}
            glyph={'glyph' in item ? (item.glyph as string) : undefined}
            label={item.name}
            maker={item.maker}
          />
          <Box l={20 + i * 131} t={780} w={118}>
            <Mono size={6.5} tracking={0.08} color={ink(0.35)} lh={1.65}>
              {item.edition}
              {'\n'}
              {item.price}
            </Mono>
          </Box>
        </View>
      ))}

      <Rule l={0} t={816} w={420} color={ink(0.14)} />
      <Box l={20} t={830} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          EVERY EARNED ITEM CARRIES THE HAND IT CAME FROM · PURCHASED ONES CARRY AN EDITION{'\n'}
          NO ITEM ON EITHER SHELF CHANGES A CARD, A BET, OR A CLOCK
        </Mono>
      </Box>

      {/* The way to the loadout. Helvetica sentence-case, because that is what a
          press is in this app — the mono cells on /loadout are its controls, not
          its routes, and the spec's route map names this one `Change loadout`. */}
      <Pressable
        onPress={() => router.push('/loadout')}
        accessibilityRole="button"
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          top: 74,
          width: 112,
          height: 28,
          borderWidth: 1,
          borderColor: ink(0.35),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Sans size={11} weight={500} color={ink(0.85)}>
          Change loadout
        </Sans>
      </Pressable>
    </Screen>
  );
}
