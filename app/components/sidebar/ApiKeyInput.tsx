'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function ApiKeyInput() {
  const [state, dispatch] = useDashboard();
  const [inputValue, setInputValue] = useState(state.apiKey);
  const [saved, setSaved] = useState(!!state.apiKey);

  const handleSave = () => {
    dispatch({ type: 'SET_API_KEY', payload: inputValue });
    localStorage.setItem('claude-api-key', inputValue);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Claude API Key
      </label>
      <div className="flex gap-2">
        <input
          type="password"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSaved(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="sk-ant-..."
          className="flex-1 px-3 py-2 rounded-md text-sm outline-none transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--sidebar-fg)',
          }}
        />
        <button
          onClick={handleSave}
          disabled={!inputValue}
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            background: saved ? 'var(--success)' : 'var(--accent)',
            color: '#fff',
            opacity: inputValue ? 1 : 0.5,
          }}
        >
          {saved ? '✓' : 'Save'}
        </button>
      </div>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
        Stored locally in your browser only
      </p>
    </div>
  );
}
