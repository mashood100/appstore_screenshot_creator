'use client';

import { useCallback, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ScreenshotFile } from '../types';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScreenshotUploader() {
  const [state, dispatch] = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    const newScreenshots: ScreenshotFile[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await readFileAsDataUrl(file);
      newScreenshots.push({
        id: `screenshot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        dataUrl,
      });
    }
    for (const screenshot of newScreenshots) {
      dispatch({ type: 'ADD_SCREENSHOT', payload: screenshot });
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
        App Screenshots
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="rounded-md cursor-pointer transition-colors text-center py-6 px-3"
        style={{
          border: '2px dashed rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--muted)',
        }}
      >
        <p className="text-sm font-medium">Drop screenshots here</p>
        <p className="text-xs mt-1">or click to browse</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Thumbnails */}
      {state.screenshots.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {state.screenshots.map((screenshot, index) => (
            <div
              key={screenshot.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <img
                src={screenshot.dataUrl}
                alt={screenshot.name}
                className="rounded"
                style={{ width: 32, height: 56, objectFit: 'cover' }}
              />
              <span className="flex-1 text-xs truncate" style={{ color: 'var(--sidebar-fg)' }}>
                {index + 1}. {screenshot.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'REMOVE_SCREENSHOT', payload: screenshot.id });
                }}
                className="text-xs px-1.5 py-0.5 rounded transition-colors hover:bg-white/10"
                style={{ color: 'var(--muted)' }}
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
