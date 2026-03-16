'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AVAILABLE_LOCALES, RTL_LOCALES } from '../constants';

export default function LocaleManager() {
  const [state, dispatch] = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);

  const availableToAdd = AVAILABLE_LOCALES.filter(
    l => !state.locales.includes(l.code)
  );

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Languages
      </label>

      {/* Active locale pills */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {state.locales.map((locale) => {
          const isRtl = RTL_LOCALES.has(locale);
          return (
            <div
              key={locale}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--sidebar-fg)',
              }}
            >
              <span className="font-medium uppercase">{locale}</span>
              {isRtl && (
                <span className="text-[10px]" style={{ color: 'var(--warning)' }}>RTL</span>
              )}
              {state.locales.length > 1 && (
                <button
                  onClick={() => dispatch({ type: 'REMOVE_LOCALE', payload: locale })}
                  className="ml-0.5 hover:bg-white/10 rounded px-0.5 transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add locale */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-xs px-2.5 py-1.5 rounded-md transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--muted)',
          }}
        >
          + Add Language
        </button>

        {showDropdown && availableToAdd.length > 0 && (
          <div
            className="absolute bottom-full left-0 mb-1 rounded-md overflow-hidden shadow-lg z-10 max-h-48 overflow-y-auto"
            style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', minWidth: 160 }}
          >
            {availableToAdd.map((locale) => (
              <button
                key={locale.code}
                onClick={() => {
                  dispatch({ type: 'ADD_LOCALE', payload: locale.code });
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
                style={{ color: 'var(--sidebar-fg)' }}
              >
                <span className="font-mono uppercase w-6">{locale.code}</span>
                <span>{locale.name}</span>
                {RTL_LOCALES.has(locale.code) && (
                  <span className="text-[10px] ml-auto" style={{ color: 'var(--warning)' }}>RTL</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
