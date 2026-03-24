'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface ScreenshotPreviewProps {
  canvasW: number;
  canvasH: number;
  index: number;
  slideLabel: string;
  isSelected: boolean;
  onSelect: () => void;
  onExport: () => void;
  onRemove: () => void;
  children: ReactNode;
  className?: string;
}

export default function ScreenshotPreview({
  canvasW,
  canvasH,
  index,
  slideLabel,
  isSelected,
  onSelect,
  onExport,
  onRemove,
  children,
  className,
}: ScreenshotPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        setScale(containerWidth / canvasW);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasW]);

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${className || ''}`}
      style={{
        border: isSelected ? '2px solid var(--accent)' : '2px solid var(--card-border)',
        background: 'var(--card-bg)',
        boxShadow: isSelected
          ? '0 0 0 2px rgba(59,130,246,0.3)'
          : isHovered
          ? '0 4px 12px rgba(0,0,0,0.1)'
          : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Remove button — top right corner */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10"
          style={{
            background: 'rgba(239,68,68,0.9)',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
          title="Remove slide"
        >
          ×
        </button>
      )}

      {/* Scaled preview */}
      <div
        style={{
          width: '100%',
          height: canvasH * scale,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: canvasW,
            height: canvasH,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>

      {/* Slide label overlay */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--card-border)',
        }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          {String(index + 1).padStart(2, '0')} — {slideLabel}
        </span>
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="text-xs font-medium px-2 py-1 rounded transition-colors"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            Export
          </button>
        )}
      </div>
    </div>
  );
}
