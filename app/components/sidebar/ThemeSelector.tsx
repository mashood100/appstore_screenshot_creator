'use client';

import { useDashboard } from '../context/DashboardContext';
import { THEMES } from '../constants';
import { ThemeId } from '../types';

const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: 'clean-light', label: 'Clean Light' },
  { id: 'dark-bold', label: 'Dark Bold' },
  { id: 'warm-editorial', label: 'Warm Editorial' },
];

export default function ThemeSelector() {
  const [state, dispatch] = useDashboard();

  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: 'var(--sidebar-fg)' }}>
        Theme Preset
      </label>
      <div className="flex gap-2">
        {THEME_OPTIONS.map((option) => {
          const theme = THEMES[option.id];
          const isActive = state.themeId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => dispatch({ type: 'SET_THEME', payload: option.id })}
              className="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-md transition-all"
              style={{
                background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Color dots */}
              <div className="flex gap-1">
                <span
                  className="rounded-full"
                  style={{ width: 12, height: 12, background: theme.bg, border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <span
                  className="rounded-full"
                  style={{ width: 12, height: 12, background: theme.accent }}
                />
                <span
                  className="rounded-full"
                  style={{ width: 12, height: 12, background: theme.fg }}
                />
              </div>
              <span className="text-[10px]" style={{ color: isActive ? 'var(--sidebar-fg)' : 'var(--muted)' }}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
