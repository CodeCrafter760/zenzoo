import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Animated, Easing,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME } from '../theme/theme';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AnimType =
  | 'stroke-down' | 'stroke-out' | 'circle-cw' | 'windshield'
  | 'small-circles' | 'bicycle' | 'squeeze' | 'hold' | 'toe-pull';

export type BodyZone =
  | 'chest' | 'tummy' | 'back' | 'both-arms' | 'both-legs'
  | 'feet' | 'head' | 'face' | 'full-body';

export interface MassageStep {
  instruction: string;
  detail: string;
  anim: AnimType;
  zone: BodyZone;
}

export interface MassageTranslation {
  title: string;
  description: string;
  tip: string;
  steps: { instruction: string; detail: string }[];
}

export interface MassageRoutine {
  title: string;
  emoji: string;
  description: string;
  duration: string;
  color: string;
  bg: string;
  tip: string;
  steps: MassageStep[];
  es?: MassageTranslation;
}

// ── Zone labels ───────────────────────────────────────────────────────────────

const ZONE_LABEL: Record<BodyZone, string> = {
  chest:       '❤️  Chest',
  tummy:       '🌀  Tummy',
  back:        '🌊  Back',
  'both-arms': '💪  Arms',
  'both-legs': '🦵  Legs',
  feet:        '🦶  Feet',
  head:        '👶  Head',
  face:        '😌  Face',
  'full-body': '✨  Full Body',
};

// ── Shared hand shape ─────────────────────────────────────────────────────────

function Hand({ color, wide = false }: { color: string; wide?: boolean }) {
  return (
    <View style={{
      width: wide ? 72 : 48,
      height: 30,
      borderRadius: 15,
      backgroundColor: color,
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 8,
      elevation: 6,
    }} />
  );
}

// ── Animation: stroke downward ────────────────────────────────────────────────

function AnimStrokeDown({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(120),
      Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(220),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-42, 68] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.07, 0.82, 1], outputRange: [0, 1, 1, 0] });

  return (
    <View style={styles.animCanvas}>
      <View style={styles.trailLine} />
      <View style={[styles.trailLine, { left: '62%' }]} />
      <Animated.View style={{ transform: [{ translateY }], opacity, flexDirection: 'row', gap: 16 }}>
        <Hand color={color} />
        <Hand color={color} />
      </Animated.View>
      <Text style={[styles.dirArrow, { color }]}>↓</Text>
    </View>
  );
}

// ── Animation: stroke outward from centre (open-book) ─────────────────────────

function AnimStrokeOut({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(200),
      Animated.timing(anim, { toValue: 1, duration: 950, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(380),
      Animated.timing(anim, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const leftX  = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -58] });
  const rightX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 58] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0.35, 1, 1, 0.35] });

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ translateX: leftX }], opacity }}>
          <Hand color={color} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: rightX }], opacity }}>
          <Hand color={color} />
        </Animated.View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 150, marginTop: 14 }}>
        <Text style={{ color, fontSize: 20, opacity: 0.55 }}>←</Text>
        <Text style={{ color, fontSize: 20, opacity: 0.55 }}>→</Text>
      </View>
    </View>
  );
}

// ── Animation: clockwise circle ───────────────────────────────────────────────

function AnimCircleCW({ color }: { color: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2100, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate  = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const R       = 54;
  const dotSize = 20;

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <View style={{ width: R * 2, height: R * 2, alignItems: 'center', justifyContent: 'center' }}>
        {/* Dashed circular path */}
        <View style={{
          position: 'absolute', width: R * 2, height: R * 2, borderRadius: R,
          borderWidth: 2.5, borderColor: color + '35', borderStyle: 'dashed',
        }} />
        {/* CW label */}
        <Text style={{ color: color + '60', fontSize: 30, fontWeight: '900' }}>↻</Text>
        {/* Orbiting dot */}
        <Animated.View style={{
          position: 'absolute', width: R * 2, height: R * 2,
          transform: [{ rotate }],
        }}>
          <View style={{
            position: 'absolute',
            top: -dotSize / 2,
            left: R - dotSize / 2,
            width: dotSize, height: dotSize, borderRadius: dotSize / 2,
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.55,
            shadowRadius: 6,
            elevation: 5,
          }} />
        </Animated.View>
      </View>
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginTop: 12 }}>Always clockwise</Text>
    </View>
  );
}

