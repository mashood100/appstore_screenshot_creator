'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import {
  DashboardState,
  DashboardAction,
  SlideConfig,
  GeneratedConfig,
} from '../types';
import { IPHONE_SIZES, THEMES, MAX_SLIDES } from '../constants';

const initialState: DashboardState = {
  apiKey: '',
  appDescription: '',
  screenshots: [],
  appIcon: null,
  uiElements: [],
  colors: { accent: '#5B7CFA', text: '#171717', background: '#F6F1EA' },
  fontFamily: 'Inter',
  features: [],
  slideCount: 0,
  slides: [],
  stylePreset: 'clean-minimal',
  themeId: 'clean-light',
  device: 'iphone',
  exportSize: IPHONE_SIZES[0],
  locales: ['en'],
  activeLocale: 'en',
  sidebarOpen: true,
  selectedSlideIndex: null,
  generating: false,
  exporting: false,
  exportProgress: null,
  error: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_APP_DESCRIPTION':
      return { ...state, appDescription: action.payload };
    case 'SET_SCREENSHOTS':
      return { ...state, screenshots: action.payload };
    case 'ADD_SCREENSHOT':
      return { ...state, screenshots: [...state.screenshots, action.payload] };
    case 'REMOVE_SCREENSHOT':
      return { ...state, screenshots: state.screenshots.filter(s => s.id !== action.payload) };
    case 'SET_APP_ICON':
      return { ...state, appIcon: action.payload };
    case 'SET_UI_ELEMENTS':
      return { ...state, uiElements: action.payload };
    case 'ADD_UI_ELEMENT':
      return { ...state, uiElements: [...state.uiElements, action.payload] };
    case 'REMOVE_UI_ELEMENT':
      return { ...state, uiElements: state.uiElements.filter(e => e.id !== action.payload) };
    case 'SET_COLORS':
      return { ...state, colors: { ...state.colors, ...action.payload }, themeId: 'custom' };
    case 'SET_FONT':
      return { ...state, fontFamily: action.payload };
    case 'SET_FEATURES':
      return { ...state, features: action.payload };
    case 'ADD_FEATURE':
      return { ...state, features: [...state.features, action.payload] };
    case 'REMOVE_FEATURE':
      return { ...state, features: state.features.filter(f => f.id !== action.payload) };
    case 'SET_SLIDE_COUNT': {
      const count = Math.max(0, Math.min(MAX_SLIDES, action.payload));
      return { ...state, slideCount: count };
    }
    case 'SET_SLIDES':
      return { ...state, slides: action.payload, slideCount: action.payload.length };
    case 'ADD_SLIDE': {
      if (state.slides.length >= MAX_SLIDES) return state;
      const newSlides = [...state.slides, action.payload];
      return { ...state, slides: newSlides, slideCount: newSlides.length };
    }
    case 'REMOVE_SLIDE': {
      const filtered = state.slides.filter(s => s.id !== action.payload);
      return {
        ...state,
        slides: filtered,
        slideCount: filtered.length,
        selectedSlideIndex: state.selectedSlideIndex !== null && state.selectedSlideIndex >= filtered.length
          ? null
          : state.selectedSlideIndex,
      };
    }
    case 'SET_STYLE':
      return { ...state, stylePreset: action.payload };
    case 'SET_THEME': {
      const theme = THEMES[action.payload];
      return {
        ...state,
        themeId: action.payload,
        colors: {
          accent: theme.accent,
          text: theme.fg,
          background: theme.bg,
        },
      };
    }
    case 'SET_DEVICE':
      return { ...state, device: action.payload };
    case 'SET_EXPORT_SIZE':
      return { ...state, exportSize: action.payload };
    case 'SET_LOCALE':
      return { ...state, activeLocale: action.payload };
    case 'ADD_LOCALE':
      if (state.locales.includes(action.payload)) return state;
      return { ...state, locales: [...state.locales, action.payload] };
    case 'REMOVE_LOCALE':
      if (state.locales.length <= 1) return state;
      return {
        ...state,
        locales: state.locales.filter(l => l !== action.payload),
        activeLocale: state.activeLocale === action.payload ? state.locales[0] : state.activeLocale,
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SELECT_SLIDE':
      return { ...state, selectedSlideIndex: action.payload };
    case 'SET_GENERATING':
      return { ...state, generating: action.payload };
    case 'SET_EXPORTING':
      return { ...state, exporting: action.payload };
    case 'SET_EXPORT_PROGRESS':
      return { ...state, exportProgress: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_GENERATED_CONFIG': {
      const config: GeneratedConfig = action.payload;
      const cappedSlides = config.slides.slice(0, MAX_SLIDES);
      return {
        ...state,
        colors: config.colors,
        themeId: config.themeId,
        features: config.features,
        slideCount: cappedSlides.length,
        slides: cappedSlides,
        fontFamily: config.fontSuggestion || state.fontFamily,
        stylePreset: config.styleSuggestion || state.stylePreset,
        generating: false,
      };
    }
    default:
      return state;
  }
}

const DashboardContext = createContext<[DashboardState, React.Dispatch<DashboardAction>] | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('claude-api-key');
    if (savedKey) {
      dispatch({ type: 'SET_API_KEY', payload: savedKey });
    }
  }, []);

  return (
    <DashboardContext.Provider value={[state, dispatch]}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
