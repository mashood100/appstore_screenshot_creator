'use client';

import { useDashboard } from '../context/DashboardContext';

export default function SlideCountSelector() {
  const [state, dispatch] = useDashboard();

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Number of Slides
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'SET_SLIDE_COUNT', payload: state.slideCount - 1 })}
          disabled={state.slideCount <= 1}
          className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: state.slideCount <= 1 ? 'var(--muted)' : 'var(--sidebar-fg)',
            cursor: state.slideCount <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          -
        </button>
        <span className="text-lg font-semibold w-8 text-center" style={{ color: 'var(--sidebar-fg)' }}>
          {state.slideCount}
        </span>
        <button
          onClick={() => dispatch({ type: 'SET_SLIDE_COUNT', payload: state.slideCount + 1 })}
          disabled={state.slideCount >= 10}
          className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: state.slideCount >= 10 ? 'var(--muted)' : 'var(--sidebar-fg)',
            cursor: state.slideCount >= 10 ? 'not-allowed' : 'pointer',
          }}
        >
          +
        </button>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          (max 10)
        </span>
      </div>
    </div>
  );
}
