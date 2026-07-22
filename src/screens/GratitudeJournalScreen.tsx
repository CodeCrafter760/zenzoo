import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';

function formatDate(dateStr: string, language: 'en' | 'es') {
  const d = new Date(dateStr);
  return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Toddlers can't write yet, so gratitude becomes tap-to-pick instead of typing.
const TODDLER_PROMPTS = [
  { emoji: '👨‍👩‍👧', label: 'My family', es: 'Mi familia' },
  { emoji: '🐶', label: 'My pet', es: 'Mi mascota' },
  { emoji: '🍎', label: 'Yummy snacks', es: 'Bocadillos ricos' },
  { emoji: '🎨', label: 'Playing', es: 'Jugar' },
  { emoji: '🎵', label: 'Music', es: 'Música' },
  { emoji: '🤗', label: 'Hugs', es: 'Abrazos' },
];

// Preschoolers can write a little, so these just help them get started.
const PRESCHOOL_STARTERS = [
  { en: 'I felt happy when...', es: 'Me sentí feliz cuando...' },
  { en: 'I liked playing with...', es: 'Me gustó jugar con...' },
  { en: 'Today was fun because...', es: 'Hoy fue divertido porque...' },
];

export default function GratitudeJournalScreen({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { isDark, journalEntries, addJournalEntry, awardCoins, ageGroup, language, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const isToddler   = ageGroup === 'Toddler (2-4)';
  const isPreschool = ageGroup === 'Preschool (4-6)';

  const today     = new Date().toDateString();
  const todayEntry = journalEntries.find(e => e.date === today);

  const [text, setText]         = useState(todayEntry?.content ?? '');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const hasContent = text.trim().length > 0;
  const isChanged  = text.trim() !== (todayEntry?.content ?? '');
  const canSave    = hasContent && isChanged;

  const saveScale = useRef(new Animated.Value(1)).current;
  const saveSpring = (to: number) =>
    Animated.spring(saveScale, { toValue: to, friction: 5, tension: 300, useNativeDriver: true });

  const handleSave = () => {
    if (!canSave) return;
    const isNew = !todayEntry;
    addJournalEntry(text.trim());
    if (isNew) awardCoins(10);
  };

  const toggleExpand = (i: number) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pastEntries = [...journalEntries].reverse().filter(e => e.date !== today);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#FFFBF0' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Header ── */}
          <TouchableOpacity onPress={() => onNavigate?.('Home')} activeOpacity={0.7} style={styles.backBtn}>
            <Feather name="arrow-left" size={16} color={PALETTE.gold} />
            <Text style={[styles.backText, { color: PALETTE.gold }]}>{t('Home')}</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: T.text }]}>{t('My Journal')} 📓</Text>
          <Text style={[styles.dateLabel, { color: T.mid }]}>{formatDate(today, language)}</Text>

          {/* ── Write area ── */}
          {isToddler ? (
            <View style={[styles.writeCard, { backgroundColor: T.card, borderColor: T.edge, padding: 16 }]}>
              <Text style={[styles.toddlerPrompt, { color: T.text }]}>{t('What made you happy today?')}</Text>
              <View style={styles.toddlerGrid}>
                {TODDLER_PROMPTS.map(p => {
                  const value = language === 'es' ? p.es : p.label;
                  const active = text === value;
                  return (
                    <TouchableOpacity
                      key={p.label}
                      style={[styles.toddlerChip, { backgroundColor: active ? PALETTE.gold : (isDark ? T.edge : '#F5F0E0'), borderColor: active ? PALETTE.gold : T.edge }]}
                      onPress={() => { tapHaptic(); setText(value); }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.toddlerChipEmoji}>{p.emoji}</Text>
                      <Text style={[styles.toddlerChipLabel, { color: active ? '#FFF' : T.text }]}>{value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={[styles.saveBtn, styles.toddlerSaveBtn, {
                  backgroundColor: canSave ? PALETTE.gold : (isDark ? T.edge : '#EEE8F4'),
                  transform: [{ scale: saveScale }],
                }]}
                onPress={handleSave}
                onPressIn={() => { if (canSave) { tapHaptic(); saveSpring(0.94).start(); } }}
                onPressOut={() => saveSpring(1).start()}
                disabled={!canSave}
                activeOpacity={1}
              >
                <Text style={[styles.saveBtnText, { color: canSave ? '#FFF' : T.soft }]}>
                  {todayEntry ? t('Update') : t('Save')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.writeCard, { backgroundColor: T.card, borderColor: T.edge }]}>
              {isPreschool && (
                <View style={styles.starterRow}>
                  {PRESCHOOL_STARTERS.map(s => {
                    const value = language === 'es' ? s.es : s.en;
                    return (
                      <TouchableOpacity
                        key={s.en}
                        style={[styles.starterChip, { backgroundColor: isDark ? T.edge : '#F5F0E0', borderColor: T.edge }]}
                        onPress={() => { tapHaptic(); setText(value); }}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.starterChipText, { color: T.text }]}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <TextInput
                style={[styles.input, { color: T.text }]}
                placeholder={t('Write whatever is on your mind today…')}
                placeholderTextColor={T.soft}
                value={text}
                onChangeText={setText}
                multiline
                textAlignVertical="top"
                maxLength={2000}
                scrollEnabled={false}
              />
              <View style={styles.writeFooter}>
                <Text style={[styles.charCount, { color: T.soft }]}>{text.length} / 2000</Text>
                <TouchableOpacity
                  style={[styles.saveBtn, {
                    backgroundColor: canSave ? PALETTE.gold : (isDark ? T.edge : '#EEE8F4'),
                    transform: [{ scale: saveScale }],
                  }]}
                  onPress={handleSave}
                  onPressIn={() => { if (canSave) { tapHaptic(); saveSpring(0.94).start(); } }}
                  onPressOut={() => saveSpring(1).start()}
                  disabled={!canSave}
                  activeOpacity={1}
                >
                  <Text style={[styles.saveBtnText, { color: canSave ? '#FFF' : T.soft }]}>
                    {todayEntry ? t('Update') : t('Save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Coin hint (only before first save today) */}
          {!todayEntry && (
            <Text style={[styles.coinHint, { color: T.mid }]}>
              💎  {t('Save your first entry today to earn 10 Calm Coins')}
            </Text>
          )}

          {/* ── Past entries ── */}
          {pastEntries.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Previous Entries')}</Text>
              {pastEntries.map((entry, i) => {
                const open = expanded.has(i);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.entryCard, { backgroundColor: T.card, borderColor: T.edge }]}
                    onPress={() => toggleExpand(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.entryHeader}>
                      <Text style={[styles.entryDate, { color: PALETTE.gold }]}>{formatDate(entry.date, language)}</Text>
                      <Feather name={open ? 'chevron-up' : 'chevron-down'} size={14} color={T.soft} />
                    </View>
                    <Text style={[styles.entryContent, { color: T.text }]} numberOfLines={open ? undefined : 2}>
                      {entry.content}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Empty state (no entries at all) */}
          {journalEntries.length === 0 && (
            <View style={[styles.emptyState, { borderColor: T.edge }]}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={[styles.emptyText, { color: T.mid }]}>
                {t('Your journal is waiting for its first entry. Start writing above!')}
              </Text>
            </View>
          )}

          <View style={{ height: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: 20, paddingTop: 14 },

  backBtn:  { marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, fontWeight: '700' },

  title:     { fontSize: 28, fontWeight: '900', letterSpacing: -0.4, marginBottom: 4 },
  dateLabel: { fontSize: 14, fontWeight: '600', marginBottom: 20 },

  // Write card
  writeCard: {
    borderRadius: RADIUS.lg, borderWidth: 1.5,
    marginBottom: 12, overflow: 'hidden',
  },
  input: {
    fontSize: 16, lineHeight: 26,
    padding: 18, minHeight: 180,
    fontWeight: '400',
  },
  writeFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  charCount:   { fontSize: 12, fontWeight: '600' },
  saveBtn:     { borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 22 },
  saveBtnText: { fontSize: 14, fontWeight: '900' },

  toddlerPrompt: { fontSize: 17, fontWeight: '900', textAlign: 'center', marginBottom: 14 },
  toddlerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  toddlerChip: { width: '30%', borderRadius: RADIUS.lg, borderWidth: 2, paddingVertical: 16, alignItems: 'center', gap: 6 },
  toddlerChipEmoji: { fontSize: 28 },
  toddlerChipLabel: { fontSize: 12, fontWeight: '800', textAlign: 'center' },
  toddlerSaveBtn: { alignSelf: 'center', marginTop: 18, paddingHorizontal: 32, paddingVertical: 14 },

  starterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, paddingBottom: 0 },
  starterChip: { borderRadius: RADIUS.pill, borderWidth: 1.5, paddingVertical: 8, paddingHorizontal: 14 },
  starterChipText: { fontSize: 12.5, fontWeight: '700' },

  coinHint: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 24 },

  // Past entries
  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: 12, marginTop: 8 },
  entryCard: {
    borderRadius: 18, borderWidth: 1.5,
    padding: 16, marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  entryDate:    { fontSize: 13, fontWeight: '800' },
  chevron:      { fontSize: 11, fontWeight: '700' },
  entryContent: { fontSize: 15, lineHeight: 23, fontWeight: '400' },

  // Empty
  emptyState: { alignItems: 'center', borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', padding: 36, marginTop: 24 },
  emptyEmoji: { fontSize: 42, marginBottom: 12 },
  emptyText:  { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
});
