import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LeaveMark, Masthead } from '@/components/AppShell';
import { Box, Mono, Rule, Sans } from '@/components/Prim';
import { EarnedItem, PurchasedItem } from '@/components/Provenance';
import { Screen } from '@/components/Screen';
import { COUNTER } from '@/data/fixtures';
import { EASE } from '@/design/motion';
import { chips, GROUND, ink, INK, MS, SURFACE } from '@/design/tokens';

/**
 * 8c — the counter.
 *
 * Not a store grid: a counter with dated stock, five things on it, flat prices
 * in credits, named makers, no bundles and no boxes. The load-bearing section is
 * NOT FOR SALE — ticked items with their requirements, advertised in the shop,
 * because nothing here is ever sold with ticks and that is the whole deal.
 *
 * INTEGRATION — the counter's masthead is the shared one (the stock's date stays
 * in the meta slot, where it belongs: this counter dates itself the way the
 * edition does), and the mark that leaves is added to its 2px rule. The counter
 * is the deepest pushed screen in the app and it is a dead end on purpose —
 * nothing is bought *onward* from here — so the one thing it owes you is a way
 * out, back to the loadout you came in from, or to HOME on a cold link.
 *
 * THE FIGURE. A counter's one large numeral is the price of the thing on it, so
 * the lead price is set at the 30 every document in the app sets its lead figure
 * at (the pot on /floor, /tables, /clip and /feed) rather than at 22 — same
 * lockup, same slot, one stop up. The balance beside `Buy and equip` is derived
 * from the stock's own figures instead of typed, so a price change cannot make
 * the counter lie about credits. Credits buy objects; they are never chips.
 */
/** The counter's credits, from its own display figure — see `COUNTER.balance`. */
const BALANCE = Number(String(COUNTER.balance).replace(/[^\d]/g, ''));

