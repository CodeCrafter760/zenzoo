/**
 * ZenZoo Design System
 * Single source of truth for all colours, typography, spacing,
 * border radii, and shadow presets. Import from here — never
 * hard-code design values inside component files.
 */

// ── Accent palette ─────────────────────────────────────────────────────────────
// Fixed colours that read well on both light and dark surfaces.
export const PALETTE = {
  purple: '#7C6EF0',  // Primary brand — XP bar, focus, coins
  gold:   '#FFB830',  // Rewards, home tab, journal, save
  mint:   '#3DD6C0',  // Shop tab, completion, breathe-ready
  coral:  '#FF8267',  // Breathing stop, timer breaks
  pink:   '#FF7BAC',  // Stories tab
  sky:    '#5BB8E4',  // Breathe tab, inhale phase, backgrounds
  indigo: '#6366F1',  // Bedroom audio active, long break
  violet: '#8B5CF6',  // Bedroom checklist, progress fill
  amber:  '#FBBF24',  // Bedroom breathing circle glow
  green:  '#2ECC71',  // Success / "Done" badges
} as const;

// ── Light surface theme ────────────────────────────────────────────────────────
export const LIGHT_THEME = {
  bg:      '#FDFAF6',   // Warm cream — primary background
  card:    '#FFFFFF',   // Pure white cards
  text:    '#2D2A5E',   // Deep purple-navy
  mid:     '#7A7498',   // Purple-grey — secondary text
  soft:    '#B8B4CC',   // Light purple-grey — placeholder / disabled
  edge:    '#EEE8F4',   // Subtle purple border
  navBg:   '#FFFFFF',
  navEdge: '#EEE8F4',
} as const;

// ── Dark surface theme ─────────────────────────────────────────────────────────
export const DARK_THEME = {
  bg:      '#0F0D1E',   // Deep navy
  card:    '#1A1830',   // Slightly lighter card
  text:    '#EDE9FF',   // Light lavender
  mid:     '#9B96C0',   // Medium lavender
  soft:    '#5E5A82',   // Muted lavender
  edge:    '#2A2548',   // Subtle purple border
  navBg:   '#13112A',
  navEdge: '#2A2548',
} as const;

export type Theme = typeof LIGHT_THEME;

// ── Typography scale ───────────────────────────────────────────────────────────
export const TYPE = {
  display: { fontSize: 30, fontWeight: '900' as const, letterSpacing: -0.4 },
  title:   { fontSize: 24, fontWeight: '900' as const, letterSpacing: -0.3 },
  heading: { fontSize: 18, fontWeight: '900' as const },
  subhead: { fontSize: 16, fontWeight: '800' as const },
  label:   { fontSize: 14, fontWeight: '700' as const },
  body:    { fontSize: 14, fontWeight: '500' as const, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '600' as const },
  tiny:    { fontSize: 10, fontWeight: '600' as const },
} as const;

// ── Spacing scale (4-pt grid) ──────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  xxl: 40,
} as const;

// ── Border radii ───────────────────────────────────────────────────────────────
// Mathematically consistent: sm=10, md=16, lg=22, xl=28 (increments of 6)
export const RADIUS = {
  sm:   10,   // badges, small chips
  md:   16,   // medium chips, inputs
  lg:   22,   // cards, standard containers
  xl:   28,   // hero cards, pet circle areas
  pill: 99,   // fully-rounded pills
} as const;

// ── Shadow presets ─────────────────────────────────────────────────────────────
// Spread these into StyleSheet objects alongside a `shadowColor`.
// e.g.  { shadowColor: PALETTE.purple, ...SHADOW.md }
export const SHADOW = {
  sm: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,  elevation: 2 },
  md: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 4 },
  lg: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 6 },
  xl: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 22, elevation: 8 },
} as const;
