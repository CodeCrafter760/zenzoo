import React, { createContext, useContext, useEffect, useState } from 'react';
export { LIGHT_THEME, DARK_THEME } from '../theme/theme';
export { SHOP_CATALOG as shopCatalog } from '../data/shop';
import { SHOP_CATALOG as shopCatalog } from '../data/shop';
import type { StoryAgeGroup } from '../data/stories/types';
export type { StoryAgeGroup } from '../data/stories/types';
import { translate, type Language } from '../i18n';
export type { Language } from '../i18n';

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

export interface ParentProfile {
  id: string;
  name: string;
  pin: string;
  color: string;
  avatar: string;
  securityQuestion: string | null;
  securityAnswer: string | null;
  failedAttempts: number;
  lockedUntil: number | null;
  childIds: string[];
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
const DEFAULT_EQUIPPED: EquippedItems = { Backgrounds: 'bg_meadow', Hats: null, Outfits: null };
const DEFAULT_AGE_GROUP: StoryAgeGroup = 'Preschool (4-6)';

interface ZenZooContextType {
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
  // Child profiles — one per kid using the app, freely switchable
  childProfiles: ChildProfile[];
  activeChildId: string | null;
  addChildProfile: (name: string, species: string, bodyColor: string, eyes: string, ageGroup: StoryAgeGroup) => string;
  switchChild: (id: string) => void;
  renameChildProfile: (id: string, name: string) => void;
  deleteChildProfile: (id: string) => void;
  // Parent Dashboard — auth (multiple parent profiles, each with its own PIN)
  parentProfiles: ParentProfile[];
  activeParentId: string | null;
  isParentUnlocked: boolean;
  addParentProfile: (name: string, pin: string, color: string, avatar: string, question: string, answer: string, childIds: string[]) => string;
  updateParentProfile: (id: string, updates: Partial<Pick<ParentProfile, 'name' | 'color' | 'avatar' | 'childIds'>>) => void;
  deleteParentProfile: (id: string) => void;
  setProfilePin: (id: string, pin: string) => void;
  setProfileSecurity: (id: string, question: string, answer: string) => void;
  verifyProfileSecurityAnswer: (id: string, answer: string) => boolean;
  registerProfileFailedAttempt: (id: string) => void;
  unlockParent: (id: string) => void;
  lockParent: () => void;
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

const genId = () => Math.random().toString(36).slice(2, 10);

function makeChildProfile(id: string, name: string, species: string, bodyColor: string, eyes: string, ageGroup: StoryAgeGroup): ChildProfile {
  return {
    id,
    name: name.trim() || 'Explorer',
    ageGroup,
    genetics: { bodyColor, eyes, hair: 'None', species },
    equipped: { ...DEFAULT_EQUIPPED },
    ownedItems: ['bg_meadow'],
    calmCoins: 0,
    streak: 1,
    journalEntries: [],
    moodEntries: [],
    screenTimeMinutes: 0,
    focusMinutes: 0,
    focusSessionsCompleted: 0,
    breathingSessions: 0,
    totalCoinsEarned: 0,
    longestStreak: 1,
    shopLocked: false,
    dailyLimitMinutes: null,
    bedtimeHour: null,
  };
}

export function ZenZooProvider({ children }: { children: React.ReactNode }) {
  const [isDark,   setIsDark]   = useState(false);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const toggleDark  = () => setIsDark(d => !d);
  const toggleAdmin = () => setIsAdmin(a => !a);
  const t = (s: string) => translate(language, s);

  // ── Child profiles ───────────────────────────────────────────────────────
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const activeChild = childProfiles.find(c => c.id === activeChildId) ?? null;

  const updateActiveChild = (updater: (c: ChildProfile) => ChildProfile) => {
    if (!activeChildId) return;
    setChildProfiles(prev => prev.map(c => (c.id === activeChildId ? updater(c) : c)));
  };

  const addChildProfile = (name: string, species: string, bodyColor: string, eyes: string, ageGroup: StoryAgeGroup) => {
    const id = genId();
    setChildProfiles(prev => [...prev, makeChildProfile(id, name, species, bodyColor, eyes, ageGroup)]);
    setActiveChildId(id);
    return id;
  };

  const switchChild = (id: string) => setActiveChildId(id);

  const renameChildProfile = (id: string, name: string) => {
    setChildProfiles(prev => prev.map(c => (c.id === id ? { ...c, name: name.trim() || c.name } : c)));
  };

  const deleteChildProfile = (id: string) => {
    setChildProfiles(prev => prev.filter(c => c.id !== id));
    setParentProfiles(prev => prev.map(p => ({ ...p, childIds: p.childIds.filter(cid => cid !== id) })));
    if (activeChildId === id) setActiveChildId(null);
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

  // ── Parent Dashboard — auth (multiple parent profiles) ─────────────────────
  const [parentProfiles, setParentProfiles] = useState<ParentProfile[]>([]);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);

  const addParentProfile = (name: string, pin: string, color: string, avatar: string, question: string, answer: string, childIds: string[]) => {
    const id = genId();
    const profile: ParentProfile = {
      id,
      name: name.trim() || 'Parent',
      pin,
      color,
      avatar,
      securityQuestion: question,
      securityAnswer: answer.trim().toLowerCase(),
      failedAttempts: 0,
      lockedUntil: null,
      childIds,
    };
    setParentProfiles(prev => [...prev, profile]);
    return id;
  };

  const updateParentProfile = (id: string, updates: Partial<Pick<ParentProfile, 'name' | 'color' | 'avatar' | 'childIds'>>) => {
    setParentProfiles(prev => prev.map(p => (p.id === id
      ? { ...p, ...updates, name: updates.name !== undefined ? (updates.name.trim() || p.name) : p.name }
      : p)));
  };

  const deleteParentProfile = (id: string) => {
    setParentProfiles(prev => prev.filter(p => p.id !== id));
    if (activeParentId === id) {
      setActiveParentId(null);
      setIsParentUnlocked(false);
    }
  };

  const setProfilePin = (id: string, pin: string) => {
    setParentProfiles(prev => prev.map(p => (p.id === id ? { ...p, pin } : p)));
  };

  const setProfileSecurity = (id: string, question: string, answer: string) => {
    setParentProfiles(prev => prev.map(p => (p.id === id
      ? { ...p, securityQuestion: question, securityAnswer: answer.trim().toLowerCase() }
      : p)));
  };

  const verifyProfileSecurityAnswer = (id: string, answer: string) => {
    const p = parentProfiles.find(pr => pr.id === id);
    return !!p && p.securityAnswer !== null && answer.trim().toLowerCase() === p.securityAnswer;
  };

  // Escalating lockout after repeated wrong PIN entries: 30s, 60s, 120s, 300s.
  const LOCKOUT_TIERS_SEC = [30, 60, 120, 300];
  const registerProfileFailedAttempt = (id: string) => {
    setParentProfiles(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = p.failedAttempts + 1;
      const lockedUntil = next >= 3
        ? Date.now() + LOCKOUT_TIERS_SEC[Math.min(next - 3, LOCKOUT_TIERS_SEC.length - 1)] * 1000
        : p.lockedUntil;
      return { ...p, failedAttempts: next, lockedUntil };
    }));
  };

