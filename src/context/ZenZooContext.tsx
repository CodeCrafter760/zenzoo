import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
export { LIGHT_THEME, DARK_THEME } from '../theme/theme';
export { SHOP_CATALOG as shopCatalog } from '../data/shop';
import { SHOP_CATALOG as shopCatalog } from '../data/shop';
import type { StoryAgeGroup } from '../data/stories/types';
export type { StoryAgeGroup } from '../data/stories/types';
import { translate, type Language } from '../i18n';
export type { Language } from '../i18n';
import { supabase } from '../lib/supabase';

export const COINS_PER_LEVEL = 50;

export interface JournalEntry {
  date: string;
  content: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
  tags: string[];
  note: string;
}

export interface Genetics {
  bodyColor: string;
  eyes: string;
  hair: string;
  species: string;
}

export interface EquippedItems {
  Backgrounds: string | null;
  Hats: string | null;
  Outfits: string | null;
}

// The signed-in parent's own display profile — 1:1 with their Supabase Auth
// account. Real identity/credentials live in Supabase Auth; this just holds
// the bits the UI shows (name, avatar, color) plus the quick-access PIN that
// gates the dashboard on a shared family device.
export interface ParentProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  pin: string | null;
}

export interface ChildProfile {
  id: string;
  name: string;
  ageGroup: StoryAgeGroup;
  genetics: Genetics;
  equipped: EquippedItems;
  ownedItems: string[];
  calmCoins: number;
  streak: number;
  journalEntries: JournalEntry[];
  moodEntries: MoodEntry[];
  screenTimeMinutes: number;
  focusMinutes: number;
  focusSessionsCompleted: number;
  breathingSessions: number;
  totalCoinsEarned: number;
  longestStreak: number;
  shopLocked: boolean;
  dailyLimitMinutes: number | null;
  bedtimeHour: number | null;
}

const DEFAULT_GENETICS: Genetics = { bodyColor: '#FFD3B6', eyes: 'Wonder', hair: 'None', species: 'Bear' };
const STARTER_BACKGROUNDS = ['bg_sky_blue', 'bg_sunny_yellow'];
const DEFAULT_EQUIPPED: EquippedItems = { Backgrounds: STARTER_BACKGROUNDS[0], Hats: null, Outfits: null };
const DEFAULT_AGE_GROUP: StoryAgeGroup = 'Preschool (4-6)';

// ── Supabase row <-> local shape helpers ─────────────────────────────────────
// The `children` table stores genetics/equipped/inventory/entries as JSON
// columns, so a fetched row maps directly onto ChildProfile except for the
// snake_case <-> camelCase field names.
function rowToChild(row: any): ChildProfile {
  return {
    id: row.id,
    name: row.name,
    ageGroup: row.age_group,
    genetics: row.genetics,
    equipped: row.equipped,
    ownedItems: row.owned_items,
    calmCoins: row.calm_coins,
    streak: row.streak,
    journalEntries: row.journal_entries,
    moodEntries: row.mood_entries,
    screenTimeMinutes: row.screen_time_minutes,
    focusMinutes: row.focus_minutes,
    focusSessionsCompleted: row.focus_sessions_completed,
    breathingSessions: row.breathing_sessions,
    totalCoinsEarned: row.total_coins_earned,
    longestStreak: row.longest_streak,
    shopLocked: row.shop_locked,
    dailyLimitMinutes: row.daily_limit_minutes,
    bedtimeHour: row.bedtime_hour,
  };
}

function childToRow(c: ChildProfile) {
  return {
    name: c.name,
    age_group: c.ageGroup,
    genetics: c.genetics,
    equipped: c.equipped,
    owned_items: c.ownedItems,
    calm_coins: c.calmCoins,
    streak: c.streak,
    journal_entries: c.journalEntries,
    mood_entries: c.moodEntries,
    screen_time_minutes: c.screenTimeMinutes,
    focus_minutes: c.focusMinutes,
    focus_sessions_completed: c.focusSessionsCompleted,
    breathing_sessions: c.breathingSessions,
    total_coins_earned: c.totalCoinsEarned,
    longest_streak: c.longestStreak,
    shop_locked: c.shopLocked,
    daily_limit_minutes: c.dailyLimitMinutes,
    bedtime_hour: c.bedtimeHour,
  };
}

function rowToProfile(row: any): ParentProfile {
  return { id: row.id, name: row.name, avatar: row.avatar, color: row.color, pin: row.pin };
}

interface AuthResult {
  error: string | null;
}

