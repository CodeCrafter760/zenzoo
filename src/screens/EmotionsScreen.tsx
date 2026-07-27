import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, SafeAreaView, type DimensionValue } from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { PALETTE, RADIUS, SHADOW, DARK_THEME, LIGHT_THEME } from '../theme/theme';
import { tapHaptic, successHaptic } from '../utils/haptics';
import { showAlert } from '../utils/alert';
import { Feather } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import BreathingIcon from '../components/icons/BreathingIcon';

// ── Phase config ─────────────────────────────────────────────────────────────
const PHASES = {
  Ready: {
    label:    'Ready to Breathe',
    message:  "Let's calm down together!",
    animal:   '🌸',
    primary:  PALETTE.mint,
    light:    '#E6FBF7',
    mid:      '#B2EDE4',
    text:     '#1A8A79',
    duration: 0,
  },
  Inhale: {
    label:    'Breathe In',
    message:  'Breathe in slowly...',
    animal:   '🐋',
    primary:  PALETTE.sky,
    light:    '#EAF6FD',
    mid:      '#B0DDF5',
    text:     '#1E6F96',
    duration: 4,
  },
  Hold: {
    label:    'Hold',
    message:  'Hold it gently...',
    animal:   '⭐',
    primary:  PALETTE.gold,
    light:    '#FFF8E3',
    mid:      '#FFE09A',
    text:     '#8A6200',
    duration: 4,
  },
  Exhale: {
    label:    'Breathe Out',
    message:  'Let it all out...',
    animal:   '🦋',
    primary:  '#A88FF0',
    light:    '#F2EDFF',
    mid:      '#CFC0FA',
    text:     '#5A3DAA',
    duration: 4,
  },
} as const;

type PhaseName = keyof typeof PHASES;

// ── Bubble positions (decorative) ────────────────────────────────────────────
const BUBBLES = [
  { x: '7%',  y: '10%', size: 16, delay: 0    },
  { x: '84%', y: '7%',  size: 11, delay: 400  },
  { x: '75%', y: '20%', size: 20, delay: 800  },
  { x: '12%', y: '26%', size: 13, delay: 1200 },
  { x: '89%', y: '38%', size: 15, delay: 600  },
  { x: '5%',  y: '52%', size: 9,  delay: 1600 },
];

