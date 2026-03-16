'use client';

import { useDashboard } from '../context/DashboardContext';
import { AVAILABLE_FONTS } from '../constants';

export default function FontSelector() {
  const [state, dispatch] = useDashboard();

  const handleChange = (font: string) => {
    dispatch({ type: 'SET_FONT', payload: font });
    // Dynamically load the Google Font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    // Avoid duplicates
    const existing = document.querySelector(`link[href*="${font.replace(/ /g, '+')}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Font Family
      </label>
      <select
        value={state.fontFamily}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md text-sm outline-none cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--sidebar-fg)',
        }}
      >
        {AVAILABLE_FONTS.map((font) => (
          <option key={font} value={font} style={{ background: '#1f2937', color: '#e2e8f0' }}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
