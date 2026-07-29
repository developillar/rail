import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
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
 */
export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Screen height={870} mode="scroll">
      <Box l={20} t={20}>
        <Mono size={20} weight={700} tracking={0.26}>
          THE RECORD
        </Mono>
      </Box>
      <Box r={20} t={26}>
        <Mono size={8} tracking={0.12} color={ink(0.5)}>
          {RECORD.handle}
        </Mono>
      </Box>
      <Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />

      <Bust l={20} t={74} size={72} emoji={RECORD.face} frame="bone" headStrip="ink" headStripAlpha={0.75} />
      <Box l={106} t={80}>
        <Mono size={18} weight={700} tracking={0.18}>
          {RECORD.handle}
        </Mono>
      </Box>
      <Box l={106} t={108}>
        <Mono size={8} tracking={0.14} color={ink(0.5)}>
          {RECORD.sessions} SESSIONS · {RECORD.hoursOnRail} H ON THE RAIL
        </Mono>
      </Box>
      <Box l={106} t={126}>
        <Mono size={8} tracking={0.14} color={ink(0.35)}>
          SEATED FROM THE RAIL {RECORD.seatedFromRail} TIMES
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
        <Mono size={7} tracking={0.12} color={ink(0.3)}>
          SINCE MAR
        </Mono>
      </Box>

      {RECORD.career.map(([label, value], i) => (
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
          {i < RECORD.career.length - 1 ? (
            <Rule l={20} t={288 + i * 28} w={380} color={ink(0.1)} />
          ) : null}
        </View>
      ))}

      <Rule l={0} t={436} w={420} color={ink(0.2)} />
      <Box l={20} t={450}>
        <Mono size={7} tracking={0.3} color={ink(0.6)}>
          EARNED · {RECORD.earnedCount}
        </Mono>
      </Box>
      <Box r={20} t={450}>
        <Mono size={7} tracking={0.12} color={ink(0.35)}>
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
        <Mono size={7} tracking={0.3} color={ink(0.6)}>
          PURCHASED · {RECORD.purchasedCount}
        </Mono>
      </Box>
      <Box r={20} t={638}>
        <Mono size={7} tracking={0.12} color={ink(0.35)}>
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
        <Mono size={7} tracking={0.1} color={ink(0.4)} lh={1.7}>
          EVERY EARNED ITEM CARRIES THE HAND IT CAME FROM · PURCHASED ONES CARRY AN EDITION{'\n'}
          NO ITEM ON EITHER SHELF CHANGES A CARD, A BET, OR A CLOCK
        </Mono>
      </Box>

      <Pressable
        onPress={() => router.push('/loadout')}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          top: 74,
          width: 84,
          height: 28,
          borderWidth: 1,
          borderColor: ink(0.35),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Mono size={7} tracking={0.16} color={ink(0.8)}>
          LOADOUT
        </Mono>
      </Pressable>
    </Screen>
  );
}
