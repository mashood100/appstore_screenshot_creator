export interface BrandColors {
  accent: string;
  text: string;
  background: string;
}

export interface ThemeTokens {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
}

export type ThemeId = 'clean-light' | 'dark-bold' | 'warm-editorial' | 'custom';

export type StylePreset =
  | 'warm-organic'
  | 'dark-moody'
  | 'clean-minimal'
  | 'bold-colorful'
  | 'gradient-heavy'
  | 'flat';

export type Locale = string;

export interface ExportSize {
  label: string;
  w: number;
  h: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export interface ScreenshotFile {
  id: string;
  name: string;
  dataUrl: string;
}

export interface UIElementFile {
  id: string;
  name: string;
  dataUrl: string;
}

export type SlideType =
  | 'hero'
  | 'differentiator'
  | 'ecosystem'
  | 'core-feature'
  | 'trust-signal'
  | 'more-features';

export type SlideLayout =
  | 'centered'
  | 'offset-right'
  | 'offset-left'
  | 'two-phone'
  | 'no-phone';

export interface TextPosition {
  x: number; // percentage of canvas width (0-100)
  y: number; // percentage of canvas height (0-100)
}

export interface SlideConfig {
  id: string;
  type: SlideType;
  categoryLabel: string;
  headline: string;
  screenshotIndex: number;
  layout: SlideLayout;
  textPosition?: TextPosition;
}

export interface SlideCopy {
  slideId: string;
  categoryLabel: string;
  headline: string;
}

export interface SlideProps {
  canvasW: number;
  canvasH: number;
  theme: ThemeTokens;
  copy: SlideCopy;
  screenshots: ScreenshotFile[];
  appIcon: string | null;
  features: Feature[];
  isRtl: boolean;
  device: 'iphone' | 'ipad';
  uiElements: string[];
  stylePreset: StylePreset;
  slideConfig: SlideConfig;
  onTextChange?: (field: 'headline' | 'categoryLabel', value: string) => void;
  onPositionChange?: (position: TextPosition) => void;
  isEditable?: boolean;
}

export interface DashboardState {
  // Uploads
  screenshots: ScreenshotFile[];
  appIcon: string | null;
  uiElements: UIElementFile[];

  // Brand
  colors: BrandColors;
  fontFamily: string;

  // Content
  features: Feature[];
  slideCount: number;
  slides: SlideConfig[];

  // Style
  stylePreset: StylePreset;
  themeId: ThemeId;

  // Device & Export
  device: 'iphone' | 'ipad';
  exportSize: ExportSize;
  locales: Locale[];
  activeLocale: Locale;

  // UI state
  sidebarOpen: boolean;
  selectedSlideIndex: number | null;
  exporting: boolean;
  exportProgress: { current: number; total: number } | null;
}

export type DashboardAction =
  | { type: 'SET_SCREENSHOTS'; payload: ScreenshotFile[] }
  | { type: 'ADD_SCREENSHOT'; payload: ScreenshotFile }
  | { type: 'REMOVE_SCREENSHOT'; payload: string }
  | { type: 'SET_APP_ICON'; payload: string | null }
  | { type: 'SET_UI_ELEMENTS'; payload: UIElementFile[] }
  | { type: 'ADD_UI_ELEMENT'; payload: UIElementFile }
  | { type: 'REMOVE_UI_ELEMENT'; payload: string }
  | { type: 'SET_COLORS'; payload: Partial<BrandColors> }
  | { type: 'SET_FONT'; payload: string }
  | { type: 'SET_FEATURES'; payload: Feature[] }
  | { type: 'ADD_FEATURE'; payload: Feature }
  | { type: 'REMOVE_FEATURE'; payload: string }
  | { type: 'SET_SLIDE_COUNT'; payload: number }
  | { type: 'SET_SLIDES'; payload: SlideConfig[] }
  | { type: 'SET_STYLE'; payload: StylePreset }
  | { type: 'SET_THEME'; payload: ThemeId }
  | { type: 'SET_DEVICE'; payload: 'iphone' | 'ipad' }
  | { type: 'SET_EXPORT_SIZE'; payload: ExportSize }
  | { type: 'SET_LOCALE'; payload: Locale }
  | { type: 'ADD_LOCALE'; payload: Locale }
  | { type: 'REMOVE_LOCALE'; payload: Locale }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SELECT_SLIDE'; payload: number | null }
  | { type: 'SET_EXPORTING'; payload: boolean }
  | { type: 'SET_EXPORT_PROGRESS'; payload: { current: number; total: number } | null }
  | { type: 'ADD_SLIDE'; payload: SlideConfig }
  | { type: 'REMOVE_SLIDE'; payload: string }
  | { type: 'UPDATE_SLIDE'; payload: { id: string; changes: Partial<SlideConfig> } };