interface ZenZooContextType {
  // Auth — one Supabase account per family device. Session persists across
  // app restarts, so this only gates the very first setup (or after sign-out).
  session: Session | null;
  authLoading: boolean;
  profile: ParentProfile | null;
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<AuthResult>;
  reauthenticate: (password: string) => Promise<AuthResult>;
  setProfilePin: (pin: string | null) => Promise<void>;
  updateProfile: (updates: Partial<Pick<ParentProfile, 'name' | 'color' | 'avatar'>>) => Promise<void>;
  isParentUnlocked: boolean;
  unlockParent: () => void;
  lockParent: () => void;
  // Active child's data — always reflects whichever child profile is currently selected
  ageGroup: StoryAgeGroup;
  genetics: Genetics;
  equipped: EquippedItems;
  ownedItems: string[];
  calmCoins: number;
  level: number;
  streak: number;
  updateGenetic: (key: keyof Genetics, value: string) => void;
  equipItem: (category: keyof EquippedItems, itemId: string | null) => void;
  buyItem: (itemId: string, cost: number) => void;
  awardCoins: (amount: number) => void;
  isDark: boolean;
  toggleDark: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (s: string) => string;
  journalEntries: JournalEntry[];
  addJournalEntry: (content: string) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (mood: string, tags: string[], note: string) => void;
  // Child profiles — one per kid using the app, backed by Supabase, scoped to
  // whichever parent account is currently signed in
  childProfiles: ChildProfile[];
  childrenLoading: boolean;
  activeChildId: string | null;
  addChildProfile: (name: string, species: string, bodyColor: string, eyes: string, ageGroup: StoryAgeGroup) => Promise<void>;
  switchChild: (id: string) => void;
  renameChildProfile: (id: string, name: string) => void;
  deleteChildProfile: (id: string) => void;
  // Parent Dashboard — stats (active child)
  screenTimeMinutes: number;
  focusMinutes: number;
  focusSessionsCompleted: number;
  addFocusMinutes: (n: number) => void;
  breathingSessions: number;
  addBreathingSession: () => void;
  totalCoinsEarned: number;
  longestStreak: number;
  // Parent Dashboard — controls (active child)
  shopLocked: boolean;
  dailyLimitMinutes: number | null;
  bedtimeHour: number | null;
  // Parent Dashboard — controls targeted at a specific (possibly non-active) child
  setChildShopLocked: (childId: string, locked: boolean) => void;
  setChildDailyLimitMinutes: (childId: string, n: number | null) => void;
  setChildBedtimeHour: (childId: string, n: number | null) => void;
  resetChildScreenTime: (childId: string) => void;
  // Admin
  isAdmin: boolean;
  toggleAdmin: () => void;
  adminSetCoins: (n: number) => void;
  adminSetStreak: (n: number) => void;
  adminUnlockAll: () => void;
  adminResetAll: () => void;
}

const ZenZooContext = createContext<ZenZooContextType | undefined>(undefined);

