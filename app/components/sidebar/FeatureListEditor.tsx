'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Feature } from '../types';

export default function FeatureListEditor() {
  const [state, dispatch] = useDashboard();
  const [newFeature, setNewFeature] = useState('');

  const handleAdd = () => {
    if (!newFeature.trim()) return;
    const feature: Feature = {
      id: `feat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: newFeature.trim(),
      description: '',
    };
    dispatch({ type: 'ADD_FEATURE', payload: feature });
    setNewFeature('');
  };

  const handleUpdate = (id: string, title: string) => {
    const updated = state.features.map(f =>
      f.id === id ? { ...f, title } : f
    );
    dispatch({ type: 'SET_FEATURES', payload: updated });
  };

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Features ({state.features.length})
      </label>

      {/* Feature list */}
      <div className="space-y-1 mb-2">
        {state.features.map((feature, index) => (
          <div
            key={feature.id}
            className="flex items-center gap-1.5"
          >
            <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: 'var(--muted)' }}>
              {index + 1}
            </span>
            <input
              type="text"
              value={feature.title}
              onChange={(e) => handleUpdate(feature.id, e.target.value)}
              className="flex-1 px-2 py-1.5 rounded text-xs outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--sidebar-fg)',
              }}
            />
            <button
              onClick={() => dispatch({ type: 'REMOVE_FEATURE', payload: feature.id })}
              className="text-xs px-1 transition-colors hover:bg-white/10 rounded"
              style={{ color: 'var(--muted)' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add feature..."
          className="flex-1 px-2 py-1.5 rounded text-xs outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--sidebar-fg)',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!newFeature.trim()}
          className="text-xs px-2 py-1.5 rounded font-medium transition-colors"
          style={{
            background: newFeature.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: newFeature.trim() ? '#fff' : 'var(--muted)',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