  const unlockParent = (id: string) => {
    setActiveParentId(id);
    setIsParentUnlocked(true);
    setParentProfiles(prev => prev.map(p => (p.id === id ? { ...p, failedAttempts: 0, lockedUntil: null } : p)));
  };
  const lockParent = () => { setIsParentUnlocked(false); setActiveParentId(null); };

  // ── Parent Dashboard — stats (active child) ─────────────────────────────────
  const addFocusMinutes = (n: number) => updateActiveChild(c => ({
    ...c, focusMinutes: c.focusMinutes + n, focusSessionsCompleted: c.focusSessionsCompleted + 1,
  }));

  const addBreathingSession = () => updateActiveChild(c => ({ ...c, breathingSessions: c.breathingSessions + 1 }));

  useEffect(() => {
    if (!activeChildId) return;
    const id = setInterval(() => {
      setChildProfiles(prev => prev.map(c => (c.id === activeChildId ? { ...c, screenTimeMinutes: c.screenTimeMinutes + 1 } : c)));
    }, 60000);
    return () => clearInterval(id);
  }, [activeChildId]);

  useEffect(() => {
    if (!activeChildId) return;
    setChildProfiles(prev => prev.map(c => (c.id === activeChildId ? { ...c, longestStreak: Math.max(c.longestStreak, c.streak) } : c)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, activeChildId]);

  // ── Parent Dashboard — controls targeted at a specific (possibly non-active) child ──
  const updateChild = (id: string, updater: (c: ChildProfile) => ChildProfile) => {
    setChildProfiles(prev => prev.map(c => (c.id === id ? updater(c) : c)));
  };
  const setChildShopLocked = (id: string, locked: boolean) => updateChild(id, c => ({ ...c, shopLocked: locked }));
  const setChildDailyLimitMinutes = (id: string, n: number | null) => updateChild(id, c => ({ ...c, dailyLimitMinutes: n }));
  const setChildBedtimeHour = (id: string, n: number | null) => updateChild(id, c => ({ ...c, bedtimeHour: n }));
  const resetChildScreenTime = (id: string) => updateChild(id, c => ({ ...c, screenTimeMinutes: 0 }));

  // ── Admin (targets the active child) ────────────────────────────────────────
  const adminSetCoins  = (n: number) => updateActiveChild(c => ({ ...c, calmCoins: Math.max(0, n) }));
  const adminSetStreak = (n: number) => updateActiveChild(c => ({ ...c, streak: Math.max(0, n) }));
  const adminUnlockAll = () => updateActiveChild(c => ({ ...c, ownedItems: shopCatalog.map(i => i.id) }));
  const adminResetAll  = () => updateActiveChild(c => ({
    ...c,
    calmCoins: 0,
    streak: 1,
    ownedItems: ['bg_meadow'],
    equipped: { ...DEFAULT_EQUIPPED },
    genetics: { ...DEFAULT_GENETICS },
  }));

  return (
    <ZenZooContext.Provider
      value={{
        ageGroup, genetics, equipped, ownedItems, calmCoins, level, streak, updateGenetic, equipItem, buyItem, awardCoins,
        isDark, toggleDark, language, setLanguage, t, journalEntries, addJournalEntry, moodEntries, addMoodEntry,
        childProfiles, activeChildId, addChildProfile, switchChild, renameChildProfile, deleteChildProfile,
        parentProfiles, activeParentId, isParentUnlocked, unlockParent, lockParent,
        addParentProfile, updateParentProfile, deleteParentProfile,
        setProfilePin, setProfileSecurity, verifyProfileSecurityAnswer, registerProfileFailedAttempt,
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
