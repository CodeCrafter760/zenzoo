import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager, Modal, type DimensionValue } from 'react-native';
import { useZenZoo, shopCatalog, COINS_PER_LEVEL } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import { Feather } from '@expo/vector-icons';
import { SPECIES_LIST } from '../data/species';
import { BIOMES, type BiomeKey } from '../data/biomes';
import { BADGES, type BadgeStats } from '../data/badges';
import PetAvatar, { asEyeStyle, asHairStyle, hatStyleFromId, outfitStyleFromId, HatIcon, OutfitIcon } from '../components/sprites/PetAvatar';
import PetBackground from '../components/PetBackground';
import SaplingGraphic, { getSaplingStage } from '../components/SaplingGraphic';


const SPROUT_POTS = [
  { label: 'Clay',    color: '#C4633A', rim: '#A0522D' },
  { label: 'Bark',    color: '#8B5A2B', rim: '#6B4423' },
  { label: 'Neon',    color: '#6C5CE7', rim: '#5A4BD1' },
  { label: 'Stone',   color: '#7F8C8D', rim: '#636E72' },
];

const PROGRESSION_MILESTONES = [
  { level: 1,  xp: 0,    reward: 'Start',              detail: 'Bear, Fox, Cat & Owl unlocked',  emoji: '🌱' },
  { level: 5,  xp: 200,  reward: 'Koala Unlocked',     detail: 'Your gentle koala friend arrives', emoji: '🐨' },
  { level: 15, xp: 700,  reward: 'Hippo Unlocked',     detail: 'The mighty hippo is yours',        emoji: '🦛' },
  { level: 20, xp: 950,  reward: 'Red Panda Unlocked', detail: 'The rare red panda appears',       emoji: '🦝' },
  { level: 25, xp: 1200, reward: 'Lion Unlocked',      detail: 'The brave lion roars for you',     emoji: '🦁' },
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function useSprings(count: number, pressedScale = 0.94) {
  const vals = useRef(Array.from({ length: count }, () => new Animated.Value(1))).current;
  const pressIn  = (i: number) => { tapHaptic(); Animated.spring(vals[i], { toValue: pressedScale, friction: 6, tension: 300, useNativeDriver: true }).start(); };
  const pressOut = (i: number) => Animated.spring(vals[i], { toValue: 1, friction: 4, tension: 300, useNativeDriver: true }).start();
  return { vals, pressIn, pressOut };
}

export default function MyZenZooScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const {
    genetics, equipped, ownedItems, level, calmCoins, updateGenetic, equipItem, isDark, ageGroup, language, t,
    unlockedBadges, breathingSessions, focusSessionsCompleted, storiesFinished, streak, longestStreak, totalCoinsEarned,
    journalEntries, moodEntries, activeChildId,
  } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [editorTab, setEditorTab] = useState<'Zoo' | 'Wardrobe' | 'Sprout' | 'Journey'>('Zoo');
  const [potTheme, setPotTheme] = useState(SPROUT_POTS[0]);
  const [openWardrobeCat, setOpenWardrobeCat] = useState<'Backgrounds' | 'Hats' | 'Outfits' | null>('Backgrounds');
  const [openBiome, setOpenBiome] = useState<BiomeKey | null>(BIOMES[0].key);

  // Each child has their own badges/streak, so the popup re-shows whenever the
  // active child changes, not just on the screen's first mount.
  const [showProgressPopup, setShowProgressPopup] = useState(true);
  useEffect(() => { setShowProgressPopup(true); }, [activeChildId]);

  const badgeStats: BadgeStats = {
    breathingSessions, focusSessionsCompleted, storiesFinished, longestStreak, totalCoinsEarned, level,
    ownedItemsCount: ownedItems.length,
    journalEntriesCount: journalEntries.length,
    moodEntriesCount: moodEntries.length,
  };

  const toggleWardrobeCat = (cat: 'Backgrounds' | 'Hats' | 'Outfits') => {
    tapHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenWardrobeCat(prev => (prev === cat ? null : cat));
  };

  const toggleBiome = (biome: BiomeKey) => {
    tapHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenBiome(prev => (prev === biome ? null : biome));
  };

  // The Journey tab is a text-heavy list of level milestones — too much
  // reading for Toddler, so it's hidden there and shown for everyone else.
  const isToddler = ageGroup === 'Toddler (2-4)';
  const EDITOR_TABS = (['Zoo', 'Wardrobe', 'Sprout', 'Journey'] as const).filter(t => !isToddler || t !== 'Journey');

  const speciesSprings = useSprings(SPECIES_LIST.length);
  const potSprings     = useSprings(SPROUT_POTS.length);
  const tabScale       = useRef(new Animated.Value(1)).current;

  const currentSpecies = SPECIES_LIST.find(s => s.type === genetics.species) ?? SPECIES_LIST[0];
  const activeBg = shopCatalog.find(i => i.id === equipped.Backgrounds);
  const stage = getSaplingStage(level);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? T.bg : '#FFFBF4' }]}>
      {/* ── Canvas ── */}
      <View style={styles.canvasContainer}>
        <PetBackground bgColor={activeBg?.type} />

        {/* Avatar + Sapling side by side */}
        <View style={styles.stageRow}>

          {/* Avatar column */}
          <View style={styles.avatarColumn}>
            <PetAvatar
              species={genetics.species}
              bodyColor={genetics.bodyColor}
              accentColor={currentSpecies.accent}
              muzzleColor={currentSpecies.muzzle}
              eyes={asEyeStyle(genetics.eyes)}
              hair={asHairStyle(genetics.hair)}
              hat={hatStyleFromId(equipped.Hats)}
              outfit={outfitStyleFromId(equipped.Outfits)}
              size={210}
            />
          </View>

          {/* Sapling column */}
          <View style={styles.saplingColumn}>
            <Text style={styles.saplingTitle}>{t('Meditation Sapling')}</Text>
            <SaplingGraphic level={level} />
            {/* Pot — tap to navigate to Breathing Space */}
            <TouchableOpacity style={styles.potTouchable} onPress={() => onNavigate?.('Emotions')} activeOpacity={0.8}>
              <View style={[styles.potRim, { backgroundColor: potTheme.rim }]}>
                <View style={[styles.potSoilLayer, { backgroundColor: '#4A2E0E' }]} />
              </View>
              <View style={[styles.potBody, { backgroundColor: potTheme.color, borderColor: potTheme.rim }]}>
                <View style={styles.potShine} />
              </View>
              <Text style={styles.breatheLabel}>{t('Breathe to Grow')}</Text>
            </TouchableOpacity>
            <Text style={styles.saplingLevelBadge}>{language === 'es' ? `Niv. ${level}` : `Lv. ${level}`}</Text>
          </View>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View style={[styles.tabBar, { backgroundColor: isDark ? T.card : '#EFEFEF' }]}>
        {EDITOR_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, editorTab === tab && [styles.activeTab, isDark && { backgroundColor: T.edge }]]}
            onPress={() => {
              tapHaptic();
              setEditorTab(tab);
              tabScale.setValue(1.1);
              Animated.spring(tabScale, { toValue: 1, friction: 3, tension: 300, useNativeDriver: true }).start();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: isDark ? T.mid : '#7F8C8D' }, editorTab === tab && styles.activeTabText]}>{t(tab)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      <ScrollView style={styles.drawer} contentContainerStyle={styles.drawerContent}>

        {/* ZOO — browse biomes, see your collection, and tap an unlocked animal to become them */}
        {editorTab === 'Zoo' && (
          <>
            <Text style={[styles.drawerHint, { color: isDark ? T.mid : '#7F8C8D' }]}>{t('Tap an animal to become them. Explore each biome and see which friends you\'ve collected!')}</Text>
            {BIOMES.map(biome => {
              const biomeSpecies = SPECIES_LIST.filter(s => s.biome === biome.key);
              const unlockedCount = biomeSpecies.filter(s => level >= s.unlockLevel).length;
              const isOpen = openBiome === biome.key;
              return (
                <View key={biome.key} style={styles.biomeSection}>
                  <TouchableOpacity
                    style={[styles.biomeHeader, { backgroundColor: isDark ? biome.color + '22' : biome.color + '15', borderColor: biome.color + '55' }]}
                    onPress={() => toggleBiome(biome.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.biomeIcon}>{biome.icon}</Text>
                    <Text style={[styles.biomeLabel, { color: biome.color }]}>{t(biome.key)}</Text>
                    <Text style={[styles.biomeCount, { color: biome.color }]}>{unlockedCount}/{biomeSpecies.length}</Text>
                    <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={biome.color} />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.speciesGrid}>
                      {biomeSpecies.map(spec => {
                        const idx = SPECIES_LIST.indexOf(spec);
                        const unlocked = level >= spec.unlockLevel;
                        const active = genetics.species === spec.type;
                        return (
                          <TouchableOpacity
                            key={spec.type}
                            style={[styles.speciesCard, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF', transform: [{ scale: speciesSprings.vals[idx] }] }, active && styles.speciesCardActive, !unlocked && { backgroundColor: isDark ? T.bg : '#F8F8F8' }]}
                            onPressIn={() => unlocked && speciesSprings.pressIn(idx)}
                            onPressOut={() => speciesSprings.pressOut(idx)}
                            onPress={() => {
                              if (!unlocked) return;
                              updateGenetic('bodyColor', spec.color);
                              updateGenetic('eyes', spec.eyes);
                              updateGenetic('species', spec.type);
                            }}
                            activeOpacity={1}
                          >
                            {unlocked ? (
                              <PetAvatar species={spec.type} bodyColor={spec.color} accentColor={spec.accent} muzzleColor={spec.muzzle} eyes={asEyeStyle(spec.eyes)} size={42} />
                            ) : (
                              <Feather name="lock" size={28} color="#B2BEC3" />
                            )}
                            <Text style={[styles.speciesName, { color: isDark ? T.text : '#2D3436' }, !unlocked && styles.lockedText]}>{t(spec.type)}</Text>
                            {!unlocked && (
                              <Text style={styles.unlockHint}>{language === 'es' ? `Niv. ${spec.unlockLevel}` : `Lv. ${spec.unlockLevel}`}</Text>
                            )}
                            {active && <View style={styles.activeCheckBadge}><Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>{t('ON')}</Text></View>}
                            {unlocked && (
                              <View style={[styles.colorSwatch, { backgroundColor: spec.color, borderColor: spec.accent }]} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* WARDROBE */}
        {editorTab === 'Wardrobe' && (
          <>
            <Text style={[styles.drawerHint, { color: isDark ? T.mid : '#7F8C8D' }]}>{t('Equip items you own from the Calm Shop.')}</Text>
            {(['Backgrounds', 'Hats', 'Outfits'] as const).map(cat => {
              const catItems = shopCatalog.filter(i => i.category === cat && ownedItems.includes(i.id));
              const isOpen = openWardrobeCat === cat;
              return (
                <View key={cat} style={styles.wardrobeSection}>
                  <TouchableOpacity
                    style={[styles.wardrobeCatHeader, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF' }]}
                    onPress={() => toggleWardrobeCat(cat)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.wardrobeCatLabel, { color: isDark ? T.text : '#2D3436' }]}>
                      {cat === 'Backgrounds' ? `🎨 ${t('Backgrounds')}` : cat === 'Hats' ? `🎩 ${t('Hats')}` : `👕 ${t('Outfits')}`}
                    </Text>
                    <Text style={[styles.wardrobeCatCount, { color: isDark ? T.mid : '#7F8C8D' }]}>{catItems.length}</Text>
                    <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={isDark ? T.mid : '#7F8C8D'} />
                  </TouchableOpacity>

                  {isOpen && (
                    catItems.length === 0 ? (
                      <Text style={[styles.wardrobeEmpty, { color: isDark ? T.soft : '#B2BEC3' }]}>{t('Nothing owned yet — visit the Calm Shop!')}</Text>
                    ) : (
                      <View style={styles.optionsWrap}>
                        {catItems.map(item => {
                          const isOn = equipped[cat] === item.id;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              style={[styles.wardrobeCard, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF' }, isOn && styles.wardrobeCardActive]}
                              onPress={() => equipItem(cat, isOn ? null : item.id)}
                            >
                              {cat === 'Backgrounds' && item.type ? (
                                <View style={[styles.wardrobeCardImage, { backgroundColor: item.type }]} />
                              ) : cat === 'Hats' && hatStyleFromId(item.id) ? (
                                <HatIcon style={hatStyleFromId(item.id)!} size={48} />
                              ) : cat === 'Outfits' && outfitStyleFromId(item.id) ? (
                                <OutfitIcon style={outfitStyleFromId(item.id)!} size={48} />
                              ) : (
                                <Text style={styles.wardrobeCardEmoji}>
                                  {cat === 'Hats' ? '🎩' : '👕'}
                                </Text>
                              )}
                              <Text style={[styles.wardrobeCardName, { color: isDark ? T.text : '#2D3436' }, isOn && styles.wardrobeCardNameActive]}>{t(item.name)}</Text>
                              {isOn && <View style={styles.onBadge}><Text style={styles.onBadgeText}>{t('Equipped')}</Text></View>}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* SPROUT POT THEME */}
        {editorTab === 'Sprout' && (
          <>
            <Text style={[styles.drawerHint, { color: isDark ? T.mid : '#7F8C8D' }]}>{t('Choose a pot style for your Meditation Sapling.')}</Text>
            <View style={styles.optionsWrap}>
              {SPROUT_POTS.map((pot, idx) => (
                <TouchableOpacity
                  key={pot.label}
                  style={[styles.potThemeCard, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF', transform: [{ scale: potSprings.vals[idx] }] }, potTheme.label === pot.label && styles.potThemeCardActive]}
                  onPressIn={() => potSprings.pressIn(idx)}
                  onPressOut={() => potSprings.pressOut(idx)}
                  onPress={() => setPotTheme(pot)}
                  activeOpacity={1}
                >
                  <View style={[styles.potThemePreview, { backgroundColor: pot.color, borderColor: pot.rim }]} />
                  <Text style={[styles.optionLabel, { color: isDark ? T.text : '#2D3436' }, potTheme.label === pot.label && styles.optionLabelActive]}>{t(pot.label)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.saplingInfoCard, { backgroundColor: isDark ? T.card : '#F4F2FF', borderColor: isDark ? T.edge : '#D4CFFE' }]}>
              <Text style={styles.saplingInfoTitle}>{t('Your Sapling')}</Text>
              <Text style={[styles.saplingInfoBody, { color: isDark ? T.mid : '#636E72' }]}>{t('Tap the pot on your sapling to visit the Breathing Space and help your plant grow. Each breathing session and level you earn makes your sapling more lush!')}</Text>
              <View style={styles.stageRow2}>
                {(['Seed','Sprout','Bush','Small Tree','Big Tree','Full Tree'] as string[]).map((s, i) => (
                  <View key={s} style={styles.stageItem}>
                    <View style={[styles.stageDot, { backgroundColor: i <= ['seed','sprout','bush','smallTree','bigTree','fullTree'].indexOf(stage) ? '#2ECC71' : '#DDD' }]} />
                    <Text style={styles.stageText}>{t(s)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* JOURNEY — Progression Road */}
        {editorTab === 'Journey' && (
          <>
            <Text style={[styles.drawerHint, { color: isDark ? T.mid : '#7F8C8D' }]}>{t('Your progression road — see what awaits at every 5 levels!')}</Text>
            <View style={[styles.xpSummaryCard, { backgroundColor: isDark ? T.card : '#F4F2FF', borderColor: isDark ? T.edge : '#D4CFFE' }]}>
              <Text style={styles.xpSummaryLevel}>{language === 'es' ? `Nivel ${level}` : `Level ${level}`}</Text>
              <View style={styles.xpSummaryTrack}>
                <View style={[styles.xpSummaryFill, { width: `${Math.round(((calmCoins % COINS_PER_LEVEL) / COINS_PER_LEVEL) * 100)}%` as DimensionValue }]} />
              </View>
              <Text style={styles.xpSummarySub}>
                {language === 'es'
                  ? `${calmCoins % COINS_PER_LEVEL} / ${COINS_PER_LEVEL} XP para el próximo nivel  •  ${calmCoins} XP total`
                  : `${calmCoins % COINS_PER_LEVEL} / ${COINS_PER_LEVEL} XP to next level  •  ${calmCoins} total XP`}
              </Text>
            </View>

            {PROGRESSION_MILESTONES.map((m, idx) => {
              const reached = level >= m.level;
              const current = level >= m.level && (idx === PROGRESSION_MILESTONES.length - 1 || level < PROGRESSION_MILESTONES[idx + 1].level);
              return (
                <View key={m.level} style={styles.milestoneRow}>
                  {idx > 0 && <View style={[styles.milestoneConnector, { backgroundColor: reached ? '#2ECC71' : '#E0E0E0' }]} />}
                  <View style={[styles.milestoneCard, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF' }, reached && (isDark ? { backgroundColor: '#0A2818', borderColor: '#1A4A2E' } : styles.milestoneCardReached), current && styles.milestoneCardCurrent]}>
                    <View style={[styles.milestoneDot, { backgroundColor: reached ? '#2ECC71' : '#DDD', borderColor: current ? '#6C5CE7' : 'transparent' }]}>
                      <Text style={{ fontSize: 16 }}>{reached ? m.emoji : '🔒'}</Text>
                    </View>
                    <View style={styles.milestoneInfo}>
                      <View style={styles.milestoneLevelRow}>
                        <Text style={[styles.milestoneLvlText, { color: isDark ? T.soft : '#B2BEC3' }, reached && { color: isDark ? T.text : '#2D3436' }]}>{language === 'es' ? `Nivel ${m.level}` : `Level ${m.level}`}</Text>
                        {current && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>{t('YOU ARE HERE')}</Text></View>}
                      </View>
                      <Text style={[styles.milestoneReward, { color: isDark ? T.soft : '#B2BEC3' }, reached && { color: isDark ? T.text : '#2D3436' }]}>{t(m.reward)}</Text>
                      <Text style={[styles.milestoneDetail, { color: isDark ? T.mid : '#7F8C8D' }]}>{t(m.detail)}</Text>
                      <Text style={styles.milestoneXP}>{language === 'es' ? `Requiere ${m.xp} XP` : `Requires ${m.xp} XP`}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* ── Badges & Streak — full view lives in the popup ── */}
            <TouchableOpacity
              style={[styles.badgesReopenCard, { backgroundColor: isDark ? T.card : '#FFFFFF', borderColor: isDark ? T.edge : '#EFEFEF' }]}
              onPress={() => { tapHaptic(); setShowProgressPopup(true); }}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 26 }}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.badgesTitle, { color: isDark ? T.text : '#2D3436' }]}>{t('Badges')}</Text>
                <Text style={[styles.badgesCount, { color: isDark ? T.mid : '#7F8C8D' }]}>
                  {unlockedBadges.length}/{BADGES.length} {t('earned')}
                </Text>
              </View>
              <Text style={[styles.badgesReopenLink, { color: isDark ? T.text : '#6C5CE7' }]}>{t('View Badges & Streak')}</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </>
        )}

      </ScrollView>

      {/* ── Badges & Streak popup — per active child, shown on entering this screen ── */}
      <Modal visible={showProgressPopup} transparent animationType="fade" onRequestClose={() => setShowProgressPopup(false)}>
        <View style={styles.popupBackdrop}>
          <View style={[styles.popupCard, { backgroundColor: isDark ? T.card : '#FFFFFF' }]}>
            <Text style={[styles.popupTitle, { color: isDark ? T.text : '#2D3436' }]}>{t('Your Progress')}</Text>

            <View style={[styles.streakRow, { backgroundColor: isDark ? T.bg : '#FFF8E8', borderColor: isDark ? T.edge : '#FFE082' }]}>
              <Text style={{ fontSize: 32 }}>🔥</Text>
              <View>
                <Text style={[styles.streakDay, { color: isDark ? T.text : '#2D3436' }]}>{t('Day {n}').replace('{n}', String(streak))}</Text>
                <Text style={[styles.streakBest, { color: isDark ? T.mid : '#7F8C8D' }]}>{t('Best streak: {n} days').replace('{n}', String(longestStreak))}</Text>
              </View>
            </View>

            <View style={styles.badgesHeader}>
              <Text style={[styles.badgesTitle, { color: isDark ? T.text : '#2D3436' }]}>{t('Badges')}</Text>
              <Text style={[styles.badgesCount, { color: isDark ? T.mid : '#7F8C8D' }]}>
                {unlockedBadges.length}/{BADGES.length} {t('earned')}
              </Text>
            </View>
            <ScrollView contentContainerStyle={styles.speciesGrid} style={styles.popupBadgeScroll}>
              {BADGES.map(badge => {
                const earned = unlockedBadges.includes(badge.id) || badge.isEarned(badgeStats);
                return (
                  <View
                    key={badge.id}
                    style={[styles.speciesCard, { backgroundColor: isDark ? T.bg : '#F8F8F8', borderColor: isDark ? T.edge : '#EFEFEF' }, earned && { backgroundColor: isDark ? T.card : '#FFFFFF' }]}
                  >
                    {earned ? (
                      <Text style={{ fontSize: 28 }}>{badge.emoji}</Text>
                    ) : (
                      <Feather name="lock" size={28} color="#B2BEC3" />
                    )}
                    <Text style={[styles.speciesName, { color: isDark ? T.text : '#2D3436' }, !earned && styles.lockedText]}>{t(badge.name)}</Text>
                    {!earned && (
                      <Text style={[styles.unlockHint, { textAlign: 'center' }]} numberOfLines={2}>{t(badge.description)}</Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.popupCloseBtn}
              onPress={() => { tapHaptic(); setShowProgressPopup(false); }}
              activeOpacity={0.85}
            >
              <Text style={styles.popupCloseBtnText}>{t('Continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF4' },

  // Canvas
  canvasContainer: { height: 270, marginHorizontal: 4, marginTop: 8, borderRadius: 24, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#DDD' },
  stageRow: { position: 'absolute', bottom: 18, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 12 },

  // Avatar
  avatarColumn: { width: 220, alignItems: 'center', position: 'relative' },

  // Sapling
  saplingColumn: { alignItems: 'center', width: 110 },
  saplingTitle: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // Pot
  potTouchable: { alignItems: 'center', marginTop: 2 },
  potRim: { width: 58, height: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  potSoilLayer: { width: '70%', height: 5, borderRadius: 3, marginTop: 2 },
  potBody: { width: 46, height: 38, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, overflow: 'hidden', justifyContent: 'flex-start', paddingTop: 4 },
  potShine: { width: 8, height: 20, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 4, marginLeft: 6 },
  breatheLabel: { fontSize: 8, fontWeight: '800', color: '#FFFFFF', marginTop: 3, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, textAlign: 'center' },
  saplingLevelBadge: { fontSize: 9, fontWeight: '800', color: '#2D3436', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 2 },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: '#EFEFEF', marginHorizontal: 12, marginTop: 8, padding: 3, borderRadius: 14 },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 11 },
  activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 11, fontWeight: '700', color: '#7F8C8D' },
  activeTabText: { color: '#6C5CE7' },

  // Drawer
  drawer: { flex: 1, marginTop: 8 },
  drawerContent: { paddingHorizontal: 14, paddingBottom: 32 },
  drawerHint: { fontSize: 12, color: '#7F8C8D', marginBottom: 12, textAlign: 'center' },

  // Species grid
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  speciesCard: { width: '31%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#EFEFEF', marginBottom: 4, position: 'relative' },
  speciesCardActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F2FF' },
  speciesName: { fontSize: 11, fontWeight: '700', color: '#2D3436', textAlign: 'center' },
  lockedText: { color: '#B2BEC3' },
  unlockHint: { fontSize: 9, color: '#A29BFE', fontWeight: '600', marginTop: 2 },
  activeCheckBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#6C5CE7', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2 },
  colorSwatch: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginTop: 4 },

  // Zoo biomes
  biomeSection: { marginBottom: 18 },
  biomeHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1.5 },
  biomeIcon:    { fontSize: 20 },
  biomeLabel:   { fontSize: 14, fontWeight: '800', flex: 1 },
  biomeCount:   { fontSize: 12, fontWeight: '800', opacity: 0.8 },

  // Options generic
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#EFEFEF', minWidth: 72 },
  optionCardActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F2FF' },
  optionEmoji: { fontSize: 24, marginBottom: 4 },
  optionLabel: { fontSize: 11, fontWeight: '700', color: '#2D3436' },
  optionLabelActive: { color: '#6C5CE7' },

  // Wardrobe
  wardrobeSection: { marginBottom: 18 },
  wardrobeCatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1.5, borderColor: '#EFEFEF' },
  wardrobeCatLabel: { fontSize: 13, fontWeight: '800', color: '#2D3436', flex: 1 },
  wardrobeCatCount: { fontSize: 12, fontWeight: '700', color: '#7F8C8D' },
  wardrobeEmpty: { fontSize: 12, color: '#B2BEC3', fontStyle: 'italic', paddingVertical: 8 },
  wardrobeCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#EFEFEF', minWidth: 80, maxWidth: 100 },
  wardrobeCardActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F2FF' },
  wardrobeCardEmoji: { fontSize: 24, marginBottom: 4 },
  wardrobeCardImage: { width: 56, height: 56, borderRadius: 10, marginBottom: 4 },
  wardrobeCardName: { fontSize: 10, fontWeight: '700', color: '#2D3436', textAlign: 'center' },
  wardrobeCardNameActive: { color: '#6C5CE7' },
  onBadge: { marginTop: 4, backgroundColor: '#6C5CE7', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2 },
  onBadgeText: { fontSize: 8, color: '#FFF', fontWeight: '800' },

  // Sprout pot theme
  potThemeCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#EFEFEF', minWidth: 72 },
  potThemeCardActive: { borderColor: '#6C5CE7', backgroundColor: '#F4F2FF' },
  potThemePreview: { width: 36, height: 36, borderRadius: 8, borderWidth: 3, marginBottom: 6 },
  saplingInfoCard: { marginTop: 16, backgroundColor: '#F4F2FF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#D4CFFE' },
  saplingInfoTitle: { fontSize: 14, fontWeight: '800', color: '#6C5CE7', marginBottom: 6 },
  saplingInfoBody: { fontSize: 12, color: '#636E72', lineHeight: 18, marginBottom: 12 },
  stageRow2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stageItem: { alignItems: 'center', gap: 4 },
  stageDot: { width: 10, height: 10, borderRadius: 5 },
  stageText: { fontSize: 9, color: '#7F8C8D', fontWeight: '600' },

  // Progression road
  xpSummaryCard: { backgroundColor: '#F4F2FF', borderRadius: 16, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: '#D4CFFE' },
  xpSummaryLevel: { fontSize: 18, fontWeight: '800', color: '#6C5CE7', marginBottom: 8, textAlign: 'center' },
  xpSummaryTrack: { height: 10, backgroundColor: '#E0DCFF', borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  xpSummaryFill: { height: '100%', backgroundColor: '#6C5CE7', borderRadius: 5 },
  xpSummarySub: { fontSize: 11, color: '#A29BFE', textAlign: 'center' },

  milestoneRow: { position: 'relative' },
  milestoneConnector: { width: 3, height: 20, marginLeft: 22, borderRadius: 2 },
  milestoneCard: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: '#EFEFEF', marginBottom: 0, alignItems: 'center' },
  milestoneCardReached: { borderColor: '#2ECC71', backgroundColor: '#F0FFF4' },
  milestoneCardCurrent: { borderColor: '#6C5CE7', backgroundColor: '#F4F2FF', shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  milestoneDot: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  milestoneInfo: { flex: 1 },
  milestoneLevelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  milestoneLvlText: { fontSize: 13, fontWeight: '800', color: '#B2BEC3' },
  milestoneLvlReached: { color: '#2D3436' },
  currentBadge: { backgroundColor: '#6C5CE7', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  currentBadgeText: { fontSize: 8, color: '#FFF', fontWeight: '800' },
  milestoneReward: { fontSize: 14, fontWeight: '800', color: '#B2BEC3', marginBottom: 2 },
  milestoneRewardReached: { color: '#2D3436' },
  milestoneDetail: { fontSize: 11, color: '#7F8C8D', marginBottom: 2 },
  milestoneXP: { fontSize: 10, color: '#A29BFE', fontWeight: '600' },

  // Badges
  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  badgesTitle:  { fontSize: 16, fontWeight: '900' },
  badgesCount:  { fontSize: 12, fontWeight: '700' },

  badgesReopenCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, borderWidth: 1.5, padding: 14, marginTop: 20,
  },
  badgesReopenLink: { fontSize: 12, fontWeight: '800' },

  // Badges & Streak popup
  popupBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  popupCard: { width: '100%', maxWidth: 420, maxHeight: '85%', borderRadius: 24, padding: 22 },
  popupTitle: { fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  popupBadgeScroll: { maxHeight: 320 },
  popupCloseBtn: { backgroundColor: '#6C5CE7', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  popupCloseBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },

  streakRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 8,
  },
  streakDay: { fontSize: 18, fontWeight: '900' },
  streakBest: { fontSize: 12, fontWeight: '700', marginTop: 2 },
});
