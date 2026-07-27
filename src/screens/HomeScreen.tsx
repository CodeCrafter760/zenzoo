import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView,
  TouchableOpacity, Animated,
} from 'react-native';
import { useZenZoo, shopCatalog, COINS_PER_LEVEL } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import PetCircle from '../components/PetCircle';
import PetBackground from '../components/PetBackground';
import XPBar from '../components/XPBar';
import { tapHaptic } from '../utils/haptics';
import { findSpecies, SPECIES_LIST } from '../data/species';
import PetAvatar, { asEyeStyle, asHairStyle, hatStyleFromId, outfitStyleFromId } from '../components/sprites/PetAvatar';
import GlassCard from '../components/GlassCard';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 6)  return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 20) return 'evening';
  return 'night';
}

const TOD_THEME = {
  morning:   { bg: '#FFFBEC', accent: PALETTE.coral,  greeting: 'Good Morning!',   petBg: '#FFE9C0' },
  afternoon: { bg: '#F2FAFF', accent: PALETTE.sky,    greeting: 'Good Afternoon!', petBg: '#D6EEFF' },
  evening:   { bg: '#FFF6EC', accent: PALETTE.coral,  greeting: 'Good Evening!',   petBg: '#FFD9B0' },
  night:     { bg: '#1E1B3A', accent: PALETTE.purple, greeting: 'Good Night!',     petBg: '#2D2A5E' },
};


const DAILY_TIPS = [
  'Take three deep breaths before you start your day 🌬️',
  'Every small step of kindness makes the world brighter ✨',
  'You are brave, creative, and wonderfully you 💛',
  'Notice five things you can see right now 👀',
  'Rest is just as important as doing things 🌙',
  'You did amazing today — be proud of yourself! 🎉',
];

type FeatherName = React.ComponentProps<typeof Feather>['name'];

const GOALS: readonly { id: string; label: string; icon: FeatherName | 'gem'; tint: string; darkTint: string; color: string }[] = [
  { id: 'Emotions', label: 'Breathe', icon: 'cloud',  tint: '#EAF6FD', darkTint: '#0C1E2E', color: PALETTE.sky },
  { id: 'Focus',    label: 'Focus',   icon: 'target', tint: '#FFF0EE', darkTint: '#2E1410', color: PALETTE.coral },
  { id: 'Bedroom',  label: 'Rest',    icon: 'moon',   tint: '#FFF8E8', darkTint: '#2E2408', color: PALETTE.gold },
  { id: 'Journal',  label: 'Earn',    icon: 'gem',    tint: '#F0EDFF', darkTint: '#160E36', color: PALETTE.purple },
];

function GoalIcon({ icon, color, size = 22 }: { icon: FeatherName | 'gem'; color: string; size?: number }) {
  if (icon === 'gem') return <FontAwesome5 name="gem" size={size - 4} color={color} />;
  return <Feather name={icon} size={size} color={color} />;
}

function useSpring(init = 1) {
  const val = useRef(new Animated.Value(init)).current;
  const to  = (toValue: number) =>
    Animated.spring(val, { toValue, friction: 6, tension: 300, useNativeDriver: true });
  return { val, pressIn: () => { tapHaptic(); to(0.95).start(); }, pressOut: () => to(1).start() };
}

