import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Easing, Modal, ScrollView, SafeAreaView,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';

const PURPLE = PALETTE.purple;
const MINT   = PALETTE.mint;
const CORAL  = PALETTE.coral;

const C      = 210;
const STROKE = 14;
const INNER  = C - STROKE * 2;

type Phase = 'focus' | 'shortBreak' | 'longBreak';

const PHASE_CFG = {
  focus:      { label: 'Focus Time',  short: 'Focus', color: PURPLE, bg: '#F0EDFF', emoji: '🦉', tip: 'Stay on your task! You can do it.' },
  shortBreak: { label: 'Short Break', short: 'Break', color: MINT,   bg: '#E6FBF7', emoji: '🐱', tip: 'Take a little rest and stretch!' },
  longBreak:  { label: 'Long Break',  short: 'Rest',  color: CORAL,  bg: '#FFF0EC', emoji: '🐻', tip: 'Great work! Enjoy your long break.' },
} as const;

// Attention spans scale hugely by age — a toddler doing a 25-minute Pomodoro
// isn't realistic, so the default session length (and how much it can be
// customized) grows with the child's age group.
const DURATIONS_BY_TIER = {
  toddler:   { focus: 5  * 60, shortBreak: 2 * 60, longBreak: 5  * 60 },
  preschool: { focus: 10 * 60, shortBreak: 3 * 60, longBreak: 10 * 60 },
  bigkid:    { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 },
};

const DURATION_OPTIONS_BY_TIER = {
  toddler:   { focus: [3, 5, 8],           shortBreak: [1, 2, 3],  longBreak: [3, 5, 8]      },
  preschool: { focus: [5, 10, 15],         shortBreak: [2, 3, 5],  longBreak: [5, 10, 15]    },
  bigkid:    { focus: [15, 20, 25, 30, 45, 60], shortBreak: [3, 5, 10], longBreak: [10, 15, 20, 30] },
};

