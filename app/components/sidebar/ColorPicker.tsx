'use client';

import { useDashboard } from '../context/DashboardContext';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
        style={{ background: 'transparent' }}
      />
      <div className="flex-1">
        <label className="block text-xs mb-0.5" style={{ color: 'var(--muted)' }}>
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) onChange(val);
          }}
          className="w-full px-2 py-1 rounded text-xs font-mono outline-none"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--sidebar-fg)',
          }}
        />
      </div>
    </div>
  );
}

export default function ColorPicker() {
  const [state, dispatch] = useDashboard();

  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: 'var(--sidebar-fg)' }}>
        Brand Colors
      </label>
      <div className="space-y-3">
        <ColorField
          label="Accent"
          value={state.colors.accent}
          onChange={(color) => dispatch({ type: 'SET_COLORS', payload: { accent: color } })}
        />
        <ColorField
          label="Text"
          value={state.colors.text}
          onChange={(color) => dispatch({ type: 'SET_COLORS', payload: { text: color } })}
        />
        <ColorField
          label="Background"
          value={state.colors.background}
          onChange={(color) => dispatch({ type: 'SET_COLORS', payload: { background: color } })}
        />
      </div>
    </div>
  );
}
