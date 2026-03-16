'use client';

import { useDashboard } from '../context/DashboardContext';
import { STYLE_PRESETS } from '../constants';

export default function StyleSelector() {
  const [state, dispatch] = useDashboard();

  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: 'var(--sidebar-fg)' }}>
        Style Direction
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {STYLE_PRESETS.map((preset) => {
          const isActive = state.stylePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => dispatch({ type: 'SET_STYLE', payload: preset.id })}
              className="text-left px-2.5 py-2 rounded-md transition-all"
              style={{
                background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="block text-xs font-medium"
                style={{ color: isActive ? 'var(--sidebar-fg)' : 'var(--muted)' }}
              >
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