// ── Animation: windshield wiper (side to side) ────────────────────────────────

function AnimWindshield({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1,  duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(anim, { toValue: -1, duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = anim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-58, 0, 58] });

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Hand color={color} wide />
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 160, marginTop: 14 }}>
        <Text style={{ color, fontSize: 20, opacity: 0.55 }}>←</Text>
        <Text style={{ color, fontSize: 20, opacity: 0.55 }}>→</Text>
      </View>
    </View>
  );
}

// ── Animation: small circles (scalp / sole) ───────────────────────────────────

function AnimSmallCircles({ color }: { color: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 850, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate  = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const R       = 18;
  const dotSize = 12;

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{ width: R * 2, height: R * 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
              position: 'absolute', width: R * 2, height: R * 2, borderRadius: R,
              borderWidth: 1.5, borderColor: color + '40', borderStyle: 'dashed',
            }} />
            <Animated.View style={{
              position: 'absolute', width: R * 2, height: R * 2,
              transform: [{ rotate }],
            }}>
              <View style={{
                position: 'absolute',
                top: -dotSize / 2, left: R - dotSize / 2,
                width: dotSize, height: dotSize, borderRadius: dotSize / 2,
                backgroundColor: color, opacity: 0.88,
              }} />
            </Animated.View>
          </View>
        ))}
      </View>
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginTop: 14 }}>
        Gentle circular motion
      </Text>
    </View>
  );
}

// ── Animation: bicycle legs ───────────────────────────────────────────────────

