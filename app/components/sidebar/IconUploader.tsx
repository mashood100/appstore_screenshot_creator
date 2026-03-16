'use client';

import { useCallback, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function IconUploader() {
  const [state, dispatch] = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'SET_APP_ICON', payload: reader.result as string });
    };
    reader.readAsDataURL(file);
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        App Icon
      </label>

      <div className="flex items-center gap-3">
        {/* Icon preview */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            background: state.appIcon ? undefined : 'rgba(255,255,255,0.06)',
            border: state.appIcon ? 'none' : '2px dashed rgba(255,255,255,0.15)',
          }}
        >
          {state.appIcon ? (
            <img
              src={state.appIcon}
              alt="App icon"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>+</span>
          )}
        </div>

        <div className="flex-1">
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--sidebar-fg)',
            }}
          >
            {state.appIcon ? 'Change' : 'Upload'}
          </button>
          {state.appIcon && (
            <button
              onClick={() => dispatch({ type: 'SET_APP_ICON', payload: null })}
              className="text-xs ml-2 transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
