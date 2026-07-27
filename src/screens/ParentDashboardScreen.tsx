import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView,
  TouchableOpacity, Animated, TextInput, Switch, ActivityIndicator, type DimensionValue,
} from 'react-native';
import { useZenZoo, COINS_PER_LEVEL } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic, successHaptic, errorHaptic } from '../utils/haptics';
import { showAlert, showConfirm } from '../utils/alert';
import { findSpecies } from '../data/species';
import { findMood } from '../data/moods';
import PetAvatar, { asEyeStyle, asHairStyle, hatStyleFromId, outfitStyleFromId } from '../components/sprites/PetAvatar';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import type { ParentProfile } from '../context/ZenZooContext';

const PARENT_BLUE = PALETTE.indigo;

type ThemeColors = typeof LIGHT_THEME | typeof DARK_THEME;

const LIMIT_OPTIONS = [30, 60, 90, 120];
const BEDTIME_OPTIONS = [19, 20, 21];

function fmtDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtHour(hour: number) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function fmtEntryDate(dateStr: string, language: 'en' | 'es') {
  const d = new Date(dateStr);
  return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' });
}

// ── Shared PIN dots + numeric keypad ─────────────────────────────────────────
function PinDots({ length, filled, color, edge }: { length: number; filled: number; color: string; edge: string }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { borderColor: color },
            i < filled ? { backgroundColor: color } : { backgroundColor: 'transparent', borderColor: edge },
          ]}
        />
      ))}
    </View>
  );
}

