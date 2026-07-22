import React, { useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useZenZoo, shopCatalog } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const CAT_CFG = {
  Backgrounds: { icon: '🖼️', color: PALETTE.sky,    bg: '#EAF6FD', label: 'Backgrounds' },
  Hats:        { icon: '🎩', color: PALETTE.purple,  bg: '#F0EDFF', label: 'Hats'        },
  Outfits:     { icon: '👕', color: PALETTE.coral,   bg: '#FFF0EC', label: 'Outfits'     },
} as const;

// ── Animated shop item card ─────────────────────────────────────────────────
interface ItemCardProps {
  item: { id: string; name: string; cost: number; category: 'Backgrounds' | 'Hats' | 'Outfits' };
  catCfg: typeof CAT_CFG[keyof typeof CAT_CFG];
  owned: boolean;
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  onPurchase: (id: string, cost: number, name: string) => void;
}

const SINGULAR_ES: Record<'Backgrounds' | 'Hats' | 'Outfits', string> = {
  Backgrounds: 'Fondo', Hats: 'Sombrero', Outfits: 'Traje',
};

function ShopItemCard({ item, catCfg, owned, isDark, cardBg, cardBorder, onPurchase }: ItemCardProps) {
  const { language, t } = useZenZoo();
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (to: number) =>
    Animated.spring(scale, { toValue: to, friction: 6, tension: 300, useNativeDriver: true });

  return (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: cardBg, borderColor: cardBorder, transform: [{ scale }] }]}
      onPressIn={() => { tapHaptic(); spring(0.95).start(); }}
      onPressOut={() => spring(1).start()}
      onPress={owned ? undefined : () => onPurchase(item.id, item.cost, item.name)}
      activeOpacity={1}
    >
      <View style={[styles.thumb, { backgroundColor: isDark ? catCfg.color + '18' : catCfg.bg }]}>
        <Text style={styles.thumbEmoji}>{catCfg.icon}</Text>
        {owned && (
          <View style={styles.ownedBadge}>
            <Feather name="check" size={10} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={[styles.itemName, { color: isDark ? '#EDE9FF' : '#2D2A5E' }]} numberOfLines={1}>{t(item.name)}</Text>
      <Text style={[styles.itemCat, { color: catCfg.color }]}>{language === 'es' ? SINGULAR_ES[item.category] : item.category.slice(0, -1)}</Text>
      {owned ? (
        <View style={[styles.itemBtn, { backgroundColor: isDark ? '#2A2548' : '#F0F0F5' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="check" size={12} color={isDark ? '#5E5A82' : '#B8B4CC'} />
            <Text style={[styles.itemBtnText, { color: isDark ? '#5E5A82' : '#B8B4CC' }]}>{t('Owned')}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.itemBtn, { backgroundColor: catCfg.color }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <FontAwesome5 name="gem" size={11} color="#FFF" />
            <Text style={[styles.itemBtnText, { color: '#FFF' }]}>{item.cost}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ShopScreen({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { calmCoins, ownedItems, buyItem, shopLocked, isDark, ageGroup, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  // The "how to earn" economics explainer is extra reading a toddler doesn't need.
  const isToddler = ageGroup === 'Toddler (2-4)';

  if (shopLocked) {
    return (
      <View style={[styles.container, styles.lockedContainer, { backgroundColor: T.bg }]}>
        <View style={[styles.lockedCircle, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
          <Feather name="lock" size={30} color={PALETTE.indigo} />
        </View>
        <Text style={[styles.lockedTitle, { color: T.text }]}>{t('Calm Shop is Locked')}</Text>
        <Text style={[styles.lockedSub, { color: T.mid }]}>{t('Ask a parent to unlock the shop from the Parent Dashboard.')}</Text>
        <TouchableOpacity style={styles.lockedBtn} onPress={() => onNavigate?.('Home')} activeOpacity={0.85}>
          <Text style={styles.lockedBtnText}>{t('Go Home')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePurchase = (itemId: string, cost: number, name: string) => {
    const displayName = t(name);
    if (ownedItems.includes(itemId)) {
      Alert.alert(t('Already Owned! 🎉'), t('You already have {name}. Equip it in My ZenZoo!').replace('{name}', displayName));
      return;
    }
    if (calmCoins < cost) {
      Alert.alert(t('Need more coins 💎'), t('You need {n} more Calm Coins. Keep breathing and focusing!').replace('{n}', String(cost - calmCoins)));
      return;
    }
    buyItem(itemId, cost);
    Alert.alert(t('Purchased! 🎉'), t('You got {name}! Go to My ZenZoo to equip it.').replace('{name}', displayName));
  };

  const categories = ['Backgrounds', 'Hats', 'Outfits'] as const;

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: T.card, borderColor: T.edge }]}>
        <View>
          <Text style={[styles.headerTitle, { color: T.text }]}>{t('Calm Shop')} 💎</Text>
          <Text style={[styles.headerSub, { color: T.mid }]}>{t('Spend your hard-earned coins!')}</Text>
        </View>
        <View style={[styles.wallet, { backgroundColor: isDark ? '#2D2A5E' : '#F0EDFF' }]}>
          <Text style={styles.walletEmoji}>💎</Text>
          <Text style={styles.walletAmount}>{calmCoins}</Text>
        </View>
      </View>

      {/* ── How to earn — hidden for Toddler, an economics lecture they don't need ── */}
      {!isToddler && (
        <View style={[styles.earnBanner, { backgroundColor: T.card, borderColor: T.edge }]}>
          <Text style={[styles.earnTitle, { color: T.text }]}>{t('How to earn Calm Coins')}</Text>
          <View style={styles.earnItems}>
            {[
              { icon: '☁️', label: 'Breathe', detail: '+10 per cycle',    color: PALETTE.sky,    screen: 'Emotions' },
              { icon: '🎯', label: 'Focus',   detail: '+10 per session',  color: PALETTE.purple, screen: 'Focus'    },
              { icon: '🌙', label: 'Bedtime', detail: '+5–10 per task',   color: '#748FFC',      screen: 'Bedroom'  },
            ].map(e => (
              <TouchableOpacity
                key={e.label}
                style={[styles.earnItem, { backgroundColor: e.color + '22', borderColor: e.color + '55' }]}
                onPress={() => onNavigate?.(e.screen)}
                activeOpacity={0.75}
              >
                <Text style={styles.earnItemIcon}>{e.icon}</Text>
                <Text style={[styles.earnItemLabel, { color: e.color }]}>{t(e.label)}</Text>
                <Text style={[styles.earnItemDetail, { color: e.color }]}>{t(e.detail)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── Catalog ── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {categories.map(cat => {
          const catItems = shopCatalog.filter(i => i.category === cat);
          const catCfg   = CAT_CFG[cat];
          return (
            <View key={cat} style={styles.catSection}>
              <View style={[styles.catHeader, { backgroundColor: isDark ? catCfg.color + '22' : catCfg.bg, borderColor: catCfg.color + '55' }]}>
                <Text style={styles.catIcon}>{catCfg.icon}</Text>
                <Text style={[styles.catLabel, { color: catCfg.color }]}>{catCfg.label}</Text>
              </View>

              <View style={styles.grid}>
                {catItems.map(item => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    catCfg={catCfg}
                    owned={ownedItems.includes(item.id)}
                    isDark={isDark}
                    cardBg={T.card}
                    cardBorder={T.edge}
                    onPurchase={handlePurchase}
                  />
                ))}
              </View>
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  lockedContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  lockedCircle:    { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  lockedTitle:     { fontSize: 19, fontWeight: '900', marginBottom: 8, textAlign: 'center' },
  lockedSub:       { fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 19, marginBottom: 22 },
  lockedBtn:       { backgroundColor: PALETTE.indigo, borderRadius: RADIUS.lg, paddingVertical: 14, paddingHorizontal: 28 },
  lockedBtnText:   { color: '#FFF', fontSize: 14, fontWeight: '800' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16,
    borderBottomWidth: 1.5,
  },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  headerSub:   { fontSize: 13, marginTop: 2, fontWeight: '600' },
  wallet: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: PALETTE.purple },
  walletEmoji:  { fontSize: 16 },
  walletAmount: { fontSize: 16, fontWeight: '900', color: PALETTE.purple },

  earnBanner: { marginHorizontal: 14, marginTop: 12, marginBottom: 8, borderRadius: RADIUS.lg, padding: 16, borderWidth: 1.5 },
  earnTitle:  { fontSize: 13, fontWeight: '800', marginBottom: 10 },
  earnItems:  { flexDirection: 'row', gap: 8 },
  earnItem:   { flex: 1, borderRadius: RADIUS.md, padding: 10, alignItems: 'center', borderWidth: 1 },
  earnItemIcon:   { fontSize: 20, marginBottom: 4 },
  earnItemLabel:  { fontSize: 11, fontWeight: '800' },
  earnItemDetail: { fontSize: 10, fontWeight: '600', marginTop: 2 },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 14, paddingTop: 4 },

  catSection: { marginBottom: 18 },
  catHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: RADIUS.md, padding: 12, marginBottom: 10, borderWidth: 1 },
  catIcon:    { fontSize: 22 },
  catLabel:   { fontSize: 16, fontWeight: '900' },

  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  itemCard: { width: '47.5%', borderRadius: RADIUS.lg, padding: 12, borderWidth: 1.5, alignItems: 'center' },

  thumb:     { width: '100%', height: 84, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative' },
  thumbEmoji: { fontSize: 34 },
  ownedBadge: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: PALETTE.mint, justifyContent: 'center', alignItems: 'center' },
  ownedBadgeText: { fontSize: 12, fontWeight: '900', color: '#FFF' },

  itemName: { fontSize: 13, fontWeight: '800', marginBottom: 2, textAlign: 'center' },
  itemCat:  { fontSize: 11, fontWeight: '600', marginBottom: 10 },
  itemBtn:  { width: '100%', paddingVertical: 10, borderRadius: RADIUS.sm, alignItems: 'center' },
  itemBtnText: { fontSize: 13, fontWeight: '800' },
});