export default function FocusScreen({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { awardCoins, addFocusMinutes, isDark, ageGroup, language, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const tier: 'toddler' | 'preschool' | 'bigkid' =
    ageGroup === 'Toddler (2-4)' ? 'toddler' : ageGroup === 'Preschool (4-6)' ? 'preschool' : 'bigkid';
  const isToddler = tier === 'toddler';
  const DEFAULT_DURATIONS = DURATIONS_BY_TIER[tier];

  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [phase, setPhase]         = useState<Phase>('focus');
  const [timeLeft, setTimeLeft]   = useState(DEFAULT_DURATIONS.focus);
  const [running, setRunning]     = useState(false);
  const [sessions, setSessions]   = useState(0);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const [showSettings, setShowSettings]   = useState(false);

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const petFloat     = useRef(new Animated.Value(0)).current;
  const petScale     = useRef(new Animated.Value(1)).current;
  const playBtnScale = useRef(new Animated.Value(1)).current;
  const playSpring   = (to: number) =>
    Animated.spring(playBtnScale, { toValue: to, friction: 5, tension: 300, useNativeDriver: true });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(petFloat, { toValue: -10, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(petFloat, { toValue: 0,   duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (running) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(petScale, { toValue: 1.1, duration: 900, useNativeDriver: true }),
          Animated.timing(petScale, { toValue: 1,   duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    petScale.setValue(1);
  }, [running]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setPhaseComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    if (!phaseComplete) return;
    setPhaseComplete(false);
    if (phase === 'focus') {
      awardCoins(10);
      addFocusMinutes(Math.round(durations.focus / 60));
      const next = sessions + 1;
      setSessions(next);
      goToPhase(next % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      goToPhase('focus');
    }
  }, [phaseComplete]);

  const goToPhase = (p: Phase) => { setPhase(p); setTimeLeft(durations[p]); setRunning(false); };
  const reset     = () => { setRunning(false); setTimeLeft(durations[phase]); };
  const fmt       = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const cfg      = PHASE_CFG[phase];
  const progress = 1 - timeLeft / durations[phase];
  const rightDeg = Math.min(progress, 0.5) * 360 - 180;
  const leftDeg  = progress > 0.5 ? (progress - 0.5) * 360 - 180 : -180;

  const safeBg      = isDark ? T.bg : cfg.bg;
  const ringCenterBg = isDark ? T.card : cfg.bg;
  const sideBtnBg   = isDark ? T.card : '#F5F0FF';
  const chipInactiveBg = isDark ? T.card : '#FFFFFF88';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: safeBg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: cfg.color }]}>{t('Focus Time')}</Text>
          <Text style={[styles.headerSub, { color: T.mid }]}>{t('Study with your ZenZoo friends 📚')}</Text>
        </View>

        {/* ── Phase selector ── */}
        <View style={styles.phaseRow}>
          {(Object.keys(PHASE_CFG) as Phase[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.phaseChip, { backgroundColor: phase === p ? PHASE_CFG[p].color : chipInactiveBg }]}
              onPress={() => goToPhase(p)}
              activeOpacity={0.8}
            >
              <Text style={styles.phaseChipIcon}>{PHASE_CFG[p].emoji}</Text>
              <Text style={[styles.phaseChipText, { color: phase === p ? '#FFFFFF' : T.mid }]}>
                {t(PHASE_CFG[p].short)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Ring timer ── */}
        <View style={styles.ringWrap}>
          <View style={[styles.ringTrack, { borderColor: isDark ? T.edge : cfg.bg }]} />

          <View style={styles.clipRight}>
            <View style={[styles.ringFill, { borderColor: cfg.color, left: -C / 2, transform: [{ rotate: `${rightDeg}deg` }] }]} />
          </View>
          {progress > 0.5 && (
            <View style={styles.clipLeft}>
              <View style={[styles.ringFill, { borderColor: cfg.color, left: 0, transform: [{ rotate: `${leftDeg}deg` }] }]} />
            </View>
          )}

          <View style={[styles.ringCenter, { backgroundColor: ringCenterBg }]}>
            <Animated.Text style={[styles.ringEmoji, { transform: [{ translateY: petFloat }, { scale: petScale }] }]}>
              {cfg.emoji}
            </Animated.Text>
            <Text style={[styles.timerText, { color: cfg.color }]}>{fmt(timeLeft)}</Text>
            <Text style={[styles.phaseTag, { color: cfg.color }]}>{t(cfg.label)}</Text>
          </View>
        </View>

        {/* ── Session dots ── */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[styles.dot, { backgroundColor: isDark ? T.edge : '#DDD9F0' }, i < sessions % 4 && { backgroundColor: cfg.color }]} />
          ))}
        </View>
        <Text style={[styles.dotLabel, { color: T.mid }]}>
          {language === 'es' ? `${sessions % 4}/4 sesiones en este ciclo` : `${sessions % 4}/4 sessions this cycle`}
        </Text>

        {/* ── Controls ── */}
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.sideBtn, { backgroundColor: sideBtnBg }]} onPress={reset} activeOpacity={0.75}>
            <Feather name="rotate-ccw" size={22} color={cfg.color} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: cfg.color, transform: [{ scale: playBtnScale }] }]}
            onPress={() => setRunning(r => !r)}
            onPressIn={() => { tapHaptic(); playSpring(0.92).start(); }}
            onPressOut={() => playSpring(1).start()}
            activeOpacity={1}
          >
            <Feather name={running ? 'pause' : 'play'} size={28} color="#FFF" />
          </TouchableOpacity>

          {isToddler ? (
            <View style={styles.sideBtn} />
          ) : (
            <TouchableOpacity style={[styles.sideBtn, { backgroundColor: sideBtnBg }]} onPress={() => setShowSettings(true)} activeOpacity={0.75}>
              <Feather name="settings" size={22} color={cfg.color} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Tip card ── */}
        <View style={[styles.tipCard, { backgroundColor: T.card, borderColor: cfg.color + '44' }]}>
          <Text style={styles.tipEmoji}>{cfg.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tipTitle, { color: cfg.color }]}>{t(cfg.label)}</Text>
            <Text style={[styles.tipText, { color: T.mid }]}>{t(cfg.tip)}</Text>
          </View>
        </View>

        {/* ── Reward banner ── */}
        <View style={[styles.rewardCard, { backgroundColor: isDark ? '#1A1500' : '#FFF9E3', borderColor: isDark ? '#3A3000' : '#FFE5A0' }]}>
          <Text style={styles.rewardIcon}>💎</Text>
          <View>
            <Text style={[styles.rewardMain, { color: isDark ? '#FFD060' : '#7A5500' }]}>{t('+10 Calm Coins per focus session')}</Text>
            <Text style={[styles.rewardSub, { color: isDark ? '#A08830' : '#A07830' }]}>
              {language === 'es'
                ? `${sessions} sesión${sessions !== 1 ? 'es' : ''} completada${sessions !== 1 ? 's' : ''} hoy`
                : `${sessions} session${sessions !== 1 ? 's' : ''} completed today`}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Settings modal ── */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: T.card }]}>
            <View style={[styles.modalHandle, { backgroundColor: T.soft }]} />
            <Text style={[styles.modalTitle, { color: T.text }]}>{t('Customize Timer')} ⚙️</Text>
            <Text style={[styles.modalSub, { color: T.mid }]}>{t('Pick durations that work best for you')}</Text>

            {([
              { key: 'focus',      label: '🧠 Focus Duration',  options: DURATION_OPTIONS_BY_TIER[tier].focus,      color: PURPLE },
              { key: 'shortBreak', label: '☕ Short Break',      options: DURATION_OPTIONS_BY_TIER[tier].shortBreak, color: MINT   },
              { key: 'longBreak',  label: '🌿 Long Break',       options: DURATION_OPTIONS_BY_TIER[tier].longBreak,  color: CORAL  },
            ] as const).map(group => (
              <View key={group.key} style={styles.modalGroup}>
                <Text style={[styles.modalGroupLabel, { color: T.text }]}>{t(group.label)}</Text>
                <View style={styles.chipRow}>
                  {group.options.map(m => {
                    const active = durations[group.key] === m * 60;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.dChip, { backgroundColor: isDark ? T.edge : '#EEE8F4' }, active && { backgroundColor: group.color }]}
                        onPress={() => setDurations(d => ({ ...d, [group.key]: m * 60 }))}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.dChipText, { color: isDark ? T.text : T.mid }, active && styles.dChipTextActive]}>{m}m</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => { setTimeLeft(durations[phase]); setShowSettings(false); }}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>{t('Save & Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  content: { alignItems: 'center', paddingBottom: 40, paddingHorizontal: 20 },

  header:      { alignItems: 'center', paddingTop: 22, paddingBottom: 18 },
  headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.4 },
  headerSub:   { fontSize: 14, marginTop: 4, fontWeight: '600' },

  phaseRow:      { flexDirection: 'row', gap: 8, marginBottom: 28 },
  phaseChip:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.lg },
  phaseChipIcon: { fontSize: 15 },
  phaseChipText: { fontSize: 13, fontWeight: '700' },

  ringWrap:   { width: C, height: C, marginBottom: 18 },
  ringTrack:  { position: 'absolute', top: 0, left: 0, width: C, height: C, borderRadius: C/2, borderWidth: STROKE },
  clipRight:  { position: 'absolute', top: 0, left: C/2, width: C/2, height: C, overflow: 'hidden' },
  clipLeft:   { position: 'absolute', top: 0, left: 0,   width: C/2, height: C, overflow: 'hidden' },
  ringFill:   { position: 'absolute', top: 0, width: C, height: C, borderRadius: C/2, borderWidth: STROKE },
  ringCenter: { position: 'absolute', top: STROKE, left: STROKE, width: INNER, height: INNER, borderRadius: INNER/2, justifyContent: 'center', alignItems: 'center' },
  ringEmoji:  { fontSize: 44, marginBottom: 4 },
  timerText:  { fontSize: 38, fontWeight: '900', letterSpacing: 2 },
  phaseTag:   { fontSize: 12, fontWeight: '700', marginTop: 3 },

  dotsRow:  { flexDirection: 'row', gap: 10, marginBottom: 6 },
  dot:      { width: 14, height: 14, borderRadius: 7 },
  dotLabel: { fontSize: 12, fontWeight: '600', marginBottom: 26 },

  controls:    { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  sideBtn:     { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  sideBtnText: { fontSize: 26, fontWeight: '700' },
  playBtn:     { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', ...SHADOW.md },
  playBtnText: { fontSize: 32, color: '#FFF' },

  tipCard:  { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.lg, padding: 16, marginBottom: 12, borderWidth: 1.5 },
  tipEmoji: { fontSize: 32 },
  tipTitle: { fontSize: 14, fontWeight: '800', marginBottom: 3 },
  tipText:  { fontSize: 13, lineHeight: 18 },

  rewardCard: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.lg, padding: 16, borderWidth: 1.5 },
  rewardIcon: { fontSize: 28 },
  rewardMain: { fontSize: 14, fontWeight: '800' },
  rewardSub:  { fontSize: 12, marginTop: 2, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard:    { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: 28, paddingBottom: 52 },
  modalHandle:  { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  modalSub:     { fontSize: 13, textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  modalGroup:      { marginBottom: 18 },
  modalGroupLabel: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  chipRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dChip:        { paddingHorizontal: 18, paddingVertical: 10, borderRadius: RADIUS.md },
  dChipText:    { fontSize: 14, fontWeight: '700' },
  dChipTextActive: { color: '#FFFFFF' },

  saveBtn:     { marginTop: 24, backgroundColor: PURPLE, borderRadius: RADIUS.lg, paddingVertical: 18, alignItems: 'center', shadowColor: PURPLE, ...SHADOW.md },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
