import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Pressable, Animated, ActivityIndicator } from 'react-native';
import { ZenZooProvider, useZenZoo } from './src/context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS } from './src/theme/theme';
import { tapHaptic } from './src/utils/haptics';
import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import HomeScreen from './src/screens/HomeScreen';
import MyZenZooScreen from './src/screens/MyZenZooScreen';
import ShopScreen from './src/screens/ShopScreen';
import EmotionsScreen from './src/screens/EmotionsScreen';
import FocusScreen from './src/screens/FocusScreen';
import BedroomRoutineScreen from './src/screens/BedroomRoutineScreen';
import GratitudeJournalScreen from './src/screens/GratitudeJournalScreen';
import StoriesScreen from './src/screens/StoriesScreen';
import AdminScreen from './src/screens/AdminScreen';
import ParentDashboardScreen from './src/screens/ParentDashboardScreen';
import AuthScreen from './src/screens/AuthScreen';
import MoodSurveyScreen from './src/screens/MoodSurveyScreen';
import { ChildSwitcherScreen } from './src/screens/ChildProfileScreen';

function LoadingScreen({ isDark }: { isDark: boolean }) {
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  return (
    <SafeAreaView style={[styles.appContainer, styles.loadingContainer, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <ActivityIndicator size="large" color={PALETTE.indigo} />
    </SafeAreaView>
  );
}

const TABS = [
  { screen: 'Home',     label: 'Home',    activeColor: PALETTE.gold,   activeBg: '#FFF8E0' },
  { screen: 'MyZenZoo', label: 'My Zoo',  activeColor: PALETTE.purple, activeBg: '#F0EDFF' },
  { screen: 'Shop',     label: 'Shop',    activeColor: PALETTE.mint,   activeBg: '#E0FAF5' },
  { screen: 'Emotions', label: 'Breathe', activeColor: PALETTE.sky,    activeBg: '#E3F4FC' },
  { screen: 'Stories',  label: 'Stories', activeColor: PALETTE.pink,   activeBg: '#FFF0F5' },
] as const;

type FeatherName = React.ComponentProps<typeof Feather>['name'];

function TabIcon({ screen, color, size = 20 }: { screen: string; color: string; size?: number }) {
  if (screen === 'MyZenZoo') return <MaterialCommunityIcons name="paw-outline" size={size} color={color} />;
  if (screen === 'Shop')     return <FontAwesome5 name="gem" size={size - 2} color={color} />;
  const featherName: FeatherName = screen === 'Home' ? 'home' : screen === 'Emotions' ? 'wind' : 'book-open';
  return <Feather name={featherName} size={size} color={color} />;
}

type Screen = typeof TABS[number]['screen'] | 'Focus' | 'Bedroom' | 'Journal' | 'Parent' | 'MoodSurvey' | 'ChildSwitcher';

function AppInner() {
  const [currentScreen, setScreen] = useState<Screen>('Home');
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const {
    isDark, isAdmin, toggleAdmin, childProfiles, activeChildId, t,
    session, authLoading, childrenLoading,
  } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const toggleRef  = useRef(toggleAdmin);
  toggleRef.current = toggleAdmin;

  // One Animated.Value per tab — pops to 1.25 on selection then springs back to 1
  const tabScales = useRef(TABS.map(() => new Animated.Value(1))).current;

  const navigate = (s: string) => setScreen(s as Screen);

  const handleTabPress = (screen: Screen, tabIndex: number) => {
    tapHaptic();
    setScreen(screen);
    tabScales[tabIndex].setValue(1.2);
    Animated.spring(tabScales[tabIndex], { toValue: 1, friction: 3, tension: 300, useNativeDriver: true }).start();
  };

  // ── Web keyboard shortcut: Cmd+Shift+K ──────────────────────────────────
  // Note: in the iOS Simulator, Cmd+Shift+K is intercepted by the Simulator
  // itself (it toggles the software keyboard). Use the 🛠 button instead.
  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          toggleRef.current();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    } catch {
      // Not a web environment — no document
    }
  }, []);

  // A real account gates the app once per device — after signing in, the
  // Supabase session persists locally, so this only shows up on first setup
  // or after an explicit sign-out (day-to-day, kids just pick their profile).
  if (authLoading) return <LoadingScreen isDark={isDark} />;
  if (!session) return <AuthScreen />;
  if (childrenLoading) return <LoadingScreen isDark={isDark} />;

  // Every app launch starts on the "Who's Playing?" picker — pick a profile or
  // create one. Profiles are freely switchable afterward (no PIN — siblings
  // sharing a device just pick their own).
  if (!hasEnteredApp || childProfiles.length === 0 || !activeChildId) {
    return <ChildSwitcherScreen onDone={() => setHasEnteredApp(true)} dismissible={false} />;
  }

  if (isAdmin) {
    return <AdminScreen />;
  }

  return (
    <SafeAreaView style={[styles.appContainer, { backgroundColor: T.bg }]}>
      <View style={styles.screenBody}>
        {currentScreen === 'Home'     && <HomeScreen onNavigate={navigate} />}
        {currentScreen === 'MyZenZoo' && <MyZenZooScreen onNavigate={navigate} />}
        {currentScreen === 'Shop'     && <ShopScreen onNavigate={navigate} />}
        {currentScreen === 'Emotions' && <EmotionsScreen />}
        {currentScreen === 'Focus'    && <FocusScreen onNavigate={navigate} />}
        {currentScreen === 'Bedroom'  && <BedroomRoutineScreen onNavigate={navigate} />}
        {currentScreen === 'Journal'  && <GratitudeJournalScreen onNavigate={navigate} />}
        {currentScreen === 'Stories'  && <StoriesScreen />}
        {currentScreen === 'Parent'   && <ParentDashboardScreen onNavigate={navigate} />}
        {currentScreen === 'MoodSurvey' && <MoodSurveyScreen onNavigate={navigate} />}
        {currentScreen === 'ChildSwitcher' && <ChildSwitcherScreen onDone={() => navigate('Home')} />}
      </View>

      {currentScreen !== 'Parent' && currentScreen !== 'ChildSwitcher' && (
      <View style={[styles.navBar, { backgroundColor: T.navBg, borderColor: T.navEdge }]}>
        {TABS.map((tab, i) => {
          const active = currentScreen === tab.screen;
          return (
            <TouchableOpacity
              key={tab.screen}
              style={[
                styles.navTab,
                active && { backgroundColor: isDark ? tab.activeColor + '22' : tab.activeBg },
              ]}
              onPress={() => handleTabPress(tab.screen, i)}
              activeOpacity={0.85}
            >
              <Animated.View style={[styles.navIcon, { transform: [{ scale: tabScales[i] }] }]}>
                <TabIcon screen={tab.screen} color={active ? tab.activeColor : (isDark ? T.soft : '#B8B4CC')} />
              </Animated.View>
              <Text style={[
                styles.navLabel,
                { color: isDark ? T.soft : '#B8B4CC' },
                active && { color: tab.activeColor, fontWeight: '800' },
              ]}>
                {t(tab.label)}
              </Text>
              {active && <View style={[styles.navDot, { backgroundColor: tab.activeColor }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
      )}

      {/* ── Secret admin trigger — invisible, bottom-right corner, 3-second hold ── */}
      <Pressable
        style={styles.secretHold}
        onLongPress={toggleAdmin}
        delayLongPress={3000}
        android_disableSound
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ZenZooProvider>
      <AppInner />
    </ZenZooProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  screenBody:   { flex: 1 },

  navBar: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 4,
    borderTopWidth: 1.5,
    shadowColor: PALETTE.purple,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
    gap: 2,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    position: 'relative',
    minHeight: 54,
    gap: 2,
  },
  navIcon:       { alignItems: 'center', justifyContent: 'center', opacity: 0.9 },
  navLabel:      { fontSize: 10, fontWeight: '600' },
  navDot:        { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2 },

  // Invisible long-press zone — bottom-right corner, 52×52, no visual
  secretHold: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 52,
    height: 52,
    zIndex: 9999,
    opacity: 0,
  },
});