function Keypad({ onDigit, onBackspace, color, mid, disabled }: { onDigit: (d: string) => void; onBackspace: () => void; color: string; mid: string; disabled?: boolean }) {
  const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'back']];
  return (
    <View style={[styles.keypad, disabled && { opacity: 0.35 }]} pointerEvents={disabled ? 'none' : 'auto'}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.keypadRow}>
          {row.map((key, ki) => {
            if (key === '') return <View key={ki} style={styles.key} />;
            if (key === 'back') {
              return (
                <TouchableOpacity key={ki} style={styles.key} onPress={() => { tapHaptic(); onBackspace(); }} activeOpacity={0.6}>
                  <Feather name="delete" size={22} color={mid} />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={ki} style={styles.key} onPress={() => { tapHaptic(); onDigit(key); }} activeOpacity={0.6}>
                <Text style={[styles.keyText, { color }]}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function useShake() {
  const shakeX = useRef(new Animated.Value(0)).current;
  const shake = () => {
    errorHaptic();
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };
  return { shakeX, shake };
}

// ── First-time (or reset) PIN creation — protects the dashboard on a shared
// family device. The real account is already authenticated via Supabase by
// the time this shows; this is just a quick kid-proof gate on top of that. ──
type PinSetupStep = 'create' | 'confirm';

function PinSetupFlow({ onCancel }: { onCancel: () => void }) {
  const { setProfilePin, unlockParent, isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const [step, setStep] = useState<PinSetupStep>('create');
  const [draftPin, setDraftPin] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { shakeX, shake } = useShake();

  useEffect(() => {
    if (input.length < 4) return;
    if (step === 'create') {
      setDraftPin(input);
      setInput('');
      setStep('confirm');
      return;
    }
    if (input === draftPin) {
      setProfilePin(draftPin);
      unlockParent();
      successHaptic();
    } else {
      setError(t("PINs didn't match — let's try again"));
      shake();
      setDraftPin(null);
      setInput('');
      setStep('create');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const titles: Record<PinSetupStep, string> = { create: 'Create a PIN', confirm: 'Confirm Your PIN' };
  const subtitles: Record<PinSetupStep, string> = {
    create: 'Protect the Parent Dashboard with a 4-digit PIN',
    confirm: 'Enter your PIN again to confirm',
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <View style={styles.gateContainer}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onCancel} activeOpacity={0.8}>
          <Feather name="x" size={20} color={T.mid} />
        </TouchableOpacity>
        <View style={[styles.shieldCircle, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
          <Feather name="shield" size={30} color={PARENT_BLUE} />
        </View>
        <Text style={[styles.gateTitle, { color: T.text }]}>{t(titles[step])}</Text>
        <Text style={[styles.gateSub, { color: T.mid }]}>{t(subtitles[step])}</Text>
        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <PinDots length={4} filled={input.length} color={PARENT_BLUE} edge={T.edge} />
        </Animated.View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Keypad
          color={T.text}
          mid={T.mid}
          onDigit={(d) => { if (input.length < 4) { setError(null); setInput(prev => prev + d); } }}
          onBackspace={() => setInput(prev => prev.slice(0, -1))}
        />
      </View>
    </SafeAreaView>
  );
}

// ── Enter the existing PIN to unlock the dashboard ───────────────────────────
function PinUnlockFlow({ profile, onBack, onForgot }: { profile: ParentProfile; onBack: () => void; onForgot: () => void }) {
  const { unlockParent, isDark, t, language } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { shakeX, shake } = useShake();

  useEffect(() => {
    if (input.length < 4) return;
    if (input === profile.pin) {
      unlockParent();
      successHaptic();
      setError(null);
      setInput('');
    } else {
      setError(t('Incorrect PIN — try again'));
      shake();
      setInput('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <View style={styles.gateContainer}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onBack} activeOpacity={0.8}>
          <Feather name="arrow-left" size={20} color={T.mid} />
        </TouchableOpacity>

        <View style={[styles.shieldCircle, { backgroundColor: profile.color }]}>
          <Text style={styles.avatarPreviewEmojiSm}>{profile.avatar}</Text>
        </View>

        <Text style={[styles.gateTitle, { color: T.text }]}>{language === 'es' ? `Hola, ${profile.name}` : `Hi, ${profile.name}`}</Text>
        <Text style={[styles.gateSub, { color: T.mid }]}>{t('Enter your PIN to access the Parent Dashboard')}</Text>

        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <PinDots length={4} filled={input.length} color={PARENT_BLUE} edge={T.edge} />
        </Animated.View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Keypad
          color={T.text}
          mid={T.mid}
          onDigit={(d) => { if (input.length < 4) { setError(null); setInput(prev => prev + d); } }}
          onBackspace={() => setInput(prev => prev.slice(0, -1))}
        />

        <TouchableOpacity onPress={onForgot} activeOpacity={0.7}>
          <Text style={[styles.forgotText, { color: T.mid }]}>{t('Forgot PIN?')} <Text style={{ color: PARENT_BLUE, fontWeight: '800' }}>{t('Reset it')}</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Forgot PIN: re-verify the real account password, then set a new PIN ─────
function ReauthFlow({ onVerified, onBack }: { onVerified: () => void; onBack: () => void }) {
  const { reauthenticate, session, isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password.length === 0 || loading) return;
    setLoading(true);
    const { error } = await reauthenticate(password);
    setLoading(false);
    if (error) {
      errorHaptic();
      setError(t('Incorrect password'));
      return;
    }
    onVerified();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <ScrollView contentContainerStyle={styles.gateContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onBack} activeOpacity={0.8}>
          <Feather name="arrow-left" size={20} color={T.mid} />
        </TouchableOpacity>
        <View style={[styles.shieldCircle, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
          <Feather name="lock" size={28} color={PARENT_BLUE} />
        </View>
        <Text style={[styles.gateTitle, { color: T.text }]}>{t('Verify Your Account')}</Text>
        <Text style={[styles.gateSub, { color: T.mid }]}>{t('Enter your account password to set a new PIN')}</Text>
        {session?.user.email && (
          <Text style={[styles.pickerLabel, { color: T.mid, alignSelf: 'center', textTransform: 'none' }]}>{session.user.email}</Text>
        )}

        <TextInput
          style={[styles.answerInput, { backgroundColor: T.card, borderColor: T.edge, color: T.text }]}
          placeholder={t('Password')}
          placeholderTextColor={T.soft}
          value={password}
          onChangeText={(v) => { setPassword(v); setError(null); }}
          secureTextEntry
          autoCapitalize="none"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: PARENT_BLUE, opacity: password.length === 0 ? 0.5 : 1 }]}
          onPress={submit}
          disabled={password.length === 0 || loading}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{loading ? t('Verifying…') : t('Verify')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Change an existing PIN (asks for the current one first) ─────────────────
type ChangePinStep = 'current' | 'new' | 'confirm';

function ChangePinFlow({ profile, onDone, T, isDark }: { profile: ParentProfile; onDone: () => void; T: ThemeColors; isDark: boolean }) {
  const { setProfilePin, t } = useZenZoo();
  const [step, setStep] = useState<ChangePinStep>('current');
  const [draft, setDraft] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { shakeX, shake } = useShake();

  useEffect(() => {
    if (input.length < 4) return;
    if (step === 'current') {
      if (input === profile.pin) {
        setInput('');
        setError(null);
        setStep('new');
      } else {
        setError(t('Incorrect current PIN'));
        shake();
        setInput('');
      }
      return;
    }
    if (step === 'new') {
      setDraft(input);
      setInput('');
      setStep('confirm');
      return;
    }
    if (input === draft && draft) {
      setProfilePin(draft);
      successHaptic();
      showAlert(t('PIN Updated'), t('Your Parent Dashboard PIN has been changed.'));
      onDone();
    } else {
      setError(t("PINs didn't match — let's try again"));
      shake();
      setDraft(null);
      setInput('');
      setStep('new');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const titles: Record<ChangePinStep, string> = { current: 'Enter Current PIN', new: 'Enter New PIN', confirm: 'Confirm New PIN' };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <View style={styles.gateContainer}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onDone} activeOpacity={0.8}>
          <Feather name="arrow-left" size={20} color={T.mid} />
        </TouchableOpacity>
        <View style={[styles.shieldCircle, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
          <Feather name="key" size={28} color={PARENT_BLUE} />
        </View>
        <Text style={[styles.gateTitle, { color: T.text }]}>{t(titles[step])}</Text>
        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <PinDots length={4} filled={input.length} color={PARENT_BLUE} edge={T.edge} />
        </Animated.View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Keypad
          color={T.text}
          mid={T.mid}
          onDigit={(d) => { if (input.length < 4) { setError(null); setInput(prev => prev + d); } }}
          onBackspace={() => setInput(prev => prev.slice(0, -1))}
        />
      </View>
    </SafeAreaView>
  );
}

// ── Weekly gratitude-journal activity chart (real data, last 7 days) ────────
function WeeklyActivityChart({ journalEntries, T, isDark }: { journalEntries: { date: string }[]; T: ThemeColors; isDark: boolean }) {
  const { language } = useZenZoo();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const active = journalEntries.some(e => e.date === d.toDateString());
    const label = d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'narrow' });
    return { label, active, isToday: i === 6 };
  });

  return (
    <View style={styles.chartRow}>
      {days.map((d, i) => (
        <View key={i} style={styles.chartCol}>
          <View style={[styles.chartTrack, { backgroundColor: isDark ? T.edge : '#EEE8F4' }]}>
            <View style={[styles.chartFill, { height: d.active ? '100%' : '14%' as DimensionValue, backgroundColor: d.active ? PALETTE.mint : (isDark ? T.soft : '#DAD6E8') }]} />
          </View>
          <Text style={[styles.chartLabel, { color: d.isToday ? PARENT_BLUE : T.mid, fontWeight: d.isToday ? '900' : '700' }]}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Collapsible section used to group each child's stats / controls ─────────
function AccordionSection({ title, icon, iconColor, isOpen, onToggle, T, isDark, children }: {
  title: string; icon: React.ComponentProps<typeof Feather>['name']; iconColor: string;
  isOpen: boolean; onToggle: () => void; T: ThemeColors; isDark: boolean; children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity
        style={[styles.accordionHeader, { backgroundColor: T.card, borderColor: T.edge }]}
        onPress={() => { tapHaptic(); onToggle(); }}
        activeOpacity={0.8}
      >
        <View style={[styles.rowIcon, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
          <Feather name={icon} size={18} color={iconColor} />
        </View>
        <Text style={[styles.accordionTitle, { flex: 1, color: T.text }]}>{title}</Text>
        <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={T.mid} />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

// ── Dashboard content, shown once the PIN gate is unlocked ──────────────────
function ParentDashboardContent({ profile, onNavigate }: { profile: ParentProfile; onNavigate?: (screen: string) => void }) {
  const {
    childProfiles, lockParent, signOut, isDark,
    setChildShopLocked, setChildDailyLimitMinutes, setChildBedtimeHour, resetChildScreenTime,
    t, language,
  } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  // Every child fetched from Supabase already belongs to this signed-in
  // parent (scoped server-side by parent_id), so there's no separate linking
  // step the way the old local multi-profile system needed.
  const linkedChildren = childProfiles;
  const [viewedChildId, setViewedChildId] = useState<string | null>(null);
  const viewedChild = linkedChildren.find(c => c.id === viewedChildId) ?? linkedChildren[0] ?? null;
  const [statsOpen, setStatsOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  const [view, setView] = useState<'dashboard' | 'changePin'>('dashboard');

  if (view === 'changePin') return <ChangePinFlow profile={profile} T={T} isDark={isDark} onDone={() => setView('dashboard')} />;

  const confirmSignOut = () => {
    showConfirm(
      t('Sign Out?'),
      t("You'll need your email and password to sign back in."),
      [
        { text: t('Cancel'), style: 'cancel' },
        { text: t('Sign Out'), style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  if (!viewedChild) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
        <View style={styles.gateContainer}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]}
            onPress={() => { lockParent(); onNavigate?.('Home'); }}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={18} color={T.mid} />
          </TouchableOpacity>
          <Text style={[styles.gateTitle, { color: T.text, marginTop: 24 }]}>{t('No Kids Yet')}</Text>
          <Text style={[styles.gateSub, { color: T.mid }]}>{t('Add a child profile to see their stats here')}</Text>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: PARENT_BLUE }]} onPress={() => onNavigate?.('ChildSwitcher')} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{t('Add a Child')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { genetics, equipped, calmCoins, streak, longestStreak, totalCoinsEarned,
    screenTimeMinutes, focusMinutes, focusSessionsCompleted, breathingSessions,
    journalEntries, moodEntries, shopLocked, dailyLimitMinutes, bedtimeHour } = viewedChild;
  const level = Math.floor(calmCoins / COINS_PER_LEVEL) + 1;
  const currentSpecies = findSpecies(genetics.species);
  const xpProgress = (calmCoins % COINS_PER_LEVEL) / COINS_PER_LEVEL;

  const OVERVIEW = [
    { icon: 'bar-chart-2' as const, color: PALETTE.sky,   bg: isDark ? '#0C1E2E' : '#EAF6FD', label: 'Screen Time', value: fmtDuration(screenTimeMinutes) },
    { icon: 'target'      as const, color: PALETTE.coral, bg: isDark ? '#2E1410' : '#FFF0EE', label: 'Focus Time',  value: fmtDuration(focusMinutes) },
  ];

  const STATS = [
    { icon: 'gem' as const,      color: PALETTE.purple, bg: isDark ? '#160E36' : '#F0EDFF', label: 'Coins Earned',  value: `${totalCoinsEarned}` },
    { icon: 'zap' as const,      color: PALETTE.gold,   bg: isDark ? '#2E2408' : '#FFF8E8', label: 'Best Streak',   value: `${longestStreak}d` },
    { icon: 'target' as const,   color: PALETTE.coral,  bg: isDark ? '#2E1410' : '#FFF0EE', label: 'Focus Sessions', value: `${focusSessionsCompleted}` },
    { icon: 'cloud' as const,    color: PALETTE.sky,    bg: isDark ? '#0C1E2E' : '#EAF6FD', label: 'Breathing Sessions', value: `${breathingSessions}` },
    { icon: 'smile' as const,    color: PALETTE.pink,   bg: isDark ? '#2E0E20' : '#FFF0F5', label: 'Mood Check-Ins', value: `${moodEntries.length}` },
  ];

  const recentEntries = [...journalEntries].reverse().slice(0, 3);
  const recentMoods = [...moodEntries].reverse().slice(0, 3);

  const confirmResetScreenTime = () => {
    showConfirm(
      t('Reset Screen Time?'),
      t("This will reset today's screen time counter back to 0."),
      [
        { text: t('Cancel'), style: 'cancel' },
        { text: t('Reset'), style: 'destructive', onPress: () => { resetChildScreenTime(viewedChild.id); successHaptic(); } },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <ScrollView contentContainerStyle={styles.dashScroll} showsVerticalScrollIndicator={false}>

        <View style={styles.dashHeader}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]}
            onPress={() => { lockParent(); onNavigate?.('Home'); }}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={18} color={T.mid} />
          </TouchableOpacity>
          <Text style={[styles.dashTitle, { color: T.text }]}>{language === 'es' ? `¡Bienvenido, ${profile.name}!` : `Welcome, ${profile.name}!`}</Text>
          <View style={[styles.parentAvatar, { backgroundColor: profile.color }]}>
            <Text style={styles.parentAvatarEmoji}>{profile.avatar}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childTabsRow} contentContainerStyle={{ gap: 8 }}>
          {linkedChildren.map(child => {
            const active = child.id === viewedChild.id;
            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childTab, { backgroundColor: active ? PARENT_BLUE : T.card, borderColor: active ? PARENT_BLUE : T.edge }]}
                onPress={() => { tapHaptic(); setViewedChildId(child.id); }}
                activeOpacity={0.85}
                disabled={linkedChildren.length === 1}
              >
                <Text style={[styles.childTabText, { color: active ? '#FFF' : T.text }]}>{child.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <AccordionSection
          title={t('Child Stats')}
          icon="bar-chart-2"
          iconColor={PARENT_BLUE}
          isOpen={statsOpen}
          onToggle={() => setStatsOpen(o => !o)}
          T={T}
          isDark={isDark}
        >
        <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Overview')}</Text>
        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.edge }]}>
          {OVERVIEW.map((row, idx) => (
            <View key={row.label} style={[styles.overviewRow, idx > 0 && { borderTopWidth: 1, borderTopColor: isDark ? T.edge : '#F0F0F8' }]}>
              <View style={[styles.rowIcon, { backgroundColor: row.bg }]}>
                <Feather name={row.icon} size={18} color={row.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: T.text }]}>{t(row.label)}</Text>
                <Text style={[styles.rowSub, { color: T.mid }]}>
                  {row.label === 'Screen Time' && dailyLimitMinutes !== null
                    ? (language === 'es' ? `Hoy • Límite ${dailyLimitMinutes}m` : `Today • Limit ${dailyLimitMinutes}m`)
                    : t('Today')}
                </Text>
              </View>
              <Text style={[styles.rowValue, { color: row.label === 'Screen Time' && dailyLimitMinutes !== null && screenTimeMinutes >= dailyLimitMinutes ? PALETTE.coral : T.text }]}>{row.value}</Text>
              <Feather name="chevron-right" size={18} color={T.soft} style={{ marginLeft: 6 }} />
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.streakCard, { backgroundColor: T.card, borderColor: T.edge }]}>
          <View style={[styles.rowIcon, { backgroundColor: isDark ? '#091E18' : '#E0FAF5' }]}>
            <Feather name="feather" size={18} color={PALETTE.mint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: T.text }]}>{t('Mindful Streak')}</Text>
            <Text style={[styles.rowSub, { color: T.mid }]}>{t('Keep it up!')}</Text>
          </View>
          <Text style={[styles.rowValue, { color: T.text }]}>{language === 'es' ? `${streak} día${streak !== 1 ? 's' : ''}` : `${streak} Day${streak !== 1 ? 's' : ''}`}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Gratitude Activity (Last 7 Days)')}</Text>
        <View style={[styles.card, styles.chartCard, { backgroundColor: T.card, borderColor: T.edge }]}>
          <WeeklyActivityChart journalEntries={journalEntries} T={T} isDark={isDark} />
        </View>

        <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Lifetime Stats')}</Text>
        <View style={styles.statsGrid}>
          {STATS.map(s => (
            <View key={s.label} style={[styles.statTile, { backgroundColor: T.card, borderColor: T.edge }]}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                {s.icon === 'gem'
                  ? <FontAwesome5 name="gem" size={13} color={s.color} />
                  : <Feather name={s.icon} size={16} color={s.color} />}
              </View>
              <Text style={[styles.statValue, { color: T.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: T.mid }]}>{t(s.label)}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: T.text }]}>{t("Child's Progress")}</Text>
        <View style={[styles.card, styles.progressCard, { backgroundColor: T.card, borderColor: T.edge }]}>
          <View style={[styles.progressAvatar, { backgroundColor: isDark ? T.bg : '#F4F2FF' }]}>
            <PetAvatar
              species={genetics.species}
              bodyColor={genetics.bodyColor}
              accentColor={currentSpecies.accent}
              muzzleColor={currentSpecies.muzzle}
              eyes={asEyeStyle(genetics.eyes)}
              hair={asHairStyle(genetics.hair)}
              hat={hatStyleFromId(equipped.Hats)}
              outfit={outfitStyleFromId(equipped.Outfits)}
              size={50}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.progressTopRow}>
              <Text style={[styles.progressName, { color: T.text }]}>{t(genetics.species)}</Text>
              <Text style={styles.progressLevel}>{language === 'es' ? `Niv. ${level}` : `Lv. ${level}`}</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? T.edge : '#EEE8F4' }]}>
              <View style={[styles.progressFill, { width: `${Math.round(xpProgress * 100)}%` as DimensionValue }]} />
            </View>
            <Text style={[styles.progressSub, { color: T.mid }]}>{language === 'es' ? `${journalEntries.length} entradas de gratitud registradas` : `${journalEntries.length} gratitude entries logged`}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Recent Gratitude Entries')}</Text>
        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.edge, padding: 16 }]}>
          {recentEntries.length === 0 ? (
            <Text style={[styles.emptyText, { color: T.mid }]}>{t('No journal entries yet.')}</Text>
          ) : (
            recentEntries.map((e, idx) => (
              <View key={e.date} style={[styles.entryRow, idx > 0 && { borderTopWidth: 1, borderTopColor: isDark ? T.edge : '#F0F0F8', marginTop: 12, paddingTop: 12 }]}>
                <Text style={[styles.entryDate, { color: PARENT_BLUE }]}>{fmtEntryDate(e.date, language)}</Text>
                <Text style={[styles.entryContent, { color: T.text }]} numberOfLines={2}>{e.content}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: T.text }]}>{t('Recent Mood Check-Ins')}</Text>
        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.edge, padding: 16 }]}>
          {recentMoods.length === 0 ? (
            <Text style={[styles.emptyText, { color: T.mid }]}>{t('No check-ins yet.')}</Text>
          ) : (
            recentMoods.map((e, idx) => {
              const m = findMood(e.mood);
              return (
                <View key={e.date} style={[styles.moodEntryRow, idx > 0 && { borderTopWidth: 1, borderTopColor: isDark ? T.edge : '#F0F0F8', marginTop: 12, paddingTop: 12 }]}>
                  <Text style={styles.moodEntryEmoji}>{m.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.moodEntryTopRow}>
                      <Text style={[styles.moodEntryMood, { color: T.text }]}>{t(e.mood)}</Text>
                      <Text style={[styles.entryDate, { color: PARENT_BLUE }]}>{fmtEntryDate(e.date, language)}</Text>
                    </View>
                    {e.tags.length > 0 && (
                      <Text style={[styles.moodEntryTags, { color: T.mid }]}>{e.tags.map(tag => t(tag)).join(' • ')}</Text>
                    )}
                    {e.note.length > 0 && (
                      <Text style={[styles.entryContent, { color: T.text, marginTop: 4 }]} numberOfLines={2}>{e.note}</Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
        </AccordionSection>

        <AccordionSection
          title={t('Parental Controls')}
          icon="sliders"
          iconColor={PARENT_BLUE}
          isOpen={controlsOpen}
          onToggle={() => setControlsOpen(o => !o)}
          T={T}
          isDark={isDark}
        >
        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.edge, padding: 16 }]}>
          <View style={styles.controlRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.controlLabel, { color: T.text }]}>{t('Lock Calm Shop')}</Text>
              <Text style={[styles.controlSub, { color: T.mid }]}>{t('Prevent spending Calm Coins')}</Text>
            </View>
            <Switch
              value={shopLocked}
              onValueChange={(v) => { tapHaptic(); setChildShopLocked(viewedChild.id, v); }}
              trackColor={{ false: isDark ? T.edge : '#E4E1EE', true: PARENT_BLUE }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.controlDivider, { backgroundColor: isDark ? T.edge : '#F0F0F8' }]} />

          <Text style={[styles.controlLabel, { color: T.text, marginBottom: 10 }]}>{t('Daily Screen Time Limit')}</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.optionChip, { backgroundColor: dailyLimitMinutes === null ? PARENT_BLUE : (isDark ? T.edge : '#EEE8F4') }]}
              onPress={() => { tapHaptic(); setChildDailyLimitMinutes(viewedChild.id, null); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionChipText, { color: dailyLimitMinutes === null ? '#FFF' : T.mid }]}>{t('Off')}</Text>
            </TouchableOpacity>
            {LIMIT_OPTIONS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.optionChip, { backgroundColor: dailyLimitMinutes === m ? PARENT_BLUE : (isDark ? T.edge : '#EEE8F4') }]}
                onPress={() => { tapHaptic(); setChildDailyLimitMinutes(viewedChild.id, m); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, { color: dailyLimitMinutes === m ? '#FFF' : T.mid }]}>{m}m</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.controlDivider, { backgroundColor: isDark ? T.edge : '#F0F0F8' }]} />

          <Text style={[styles.controlLabel, { color: T.text, marginBottom: 10 }]}>{t('Bedtime Reminder')}</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.optionChip, { backgroundColor: bedtimeHour === null ? PARENT_BLUE : (isDark ? T.edge : '#EEE8F4') }]}
              onPress={() => { tapHaptic(); setChildBedtimeHour(viewedChild.id, null); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionChipText, { color: bedtimeHour === null ? '#FFF' : T.mid }]}>{t('Off')}</Text>
            </TouchableOpacity>
            {BEDTIME_OPTIONS.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.optionChip, { backgroundColor: bedtimeHour === h ? PARENT_BLUE : (isDark ? T.edge : '#EEE8F4') }]}
                onPress={() => { tapHaptic(); setChildBedtimeHour(viewedChild.id, h); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, { color: bedtimeHour === h ? '#FFF' : T.mid }]}>{fmtHour(h)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </AccordionSection>

        <AccordionSection
          title={t('Security')}
          icon="shield"
          iconColor={PARENT_BLUE}
          isOpen={securityOpen}
          onToggle={() => setSecurityOpen(o => !o)}
          T={T}
          isDark={isDark}
        >
        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.edge }]}>
          <TouchableOpacity style={styles.actionRow} onPress={() => setView('changePin')} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
              <Feather name="key" size={16} color={PARENT_BLUE} />
            </View>
            <Text style={[styles.rowLabel, { flex: 1, color: T.text }]}>{t('Change PIN')}</Text>
            <Feather name="chevron-right" size={18} color={T.soft} />
          </TouchableOpacity>
          <View style={[styles.controlDivider, { backgroundColor: isDark ? T.edge : '#F0F0F8', marginHorizontal: 16 }]} />
          <TouchableOpacity style={styles.actionRow} onPress={confirmResetScreenTime} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2E1410' : '#FFF0EE' }]}>
              <Feather name="rotate-ccw" size={16} color={PALETTE.coral} />
            </View>
            <Text style={[styles.rowLabel, { flex: 1, color: T.text }]}>{t("Reset Today's Screen Time")}</Text>
          </TouchableOpacity>
          <View style={[styles.controlDivider, { backgroundColor: isDark ? T.edge : '#F0F0F8', marginHorizontal: 16 }]} />
          <TouchableOpacity style={styles.actionRow} onPress={confirmSignOut} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2E1410' : '#FFF0EE' }]}>
              <Feather name="log-out" size={16} color={PALETTE.coral} />
            </View>
            <Text style={[styles.rowLabel, { flex: 1, color: PALETTE.coral }]}>{t('Sign Out')}</Text>
          </TouchableOpacity>
        </View>
        </AccordionSection>

        <View style={styles.footerRow}>
          <Text style={styles.footerEmoji}>🌱</Text>
          <Text style={[styles.footerText, { color: T.text }]}>{t('Growing Mindfully!')}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default function ParentDashboardScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const { profile, isParentUnlocked, isDark } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [gate, setGate] = useState<'unlock' | 'reauth' | 'setup'>('unlock');

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingSafe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
        <ActivityIndicator color={PARENT_BLUE} size="large" />
      </SafeAreaView>
    );
  }

  if (!isParentUnlocked) {
    if (!profile.pin || gate === 'setup') {
      return <PinSetupFlow onCancel={() => onNavigate?.('Home')} />;
    }
    if (gate === 'reauth') {
      return <ReauthFlow onVerified={() => setGate('setup')} onBack={() => setGate('unlock')} />;
    }
    return (
      <PinUnlockFlow
        profile={profile}
        onBack={() => onNavigate?.('Home')}
        onForgot={() => setGate('reauth')}
      />
    );
  }

  return <ParentDashboardContent profile={profile} onNavigate={onNavigate} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loadingSafe: { justifyContent: 'center', alignItems: 'center' },

  // Gate
  gateContainer: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32 },
  backBtn:      { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
  shieldCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 16 },
  gateTitle:    { fontSize: 21, fontWeight: '900', marginBottom: 6, textAlign: 'center' },
  gateSub:      { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 26, paddingHorizontal: 12 },

  errorText:    { color: PALETTE.coral, fontSize: 12.5, fontWeight: '700', marginTop: 14, marginBottom: -6, textAlign: 'center' },
  hintText:     { fontSize: 11.5, fontWeight: '600', marginTop: 16, textAlign: 'center' },
  forgotText:   { fontSize: 13, fontWeight: '600', marginTop: 22, textAlign: 'center' },

  dotsRow: { flexDirection: 'row', gap: 16 },
  dot:     { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },

  keypad:     { marginTop: 34, gap: 18 },
  keypadRow:  { flexDirection: 'row', gap: 26 },
  key:        { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  keyText:    { fontSize: 26, fontWeight: '700' },

  answerInput:   { width: '100%', borderRadius: RADIUS.md, borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 16, fontSize: 14, fontWeight: '600', marginBottom: 8 },

  primaryBtn:     { width: '100%', borderRadius: RADIUS.lg, paddingVertical: 16, alignItems: 'center', marginTop: 16, ...SHADOW.sm },
  primaryBtnRow:  { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  avatarPreviewEmojiSm: { fontSize: 26 },
  pickerLabel:  { fontSize: 12, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 },

  // Dashboard
  dashScroll: { padding: 18, paddingBottom: 40 },
  dashHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  dashTitle:  { fontSize: 19, fontWeight: '900' },
  parentAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  parentAvatarEmoji: { fontSize: 20 },

  childTabsRow: { marginBottom: 16, flexGrow: 0 },
  childTab:     { borderRadius: RADIUS.pill, borderWidth: 1.5, paddingVertical: 9, paddingHorizontal: 16 },
  childTabText: { fontSize: 13, fontWeight: '800' },

  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10 },

  accordionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.lg, borderWidth: 1.5, padding: 14, ...SHADOW.sm },
  accordionTitle:  { fontSize: 15, fontWeight: '900' },
  accordionBody:   { marginTop: 14 },

  card: { borderRadius: RADIUS.lg, borderWidth: 1.5, marginBottom: 16, ...SHADOW.sm },

  overviewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  rowIcon:     { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rowLabel:    { fontSize: 14, fontWeight: '800' },
  rowSub:      { fontSize: 11.5, fontWeight: '600', marginTop: 1 },
  rowValue:    { fontSize: 14, fontWeight: '800' },

  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },

  chartCard: { padding: 18 },
  chartRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  chartCol:  { alignItems: 'center', gap: 8, width: 28 },
  chartTrack:{ width: 14, height: 60, borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  chartFill: { width: '100%', borderRadius: 7 },
  chartLabel:{ fontSize: 11 },

  statsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statTile:   { width: '47%', borderRadius: RADIUS.lg, borderWidth: 1.5, padding: 14, gap: 6, ...SHADOW.sm },
  statIcon:   { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  statValue:  { fontSize: 18, fontWeight: '900' },
  statLabel:  { fontSize: 11.5, fontWeight: '700' },

  progressCard:   { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  progressAvatar: { width: 66, height: 66, borderRadius: 33, justifyContent: 'center', alignItems: 'center' },
  progressTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressName:   { fontSize: 15, fontWeight: '900' },
  progressLevel:  { fontSize: 13, fontWeight: '900', color: PARENT_BLUE },
  progressTrack:  { height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressFill:   { height: '100%', backgroundColor: PARENT_BLUE, borderRadius: 5 },
  progressSub:    { fontSize: 11.5, fontWeight: '600' },

  emptyText:    { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  entryRow:     { gap: 4 },
  entryDate:    { fontSize: 11.5, fontWeight: '800' },
  entryContent: { fontSize: 13.5, fontWeight: '600', lineHeight: 19 },

  moodEntryRow:    { flexDirection: 'row', gap: 12 },
  moodEntryEmoji:  { fontSize: 26 },
  moodEntryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moodEntryMood:   { fontSize: 14, fontWeight: '800' },
  moodEntryTags:   { fontSize: 11.5, fontWeight: '600', marginTop: 2 },

  controlRow:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  controlLabel:    { fontSize: 14, fontWeight: '800' },
  controlSub:      { fontSize: 11.5, fontWeight: '600', marginTop: 1 },
  controlDivider:  { height: 1, marginVertical: 16 },
  chipRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip:      { paddingVertical: 9, paddingHorizontal: 14, borderRadius: RADIUS.pill },
  optionChipText:  { fontSize: 12.5, fontWeight: '800' },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },

  footerRow:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6 },
  footerEmoji: { fontSize: 18 },
  footerText:  { fontSize: 14, fontWeight: '800' },
});
