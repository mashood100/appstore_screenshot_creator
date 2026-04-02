'use client';

import { useEffect, useRef } from 'react';
import { ScreenshotFile } from '../types';

interface ScreenshotAssignerProps {
  screenshots: ScreenshotFile[];
  currentScreenshotId: string | null;
  onAssign: (screenshotId: string | null) => void;
  onClose: () => void;
}

export default function ScreenshotAssigner({
  screenshots,
  currentScreenshotId,
  onAssign,
  onClose,
}: ScreenshotAssignerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    // Delay activation so the click that opened this popover doesn't immediately close it
    const raf = requestAnimationFrame(() => {
      readyRef.current = true;
    });

    function handleClickOutside(e: MouseEvent) {
      if (!readyRef.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      cancelAnimationFrame(raf);
      readyRef.current = false;
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 rounded-lg shadow-xl p-2"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        minWidth: 200,
        maxWidth: 280,
        bottom: '100%',
        left: 0,
        marginBottom: 8,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-[10px] font-medium px-1 mb-1.5" style={{ color: 'var(--muted)' }}>
        Assign screenshot
      </p>

      {/* "None" option */}
      <button
        onClick={() => { onAssign(null); onClose(); }}
        className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors hover:bg-white/10"
        style={{
          color: 'var(--muted)',
          background: !currentScreenshotId ? 'rgba(59,130,246,0.15)' : undefined,
        }}
      >
        No screenshot
      </button>

      {/* Screenshot thumbnails */}
      {screenshots.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          {screenshots.map((ss) => (
            <button
              key={ss.id}
              onClick={() => { onAssign(ss.id); onClose(); }}
              className="rounded overflow-hidden transition-all"
              style={{
                outline: ss.id === currentScreenshotId ? '2px solid var(--accent)' : '2px solid transparent',
                outlineOffset: -2,
              }}
              title={ss.name}
            >
              <img
                src={ss.dataUrl}
                alt={ss.name}
                style={{ width: '100%', height: 52, objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {screenshots.length === 0 && (
        <p className="text-[10px] px-1 py-2 text-center" style={{ color: 'var(--muted)' }}>
          Upload screenshots first
        </p>
      )}
    </div>
  );
}
