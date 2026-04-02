'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  DashboardState,
  DashboardAction,
  SlideConfig,
} from '../types';
import { IPHONE_SIZES, THEMES, MAX_SLIDES } from '../constants';

const initialState: DashboardState = {
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
  exporting: false,
  exportProgress: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_SCREENSHOTS':
      return { ...state, screenshots: action.payload };
    case 'ADD_SCREENSHOT':
      return { ...state, screenshots: [...state.screenshots, action.payload] };
    case 'REMOVE_SCREENSHOT': {
      const removedId = action.payload;
      return {
        ...state,
        screenshots: state.screenshots.filter(s => s.id !== removedId),
        slides: state.slides.map(s => ({
          ...s,
          screenshotId: s.screenshotId === removedId ? null : s.screenshotId,
          secondaryScreenshotId: s.secondaryScreenshotId === removedId ? null : s.secondaryScreenshotId,
        })),
      };
    }
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
    case 'SET_EXPORTING':
      return { ...state, exporting: action.payload };
    case 'SET_EXPORT_PROGRESS':
      return { ...state, exportProgress: action.payload };
    case 'UPDATE_SLIDE': {
      const { id, changes } = action.payload;
      return { ...state, slides: state.slides.map(s => s.id === id ? { ...s, ...changes } : s) };
    }
    case 'ASSIGN_SCREENSHOT': {
      const { slideId, screenshotId, secondary } = action.payload;
      return {
        ...state,
        slides: state.slides.map(s => {
          if (s.id !== slideId) return s;
          if (secondary) return { ...s, secondaryScreenshotId: screenshotId };
          return { ...s, screenshotId };
        }),
      };
    }
    default:
      return state;
  }
}

const DashboardContext = createContext<[DashboardState, React.Dispatch<DashboardAction>] | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

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
