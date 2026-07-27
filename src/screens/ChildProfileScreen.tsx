import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import type { ChildProfile, StoryAgeGroup } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic, successHaptic } from '../utils/haptics';
import { showConfirm } from '../utils/alert';
import { SPECIES_LIST, findSpecies } from '../data/species';
import { STORY_AGE_GROUPS } from '../data/stories/types';
import PetAvatar, { asEyeStyle, asHairStyle, hatStyleFromId, outfitStyleFromId } from '../components/sprites/PetAvatar';
import { Feather } from '@expo/vector-icons';

const AGE_GROUP_HINT: Record<StoryAgeGroup, string> = {
  'Toddler (2-4)':   'Big buttons, a simple home screen',
  'Preschool (4-6)': 'The full ZenZoo experience',
  'Pre-Teen (6-9)':   'The full ZenZoo experience',
};

type ThemeColors = typeof LIGHT_THEME | typeof DARK_THEME;

const CHILD_ACCENT = PALETTE.mint;
const STARTER_SPECIES = SPECIES_LIST.filter(s => s.unlockLevel <= 1);

function ChildAvatarPreview({ child, size = 44 }: { child: ChildProfile; size?: number }) {
  const spec = findSpecies(child.genetics.species);
  return (
    <PetAvatar
      species={child.genetics.species}
      bodyColor={child.genetics.bodyColor}
      accentColor={spec.accent}
      muzzleColor={spec.muzzle}
      eyes={asEyeStyle(child.genetics.eyes)}
      hair={asHairStyle(child.genetics.hair)}
      hat={hatStyleFromId(child.equipped.Hats)}
      outfit={outfitStyleFromId(child.equipped.Outfits)}
      size={size}
    />
  );
}

// ── Create a new child profile: name → age group → starter pet pick ─────────
type OnboardStep = 'name' | 'age' | 'species';

