'use client';

import { useCallback, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { UIElementFile } from '../types';

export default function UIElementUploader() {
  const [state, dispatch] = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      reader.onload = () => {
        const element: UIElementFile = {
          id: `ui-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          dataUrl: reader.result as string,
        };
        dispatch({ type: 'ADD_UI_ELEMENT', payload: element });
      };
      reader.readAsDataURL(file);
    }
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sidebar-fg)' }}>
        Floating Decorations <span className="font-normal" style={{ color: 'var(--muted)' }}>(Optional)</span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="rounded-md cursor-pointer transition-colors text-center py-4 px-3"
        style={{
          border: '2px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.02)',
          color: 'var(--muted)',
        }}
      >
        <p className="text-xs">Drop UI element PNGs</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {state.uiElements.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {state.uiElements.map((el) => (
            <div
              key={el.id}
              className="relative group rounded overflow-hidden"
              style={{ width: 40, height: 40 }}
            >
              <img
                src={el.dataUrl}
                alt={el.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => dispatch({ type: 'REMOVE_UI_ELEMENT', payload: el.id })}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
