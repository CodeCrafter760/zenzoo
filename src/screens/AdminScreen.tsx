import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useZenZoo, shopCatalog, COINS_PER_LEVEL } from '../context/ZenZooContext';

const A = {
  bg:      '#0A0818',
  card:    '#12102A',
  border:  '#2A2550',
  purple:  '#7C6EF0',
  teal:    '#3DD6C0',
  gold:    '#FFB830',
  red:     '#FF5E6C',
  text:    '#EDE9FF',
  sub:     '#9B96C0',
  dim:     '#5E5A82',
  green:   '#4ADE80',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, accent = A.sub }: { label: string; value: string; accent?: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

export default function AdminScreen() {
  const {
    calmCoins, level, streak, ownedItems, equipped, genetics, journalEntries, isDark,
    adminSetCoins, adminSetStreak, adminUnlockAll, adminResetAll, toggleAdmin,
  } = useZenZoo();

  const [coinInput,   setCoinInput]   = useState(String(calmCoins));
  const [streakInput, setStreakInput] = useState(String(streak));

  const applyCoins = () => {
    const n = parseInt(coinInput, 10);
    if (!isNaN(n)) adminSetCoins(n);
  };

  const applyStreak = () => {
    const n = parseInt(streakInput, 10);
    if (!isNaN(n)) adminSetStreak(n);
  };

  const quickAddCoins = (amount: number) => {
    const next = calmCoins + amount;
    adminSetCoins(next);
    setCoinInput(String(next));
  };

  const handleUnlockAll = () => {
    adminUnlockAll();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset everything?',
      'This will wipe all coins, items, and progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: () => {
            adminResetAll();
            setCoinInput('0');
            setStreakInput('1');
          },
        },
      ],
    );
  };

  const totalItems   = shopCatalog.length;
  const ownedCount   = ownedItems.length;
  const lockedCount  = totalItems - ownedCount;
  const nextLevel    = (level * COINS_PER_LEVEL);
  const progressPct  = Math.round(((calmCoins % COINS_PER_LEVEL) / COINS_PER_LEVEL) * 100);

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>🛠  Admin Panel</Text>
          <Text style={s.headerSub}>My ZenZoo · Developer Access</Text>
        </View>
        <TouchableOpacity style={s.exitBtn} onPress={toggleAdmin} activeOpacity={0.8}>
          <Text style={s.exitText}>✕  Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── CALM COINS ── */}
        <Section title="💎  Calm Coins">
          <View style={s.bigStat}>
            <Text style={[s.bigNum, { color: A.gold }]}>{calmCoins.toLocaleString()}</Text>
            <Text style={s.bigLabel}>current balance</Text>
          </View>
          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              value={coinInput}
              onChangeText={setCoinInput}
              keyboardType="number-pad"
              onSubmitEditing={applyCoins}
              placeholderTextColor={A.dim}
              selectionColor={A.purple}
            />
            <TouchableOpacity style={[s.setBtn, { backgroundColor: A.gold }]} onPress={applyCoins} activeOpacity={0.85}>
              <Text style={s.setBtnText}>Set</Text>
            </TouchableOpacity>
          </View>
          <View style={s.quickRow}>
            {[50, 200, 500, 1000].map(n => (
              <TouchableOpacity key={n} style={s.quickBtn} onPress={() => quickAddCoins(n)} activeOpacity={0.8}>
                <Text style={[s.quickBtnText, { color: A.gold }]}>+{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* ── LEVEL & XP ── */}
        <Section title="⭐  Level & XP">
          <View style={s.bigStat}>
            <Text style={[s.bigNum, { color: A.purple }]}>Level {level}</Text>
            <Text style={s.bigLabel}>{progressPct}% to Level {level + 1} · needs {nextLevel} coins total</Text>
          </View>
          {/* Level shortcuts */}
          <Text style={s.fieldLabel}>Jump to level:</Text>
          <View style={s.quickRow}>
            {[1, 5, 10, 25].map(lvl => (
              <TouchableOpacity
                key={lvl}
                style={s.quickBtn}
                onPress={() => {
                  const coins = (lvl - 1) * COINS_PER_LEVEL;
                  adminSetCoins(coins);
                  setCoinInput(String(coins));
                }}
                activeOpacity={0.8}
              >
                <Text style={[s.quickBtnText, { color: A.purple }]}>Lv {lvl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* ── STREAK ── */}
        <Section title="🔥  Streak">
          <View style={s.bigStat}>
            <Text style={[s.bigNum, { color: '#FF8267' }]}>{streak} days</Text>
          </View>
          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              value={streakInput}
              onChangeText={setStreakInput}
              keyboardType="number-pad"
              onSubmitEditing={applyStreak}
              placeholderTextColor={A.dim}
              selectionColor={A.purple}
            />
            <TouchableOpacity style={[s.setBtn, { backgroundColor: '#FF8267' }]} onPress={applyStreak} activeOpacity={0.85}>
              <Text style={s.setBtnText}>Set</Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* ── ITEMS & OUTFITS ── */}
        <Section title="🎒  Items & Outfits">
          <View style={s.statsGrid}>
            <View style={[s.statBox, { borderColor: A.teal + '55' }]}>
              <Text style={[s.statNum, { color: A.teal }]}>{ownedCount}</Text>
              <Text style={s.statLbl}>owned</Text>
            </View>
            <View style={[s.statBox, { borderColor: A.dim + '55' }]}>
              <Text style={[s.statNum, { color: A.dim }]}>{lockedCount}</Text>
              <Text style={s.statLbl}>locked</Text>
            </View>
            <View style={[s.statBox, { borderColor: A.purple + '55' }]}>
              <Text style={[s.statNum, { color: A.purple }]}>{totalItems}</Text>
              <Text style={s.statLbl}>total</Text>
            </View>
          </View>

          <TouchableOpacity style={[s.actionBtn, { backgroundColor: A.teal }]} onPress={handleUnlockAll} activeOpacity={0.85}>
            <Text style={s.actionBtnText}>🔓  Unlock All Items</Text>
          </TouchableOpacity>

          {/* Item list */}
          <Text style={[s.fieldLabel, { marginTop: 14 }]}>Catalogue:</Text>
          {shopCatalog.map(item => (
            <View key={item.id} style={s.itemRow}>
              <View style={[s.ownedDot, { backgroundColor: ownedItems.includes(item.id) ? A.green : A.dim }]} />
              <Text style={s.itemName}>{item.name}</Text>
              <Text style={[s.itemCat, { color: A.dim }]}>{item.category}</Text>
              <Text style={[s.itemCost, { color: A.gold }]}>💎 {item.cost}</Text>
            </View>
          ))}
        </Section>

        {/* ── EQUIPPED ── */}
        <Section title="👗  Equipped">
          <Row label="Background" value={equipped.Backgrounds ?? 'None'} accent={A.teal} />
          <Row label="Hat"        value={equipped.Hats       ?? 'None'} accent={A.purple} />
          <Row label="Outfit"     value={equipped.Outfits    ?? 'None'} accent={A.gold} />
        </Section>

        {/* ── AVATAR ── */}
        <Section title="🐾  Avatar (Genetics)">
          <Row label="Species"    value={genetics.species}   accent={A.teal}   />
          <Row label="Body Color" value={genetics.bodyColor} accent={A.purple} />
          <Row label="Eyes"       value={genetics.eyes}      accent={A.text}   />
          <Row label="Hair"       value={genetics.hair}      accent={A.text}   />
        </Section>

        {/* ── JOURNAL ── */}
        <Section title="📓  Journal">
          <Row label="Entries" value={String(journalEntries.length)} accent={A.gold} />
          {journalEntries.map((e, i) => (
            <View key={i} style={s.journalEntry}>
              <Text style={[s.journalDate, { color: A.purple }]}>{e.date}</Text>
              <Text style={s.journalSnippet} numberOfLines={1}>{e.content}</Text>
            </View>
          ))}
          {journalEntries.length === 0 && (
            <Text style={[s.itemCat, { textAlign: 'center', marginTop: 8 }]}>No entries yet</Text>
          )}
        </Section>

        {/* ── SYSTEM ── */}
        <Section title="⚙️  System">
          <Row label="Dark Mode" value={isDark ? 'On' : 'Off'} accent={isDark ? A.purple : A.dim} />
          <Row label="Coins/Level" value={`${COINS_PER_LEVEL} coins`} />
        </Section>

        {/* ── DANGER ZONE ── */}
        <Section title="⚠️  Danger Zone">
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: A.red }]} onPress={handleReset} activeOpacity={0.85}>
            <Text style={s.actionBtnText}>🗑  Reset All Progress</Text>
          </TouchableOpacity>
        </Section>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: A.bg },
  scroll: { padding: 18 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderColor: A.border,
    backgroundColor: A.card,
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: A.text, letterSpacing: -0.3 },
  headerSub:   { fontSize: 11, color: A.dim, marginTop: 2, fontWeight: '600' },
  exitBtn:     { backgroundColor: A.red + '22', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: A.red + '55' },
  exitText:    { color: A.red, fontWeight: '800', fontSize: 13 },

  section: {
    backgroundColor: A.card, borderRadius: 20, borderWidth: 1,
    borderColor: A.border, padding: 18, marginBottom: 14,
  },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: A.sub, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 },

  bigStat:   { alignItems: 'center', marginBottom: 16 },
  bigNum:    { fontSize: 40, fontWeight: '900', letterSpacing: -1 },
  bigLabel:  { fontSize: 12, color: A.dim, marginTop: 4, fontWeight: '600', textAlign: 'center' },

  inputRow:  { flexDirection: 'row', gap: 10, marginBottom: 10 },
  input: {
    flex: 1, backgroundColor: A.bg, borderRadius: 12, borderWidth: 1.5,
    borderColor: A.border, paddingHorizontal: 14, paddingVertical: 12,
    color: A.text, fontSize: 18, fontWeight: '700',
  },
  setBtn:    { borderRadius: 12, paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' },
  setBtnText:{ color: '#000', fontWeight: '900', fontSize: 14 },

  quickRow:  { flexDirection: 'row', gap: 8 },
  quickBtn:  { flex: 1, backgroundColor: A.bg, borderRadius: 10, borderWidth: 1, borderColor: A.border, paddingVertical: 10, alignItems: 'center' },
  quickBtnText: { fontSize: 13, fontWeight: '800' },

  fieldLabel: { fontSize: 11, color: A.dim, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },

  statsGrid:  { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statBox:    { flex: 1, borderRadius: 14, borderWidth: 1.5, padding: 12, alignItems: 'center' },
  statNum:    { fontSize: 28, fontWeight: '900' },
  statLbl:    { fontSize: 11, color: A.dim, fontWeight: '700', marginTop: 2 },

  actionBtn:     { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 4 },
  actionBtnText: { fontSize: 15, fontWeight: '900', color: '#000' },

  itemRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderColor: A.border },
  ownedDot:  { width: 8, height: 8, borderRadius: 4 },
  itemName:  { flex: 1, color: A.text, fontSize: 13, fontWeight: '600' },
  itemCat:   { fontSize: 11, color: A.dim, fontWeight: '600' },
  itemCost:  { fontSize: 12, fontWeight: '700', minWidth: 48, textAlign: 'right' },

  row:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: A.border },
  rowLabel:   { color: A.dim, fontSize: 13, fontWeight: '600' },
  rowValue:   { fontSize: 13, fontWeight: '700' },

  journalEntry:   { paddingVertical: 7, borderBottomWidth: 1, borderColor: A.border },
  journalDate:    { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  journalSnippet: { fontSize: 12, color: A.sub },
});