function AnimBicycle({ color }: { color: string }) {
  const leftAnim  = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const leftLoop = Animated.loop(Animated.sequence([
      Animated.timing(leftAnim,  { toValue: 1, duration: 620, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(leftAnim,  { toValue: 0, duration: 620, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    const rightLoop = Animated.loop(Animated.sequence([
      Animated.timing(rightAnim, { toValue: 0, duration: 620, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(rightAnim, { toValue: 1, duration: 620, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    leftLoop.start();
    rightLoop.start();
    return () => { leftLoop.stop(); rightLoop.stop(); };
  }, []);

  const leftY  = leftAnim.interpolate({ inputRange: [0, 1], outputRange: [18, -18] });
  const rightY = rightAnim.interpolate({ inputRange: [0, 1], outputRange: [18, -18] });

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginBottom: 12 }}>
        Alternate each leg
      </Text>
      <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center', height: 80 }}>
        <Animated.View style={{ transform: [{ translateY: leftY }], alignItems: 'center', gap: 5 }}>
          <View style={{ width: 30, height: 16, borderRadius: 8, backgroundColor: color + '55' }} />
          <View style={{ width: 30, height: 44, borderRadius: 15, backgroundColor: color + 'DD' }} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: rightY }], alignItems: 'center', gap: 5 }}>
          <View style={{ width: 30, height: 16, borderRadius: 8, backgroundColor: color + '55' }} />
          <View style={{ width: 30, height: 44, borderRadius: 15, backgroundColor: color + 'DD' }} />
        </Animated.View>
      </View>
    </View>
  );
}

// ── Animation: squeeze ────────────────────────────────────────────────────────

function AnimSqueeze({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(300),
      Animated.timing(anim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(300),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const leftX   = anim.interpolate({ inputRange: [0, 1], outputRange: [-42, 0] });
  const rightX  = anim.interpolate({ inputRange: [0, 1], outputRange: [42, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 0.12, 0.88, 1], outputRange: [0.3, 1, 1, 0.3] });

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Animated.View style={{ transform: [{ translateX: leftX }], opacity }}>
          <Hand color={color} />
        </Animated.View>
        <View style={{ width: 22, height: 64, borderRadius: 11, backgroundColor: color + '22' }} />
        <Animated.View style={{ transform: [{ translateX: rightX }], opacity }}>
          <Hand color={color} />
        </Animated.View>
      </View>
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginTop: 14 }}>
        Squeeze and release
      </Text>
    </View>
  );
}

// ── Animation: gentle hold / pulse ───────────────────────────────────────────

function AnimHold({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1,   duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0.6, duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <Animated.View style={{ opacity: anim, alignItems: 'center', gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Hand color={color} />
          <Hand color={color} />
        </View>
        <View style={{ width: 110, height: 4, borderRadius: 2, backgroundColor: color + '40' }} />
      </Animated.View>
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginTop: 14 }}>
        Hold gently and breathe
      </Text>
    </View>
  );
}

// ── Animation: toe pull ───────────────────────────────────────────────────────

function AnimToePull({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(220),
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.delay(180),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -36] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0.3, 1, 1, 0.3] });

  return (
    <View style={[styles.animCanvas, { justifyContent: 'center' }]}>
      <Text style={{ color, fontSize: 20, opacity: 0.5, marginBottom: 6 }}>↑</Text>
      <Animated.View style={{ transform: [{ translateY }], opacity, flexDirection: 'row', gap: 6 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <View key={i} style={{ width: 14, height: 22, borderRadius: 7, backgroundColor: color }} />
        ))}
      </Animated.View>
      <View style={{ width: 88, height: 22, borderRadius: 11, backgroundColor: color + '30', marginTop: 8 }} />
      <Text style={{ color: color + '70', fontSize: 12, fontWeight: '700', marginTop: 12 }}>
        Gently pull each toe
      </Text>
    </View>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

function StepAnimation({ anim, color }: { anim: AnimType; color: string }) {
  switch (anim) {
    case 'stroke-down':   return <AnimStrokeDown   color={color} />;
    case 'stroke-out':    return <AnimStrokeOut    color={color} />;
    case 'circle-cw':     return <AnimCircleCW     color={color} />;
    case 'windshield':    return <AnimWindshield   color={color} />;
    case 'small-circles': return <AnimSmallCircles color={color} />;
    case 'bicycle':       return <AnimBicycle      color={color} />;
    case 'squeeze':       return <AnimSqueeze      color={color} />;
    case 'hold':          return <AnimHold         color={color} />;
    case 'toe-pull':      return <AnimToePull      color={color} />;
  }
}

// ── Player component ──────────────────────────────────────────────────────────

interface Props {
  routine: MassageRoutine;
  onClose: () => void;
}

export default function MassagePlayer({ routine, onClose }: Props) {
  const { isDark, language, t } = useZenZoo();
  const T     = isDark ? DARK_THEME : LIGHT_THEME;
  const [step, setStep] = useState(0);
  const total           = routine.steps.length;
  const current         = routine.steps[step];
  const tr = language === 'es' ? routine.es : undefined;
  const currentTr = tr?.steps[step];

  const goNext = () => { if (step < total - 1) setStep(s => s + 1); };
  const goPrev = () => { if (step > 0)         setStep(s => s - 1); };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#FFFCF5' }]}>

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { borderColor: T.edge }]}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={[styles.backText, { color: routine.color }]}>← {t('Back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: T.text }]} numberOfLines={1}>
          {routine.emoji}  {tr?.title ?? routine.title}
        </Text>
        <Text style={[styles.stepCount, { color: T.mid }]}>{step + 1} / {total}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Parent-led notice ── */}
        <View style={[styles.parentBanner, { backgroundColor: isDark ? routine.color + '1A' : routine.bg, borderColor: routine.color + '44' }]}>
          <Text style={[styles.parentBannerText, { color: routine.color }]}>
            {t('👨‍👩‍👧 A parent-led massage — follow these steps to gently massage your child.')}
          </Text>
        </View>

        {/* ── Tip banner ── */}
        <View style={[styles.tipBanner, { backgroundColor: isDark ? routine.color + '1A' : routine.bg, borderColor: routine.color + '44' }]}>
          <Text style={[styles.tipText, { color: routine.color }]}>💡  {tr?.tip ?? routine.tip}</Text>
        </View>

        {/* ── Animation card ── */}
        <View style={[styles.animCard, { backgroundColor: T.card, borderColor: routine.color + '33' }]}>

          {/* Zone label */}
          <View style={[styles.zonePill, { backgroundColor: isDark ? routine.color + '22' : routine.bg }]}>
            <Text style={[styles.zoneText, { color: routine.color }]}>
              {t(ZONE_LABEL[current.zone])}
            </Text>
          </View>

          {/* Animation — key={step} causes full remount so animations restart */}
          <View style={styles.animWrap}>
            <StepAnimation key={step} anim={current.anim} color={routine.color} />
          </View>

          {/* Step instruction */}
          <Text style={[styles.instruction, { color: T.text }]}>{currentTr?.instruction ?? current.instruction}</Text>
          <Text style={[styles.detail,      { color: T.mid  }]}>{currentTr?.detail ?? current.detail}</Text>
        </View>

        {/* ── Dot progress bar ── */}
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setStep(i)} activeOpacity={0.7}>
              <View style={[
                styles.dot,
                { backgroundColor: i < step  ? routine.color + '55'
                                  : i === step ? routine.color
                                  :              isDark ? T.edge : '#E2DCF0' },
                i === step && styles.dotActive,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Navigation ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: isDark ? T.card : '#F4F0FB', borderColor: T.edge },
              step === 0 && { opacity: 0.3 },
            ]}
            onPress={goPrev}
            disabled={step === 0}
            activeOpacity={0.8}
          >
            <Text style={[styles.navBtnText, { color: T.mid }]}>← {t('Prev')}</Text>
          </TouchableOpacity>

          {step < total - 1 ? (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary, { backgroundColor: routine.color }]}
              onPress={goNext}
              activeOpacity={0.85}
            >
              <Text style={[styles.navBtnText, { color: '#FFF' }]}>{t('Next Step')} →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary, { backgroundColor: '#3DD6C0' }]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={[styles.navBtnText, { color: '#FFF' }]}>{t('All Done')} ✓</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: 18, paddingTop: 16, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1.5,
  },
  backBtn:    { minWidth: 62 },
  backText:   { fontSize: 14, fontWeight: '700' },
  topTitle:   { flex: 1, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  stepCount:  { minWidth: 42, textAlign: 'right', fontSize: 13, fontWeight: '700' },

  parentBanner:     { borderRadius: 18, borderWidth: 1.5, padding: 13, marginBottom: 12 },
  parentBannerText: { fontSize: 12.5, fontWeight: '700', lineHeight: 18 },

  tipBanner: { borderRadius: 18, borderWidth: 1.5, padding: 13, marginBottom: 16 },
  tipText:   { fontSize: 13, fontWeight: '700', lineHeight: 20 },

  animCard: {
    borderRadius: 28, borderWidth: 2, padding: 22,
    alignItems: 'center', marginBottom: 20,
  },

  zonePill: {
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginBottom: 18,
  },
  zoneText: { fontSize: 14, fontWeight: '800' },

  animWrap: { minHeight: 155, justifyContent: 'center', alignItems: 'center', marginBottom: 22, width: '100%' },

  instruction: { fontSize: 20, fontWeight: '900', textAlign: 'center', letterSpacing: -0.3, marginBottom: 10 },
  detail:      { fontSize: 15, lineHeight: 25, textAlign: 'center', fontWeight: '400' },

  dots:      { flexDirection: 'row', justifyContent: 'center', gap: 7, marginBottom: 20 },
  dot:       { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24, borderRadius: 4 },

  navRow:        { flexDirection: 'row', gap: 12 },
  navBtn:        { flex: 1, paddingVertical: 17, borderRadius: 20, alignItems: 'center', borderWidth: 1.5 },
  navBtnPrimary: { flex: 1.6, borderWidth: 0 },
  navBtnText:    { fontSize: 15, fontWeight: '800' },

  // ── Shared animation canvas ──
  animCanvas: {
    width: '100%', alignItems: 'center', minHeight: 140,
    justifyContent: 'flex-start', paddingTop: 16,
  },
  trailLine: {
    position: 'absolute', top: 10, bottom: 20, width: 2,
    backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 1, left: '36%',
  },
  dirArrow: {
    position: 'absolute', bottom: 4, fontSize: 22, opacity: 0.5,
  },
});