export function ZenZooProvider({ children }: { children: React.ReactNode }) {
  const [isDark,   setIsDark]   = useState(false);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [languageState, setLanguageState] = useState<Language>('en');
  const toggleDark  = () => setIsDark(d => !d);
  const toggleAdmin = () => setIsAdmin(a => !a);
  const t = (s: string) => translate(languageState, s);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setChildProfiles([]);
      setActiveChildId(null);
      setIsParentUnlocked(false);
      return;
    }
    supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data, error }) => {
      if (error) { console.warn('Failed to fetch profile:', error.message); return; }
      if (data) {
        setProfile(rowToProfile(data));
        setLanguageState((data.language as Language) ?? 'en');
      }
    });
    setChildrenLoading(true);
    supabase.from('children').select('*').eq('parent_id', session.user.id).order('created_at').then(({ data, error }) => {
      setChildrenLoading(false);
      if (error) { console.warn('Failed to fetch children:', error.message); return; }
      setChildProfiles((data ?? []).map(rowToChild));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  const signUp = async (email: string, password: string, name: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPasswordForEmail = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  };

  // Re-checks the account password — used to verify identity before letting
  // someone set a new dashboard PIN if they've forgotten the old one.
  const reauthenticate = async (password: string): Promise<AuthResult> => {
    if (!session?.user.email) return { error: 'No signed-in account' };
    const { error } = await supabase.auth.signInWithPassword({ email: session.user.email, password });
    return { error: error?.message ?? null };
  };

  const setProfilePin = async (pin: string | null) => {
    if (!session) return;
    setProfile(prev => (prev ? { ...prev, pin } : prev));
    const { error } = await supabase.from('profiles').update({ pin }).eq('id', session.user.id);
    if (error) console.warn('Failed to save PIN:', error.message);
  };

  const updateProfile = async (updates: Partial<Pick<ParentProfile, 'name' | 'color' | 'avatar'>>) => {
    if (!session) return;
    setProfile(prev => (prev ? { ...prev, ...updates } : prev));
    const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
    if (error) console.warn('Failed to update profile:', error.message);
  };

  const unlockParent = () => setIsParentUnlocked(true);
  const lockParent = () => setIsParentUnlocked(false);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    if (session) {
      supabase.from('profiles').update({ language: l }).eq('id', session.user.id).then(({ error }) => {
        if (error) console.warn('Failed to save language:', error.message);
      });
    }
  };

  // ── Child profiles ───────────────────────────────────────────────────────
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const activeChild = childProfiles.find(c => c.id === activeChildId) ?? null;

  // Applies a change locally right away (so the UI stays instant) and pushes
  // the same change to Supabase in the background.
  const applyChildUpdate = (id: string, updater: (c: ChildProfile) => ChildProfile) => {
    setChildProfiles(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = updater(c);
      supabase.from('children').update(childToRow(next)).eq('id', id).then(({ error }) => {
        if (error) console.warn('Failed to sync child', id, error.message);
      });
      return next;
    }));
  };

  const updateActiveChild = (updater: (c: ChildProfile) => ChildProfile) => {
    if (!activeChildId) return;
    applyChildUpdate(activeChildId, updater);
  };

  const addChildProfile = async (name: string, species: string, bodyColor: string, eyes: string, ageGroup: StoryAgeGroup) => {
    if (!session) return;
    const { data, error } = await supabase.from('children').insert({
      parent_id: session.user.id,
      name: name.trim() || 'Explorer',
      age_group: ageGroup,
      genetics: { bodyColor, eyes, hair: 'None', species },
      equipped: DEFAULT_EQUIPPED,
      owned_items: STARTER_BACKGROUNDS,
    }).select().single();
    if (error || !data) { console.warn('Failed to create child:', error?.message); return; }
    const child = rowToChild(data);
    setChildProfiles(prev => [...prev, child]);
    setActiveChildId(child.id);
  };

  const switchChild = (id: string) => setActiveChildId(id);

  const renameChildProfile = (id: string, name: string) => {
    applyChildUpdate(id, c => ({ ...c, name: name.trim() || c.name }));
  };

  const deleteChildProfile = (id: string) => {
    setChildProfiles(prev => prev.filter(c => c.id !== id));
    if (activeChildId === id) setActiveChildId(null);
    supabase.from('children').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Failed to delete child', id, error.message);
    });
  };

  // Active-child derived values, exposed flat so existing screens don't need to change
  const ageGroup = activeChild?.ageGroup ?? DEFAULT_AGE_GROUP;
  const genetics = activeChild?.genetics ?? DEFAULT_GENETICS;
  const equipped = activeChild?.equipped ?? DEFAULT_EQUIPPED;
  const ownedItems = activeChild?.ownedItems ?? [];
  const calmCoins = activeChild?.calmCoins ?? 0;
  const streak = activeChild?.streak ?? 1;
  const journalEntries = activeChild?.journalEntries ?? [];
  const moodEntries = activeChild?.moodEntries ?? [];
  const screenTimeMinutes = activeChild?.screenTimeMinutes ?? 0;
  const focusMinutes = activeChild?.focusMinutes ?? 0;
  const focusSessionsCompleted = activeChild?.focusSessionsCompleted ?? 0;
  const breathingSessions = activeChild?.breathingSessions ?? 0;
  const totalCoinsEarned = activeChild?.totalCoinsEarned ?? 0;
  const longestStreak = activeChild?.longestStreak ?? 1;
  const shopLocked = activeChild?.shopLocked ?? false;
  const dailyLimitMinutes = activeChild?.dailyLimitMinutes ?? null;
  const bedtimeHour = activeChild?.bedtimeHour ?? null;
  const level = Math.floor(calmCoins / COINS_PER_LEVEL) + 1;

  const updateGenetic = (key: keyof Genetics, value: string) => {
    updateActiveChild(c => ({ ...c, genetics: { ...c.genetics, [key]: value } }));
  };

  const equipItem = (category: keyof EquippedItems, itemId: string | null) => {
    updateActiveChild(c => ({ ...c, equipped: { ...c.equipped, [category]: itemId } }));
  };

  const buyItem = (itemId: string, cost: number) => {
    updateActiveChild(c => ({ ...c, calmCoins: c.calmCoins - cost, ownedItems: [...c.ownedItems, itemId] }));
  };

  const awardCoins = (amount: number) => {
    updateActiveChild(c => ({ ...c, calmCoins: c.calmCoins + amount, totalCoinsEarned: c.totalCoinsEarned + amount }));
  };

  const addJournalEntry = (content: string) => {
    const date = new Date().toDateString();
    updateActiveChild(c => {
      const idx = c.journalEntries.findIndex(e => e.date === date);
      const journalEntries = idx >= 0
        ? c.journalEntries.map((e, i) => (i === idx ? { date, content } : e))
        : [...c.journalEntries, { date, content }];
      return { ...c, journalEntries };
    });
  };

  const addMoodEntry = (mood: string, tags: string[], note: string) => {
    const date = new Date().toDateString();
    updateActiveChild(c => {
      const entry = { date, mood, tags, note };
      const idx = c.moodEntries.findIndex(e => e.date === date);
      const moodEntries = idx >= 0
        ? c.moodEntries.map((e, i) => (i === idx ? entry : e))
        : [...c.moodEntries, entry];
      return { ...c, moodEntries };
    });
  };

  // ── Parent Dashboard — stats (active child) ─────────────────────────────────
  const addFocusMinutes = (n: number) => updateActiveChild(c => ({
    ...c, focusMinutes: c.focusMinutes + n, focusSessionsCompleted: c.focusSessionsCompleted + 1,
  }));

  const addBreathingSession = () => updateActiveChild(c => ({ ...c, breathingSessions: c.breathingSessions + 1 }));

  useEffect(() => {
    if (!activeChildId) return;
    const id = setInterval(() => {
      updateActiveChild(c => ({ ...c, screenTimeMinutes: c.screenTimeMinutes + 1 }));
    }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChildId]);

  useEffect(() => {
    if (!activeChildId) return;
    if (streak > longestStreak) {
      updateActiveChild(c => ({ ...c, longestStreak: Math.max(c.longestStreak, c.streak) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, activeChildId]);

  // ── Parent Dashboard — controls targeted at a specific (possibly non-active) child ──
  const setChildShopLocked = (id: string, locked: boolean) => applyChildUpdate(id, c => ({ ...c, shopLocked: locked }));
  const setChildDailyLimitMinutes = (id: string, n: number | null) => applyChildUpdate(id, c => ({ ...c, dailyLimitMinutes: n }));
  const setChildBedtimeHour = (id: string, n: number | null) => applyChildUpdate(id, c => ({ ...c, bedtimeHour: n }));
  const resetChildScreenTime = (id: string) => applyChildUpdate(id, c => ({ ...c, screenTimeMinutes: 0 }));

  // ── Admin (targets the active child) ────────────────────────────────────────
  const adminSetCoins  = (n: number) => updateActiveChild(c => ({ ...c, calmCoins: Math.max(0, n) }));
  const adminSetStreak = (n: number) => updateActiveChild(c => ({ ...c, streak: Math.max(0, n) }));
  const adminUnlockAll = () => updateActiveChild(c => ({ ...c, ownedItems: shopCatalog.map(i => i.id) }));
  const adminResetAll  = () => updateActiveChild(c => ({
    ...c,
    calmCoins: 0,
    streak: 1,
    ownedItems: STARTER_BACKGROUNDS,
    equipped: { ...DEFAULT_EQUIPPED },
    genetics: { ...DEFAULT_GENETICS },
  }));

  return (
    <ZenZooContext.Provider
      value={{
        session, authLoading, profile, signUp, signIn, signOut, resetPasswordForEmail, reauthenticate,
        setProfilePin, updateProfile, isParentUnlocked, unlockParent, lockParent,
        ageGroup, genetics, equipped, ownedItems, calmCoins, level, streak, updateGenetic, equipItem, buyItem, awardCoins,
        isDark, toggleDark, language: languageState, setLanguage, t, journalEntries, addJournalEntry, moodEntries, addMoodEntry,
        childProfiles, childrenLoading, activeChildId, addChildProfile, switchChild, renameChildProfile, deleteChildProfile,
        screenTimeMinutes, focusMinutes, focusSessionsCompleted, addFocusMinutes,
        breathingSessions, addBreathingSession, totalCoinsEarned, longestStreak,
        shopLocked, dailyLimitMinutes, bedtimeHour,
        setChildShopLocked, setChildDailyLimitMinutes, setChildBedtimeHour, resetChildScreenTime,
        isAdmin, toggleAdmin, adminSetCoins, adminSetStreak, adminUnlockAll, adminResetAll,
      }}
    >
      {children}
    </ZenZooContext.Provider>
  );
}

export function useZenZoo() {
  const context = useContext(ZenZooContext);
  if (!context) throw new Error('useZenZoo must be used within a ZenZooProvider');
  return context;
}