export default function EmotionsScreen() {
  const { awardCoins, addBreathingSession, isDark, ageGroup, language, t } = useZenZoo();
  // "Box breathing · 4s in · 4s hold · 4s out" is jargon a pre-reader can't
  // use — Toddler & Preschool get a plain-language line instead.
  const isPreTeen = ageGroup === 'Pre-Teen (6-9)';
  const [isBreathing,      setIsBreathing]      = useState(false);
  const [phase,            setPhase]             = useState<PhaseName>('Ready');
  const [secondsLeft,      setSecondsLeft]       = useState(4);
  const [completedCycles,  setCompletedCycles]   = useState(0);

  const cfg = PHASES[phase];

  const circleScale = useRef(new Animated.Value(1)).current;
  const animalFloat = useRef(new Animated.Value(0)).current;
  const bubbleAnims = useRef(BUBBLES.map(() => new Animated.Value(0))).current;
  const mainBtnScale = useRef(new Animated.Value(1)).current;
  const btnSpring    = (to: number) =>
    Animated.spring(mainBtnScale, { toValue: to, friction: 5, tension: 300, useNativeDriver: true });

  // Bubble float loops
  useEffect(() => {
    bubbleAnims.forEach((anim, i) => {
      const t = setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 2200 + i * 280, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
            Animated.timing(anim, { toValue: 0, duration: 2200 + i * 280, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
          ])
        ).start();
      }, BUBBLES[i].delay);
      return () => clearTimeout(t);
    });
  }, []);

  // Animal gentle float
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animalFloat, { toValue: -7, duration: 1900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(animalFloat, { toValue: 0,  duration: 1900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  // Phase countdown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isBreathing) return;

    if (secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    } else {
      if (phase === 'Inhale') {
        transitionTo('Hold');
      } else if (phase === 'Hold') {
        transitionTo('Exhale');
      } else if (phase === 'Exhale') {
        setCompletedCycles(c => c + 1);
        awardCoins(10);
        addBreathingSession();
        successHaptic();
        showAlert(t('🌟 Great breathing!'), t('You earned 10 Calm Coins! Keep it up!'));
        transitionTo('Inhale');
      }
    }
    return () => clearTimeout(timer);
  }, [isBreathing, secondsLeft, phase]);

  const animateCircle = (toValue: number, duration: number, easing?: (t: number) => number) => {
    Animated.timing(circleScale, {
      toValue,
      duration,
      easing: easing ?? Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const transitionTo = (next: PhaseName) => {
    setPhase(next);
    setSecondsLeft(PHASES[next].duration);
    if (next === 'Inhale') animateCircle(1.7, 4000, Easing.out(Easing.ease));
    else if (next === 'Hold') animateCircle(1.75, 500);
    else if (next === 'Exhale') animateCircle(1, 4000, Easing.in(Easing.ease));
  };

  const start = () => {
    setIsBreathing(true);
    setCompletedCycles(0);
    setPhase('Inhale');
    setSecondsLeft(4);
    animateCircle(1.7, 4000, Easing.out(Easing.ease));
  };

  const stop = () => {
    setIsBreathing(false);
    setPhase('Ready');
    circleScale.setValue(1);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? DARK_THEME.bg : cfg.light }]}>

      {/* Floating decorative bubbles */}
      {BUBBLES.map((b, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.bubble,
            {
              left: b.x as DimensionValue,
              top:  b.y as DimensionValue,
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              backgroundColor: cfg.mid,
              opacity: 0.55,
              transform: [{
                translateY: bubbleAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] }),
              }],
            },
          ]}
        />
      ))}

      {/* ── Header (hidden while breathing) ── */}
      {!isBreathing && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? DARK_THEME.text : cfg.text }]}>{t('Breathing Space')}</Text>
          <Text style={[styles.subtitle, { color: cfg.primary }]}>
            {isPreTeen ? t('Box breathing  ·  4s in  ·  4s hold  ·  4s out') : t('Watch the bubble grow and shrink!')}
          </Text>
        </View>
      )}

      {/* ── Breathing zone — fixed-size, always centered ── */}
      <View style={styles.centerFill}>

        {/* Fixed 300×300 canvas — all rings absolutely placed inside */}
        <View style={styles.breathCanvas}>
          {/* Outer glow ring */}
          <Animated.View style={[
            styles.ringOuter,
            { borderColor: cfg.primary, transform: [{ scale: circleScale }], opacity: 0.18 },
          ]} />

          {/* Mid ring */}
          <Animated.View style={[
            styles.ringMid,
            { borderColor: cfg.primary, backgroundColor: cfg.mid + '55', transform: [{ scale: circleScale }] },
          ]} />

          {/* Inner solid circle */}
          <Animated.View style={[
            styles.circleInner,
            { backgroundColor: cfg.primary, transform: [{ scale: circleScale }] },
          ]}>
            <View style={styles.circleShine} />
            <Animated.Text style={[styles.animal, { transform: [{ translateY: animalFloat }] }]}>
              {cfg.animal}
            </Animated.Text>
            <Text style={styles.phaseLabel}>{t(cfg.label)}</Text>
            {isBreathing && (
              <View style={styles.countdownBadge}>
                <Text style={styles.countdownText}>{secondsLeft}s</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Phase message — always visible, below the canvas */}
        <Text style={[styles.phaseMessage, { color: isDark ? DARK_THEME.text : cfg.text }]}>{t(cfg.message)}</Text>

        {/* Cycle stars — shown while breathing */}
        {isBreathing && completedCycles > 0 && (
          <View style={styles.cycleRow}>
            {Array.from({ length: Math.min(completedCycles, 8) }).map((_, i) => (
              <Text key={i} style={styles.cycleStar}>⭐</Text>
            ))}
            {completedCycles > 8 && <Text style={styles.cycleMore}>+{completedCycles - 8}</Text>}
          </View>
        )}
        {isBreathing && (
          <Text style={[styles.cycleLabel, { color: isDark ? DARK_THEME.mid : cfg.text }]}>
            {completedCycles === 0
              ? t('First cycle in progress...')
              : language === 'es'
                ? `${completedCycles} ciclo${completedCycles > 1 ? 's' : ''} completado${completedCycles > 1 ? 's' : ''}  🎉`
                : `${completedCycles} cycle${completedCycles > 1 ? 's' : ''} complete  🎉`}
          </Text>
        )}

      </View>

      {/* ── Bottom area ── */}
      <View style={styles.bottom}>
        {!isBreathing ? (
          <>
            <TouchableOpacity
              style={[styles.mainBtn, { backgroundColor: cfg.primary, transform: [{ scale: mainBtnScale }] }]}
              onPress={start}
              onPressIn={() => { tapHaptic(); btnSpring(0.95).start(); }}
              onPressOut={() => btnSpring(1).start()}
              activeOpacity={1}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="wind" size={20} color="#FFF" />
                <Text style={styles.mainBtnText}>{t('Start Breathing')}</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.rewardNote, { backgroundColor: isDark ? DARK_THEME.card : cfg.mid }]}>
              <Text style={[styles.rewardText, { color: isDark ? DARK_THEME.mid : cfg.text }]}>
                💎  {t('Earn 10 Calm Coins for each complete cycle!')}
              </Text>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.mainBtn, styles.stopBtn, { transform: [{ scale: mainBtnScale }] }]}
            onPress={stop}
            onPressIn={() => btnSpring(0.95).start()}
            onPressOut={() => btnSpring(1).start()}
            activeOpacity={1}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="square" size={20} color="#FFF" />
              <Text style={styles.mainBtnText}>{t('Stop')}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  bubble: { position: 'absolute' },

  // Header
  header:   { alignItems: 'center', paddingTop: 26, paddingBottom: 6, paddingHorizontal: 24 },
  title:    { fontSize: 28, fontWeight: '900', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '700', marginTop: 5, textAlign: 'center' },

  // Central growing area — pushes canvas to true vertical center
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },

  // Fixed 300×300 square canvas; rings are absolute and self-center inside
  breathCanvas: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // All three rings are absolute so they share the same center point
  ringOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
  },
  ringMid: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
  },
  circleInner: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    ...SHADOW.xl,
  },
  circleShine: {
    position: 'absolute',
    top: 14,
    left: 18,
    width: 36,
    height: 50,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '20deg' }],
  },
  animal:     { fontSize: 44 },
  phaseLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  countdownBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  countdownText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },

  phaseMessage: { fontSize: 17, fontWeight: '700', textAlign: 'center', paddingHorizontal: 32 },

  // Cycle counter
  cycleRow:  { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4 },
  cycleStar: { fontSize: 22 },
  cycleMore: { fontSize: 14, fontWeight: '800', color: '#888', alignSelf: 'center' },
  cycleLabel:{ fontSize: 13, fontWeight: '700', textAlign: 'center' },

  // Bottom controls
  bottom:   { paddingHorizontal: 24, paddingBottom: 36, gap: 12 },
  mainBtn:  {
    borderRadius: RADIUS.lg,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    ...SHADOW.md,
  },
  stopBtn:     { backgroundColor: PALETTE.coral },
  mainBtnText: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3 },

  rewardNote: { borderRadius: RADIUS.md, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center' },
  rewardText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
