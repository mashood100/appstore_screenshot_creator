import { ThemeTokens, ThemeId, ExportSize, StylePreset, SlideType, SlideLayout } from './types';

// Max slides allowed (keeps Claude API responses manageable)
export const MAX_SLIDES = 5;

// Canvas design sizes (design at largest, scale for export)
export const IPHONE_W = 1320;
export const IPHONE_H = 2868;
export const IPAD_W = 2064;
export const IPAD_H = 2752;

// iPhone mockup measurements (from mockup.png)
export const MK_W = 1022;
export const MK_H = 2082;
export const SC_L = (52 / MK_W) * 100;   // screen left offset %
export const SC_T = (46 / MK_H) * 100;   // screen top offset %
export const SC_W = (918 / MK_W) * 100;  // screen width %
export const SC_H = (1990 / MK_H) * 100; // screen height %
export const SC_RX = (126 / 918) * 100;  // border-radius x %
export const SC_RY = (126 / 1990) * 100; // border-radius y %

// Export sizes
export const IPHONE_SIZES: ExportSize[] = [
  { label: '6.9"', w: 1320, h: 2868 },
  { label: '6.5"', w: 1284, h: 2778 },
  { label: '6.3"', w: 1206, h: 2622 },
  { label: '6.1"', w: 1125, h: 2436 },
];

export const IPAD_SIZES: ExportSize[] = [
  { label: '13" iPad', w: 2064, h: 2752 },
  { label: '12.9" iPad Pro', w: 2048, h: 2732 },
];

// Theme presets
export const THEMES: Record<ThemeId, ThemeTokens> = {
  'clean-light': {
    bg: '#F6F1EA',
    fg: '#171717',
    accent: '#5B7CFA',
    muted: '#6B7280',
  },
  'dark-bold': {
    bg: '#0B1020',
    fg: '#F8FAFC',
    accent: '#8B5CF6',
    muted: '#94A3B8',
  },
  'warm-editorial': {
    bg: '#F7E8DA',
    fg: '#2B1D17',
    accent: '#D97706',
    muted: '#7C5A47',
  },
  custom: {
    bg: '#FFFFFF',
    fg: '#171717',
    accent: '#5B7CFA',
    muted: '#6B7280',
  },
};

// Style presets
export const STYLE_PRESETS: { id: StylePreset; label: string; description: string }[] = [
  { id: 'clean-minimal', label: 'Clean / Minimal', description: 'Crisp whites, subtle shadows, breathing room' },
  { id: 'dark-moody', label: 'Dark / Moody', description: 'Deep backgrounds, glowing accents, dramatic' },
  { id: 'warm-organic', label: 'Warm / Organic', description: 'Earthy tones, soft gradients, inviting' },
  { id: 'bold-colorful', label: 'Bold / Colorful', description: 'Vibrant colors, strong contrasts, energetic' },
  { id: 'gradient-heavy', label: 'Gradient Heavy', description: 'Rich gradients, depth, modern feel' },
  { id: 'flat', label: 'Flat', description: 'Solid colors, no shadows, minimal decoration' },
];

// Available fonts
export const AVAILABLE_FONTS = [
  'Inter',
  'Poppins',
  'DM Sans',
  'Manrope',
  'Space Grotesk',
  'Plus Jakarta Sans',
  'Outfit',
  'Sora',
  'Nunito',
  'Rubik',
];

// RTL locales
export const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

// Available locales
export const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'he', name: 'Hebrew' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
];

// Typography scale functions (relative to canvas width)
export const categoryLabelSize = (W: number) => W * 0.028;
export const headlineSize = (W: number) => W * 0.09;
export const heroHeadlineSize = (W: number) => W * 0.1;

// Slide framework (narrative arc)
export const SLIDE_FRAMEWORK = [
  { slot: 1, type: 'hero' as const, purpose: 'Hero / Main Benefit', description: 'App icon + tagline + home screen' },
  { slot: 2, type: 'differentiator' as const, purpose: 'Differentiator', description: 'What makes this app unique' },
  { slot: 3, type: 'ecosystem' as const, purpose: 'Ecosystem', description: 'Widgets, watch, extensions' },
  { slot: 4, type: 'core-feature' as const, purpose: 'Core Feature', description: 'One feature per slide' },
  { slot: 5, type: 'core-feature' as const, purpose: 'Core Feature', description: 'One feature per slide' },
  { slot: 6, type: 'core-feature' as const, purpose: 'Core Feature', description: 'One feature per slide' },
  { slot: 7, type: 'trust-signal' as const, purpose: 'Trust Signal', description: 'Identity and craft' },
  { slot: 8, type: 'more-features' as const, purpose: 'More Features', description: 'Feature pills + extras' },
];

// Slide design catalog — shown in the design picker when user clicks "+"
export const SLIDE_DESIGNS: {
  type: SlideType;
  label: string;
  description: string;
  defaultCategoryLabel: string;
  defaultHeadline: string;
  defaultLayout: SlideLayout;
}[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'App icon, big tagline, and phone at bottom. The first thing users see.',
    defaultCategoryLabel: '',
    defaultHeadline: 'Your App Tagline',
    defaultLayout: 'centered',
  },
  {
    type: 'differentiator',
    label: 'Differentiator',
    description: 'Highlight what makes your app unique vs competitors.',
    defaultCategoryLabel: 'WHAT SETS US APART',
    defaultHeadline: 'Built Different',
    defaultLayout: 'offset-right',
  },
  {
    type: 'ecosystem',
    label: 'Ecosystem',
    description: 'Show your app across devices with two phones layered together.',
    defaultCategoryLabel: 'EVERYWHERE YOU ARE',
    defaultHeadline: 'Works Across\nAll Devices',
    defaultLayout: 'two-phone',
  },
  {
    type: 'core-feature',
    label: 'Feature Spotlight',
    description: 'Showcase a single key feature with a phone mockup.',
    defaultCategoryLabel: 'FEATURE',
    defaultHeadline: 'Your Key Feature',
    defaultLayout: 'centered',
  },
  {
    type: 'trust-signal',
    label: 'Trust Signal',
    description: 'Bold text-only slide for identity and craft. No phone.',
    defaultCategoryLabel: 'MADE FOR YOU',
    defaultHeadline: 'Crafted With Care',
    defaultLayout: 'no-phone',
  },
  {
    type: 'more-features',
    label: 'More Features',
    description: 'Grid of feature pills showing everything else your app does.',
    defaultCategoryLabel: '',
    defaultHeadline: 'And So Much More',
    defaultLayout: 'no-phone',
  },
];
