import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS } from '../theme/theme';
import { tapHaptic, successHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';
import { MOODS, MOOD_TAGS, findMood } from '../data/moods';

function formatDate(dateStr: string, language: 'en' | 'es') {
  const d = new Date(dateStr);
  return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function MoodSurveyScreen({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { isDark, moodEntries, addMoodEntry, awardCoins, ageGroup, language, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  // Tags require reading, the note requires writing — both scale with age.
  // Toddler: mood only. Preschool: mood + tags. Pre-Teen: everything.
  const isToddler = ageGroup === 'Toddler (2-4)';
  const isPreTeen  = ageGroup === 'Pre-Teen (6-9)';

  const today = new Date().toDateString();
  const todayEntry = moodEntries.find(e => e.date === today);

  const [mood, setMood] = useState<string | null>(todayEntry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(todayEntry?.tags ?? []);
  const [note, setNote] = useState(todayEntry?.note ?? '');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const isChanged =
    mood !== (todayEntry?.mood ?? null) ||
    JSON.stringify(tags) !== JSON.stringify(todayEntry?.tags ?? []) ||
    note.trim() !== (todayEntry?.note ?? '');
  const canSave = mood !== null && isChanged;

  const saveScale = useRef(new Animated.Value(1)).current;
  const saveSpring = (to: number) =>
    Animated.spring(saveScale, { toValue: to, friction: 5, tension: 300, useNativeDriver: true }).start();

  const handleSave = () => {
    if (!canSave || !mood) return;
    const isNew = !todayEntry;
    addMoodEntry(mood, tags, note.trim());
    if (isNew) awardCoins(10);
    successHaptic();
  };

  const toggleExpand = (i: number) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pastEntries = [...moodEntries].reverse().filter(e => e.date !== today);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F2FAFF' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Header ── */}
          <TouchableOpacity onPress={() => onNavigate?.('Home')} activeOpacity={0.7} style={styles.backBtn}>
            <Feather name="arrow-left" size={16} color={PALETTE.sky} />
            <Text style={[styles.backText, { color: PALETTE.sky }]}>{t('Home')}</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: T.text }]}>{t('Daily Check-In')} 🌤️</Text>
          <Text style={[styles.dateLabel, { color: T.mid }]}>{formatDate(today, language)}</Text>

          {/* ── Mood picker ── */}
          <Text style={[styles.sectionLabel, { color: T.text }]}>{t('How are you feeling today?')}</Text>
          <View style={styles.moodGrid}>
            {MOODS.map(m => {
              const active = mood === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.moodCard, { backgroundColor: active ? m.color : T.card, borderColor: active ? m.color : T.edge }]}
                  onPress={() => { tapHaptic(); setMood(m.key); }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: active ? '#FFFFFF' : T.text }]}>{t(m.key)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Tags — need reading, so Toddler skips straight to Save ── */}
          {!isToddler && (
            <>
              <Text style={[styles.sectionLabel, { color: T.text }]}>{t("What's affecting your mood? (optional)")}</Text>
              <View style={styles.tagWrap}>
                {MOOD_TAGS.map(tag => {
                  const active = tags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, { backgroundColor: active ? PALETTE.sky : T.card, borderColor: active ? PALETTE.sky : T.edge }]}
                      onPress={() => { tapHaptic(); toggleTag(tag); }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.tagText, { color: active ? '#FFFFFF' : T.text }]}>{t(tag)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* ── Note — needs writing, so only Pre-Teen gets a text field ── */}
          {isPreTeen && (
            <>
              <Text style={[styles.sectionLabel, { color: T.text }]}>{t('Want to add a note? (optional)')}</Text>
              <View style={[styles.noteCard, { backgroundColor: T.card, borderColor: T.edge }]}>
                <TextInput
                  style={[styles.noteInput, { color: T.text }]}
                  placeholder={t('Tell us more about your day…')}
                  placeholderTextColor={T.soft}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  scrollEnabled={false}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: canSave ? PALETTE.sky : (isDark ? T.edge : '#EEE8F4'), transform: [{ scale: saveScale }] }]}
            onPress={handleSave}
            onPressIn={() => { if (canSave) { tapHaptic(); saveSpring(0.96); } }}
            onPressOut={() => saveSpring(1)}
            disabled={!canSave}
            activeOpacity={1}
          >
            <Text style={[styles.saveBtnText, { color: canSave ? '#FFFFFF' : T.soft }]}>
              {todayEntry ? t('Update Check-In') : t('Submit Check-In')}
            </Text>
          </TouchableOpacity>

          {!todayEntry ? (
            <Text style={[styles.coinHint, { color: T.mid }]}>💎  {t("Complete today's check-in to earn 10 Calm Coins")}</Text>
          ) : (
            <View style={styles.doneRow}>
              <Feather name="check-circle" size={14} color={PALETTE.green} />
              <Text style={[styles.doneText, { color: PALETTE.green }]}>{t('You checked in today!')}</Text>
            </View>
          )}

          {/* ── Past check-ins ── */}
          {pastEntries.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Previous Check-Ins')}</Text>
              {pastEntries.map((entry, i) => {
                const open = expanded.has(i);
                const m = findMood(entry.mood);
                return (
                  <TouchableOpacity
                    key={entry.date}
                    style={[styles.entryCard, { backgroundColor: T.card, borderColor: T.edge }]}
                    onPress={() => toggleExpand(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.entryHeader}>
                      <View style={styles.entryHeaderLeft}>
                        <Text style={styles.entryMoodEmoji}>{m.emoji}</Text>
                        <View>
                          <Text style={[styles.entryMood, { color: T.text }]}>{t(entry.mood)}</Text>
                          <Text style={[styles.entryDate, { color: T.mid }]}>{formatDate(entry.date, language)}</Text>
                        </View>
                      </View>
                      <Feather name={open ? 'chevron-up' : 'chevron-down'} size={14} color={T.soft} />
                    </View>
                    {open && (
                      <>
                        {entry.tags.length > 0 && (
                          <View style={styles.entryTagsRow}>
                            {entry.tags.map(tag => (
                              <View key={tag} style={[styles.entryTagChip, { backgroundColor: isDark ? T.edge : '#EAF6FD' }]}>
                                <Text style={[styles.entryTagText, { color: T.mid }]}>{t(tag)}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {entry.note.length > 0 && (
                          <Text style={[styles.entryNote, { color: T.text }]}>{entry.note}</Text>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {moodEntries.length === 0 && (
            <View style={[styles.emptyState, { borderColor: T.edge }]}>
              <Text style={styles.emptyEmoji}>🌤️</Text>
              <Text style={[styles.emptyText, { color: T.mid }]}>
                {t("Check in with yourself daily — a parent can see how you've been feeling in the Parent Dashboard.")}
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
  dateLabel: { fontSize: 14, fontWeight: '600', marginBottom: 22 },

  sectionLabel: { fontSize: 15, fontWeight: '800', marginBottom: 12 },

  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  moodCard: { width: '31%', borderRadius: RADIUS.lg, borderWidth: 1.5, paddingVertical: 14, alignItems: 'center', gap: 4 },
  moodEmoji:{ fontSize: 26 },
  moodLabel:{ fontSize: 12, fontWeight: '800' },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  tagChip: { borderRadius: RADIUS.pill, borderWidth: 1.5, paddingVertical: 9, paddingHorizontal: 14 },
  tagText: { fontSize: 12.5, fontWeight: '700' },

  noteCard:  { borderRadius: RADIUS.lg, borderWidth: 1.5, marginBottom: 18, overflow: 'hidden' },
  noteInput: { fontSize: 15, lineHeight: 22, padding: 16, minHeight: 90 },

  saveBtn:     { borderRadius: RADIUS.lg, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 15, fontWeight: '900' },

  coinHint: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 12, marginBottom: 24 },
  doneRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 24 },
  doneText: { fontSize: 13, fontWeight: '800' },

  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: 12, marginTop: 8 },
  entryCard:    { borderRadius: 18, borderWidth: 1.5, padding: 16, marginBottom: 12 },
  entryHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  entryMoodEmoji:  { fontSize: 24 },
  entryMood:       { fontSize: 14, fontWeight: '800' },
  entryDate:       { fontSize: 12, fontWeight: '600', marginTop: 1 },
  entryTagsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  entryTagChip:    { borderRadius: RADIUS.pill, paddingVertical: 5, paddingHorizontal: 10 },
  entryTagText:    { fontSize: 11, fontWeight: '700' },
  entryNote:       { fontSize: 14, lineHeight: 21, marginTop: 10 },

  emptyState: { alignItems: 'center', borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', padding: 36, marginTop: 24 },
  emptyEmoji: { fontSize: 42, marginBottom: 12 },
  emptyText:  { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
});
