'use client';

import { useDashboard } from '../context/DashboardContext';

export default function AppDescriptionInput() {
  const [state, dispatch] = useDashboard();

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        App Description <span style={{ color: 'var(--error)' }}>*</span>
      </label>
      <textarea
        value={state.appDescription}
        onChange={(e) => dispatch({ type: 'SET_APP_DESCRIPTION', payload: e.target.value })}
        placeholder="Describe your app — what it does, who it's for, its key value proposition..."
        rows={4}
        className="w-full px-3 py-2 rounded-md text-sm outline-none resize-none transition-colors"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--sidebar-fg)',
        }}
      />
      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
        Required for Claude to generate creative direction
      </p>
    </div>
  );
}
