'use client';

import { useDashboard } from '../context/DashboardContext';

export default function GenerateButton() {
  const [state, dispatch] = useDashboard();

  const isDisabled = !state.apiKey || !state.appDescription || state.generating;

  const handleGenerate = async () => {
    if (isDisabled) return;

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: state.apiKey,
          appDescription: state.appDescription,
          partialConfig: {
            colors: state.themeId !== 'clean-light' ? state.colors : undefined,
            features: state.features.length > 0 ? state.features.map(f => f.title) : undefined,
            font: state.fontFamily !== 'Inter' ? state.fontFamily : undefined,
            style: state.stylePreset !== 'clean-minimal' ? state.stylePreset : undefined,
            slideCount: state.slideCount,
            locales: state.locales,
            screenshotCount: state.screenshots.length,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const config = await response.json();
      dispatch({ type: 'SET_GENERATED_CONFIG', payload: config });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Generation failed' });
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={isDisabled}
        className="w-full py-2.5 rounded-md text-sm font-semibold transition-all"
        style={{
          background: isDisabled
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          color: isDisabled ? 'var(--muted)' : '#fff',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: isDisabled ? 'none' : '0 2px 8px rgba(59,130,246,0.3)',
        }}
      >
        {state.generating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          'Generate with Claude'
        )}
      </button>

      {!state.apiKey && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--warning)' }}>
          Add your API key above to enable generation
        </p>
      )}
      {state.apiKey && !state.appDescription && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--warning)' }}>
          Describe your app to enable generation
        </p>
      )}

      {state.error && (
        <div
          className="mt-2 px-3 py-2 rounded-md text-xs"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}
        >
          {state.error}
        </div>
      )}
    </div>
  );
}
