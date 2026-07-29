import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bust } from '@/components/Bust';
import { Board, PlayingCard } from '@/components/Card';
import { Box, Mono, Rule, Sans } from '@/components/Prim';
import { ReactionMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { CAST, CROWD, EDITION } from '@/data/fixtures';
import { chips, ink, INK, SURFACE } from '@/design/tokens';

/**
 * 6a — the edition.
 *
 * A dashboard reports; an edition decides. So: a masthead, a dated edition
 * number, one lead hand set in a real headline with a verdict in it, and
 * everything else demoted to agate under section rules. Hierarchy carries the
 * judgement, not engagement counters — reaction counts sit below the fold of
 * each item, never above a headline.
 */
export default function FeedScreen() {
  const router = useRouter();
  const lead = EDITION.lead;

  return (
    <Screen height={900} mode="scroll">
      <Box l={20} t={20}>
        <Mono size={20} weight={700} tracking={0.26}>
          THE RAIL
        </Mono>
      </Box>
      <Box r={20} t={26}>
        <Mono size={8} tracking={0.14} color={ink(0.5)}>
          {EDITION.date} · ED {EDITION.number}
        </Mono>
      </Box>
      <Rule l={0} t={56} w={420} weight={2} color={ink(0.8)} />

      <Box l={20} t={70}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          {lead.kicker}
        </Mono>
      </Box>
      <Box l={20} t={88} w={376}>
        <Sans size={19} weight={500} tracking={-0.01} lh={1.28}>
          {lead.headline}
        </Sans>
      </Box>

      <Board l={20} t={152} cards={lead.board} w={30} h={44} gap={3} />
      <Box r={20} t={150} style={{ alignItems: 'flex-end', gap: 6 }}>
        <Sans size={7} tracking={0.3} color={ink(0.4)}>
          POT
        </Sans>
        <Mono size={26} weight={700} tracking={-0.035} lh={0.9}>
          {chips(lead.pot)}
        </Mono>
      </Box>

      <Bust l={20} t={216} size={32} emoji={lead.winner.face} frame="bone" />
      <Box l={60} t={218} style={{ gap: 5 }}>
        <Sans size={8} tracking={0.2}>
          {lead.winner.name}
        </Sans>
        <Mono size={12} weight={500} tracking={0.02}>
          {lead.winner.line}
        </Mono>
      </Box>
      <Bust r={20} t={216} size={32} emoji={lead.loser.face} frame="crowd" opacity={0.55} />
      <Box r={60} t={218} style={{ alignItems: 'flex-end', gap: 5, opacity: 0.5 }}>
        <Sans size={8} tracking={0.2}>
          {lead.loser.name}
        </Sans>
        <Mono size={12} weight={500}>
          {lead.loser.line}
        </Mono>
      </Box>

      {/* 40+ masses into one bar; the breakdown stays in agate beside it. */}
      <Box l={20} t={266} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <ReactionMark count={lead.reactions} style={{ position: 'relative' }} />
        {lead.breakdown.map((b) => (
          <View key={b.face} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Mono size={15}>{b.face}</Mono>
            <Mono size={9} color={ink(0.5)}>
              {b.count}
            </Mono>
          </View>
        ))}
      </Box>

      <Box l={20} t={298} w={380} h={44} style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => router.push('/clip')}
          style={({ pressed }) => ({
            width: 170,
            height: 44,
            borderWidth: 1,
            borderColor: INK,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 11,
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={12} weight={500}>
            Watch clip
          </Sans>
          <Mono size={9} color={ink(0.6)}>
            {lead.clip}
          </Mono>
        </Pressable>
        {['Throw', 'Save'].map((label) => (
          <View
            key={label}
            style={{
              width: 105,
              height: 44,
              borderWidth: 1,
              borderLeftWidth: 0,
              borderColor: ink(0.3),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sans size={12} weight={500} color={ink(0.8)}>
              {label}
            </Sans>
          </View>
        ))}
      </Box>

      <Rule l={0} t={366} w={420} color={ink(0.2)} />
      <Box l={20} t={380}>
        <Mono size={8} tracking={0.3} color={ink(0.6)}>
          BAD BEATS
        </Mono>
      </Box>
      <Box r={20} t={380}>
        <Mono size={7} tracking={0.14} color={ink(0.35)}>
          3 NEW
        </Mono>
      </Box>

      {EDITION.badBeats.map((item, i) => {
        const top = 404 + i * 72;
        return (
          <View key={item.headline}>
            <Box l={20} t={top} w={250}>
              <Sans size={12} weight={500} lh={1.3}>
                {item.headline}
              </Sans>
            </Box>
            <Box l={20} t={top + 36}>
              <Mono size={7.5} tracking={0.12} color={ink(0.4)}>
                {item.meta}
              </Mono>
            </Box>
            <Box r={20} t={top} style={{ flexDirection: 'row', gap: 2 }}>
              {item.cards.map((rank, j) => (
                <PlayingCard key={j} w={16} h={22} rank={rank} tone="board" style={{ position: 'relative' }} />
              ))}
            </Box>
            <ReactionMark r={20} t={top + 30} count={item.reactions} scale="agate" />
            {i < 2 ? <Rule l={20} t={top + 58} w={380} color={ink(0.1)} /> : null}
          </View>
        );
      })}

      <Rule l={0} t={616} w={420} color={ink(0.2)} />
      <Box l={20} t={630}>
        <Mono size={8} tracking={0.3} color={ink(0.6)}>
          FROM YOUR TABLES
        </Mono>
      </Box>

      {EDITION.yourTables.map((item, i) => {
        const top = 654 + i * 74;
        return (
          <View key={item.headline}>
            <Bust l={20} t={top} size={28} emoji={CAST[1].face} frame="lit" />
            <Box l={58} t={top} w={212}>
              <Sans size={12} weight={500} lh={1.3}>
                {item.headline}
              </Sans>
            </Box>
            <Box l={58} t={top + 36}>
              <Mono size={7.5} tracking={0.12} color={ink(0.4)}>
                {item.meta}
              </Mono>
            </Box>
            <Pressable
              onPress={() => router.push(i === 0 ? '/table' : '/clip')}
              style={({ pressed }) => ({
                position: 'absolute',
                right: 20,
                top: top + 6,
                width: 84,
                height: 32,
                borderWidth: 1,
                borderColor: ink(0.35),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? SURFACE.press : undefined,
              })}
            >
              <Sans size={11} weight={500} color={ink(0.85)}>
                {item.action}
              </Sans>
            </Pressable>
            {i === 0 ? <Rule l={20} t={top + 60} w={380} color={ink(0.1)} /> : null}
          </View>
        );
      })}

      <Rule l={0} t={812} w={420} color={ink(0.28)} />
      <Box l={20} t={828} style={{ flexDirection: 'row', gap: 5 }}>
        {CROWD.slice(0, 4).map((face) => (
          <Bust key={face} size={22} emoji={face} frame="crowd" opacity={0.7} style={{ position: 'relative' }} />
        ))}
      </Box>
      <Box r={20} t={834}>
        <Mono size={8} tracking={0.14} color={ink(0.45)}>
          {EDITION.footer}
        </Mono>
      </Box>
    </Screen>
  );
}