export default function HomeScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const {
    genetics, equipped, calmCoins, streak, level, isDark, toggleDark, journalEntries, moodEntries,
    screenTimeMinutes, dailyLimitMinutes, bedtimeHour, ageGroup, language, setLanguage, t,
  } = useZenZoo();
  const T     = isDark ? DARK_THEME : LIGHT_THEME;
  const tod   = getTimeOfDay();
  const theme = TOD_THEME[tod];
  const [tip] = useState(() => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'es' : 'en');

  // Toddlers get a stripped-down home screen — fewer sections, bigger targets.
  // Preschool trims just the wordiest bit (the text tip). Pre-Teen sees it all.
  // Teen sees it all too, plus the frosted "Sanctuary" styling on the hero card.
  const isToddler   = ageGroup === 'Toddler (2-4)';
  const isPreschool = ageGroup === 'Preschool (4-6)';
  const isTeen      = ageGroup === 'Teen (13-17)';
  const teenAccent  = isDark ? PALETTE.neonTeal : PALETTE.neonViolet;

  const darkBtn    = useSpring();
  const parentBtn  = useSpring();
  const switchBtn  = useSpring();
  const avatarBtn  = useSpring();
  const moodBtn    = useSpring();
  const journalBtn = useSpring();
  const goalSprings = useRef(GOALS.map(() => new Animated.Value(1))).current;
  const speciesSprings = useRef(SPECIES_LIST.map(() => new Animated.Value(1))).current;

  const goalSpring    = (i: number, to: number) => Animated.spring(goalSprings[i],    { toValue: to, friction: 6, tension: 300, useNativeDriver: true }).start();
  const speciesSpring = (i: number, to: number) => Animated.spring(speciesSprings[i], { toValue: to, friction: 6, tension: 300, useNativeDriver: true }).start();

  const currentSpecies = findSpecies(genetics.species);
  const todayJournaled = journalEntries.some(e => e.date === new Date().toDateString());
  const todayMoodChecked = moodEntries.some(e => e.date === new Date().toDateString());
  const overLimit = dailyLimitMinutes !== null && screenTimeMinutes >= dailyLimitMinutes;
  const isBedtime = bedtimeHour !== null && new Date().getHours() >= bedtimeHour;
  const activeBg = equipped.Backgrounds ? shopCatalog.find(i => i.id === equipped.Backgrounds) : undefined;

  // theme.bg is only genuinely "light" for the morning/afternoon/evening buckets —
  // night's is a moody navy, so it must be skipped when the user has picked light
  // mode themselves (e.g. bright mode at night), or they'd land on a dark screen
  // despite asking for light.
  const safeBg = isDark
    ? (tod === 'night' ? theme.bg : T.bg)
    : (tod === 'night' ? LIGHT_THEME.bg : theme.bg);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: safeBg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Top bar ── */}
        <View style={styles.topRow}>
          <View style={styles.topLeftGroup}>
            <Animated.View style={{ transform: [{ scale: parentBtn.val }] }}>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}
                onPress={() => onNavigate?.('Parent')}
                onPressIn={parentBtn.pressIn}
                onPressOut={parentBtn.pressOut}
                activeOpacity={1}
              >
                <Feather name="shield" size={17} color={T.mid} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: darkBtn.val }] }}>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}
                onPress={toggleDark}
                onPressIn={darkBtn.pressIn}
                onPressOut={darkBtn.pressOut}
                activeOpacity={1}
              >
                <Feather name={isDark ? 'sun' : 'moon'} size={18} color={T.mid} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: switchBtn.val }] }}>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}
                onPress={() => onNavigate?.('ChildSwitcher')}
                onPressIn={switchBtn.pressIn}
                onPressOut={switchBtn.pressOut}
                activeOpacity={1}
              >
                <Feather name="users" size={17} color={T.mid} />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}
              onPress={() => { tapHaptic(); toggleLanguage(); }}
              activeOpacity={0.85}
            >
              <Text style={[styles.langBtnText, { color: T.mid }]}>{language === 'en' ? 'ES' : 'EN'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.greeting, { color: T.text }]}>{t(theme.greeting)}</Text>

          <Animated.View style={{ transform: [{ scale: avatarBtn.val }] }}>
            <TouchableOpacity
              style={[styles.avatarBtn, { backgroundColor: isDark ? '#2A2548' : '#F8F5FF', borderColor: PALETTE.purple }]}
              onPress={() => onNavigate?.('MyZenZoo')}
              onPressIn={avatarBtn.pressIn}
              onPressOut={avatarBtn.pressOut}
              activeOpacity={1}
            >
              <PetAvatar
                species={genetics.species}
                bodyColor={genetics.bodyColor}
                accentColor={currentSpecies.accent}
                muzzleColor={currentSpecies.muzzle}
                eyes={asEyeStyle(genetics.eyes)}
                hair={asHairStyle(genetics.hair)}
                hat={hatStyleFromId(equipped.Hats)}
                outfit={outfitStyleFromId(equipped.Outfits)}
                size={36}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── Mood bar ── */}
        <Animated.View style={{ transform: [{ scale: moodBtn.val }] }}>
          <TouchableOpacity
            style={[styles.moodBar, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: T.edge }]}
            onPress={() => onNavigate?.('MoodSurvey')}
            onPressIn={moodBtn.pressIn}
            onPressOut={moodBtn.pressOut}
            activeOpacity={1}
          >
            <Text style={styles.moodText}>
              <Text style={{ color: theme.accent, fontWeight: '900' }}>{language === 'es' ? '¿Cómo' : 'How'}</Text>
              <Text style={{ color: T.text, fontWeight: '700' }}> {language === 'es' ? 'te sientes hoy?' : 'are you feeling today?'}</Text>
            </Text>
            <View style={[styles.moodArrow, { backgroundColor: todayMoodChecked ? PALETTE.green : theme.accent }]}>
              <Feather name={todayMoodChecked ? 'check' : 'arrow-right'} size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Streak / coin strip ── */}
        <View style={styles.statsRow}>
          <View style={[styles.pill, { backgroundColor: T.card, borderColor: T.edge }]}>
            <Text style={styles.pillEmoji}>🔥</Text>
            <Text style={[styles.pillVal, { color: T.text }]}>{language === 'es' ? `${streak}d racha` : `${streak}d streak`}</Text>
          </View>
          <View style={[styles.pill, styles.coinPill, { backgroundColor: isDark ? '#2D2A5E' : '#F0EDFF' }]}>
            <Text style={styles.pillEmoji}>💎</Text>
            <Text style={[styles.pillVal, { color: PALETTE.purple }]}>{calmCoins} {t('coins')}</Text>
          </View>
          {dailyLimitMinutes !== null && (
            <View style={[
              styles.pill,
              { backgroundColor: overLimit ? (isDark ? '#2E1410' : '#FFF0EE') : (isDark ? T.card : '#EAF6FD'), borderColor: overLimit ? PALETTE.coral : T.edge },
            ]}>
              <Text style={styles.pillEmoji}>⏱️</Text>
              <Text style={[styles.pillVal, { color: overLimit ? PALETTE.coral : T.text }]}>
                {screenTimeMinutes}/{dailyLimitMinutes} min
              </Text>
            </View>
          )}
        </View>

        {/* ── Bedtime reminder ── */}
        {isBedtime && (
          <View style={[styles.bedtimeBanner, { backgroundColor: isDark ? '#1B1F3A' : '#EEF0FF', borderColor: isDark ? '#33305C' : '#D6DAFF' }]}>
            <Text style={styles.bedtimeEmoji}>🌙</Text>
            <Text style={[styles.bedtimeText, { color: isDark ? '#C7CBFF' : PALETTE.indigo }]}>{t('It might be time to wind down for bed!')}</Text>
          </View>
        )}

        {/* ── Pet hero scene ── */}
        <View style={[styles.petCard, isTeen && { shadowColor: teenAccent }]}>
          <PetBackground bgColor={activeBg?.type} />
          {isTeen && (
            <View style={styles.petCardGlassStrip}>
              <GlassCard isDark={isDark} tint={teenAccent + '22'} style={styles.petCardGlassCard}>
                <Text style={styles.petCardGlassLabel}>{t('Sanctuary')}</Text>
              </GlassCard>
            </View>
          )}
          <View style={styles.petCardInner}>
            <PetCircle
              species={genetics.species}
              bodyColor={genetics.bodyColor}
              accentColor={currentSpecies.accent}
              muzzleColor={currentSpecies.muzzle}
              eyes={asEyeStyle(genetics.eyes)}
              hair={asHairStyle(genetics.hair)}
              hatId={equipped.Hats}
              outfitId={equipped.Outfits}
              hintColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── XP bar ── */}
        <XPBar
          level={level}
          calmCoins={calmCoins}
          coinsPerLevel={COINS_PER_LEVEL}
          cardBg={T.card}
          cardBorder={T.edge}
          trackBg={isDark ? T.edge : '#EEE8F4'}
          midColor={T.mid}
          softColor={T.soft}
        />

        {/* ── Today's Goals ── */}
        <Text style={[styles.sectionTitle, { color: T.text }]}>{t("Today's Goals")}</Text>
        <View style={styles.goalsRow}>
          {GOALS.map((g, i) => (
            <TouchableOpacity
              key={g.id}
              style={styles.goalItem}
              onPress={() => onNavigate?.(g.id)}
              onPressIn={() => { tapHaptic(); goalSpring(i, 0.92); }}
              onPressOut={() => goalSpring(i, 1)}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  styles.goalCircle,
                  isToddler && styles.goalCircleBig,
                  { backgroundColor: isDark ? g.darkTint : g.tint, transform: [{ scale: goalSprings[i] }] },
                ]}
              >
                <GoalIcon icon={g.icon} color={g.color} size={isToddler ? 32 : 22} />
              </Animated.View>
              <Text style={[styles.goalLabel, { color: T.text }, isToddler && styles.goalLabelBig]}>{t(g.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!isToddler && (
          <>
            {/* ── My Zoo ── */}
            <Text style={[styles.sectionTitle, { color: T.text }]}>{t('My Zoo')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.zooRow}
            >
              {SPECIES_LIST.map((spec, i) => {
                const unlocked = level >= spec.unlockLevel;
                const active   = genetics.species === spec.type;
                return (
                  <TouchableOpacity
                    key={spec.type}
                    style={styles.zooItem}
                    onPress={() => onNavigate?.('MyZenZoo')}
                    onPressIn={() => { tapHaptic(); speciesSpring(i, 0.92); }}
                    onPressOut={() => speciesSpring(i, 1)}
                    activeOpacity={1}
                  >
                    <Animated.View
                      style={[
                        styles.zooCircle,
                        {
                          backgroundColor: unlocked ? (isDark ? T.card : '#FFFFFF') : (isDark ? T.bg : '#F5F2FA'),
                          borderColor: active ? PALETTE.purple : T.edge,
                          borderWidth: active ? 2.5 : 1.5,
                          transform: [{ scale: speciesSprings[i] }],
                        },
                      ]}
                    >
                      {unlocked ? (
                        <PetAvatar species={spec.type} bodyColor={spec.color} accentColor={spec.accent} muzzleColor={spec.muzzle} eyes={spec.eyes} size={38} />
                      ) : (
                        <Feather name="lock" size={18} color={T.soft} />
                      )}
                    </Animated.View>
                    <Text style={[styles.zooLabel, { color: unlocked ? T.mid : T.soft }]} numberOfLines={1}>
                      {t(spec.type)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Daily tip — Pre-Teen only; the wording is a bit much for Preschool ── */}
            {!isPreschool && (
              <View style={[styles.tipCard, { backgroundColor: isDark ? T.card : '#FFF9E8', borderColor: isDark ? T.edge : '#FFE5A0' }]}>
                <Text style={styles.tipLabel}>✨ {t('Daily Thought')}</Text>
                <Text style={[styles.tipText, { color: isDark ? T.mid : '#6B5700' }]}>{t(tip)}</Text>
              </View>
            )}

            {/* ── Gratitude journal ── */}
            <TouchableOpacity
              style={[
                styles.journalCard,
                {
                  backgroundColor: isDark ? '#1A1408' : '#FFF8E8',
                  borderColor:     isDark ? '#3A2A00' : '#FFE082',
                  transform:       [{ scale: journalBtn.val }],
                },
              ]}
              onPress={() => onNavigate?.('Journal')}
              onPressIn={journalBtn.pressIn}
              onPressOut={journalBtn.pressOut}
              activeOpacity={1}
            >
              <Text style={styles.journalEmoji}>📓</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.journalTitle, { color: T.text }]}>{t('Gratitude Journal')}</Text>
                <Text style={[styles.journalSub,   { color: T.mid  }]}>{t('Reflect on what made today good')}</Text>
              </View>
              {todayJournaled ? (
                <View style={styles.journalDoneBadge}>
                  <Text style={styles.journalDoneText}>{t('Done')} ✓</Text>
                </View>
              ) : (
                <View style={[styles.journalArrow, { backgroundColor: PALETTE.gold }]}>
                  <Feather name="arrow-right" size={18} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: 18, paddingBottom: 36 },

  topRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  topLeftGroup: { flexDirection: 'row', gap: 8 },
  iconBtn:      { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  greeting:   { fontSize: 20, fontWeight: '900', letterSpacing: -0.3 },
  langBtnText: { fontSize: 11, fontWeight: '900' },
  avatarBtn:  { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },

  moodBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: RADIUS.pill, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 18, marginBottom: 12, ...SHADOW.sm },
  moodText: { fontSize: 14, flex: 1 },
  moodArrow: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  statsRow:  { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  pill:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 13, borderRadius: RADIUS.pill, borderWidth: 1.5 },
  coinPill:  { borderColor: PALETTE.purple },
  pillEmoji: { fontSize: 14 },
  pillVal:   { fontSize: 12, fontWeight: '800' },

  bedtimeBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: RADIUS.lg, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16 },
  bedtimeEmoji:  { fontSize: 18 },
  bedtimeText:   { fontSize: 13, fontWeight: '700', flex: 1 },

  petCard:      { borderRadius: RADIUS.xl, height: 420, marginHorizontal: -18, marginBottom: 16, overflow: 'hidden', shadowColor: PALETTE.purple, ...SHADOW.lg },
  petCardInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  petCardGlassStrip: { position: 'absolute', top: 14, left: 14, zIndex: 2 },
  petCardGlassCard:  { paddingHorizontal: 14, paddingVertical: 8 },
  petCardGlassLabel: { fontSize: 12, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 },

  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: 14 },

  goalsRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  goalItem:   { alignItems: 'center', gap: 8, width: '23%' },
  goalCircle: { width: 58, height: 58, borderRadius: 29, justifyContent: 'center', alignItems: 'center' },
  goalCircleBig: { width: 76, height: 76, borderRadius: 38 },
  goalLabel:  { fontSize: 12, fontWeight: '700' },
  goalLabelBig: { fontSize: 14, fontWeight: '900' },

  zooRow:   { gap: 14, paddingRight: 4, paddingBottom: 4, marginBottom: 22 },
  zooItem:  { alignItems: 'center', gap: 6, width: 66 },
  zooCircle:{ width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  zooLabel: { fontSize: 10.5, fontWeight: '700' },

  tipCard:  { borderRadius: RADIUS.lg, padding: 14, marginBottom: 14, borderWidth: 1.5, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipLabel: { fontSize: 11, fontWeight: '800', color: PALETTE.gold, marginBottom: 4 },
  tipText:  { fontSize: 13, fontWeight: '500', lineHeight: 19, flex: 1 },

  journalCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: RADIUS.lg, padding: 18, borderWidth: 1.5, shadowColor: PALETTE.gold, ...SHADOW.sm },
  journalEmoji:     { fontSize: 34 },
  journalTitle:     { fontSize: 15, fontWeight: '900', marginBottom: 3 },
  journalSub:       { fontSize: 12, fontWeight: '600' },
  journalDoneBadge: { backgroundColor: PALETTE.green, borderRadius: RADIUS.sm + 4, paddingHorizontal: 12, paddingVertical: 6 },
  journalDoneText:  { fontSize: 12, fontWeight: '800', color: '#FFF' },
  journalArrow:     { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