export default function ShopScreen() {
  const [owned, setOwned] = useState(false);
  const mark = useSharedValue(0);

  // The only celebration money buys: the mark strikes onto the plate, 120ms.
  const markStyle = useAnimatedStyle(() => ({
    opacity: mark.value,
    transform: [{ scale: 0.6 + mark.value * 0.4 }],
  }));

  const buy = () => {
    if (owned) return;
    setOwned(true);
    mark.value = withTiming(1, { duration: MS.mark, easing: EASE.settle });
  };

  return (
    <Screen height={720} mode="scroll">
      <Masthead title="THE COUNTER" meta={`STOCK · ${COUNTER.date}`} />
      <LeaveMark label="LEAVE THE COUNTER" ruleY={56} fallback="/home" />

      <View style={{ position: 'absolute', left: 20, top: 80, width: 118, height: 118 }}>
        <PurchasedItem l={0} t={0} w={118} h={118} face={COUNTER.lead.face} maker={undefined} />
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 16,
              height: 16,
              backgroundColor: INK,
              alignItems: 'center',
              justifyContent: 'center',
            },
            markStyle,
          ]}
        >
          <Mono size={9} weight={700} color={GROUND}>
            {COUNTER.lead.maker}
          </Mono>
        </Animated.View>
      </View>

      <Box l={154} t={82}>
        <Sans size={15} weight={500} tracking={-0.01} lh={1.25}>
          {COUNTER.lead.title}
        </Sans>
      </Box>
      <Box l={154} t={106}>
        <Mono size={7} tracking={0.18} color={ink(0.45)}>
          {COUNTER.lead.kicker}
        </Mono>
      </Box>
      <Box l={154} t={126} w={246}>
        <Sans size={9} color={ink(0.55)} lh={1.5}>
          {COUNTER.lead.copy}
        </Sans>
      </Box>
      <Box l={154} t={172} style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Mono size={30} weight={700} tracking={-0.04}>
          {chips(COUNTER.lead.price)}
        </Mono>
        <Mono size={9} tracking={0.14} color={ink(0.5)}>
          {' '}
          CR
        </Mono>
      </Box>
      <Box r={20} t={176}>
        <Mono size={7} tracking={0.12} color={ink(0.35)}>
          {COUNTER.lead.edition}
        </Mono>
      </Box>

      <Pressable
        onPress={buy}
        accessibilityRole="button"
        accessibilityLabel={
          owned
            ? `${COUNTER.lead.title} is owned and equipped`
            : `Buy and equip ${COUNTER.lead.title} for ${chips(COUNTER.lead.price)} play credits`
        }
        accessibilityState={{ selected: owned }}
        style={({ pressed }) => ({
          position: 'absolute',
          left: 20,
          top: 214,
          width: 380,
          height: 44,
          borderWidth: 1,
          borderLeftWidth: 3,
          borderColor: owned ? ink(0.4) : INK,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 14,
          paddingRight: 12,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Sans size={12} weight={500} color={owned ? ink(0.6) : ink()}>
          {owned ? 'Owned · equipped' : 'Buy and equip'}
        </Sans>
        <Mono size={9} color={ink(0.6)}>
          BALANCE {chips(owned ? BALANCE - COUNTER.lead.price : BALANCE)} CR
        </Mono>
      </Pressable>

      <Rule l={0} t={280} w={420} color={ink(0.2)} />
      <Box l={20} t={294}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          ALSO ON THE COUNTER
        </Mono>
      </Box>
      <Box r={20} t={294}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          NO BUNDLES · NO BOXES
        </Mono>
      </Box>

      {COUNTER.stock.map((item, i) => {
        const top = 324 + i * 70;
        return (
          <View key={item.title}>
            <PurchasedItem
              l={20}
              t={top}
              w={44}
              h={44}
              face={'face' in item ? item.face : undefined}
              glyph={'glyph' in item ? item.glyph : undefined}
              maker={item.soldOut ? undefined : item.maker}
              dim={item.soldOut ? 0.4 : undefined}
            />
            <Box l={80} t={top + 6}>
              <Sans size={12} weight={500} color={item.soldOut ? ink(0.45) : ink()}>
                {item.title}
              </Sans>
            </Box>
            {item.soldOut ? <Rule l={80} t={top + 14} w={88} color={ink(0.45)} /> : null}
            <Box l={80} t={top + 26}>
              <Mono size={6.5} tracking={0.1} color={ink(item.soldOut ? 0.3 : 0.35)}>
                {item.meta}
              </Mono>
            </Box>
            <Box r={20} t={top + 12}>
              <Mono
                size={item.soldOut ? 7 : 14}
                weight={item.soldOut ? 400 : 500}
                tracking={item.soldOut ? 0.16 : 0}
                color={item.owned || item.soldOut ? ink(0.4) : ink()}
              >
                {item.price}
              </Mono>
            </Box>
            {i < COUNTER.stock.length - 1 ? <Rule l={20} t={top + 60} w={380} color={ink(0.1)} /> : null}
          </View>
        );
      })}

      <Rule l={0} t={528} w={420} color={ink(0.2)} />
      <Box l={20} t={542}>
        <Mono size={7} tracking={0.3} color={ink()}>
          NOT FOR SALE
        </Mono>
      </Box>
      <Box r={20} t={542}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          TICKS ARE NOT STOCK
        </Mono>
      </Box>

      {COUNTER.notForSale.map((item, i) => {
        const top = 576 + i * 48;
        return (
          <View key={item.name}>
            <EarnedItem l={20} t={top} w={26} h={26} face={item.face} />
            <Box l={58} t={top + 6}>
              <Mono size={8} tracking={0.12} color={ink(0.7)}>
                {item.name}
              </Mono>
            </Box>
            <Box r={20} t={top + 6}>
              <Mono size={7} tracking={0.1} color={ink(0.4)}>
                {item.requirement}
              </Mono>
            </Box>
            {i === 0 ? <Rule l={20} t={top + 38} w={380} color={ink(0.1)} /> : null}
          </View>
        );
      })}

      <Rule l={0} t={672} w={420} color={ink(0.14)} />
      <Box l={20} t={686} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          FLAT PRICES, NAMED MAKERS, DATED STOCK · NOTHING HERE AFFECTS A HAND{'\n'}
          NO ITEM IS EVER SOLD WITH TICKS — THAT IS THE WHOLE DEAL
        </Mono>
      </Box>
    </Screen>
  );
}
