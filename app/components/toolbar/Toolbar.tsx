'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { IPHONE_SIZES, IPAD_SIZES, THEMES } from '../constants';
import { ThemeId, ExportSize } from '../types';

interface ToolbarProps {
  onExportCurrent: () => void;
  onExportAll: () => void;
}

export default function Toolbar({ onExportCurrent, onExportAll }: ToolbarProps) {
  const [state, dispatch] = useDashboard();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const sizes = state.device === 'ipad' ? IPAD_SIZES : IPHONE_SIZES;

  const themeOptions: { id: ThemeId; color: string }[] = [
    { id: 'clean-light', color: THEMES['clean-light'].bg },
    { id: 'dark-bold', color: THEMES['dark-bold'].bg },
    { id: 'warm-editorial', color: THEMES['warm-editorial'].bg },
  ];

  return (
    <div
      className="flex items-center justify-between px-6 py-3 sticky top-0 z-10"
      style={{
        background: 'var(--toolbar-bg)',
        borderBottom: '1px solid var(--toolbar-border)',
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Device toggle */}
        <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--card-border)' }}>
          <button
            onClick={() => dispatch({ type: 'SET_DEVICE', payload: 'iphone' })}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: state.device === 'iphone' ? 'var(--accent)' : 'transparent',
              color: state.device === 'iphone' ? '#fff' : 'var(--foreground)',
            }}
          >
            iPhone
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_DEVICE', payload: 'ipad' })}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: state.device === 'ipad' ? 'var(--accent)' : 'transparent',
              color: state.device === 'ipad' ? '#fff' : 'var(--foreground)',
              borderLeft: '1px solid var(--card-border)',
            }}
          >
            iPad
          </button>
        </div>

        {/* Size dropdown */}
        <select
          value={`${state.exportSize.w}x${state.exportSize.h}`}
          onChange={(e) => {
            const size = sizes.find((s: ExportSize) => `${s.w}x${s.h}` === e.target.value);
            if (size) dispatch({ type: 'SET_EXPORT_SIZE', payload: size });
          }}
          className="px-2 py-1.5 rounded-md text-xs outline-none cursor-pointer"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--foreground)',
          }}
        >
          {sizes.map((size: ExportSize) => (
            <option key={`${size.w}x${size.h}`} value={`${size.w}x${size.h}`}>
              {size.label} ({size.w}x{size.h})
            </option>
          ))}
        </select>

        {/* Locale tabs */}
        {state.locales.length > 1 && (
          <div className="flex gap-1">
            {state.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => dispatch({ type: 'SET_LOCALE', payload: locale })}
                className="px-2.5 py-1 rounded text-xs font-medium uppercase transition-colors"
                style={{
                  background: state.activeLocale === locale ? 'var(--accent)' : 'transparent',
                  color: state.activeLocale === locale ? '#fff' : 'var(--muted)',
                }}
              >
                {locale}
              </button>
            ))}
          </div>
        )}

        {/* Theme quick-switcher */}
        <div className="flex gap-1.5 items-center">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => dispatch({ type: 'SET_THEME', payload: opt.id })}
              className="rounded-full transition-all"
              style={{
                width: state.themeId === opt.id ? 16 : 12,
                height: state.themeId === opt.id ? 16 : 12,
                background: opt.color,
                border: state.themeId === opt.id
                  ? '2px solid var(--accent)'
                  : '1px solid var(--card-border)',
                boxShadow: state.themeId === opt.id ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none',
              }}
              title={opt.id}
            />
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Export progress */}
        {state.exportProgress && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(state.exportProgress.current / state.exportProgress.total) * 100}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {state.exportProgress.current}/{state.exportProgress.total}
            </span>
          </div>
        )}

        {/* Export button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={state.exporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              opacity: state.exporting ? 0.6 : 1,
            }}
          >
            {state.exporting ? 'Exporting...' : 'Export'}
            <span className="text-xs">▾</span>
          </button>

          {showExportMenu && !state.exporting && (
            <div
              className="absolute right-0 top-full mt-1 rounded-md overflow-hidden shadow-lg z-20"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                minWidth: 200,
              }}
            >
              <button
                onClick={() => {
                  onExportCurrent();
                  setShowExportMenu(false);
                }}
                disabled={state.selectedSlideIndex === null}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
                style={{
                  color: state.selectedSlideIndex === null ? 'var(--muted)' : 'var(--foreground)',
                  borderBottom: '1px solid var(--card-border)',
                }}
              >
                Export Current Slide
                {state.selectedSlideIndex === null && (
                  <span className="block text-xs" style={{ color: 'var(--muted)' }}>Select a slide first</span>
                )}
              </button>
              <button
                onClick={() => {
                  onExportAll();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
                style={{ color: 'var(--foreground)' }}
              >
                Export All Slides
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