export function ChildOnboardingFlow({ onCancel, onFinish }: { onCancel?: () => void; onFinish?: () => void }) {
  const { addChildProfile, isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [step, setStep] = useState<OnboardStep>('name');
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<StoryAgeGroup>('Preschool (4-6)');
  const [speciesType, setSpeciesType] = useState(STARTER_SPECIES[0].type);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const spec = findSpecies(speciesType);
    await addChildProfile(name, spec.type, spec.color, spec.eyes, ageGroup);
    setSaving(false);
    successHaptic();
    onFinish?.();
  };

  if (step === 'name') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F3FBF9' }]}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {onCancel && (
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onCancel} activeOpacity={0.8}>
              <Feather name="x" size={20} color={T.mid} />
            </TouchableOpacity>
          )}
          <View style={[styles.heroCircle, { backgroundColor: isDark ? '#0C2A22' : '#DFF7F0' }]}>
            <Text style={styles.heroEmoji}>🐾</Text>
          </View>
          <Text style={[styles.title, { color: T.text }]}>{t('Welcome to ZenZoo!')}</Text>
          <Text style={[styles.subtitle, { color: T.mid }]}>{t("What's your name?")}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: T.card, borderColor: T.edge, color: T.text }]}
            placeholder={t('Your name')}
            placeholderTextColor={T.soft}
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: CHILD_ACCENT, opacity: name.trim().length === 0 ? 0.5 : 1 }]}
            onPress={() => { if (name.trim().length > 0) { tapHaptic(); setStep('age'); } }}
            activeOpacity={0.85}
            disabled={name.trim().length === 0}
          >
            <Text style={styles.primaryBtnText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'age') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F3FBF9' }]}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={() => setStep('name')} activeOpacity={0.8}>
            <Feather name="arrow-left" size={20} color={T.mid} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: T.text }]}>{t('How Old Are You?')}</Text>
          <Text style={[styles.subtitle, { color: T.mid }]}>{t('ZenZoo adjusts itself to fit your age')}</Text>
          <View style={styles.ageList}>
            {STORY_AGE_GROUPS.map(a => {
              const active = ageGroup === a;
              return (
                <TouchableOpacity
                  key={a}
                  style={[styles.ageCard, { backgroundColor: T.card, borderColor: active ? CHILD_ACCENT : T.edge, borderWidth: active ? 2.5 : 1.5 }]}
                  onPress={() => { tapHaptic(); setAgeGroup(a); }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.ageCardLabel, { color: T.text }]}>{t(a)}</Text>
                  <Text style={[styles.ageCardHint, { color: T.mid }]}>{t(AGE_GROUP_HINT[a])}</Text>
                  {active && <Feather name="check-circle" size={20} color={CHILD_ACCENT} />}
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: CHILD_ACCENT }]} onPress={() => { tapHaptic(); setStep('species'); }} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F3FBF9' }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={() => setStep('age')} activeOpacity={0.8}>
          <Feather name="arrow-left" size={20} color={T.mid} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: T.text }]}>{t('Pick Your Pet')}</Text>
        <Text style={[styles.subtitle, { color: T.mid }]}>{t('You can customize it more later in My Zoo')}</Text>
        <View style={styles.speciesGrid}>
          {STARTER_SPECIES.map(spec => {
            const active = speciesType === spec.type;
            return (
              <TouchableOpacity
                key={spec.type}
                style={[styles.speciesCard, { backgroundColor: T.card, borderColor: active ? CHILD_ACCENT : T.edge, borderWidth: active ? 2.5 : 1.5 }]}
                onPress={() => { tapHaptic(); setSpeciesType(spec.type); }}
                activeOpacity={0.85}
              >
                <PetAvatar species={spec.type} bodyColor={spec.color} accentColor={spec.accent} muzzleColor={spec.muzzle} eyes={spec.eyes} size={54} />
                <Text style={[styles.speciesLabel, { color: T.text }]}>{t(spec.type)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: CHILD_ACCENT, opacity: saving ? 0.6 : 1 }]} onPress={finish} activeOpacity={0.85} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>{t("Let's Go!")}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Switch between existing child profiles, rename/remove, or add a new one ─
export function ChildSwitcherScreen({ onDone, dismissible = true }: { onDone: () => void; dismissible?: boolean }) {
  const { childProfiles, activeChildId, switchChild, renameChildProfile, deleteChildProfile, isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [mode, setMode] = useState<'grid' | 'create'>('grid');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  if (mode === 'create') {
    return <ChildOnboardingFlow onCancel={() => setMode('grid')} onFinish={onDone} />;
  }

  const confirmDelete = (child: ChildProfile) => {
    showConfirm(
      t('Remove {name}?').replace('{name}', child.name),
      t("This child's profile and progress will be deleted."),
      [
        { text: t('Cancel'), style: 'cancel' },
        { text: t('Remove'), style: 'destructive', onPress: () => { deleteChildProfile(child.id); successHaptic(); } },
      ]
    );
  };

  const saveRename = () => {
    if (renamingId) renameChildProfile(renamingId, renameInput);
    setRenamingId(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F3FBF9' }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {dismissible && (
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: T.card, borderColor: T.edge }]} onPress={onDone} activeOpacity={0.8}>
            <Feather name="x" size={20} color={T.mid} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: T.text }]}>{t("Who's Playing?")}</Text>
        <Text style={[styles.subtitle, { color: T.mid }]}>
          {childProfiles.length === 0 ? t('Create an account to get started') : t('Tap your profile to jump in')}
        </Text>

        <View style={styles.profileGrid}>
          {childProfiles.map(child => (
            <View
              key={child.id}
              style={[
                styles.profileCard,
                { backgroundColor: T.card, borderColor: child.id === activeChildId ? CHILD_ACCENT : T.edge, borderWidth: child.id === activeChildId ? 2.5 : 1.5 },
              ]}
            >
              <TouchableOpacity
                onPress={() => { tapHaptic(); switchChild(child.id); successHaptic(); onDone(); }}
                activeOpacity={0.85}
                style={styles.profileCardTap}
              >
                <View style={[styles.profileCardAvatar, { backgroundColor: isDark ? T.bg : '#F4F2FF' }]}>
                  <ChildAvatarPreview child={child} size={72} />
                </View>
                <Text style={[styles.profileCardName, { color: T.text }]} numberOfLines={1}>{child.name}</Text>
              </TouchableOpacity>
              <View style={styles.profileCardActions}>
                <TouchableOpacity style={styles.manageIconBtn} onPress={() => { setRenamingId(child.id); setRenameInput(child.name); }} activeOpacity={0.7}>
                  <Feather name="edit-2" size={13} color={T.mid} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.manageIconBtn} onPress={() => confirmDelete(child)} activeOpacity={0.7}>
                  <Feather name="trash-2" size={13} color={PALETTE.coral} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.profileCard, styles.addProfileCard, { borderColor: T.edge }]}
            onPress={() => { tapHaptic(); setMode('create'); }}
            activeOpacity={0.8}
          >
            <View style={[styles.profileCardAvatar, { backgroundColor: T.card, borderWidth: 1.5, borderColor: T.edge, borderStyle: 'dashed' }]}>
              <Feather name="plus" size={36} color={T.mid} />
            </View>
            <Text style={[styles.profileCardName, { color: T.mid }]}>{t('Create Account')}</Text>
          </TouchableOpacity>
        </View>

        {renamingId && (
          <View style={[styles.renameBox, { backgroundColor: T.card, borderColor: T.edge }]}>
            <TextInput
              style={[styles.renameInput, { color: T.text }]}
              value={renameInput}
              onChangeText={setRenameInput}
              placeholder={t('Name')}
              placeholderTextColor={T.soft}
              autoFocus
            />
            <TouchableOpacity style={[styles.renameSaveBtn, { backgroundColor: CHILD_ACCENT }]} onPress={saveRename} activeOpacity={0.85}>
              <Feather name="check" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 12, paddingBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 12, left: 24 },

  heroCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 16 },
  heroEmoji: { fontSize: 30 },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 48, paddingHorizontal: 12 },

  input: { width: '100%', borderRadius: RADIUS.md, borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 16, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  primaryBtn: { width: '100%', borderRadius: RADIUS.lg, paddingVertical: 16, alignItems: 'center', marginTop: 16, ...SHADOW.sm },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', width: '100%' },
  speciesCard: { width: '46%', borderRadius: RADIUS.lg, borderWidth: 1.5, paddingVertical: 16, alignItems: 'center', gap: 8, ...SHADOW.sm },
  speciesLabel: { fontSize: 13, fontWeight: '800' },

  ageList: { width: '100%', gap: 12, marginBottom: 8 },
  ageCard: { borderRadius: RADIUS.lg, paddingVertical: 16, paddingHorizontal: 18, gap: 4, ...SHADOW.sm },
  ageCardLabel: { fontSize: 16, fontWeight: '900' },
  ageCardHint: { fontSize: 12.5, fontWeight: '600' },

  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center', width: '100%' },
  profileCard: { width: 168, borderRadius: RADIUS.xl, borderWidth: 1.5, paddingTop: 26, paddingBottom: 14, alignItems: 'center', gap: 6, ...SHADOW.md },
  profileCardTap: { alignItems: 'center', gap: 14, paddingHorizontal: 8 },
  addProfileCard: { backgroundColor: 'transparent', borderStyle: 'dashed', shadowOpacity: 0, justifyContent: 'center', paddingVertical: 26 },
  profileCardAvatar: { width: 92, height: 92, borderRadius: 46, justifyContent: 'center', alignItems: 'center' },
  profileCardName: { fontSize: 17, fontWeight: '800', textAlign: 'center', paddingHorizontal: 4 },
  profileCardActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  manageIconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },

  renameBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: RADIUS.lg, borderWidth: 1.5, padding: 8, marginTop: 20, width: '100%', maxWidth: 360 },
  renameInput: { flex: 1, fontSize: 14, fontWeight: '600', paddingHorizontal: 10 },
  renameSaveBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
