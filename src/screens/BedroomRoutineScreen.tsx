import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Easing, ScrollView, Dimensions, type DimensionValue,
} from 'react-native';
import { Audio, AVPlaybackSource } from 'expo-av';
import { useZenZoo } from '../context/ZenZooContext';
import { PALETTE, RADIUS, SHADOW } from '../theme/theme';

const { width: SW, height: SH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO SOURCES
// To enable a track, replace `null` with:
//   • a local file:  require('../../assets/sounds/rain.mp3')
//   • a remote URI:  { uri: 'https://your-cdn.com/rain.mp3' }
// ─────────────────────────────────────────────────────────────────────────────
const SOUNDS: { id: string; label: string; emoji: string; source: AVPlaybackSource | null }[] = [
  { id: 'rain',  label: 'Rainforest Canopy', emoji: '🌧️', source: require('../../assets/sounds/canopy.mp3')  },
  { id: 'lofi',  label: 'Lo-Fi Hum', emoji: '🎵', source: require('../../assets/sounds/lofi.mp3')  },
  { id: 'ocean', label: 'Whale Song',  emoji: '🌊', source: require('../../assets/sounds/whale.mp3')  },
];

// ─────────────────────────────────────────────────────────────────────────────

const STARS: { x: number; y: number; s: number }[] = [
  { x: SW * 0.10, y: SH * 0.03, s: 2   }, { x: SW * 0.28, y: SH * 0.02, s: 1.5 },
  { x: SW * 0.47, y: SH * 0.05, s: 3   }, { x: SW * 0.65, y: SH * 0.03, s: 2.5 },
  { x: SW * 0.83, y: SH * 0.07, s: 1.5 }, { x: SW * 0.05, y: SH * 0.11, s: 2   },
  { x: SW * 0.38, y: SH * 0.09, s: 3   }, { x: SW * 0.58, y: SH * 0.13, s: 1.5 },
  { x: SW * 0.78, y: SH * 0.08, s: 2.5 }, { x: SW * 0.20, y: SH * 0.16, s: 2   },
  { x: SW * 0.52, y: SH * 0.14, s: 1.5 }, { x: SW * 0.72, y: SH * 0.18, s: 2   },
  { x: SW * 0.91, y: SH * 0.12, s: 3   }, { x: SW * 0.14, y: SH * 0.22, s: 2.5 },
  { x: SW * 0.62, y: SH * 0.20, s: 1.5 }, { x: SW * 0.33, y: SH * 0.25, s: 2   },
  { x: SW * 0.86, y: SH * 0.24, s: 2   }, { x: SW * 0.44, y: SH * 0.28, s: 1.5 },
  { x: SW * 0.18, y: SH * 0.30, s: 2.5 }, { x: SW * 0.70, y: SH * 0.27, s: 2   },
];

const TASKS = [
  { id: 1, label: 'Dim the lights',                    emoji: '💡', coins: 5  },
  { id: 2, label: 'Put phone on charger away from bed', emoji: '🔌', coins: 10 },
  { id: 3, label: 'Drink a glass of water',             emoji: '💧', coins: 5  },
  { id: 4, label: 'Brush teeth',                        emoji: '🦷', coins: 5  },
];

const SLEEP_TIMERS = [15, 30, 45];

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';
const PHASES: { phase: BreathPhase; ms: number; label: string; scale: number; glow: number }[] = [
  { phase: 'inhale', ms: 4000, label: 'Breathe In...',  scale: 1.45, glow: 1   },
  { phase: 'hold',   ms: 7000, label: 'Hold...',        scale: 1.45, glow: 0.7 },
  { phase: 'exhale', ms: 8000, label: 'Breathe Out...', scale: 1.0,  glow: 0   },
];
const PHASE_EMOJI: Record<BreathPhase, string> = {
  idle: '💤', inhale: '🌬️', hold: '✨', exhale: '😮‍💨',
};

export default function BedroomRoutineScreen({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { awardCoins, ageGroup, language, t } = useZenZoo();
  // Ambient soundscape picking + a sleep timer is an extra layer of choices
  // that a toddler doesn't need — checklist + breathing is plenty for them.
  const isToddler = ageGroup === 'Toddler (2-4)';

  const [completed,   setCompleted]   = useState<Set<number>>(new Set());
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [breathLabel, setBreathLabel] = useState('Tap to begin');
  const [breathActive, setBreathActive] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isLoading,   setIsLoading]   = useState(false);
  const [sleepTimer,  setSleepTimer]  = useState<number | null>(null);
  const [timerSecs,   setTimerSecs]   = useState<number | null>(null);

  // ── Animated values ───────────────────────────────────────────────────────
  const petFloat    = useRef(new Animated.Value(0)).current;
  const petNod      = useRef(new Animated.Value(0)).current;
  const moonScale   = useRef(new Animated.Value(1)).current;
  const breathScale = useRef(new Animated.Value(1)).current;
  const breathGlow  = useRef(new Animated.Value(0)).current;
  const taskScales  = useRef(TASKS.map(() => new Animated.Value(1))).current;
  const starAnims   = useRef(STARS.map((_, i) => new Animated.Value(0.2 + (i % 5) * 0.15))).current;

  // ── Refs for stable access across async callbacks ─────────────────────────
  const soundRef         = useRef<Audio.Sound | null>(null);
  const breathActiveRef  = useRef(false);
  const breathTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Ambient animations ────────────────────────────────────────────────────
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(petFloat, { toValue: -10, duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(petFloat, { toValue: 0,   duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(moonScale, { toValue: 1.12, duration: 3800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(moonScale, { toValue: 1,    duration: 3800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    starAnims.forEach((anim, i) => {
      const t = setTimeout(() => {
        const twinkle = () => {
          Animated.sequence([
            Animated.timing(anim, { toValue: 0.1, duration: 700 + i * 70, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.9, duration: 700 + i * 70, useNativeDriver: true }),
          ]).start(({ finished }) => { if (finished) twinkle(); });
        };
        twinkle();
      }, i * 180);
      timeouts.push(t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // ── Pet nod ───────────────────────────────────────────────────────────────
  const triggerNod = useCallback(() => {
    Animated.sequence([
      Animated.timing(petNod, { toValue: 1,  duration: 180, useNativeDriver: true }),
      Animated.timing(petNod, { toValue: -1, duration: 180, useNativeDriver: true }),
      Animated.timing(petNod, { toValue: 0,  duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Checklist ─────────────────────────────────────────────────────────────
  const toggleTask = (id: number, idx: number) => {
    if (completed.has(id)) return;
    setCompleted(prev => new Set(prev).add(id));
    awardCoins(TASKS[idx].coins);
    triggerNod();
    Animated.sequence([
      Animated.spring(taskScales[idx], { toValue: 1.06, friction: 3, tension: 200, useNativeDriver: true }),
      Animated.spring(taskScales[idx], { toValue: 1,    friction: 6,               useNativeDriver: true }),
    ]).start();
  };

  // ── Breathing ─────────────────────────────────────────────────────────────
  const runPhase = useCallback((idx: number) => {
    const { phase, ms, label, scale, glow } = PHASES[idx];
    setBreathPhase(phase);
    setBreathLabel(label);
    Animated.parallel([
      Animated.timing(breathScale, { toValue: scale, duration: phase === 'hold' ? 300 : ms, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(breathGlow,  { toValue: glow,  duration: phase === 'hold' ? 300 : ms, useNativeDriver: true }),
    ]).start();
    breathTimeoutRef.current = setTimeout(() => {
      if (!breathActiveRef.current) return;
      runPhase((idx + 1) % PHASES.length);
    }, ms);
  }, []);

  const toggleBreath = () => {
    if (breathActiveRef.current) {
      breathActiveRef.current = false;
      setBreathActive(false);
      if (breathTimeoutRef.current) clearTimeout(breathTimeoutRef.current);
      Animated.parallel([
        Animated.timing(breathScale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(breathGlow,  { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
      setBreathPhase('idle');
      setBreathLabel('Tap to begin');
    } else {
      breathActiveRef.current = true;
      setBreathActive(true);
      runPhase(0);
    }
  };

  // ── Audio ─────────────────────────────────────────────────────────────────
  const unloadCurrent = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
    }
  }, []);

  const handleSoundToggle = useCallback(async (id: string) => {
    const cfg = SOUNDS.find(s => s.id === id);
    if (!cfg?.source) return; // no audio file configured — ignore tap

    if (activeSound === id) {
      // Stop current track
      await unloadCurrent();
      setActiveSound(null);
      setSleepTimer(null);
    } else {
      setIsLoading(true);
      await unloadCurrent();
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
        const { sound } = await Audio.Sound.createAsync(
          cfg.source,
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
        setActiveSound(id);
      } catch (err) {
        console.warn('expo-av: failed to load sound', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [activeSound, unloadCurrent]);

  // ── Sleep timer ───────────────────────────────────────────────────────────
  const startTimer = useCallback((minutes: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const endAt = Date.now() + minutes * 60 * 1000;
    setTimerSecs(minutes * 60);

    timerIntervalRef.current = setInterval(async () => {
      const rem = Math.round((endAt - Date.now()) / 1000);
      if (rem <= 0) {
        clearInterval(timerIntervalRef.current!);
        timerIntervalRef.current = null;
        await unloadCurrent();
        setActiveSound(null);
        setTimerSecs(null);
        setSleepTimer(null);
      } else {
        setTimerSecs(rem);
      }
    }, 1000);
  }, [unloadCurrent]);

  const handleTimerSelect = useCallback((minutes: number) => {
    if (sleepTimer === minutes) {
      // Cancel timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      setSleepTimer(null);
      setTimerSecs(null);
    } else {
      setSleepTimer(minutes);
      startTimer(minutes);
    }
  }, [sleepTimer, startTimer]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => {
    breathActiveRef.current = false;
    if (breathTimeoutRef.current) clearTimeout(breathTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    unloadCurrent();
  }, []);

  const fmtTimer = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const nodRotate  = petNod.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-10deg', '0deg', '10deg'] });
  const progressPct = completed.size / TASKS.length;
  const anySourceConfigured = SOUNDS.some(s => s.source !== null);

  return (
    <View style={styles.screen}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Stars */}
      {STARS.map((star, i) => (
        <Animated.View
          key={i}
          style={[styles.star, {
            left: star.x, top: star.y,
            width: star.s, height: star.s, borderRadius: star.s / 2,
            opacity: starAnims[i],
          }]}
        />
      ))}

      <Animated.Text style={[styles.moon, { transform: [{ scale: moonScale }] }]}>🌙</Animated.Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <Text style={styles.title}>{t('Bedtime Routine')} 🌙</Text>
        <Text style={styles.subtitle}>{t('Wind down and drift off peacefully')}</Text>

        {/* Sleepy companion */}
        <View style={styles.petWrap}>
          <Animated.Text
            style={[styles.petEmoji, { transform: [{ translateY: petFloat }, { rotate: nodRotate }] }]}
          >
            😴
          </Animated.Text>
          <Text style={styles.petCaption}>{t('Your ZenZoo friend is getting sleepy...')}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>{t('Sleep Prep Progress')}</Text>
            <Text style={styles.progressCount}>
              {language === 'es' ? `${completed.size}/${TASKS.length} hecho` : `${completed.size}/${TASKS.length} done`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progressPct * 100)}%` as DimensionValue }]} />
          </View>
        </View>

        {/* Checklist */}
        <Text style={styles.sectionTitle}>{t('Sleep Prep Checklist')}</Text>
        {TASKS.map((task, i) => {
          const done = completed.has(task.id);
          return (
            <Animated.View
              key={task.id}
              style={[styles.taskCard, done && styles.taskCardDone, { transform: [{ scale: taskScales[i] }] }]}
            >
              <TouchableOpacity
                style={styles.taskRow}
                onPress={() => toggleTask(task.id, i)}
                disabled={done}
                activeOpacity={0.75}
              >
                <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
                  <Text style={styles.checkIcon}>{done ? '✓' : task.emoji}</Text>
                </View>
                <View style={styles.taskTextCol}>
                  <Text style={[styles.taskLabel, done && styles.taskLabelDone]}>{t(task.label)}</Text>
                  <Text style={styles.taskCoins}>+{task.coins} {t('Calm Coins')}</Text>
                </View>
                {done && <Text style={styles.taskBadge}>{t('Done')} ✨</Text>}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* 4-7-8 Breathing */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{t('4-7-8 Wind-Down Breathing')}</Text>
        <Text style={styles.sectionSub}>{t('Inhale 4s  ·  Hold 7s  ·  Exhale 8s')}</Text>

        <View style={styles.breathWrap}>
          <TouchableOpacity onPress={toggleBreath} activeOpacity={0.9}>
            <Animated.View style={[styles.breathOuter, { transform: [{ scale: breathScale }] }]}>
              <Animated.View style={[styles.breathGlowRing, { opacity: breathGlow }]} />
              <View style={styles.breathInner}>
                <Text style={styles.breathEmoji}>{PHASE_EMOJI[breathPhase]}</Text>
                <Text style={styles.breathLabel}>{t(breathLabel)}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
          {breathActive && <Text style={styles.breathStop}>{t('Tap circle to stop')}</Text>}
        </View>

        {/* Ambient Soundscape — hidden for Toddler, an extra layer of choice they don't need */}
        {!isToddler && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{t('Ambient Soundscape')}</Text>
            <Text style={styles.sectionSub}>
              {anySourceConfigured
                ? t('Tap a track to play — loops until stopped or timer runs out')
                : t('Add MP3s to assets/sounds/ and set the source fields in BedroomRoutineScreen.tsx')}
            </Text>

            {SOUNDS.map(s => {
              const on      = activeSound === s.id;
              const hasFile = s.source !== null;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.soundCard, on && styles.soundCardOn, !hasFile && styles.soundCardDisabled]}
                  onPress={() => handleSoundToggle(s.id)}
                  activeOpacity={hasFile ? 0.8 : 1}
                >
                  <Text style={[styles.soundEmoji, !hasFile && { opacity: 0.35 }]}>{s.emoji}</Text>
                  <View style={styles.soundTextCol}>
                    <Text style={[styles.soundName, on && styles.soundNameOn, !hasFile && styles.soundNameDisabled]}>
                      {t(s.label)}
                    </Text>
                    {!hasFile && <Text style={styles.noFileHint}>{t('No audio file — see comment in source')}</Text>}
                  </View>
                  <View style={[styles.soundToggle, on && styles.soundToggleOn, !hasFile && styles.soundToggleDisabled]}>
                    <Text style={styles.soundToggleText}>
                      {isLoading && on ? '…' : on ? '⏸' : '▶'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Sleep timer — only when a track is active */}
            {activeSound && (
              <View style={styles.timerCard}>
                <Text style={styles.timerTitle}>⏱ {t('Sleep Timer')}</Text>
                <View style={styles.timerRow}>
                  {SLEEP_TIMERS.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.timerChip, sleepTimer === m && styles.timerChipOn]}
                      onPress={() => handleTimerSelect(m)}
                    >
                      <Text style={[styles.timerChipText, sleepTimer === m && styles.timerChipTextOn]}>{m} min</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {timerSecs !== null && (
                  <Text style={styles.timerCountdown}>
                    {language === 'es' ? `El audio se detiene en ${fmtTimer(timerSecs)}` : `Audio stops in ${fmtTimer(timerSecs)}`}
                  </Text>
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#1E1B4B' },
  bgTop:     { position: 'absolute', top: 0, left: 0, right: 0, height: '60%', backgroundColor: '#1E1B4B' },
  bgBottom:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: '#312E81', opacity: 0.55 },
  star:      { position: 'absolute', backgroundColor: '#E0E7FF' },
  moon:      { position: 'absolute', top: SH * 0.04, right: SW * 0.07, fontSize: 38 },
  scroll:    { flex: 1 },
  scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 32 },

  title:    { fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 4, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: '#A5B4FC', textAlign: 'center', marginBottom: 28, fontWeight: '600' },

  petWrap:    { alignItems: 'center', marginBottom: 24 },
  petEmoji:   { fontSize: 86 },
  petCaption: { fontSize: 14, color: '#A5B4FC', marginTop: 10, fontWeight: '600' },

  progressCard:   { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: RADIUS.lg, padding: 16, marginBottom: 26, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  progressTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel:  { fontSize: 14, color: '#A5B4FC', fontWeight: '700' },
  progressCount:  { fontSize: 14, color: '#C4B5FD', fontWeight: '800' },
  progressTrack:  { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: PALETTE.violet, borderRadius: 6 },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  sectionSub:   { fontSize: 13, color: '#A5B4FC', marginBottom: 16, fontWeight: '600' },

  taskCard:     { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.lg, marginBottom: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  taskCardDone: { backgroundColor: 'rgba(139,92,246,0.18)', borderColor: 'rgba(139,92,246,0.35)' },
  taskRow:      { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  checkCircle:  { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  checkCircleDone: { backgroundColor: PALETTE.violet, borderColor: PALETTE.violet },
  checkIcon:    { fontSize: 20 },
  taskTextCol:  { flex: 1 },
  taskLabel:    { fontSize: 15, color: '#FFFFFF', fontWeight: '700', marginBottom: 3 },
  taskLabelDone:{ color: '#64748B', textDecorationLine: 'line-through' },
  taskCoins:    { fontSize: 12, color: '#A78BFA', fontWeight: '600' },
  taskBadge:    { fontSize: 13, color: '#C4B5FD', fontWeight: '800' },

  breathWrap:     { alignItems: 'center', marginBottom: 14, paddingVertical: 12 },
  breathOuter:    { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(251,191,36,0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: 'rgba(251,191,36,0.3)', shadowColor: PALETTE.amber, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.55, shadowRadius: 28, elevation: 12 },
  breathGlowRing: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(251,191,36,0.2)' },
  breathInner:    { alignItems: 'center' },
  breathEmoji:    { fontSize: 44, marginBottom: 10 },
  breathLabel:    { fontSize: 16, color: '#FDE68A', fontWeight: '800', textAlign: 'center' },
  breathStop:     { marginTop: 14, fontSize: 13, color: '#A5B4FC', fontWeight: '600' },

  soundCard:         { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: RADIUS.lg, padding: 18, marginBottom: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', gap: 14 },
  soundCardOn:       { backgroundColor: PALETTE.indigo + '33', borderColor: PALETTE.indigo + '80' },
  soundCardDisabled: { opacity: 0.5 },
  soundEmoji:        { fontSize: 28 },
  soundTextCol:      { flex: 1 },
  soundName:         { fontSize: 16, color: '#94A3B8', fontWeight: '700' },
  soundNameOn:       { color: '#FFFFFF' },
  soundNameDisabled: { color: '#475569' },
  noFileHint:        { fontSize: 11, color: '#475569', marginTop: 3 },
  soundToggle:         { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  soundToggleOn:       { backgroundColor: PALETTE.indigo },
  soundToggleDisabled: { backgroundColor: 'rgba(255,255,255,0.04)' },
  soundToggleText:     { fontSize: 17, color: '#FFFFFF' },

  timerCard:       { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 18, marginTop: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  timerTitle:      { fontSize: 14, color: '#A5B4FC', fontWeight: '800', marginBottom: 14 },
  timerRow:        { flexDirection: 'row', gap: 10 },
  timerChip:       { flex: 1, paddingVertical: 13, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  timerChipOn:     { backgroundColor: PALETTE.indigo + '66', borderColor: PALETTE.indigo },
  timerChipText:   { fontSize: 14, color: '#94A3B8', fontWeight: '700' },
  timerChipTextOn: { color: '#FFFFFF' },
  timerCountdown:  { textAlign: 'center', marginTop: 14, fontSize: 15, color: '#C4B5FD', fontWeight: '800' },
});
