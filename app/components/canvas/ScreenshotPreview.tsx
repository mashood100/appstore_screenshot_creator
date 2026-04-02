'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { ScreenshotFile } from '../types';
import ScreenshotAssigner from './ScreenshotAssigner';

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
  slideId: string;
  screenshotId: string | null;
  screenshots: ScreenshotFile[];
  onAssignScreenshot: (slideId: string, screenshotId: string | null, secondary?: boolean) => void;
  hasSecondaryScreenshot?: boolean;
  secondaryScreenshotId?: string | null;
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
  slideId,
  screenshotId,
  screenshots,
  onAssignScreenshot,
  hasSecondaryScreenshot,
  secondaryScreenshotId,
}: ScreenshotPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAssigner, setShowAssigner] = useState<false | 'primary' | 'secondary'>(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/screenshot-id')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedId = e.dataTransfer.getData('application/screenshot-id');
    if (droppedId) {
      onAssignScreenshot(slideId, droppedId);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-lg transition-all ${className || ''}`}
      style={{
        border: isDragOver
          ? '2px solid var(--accent)'
          : isSelected
          ? '2px solid var(--accent)'
          : '2px solid var(--card-border)',
        background: isDragOver ? 'rgba(59,130,246,0.05)' : 'var(--card-bg)',
        boxShadow: isDragOver
          ? '0 0 0 3px rgba(59,130,246,0.2)'
          : isSelected
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
        className="rounded-t-lg"
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

      {/* Slide label + controls */}
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--card-border)',
          borderRadius: '0 0 8px 8px',
          position: 'relative',
        }}
      >
        <span className="text-xs font-medium flex-1 truncate" style={{ color: 'var(--muted)' }}>
          {String(index + 1).padStart(2, '0')} — {slideLabel}
        </span>

        {/* Screenshot assign button(s) */}
        {hasSecondaryScreenshot ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAssigner(showAssigner === 'primary' ? false : 'primary');
              }}
              className="text-xs px-2 py-0.5 rounded transition-colors hover:bg-white/10 font-medium"
              style={{
                background: screenshotId ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)',
                color: screenshotId ? 'var(--accent)' : 'var(--muted)',
                border: showAssigner === 'primary' ? '1px solid var(--accent)' : '1px solid transparent',
              }}
              title="Assign front screenshot"
            >
              {screenshotId ? 'Front ✓' : 'Front'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAssigner(showAssigner === 'secondary' ? false : 'secondary');
              }}
              className="text-xs px-2 py-0.5 rounded transition-colors hover:bg-white/10 font-medium"
              style={{
                background: secondaryScreenshotId ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)',
                color: secondaryScreenshotId ? 'var(--accent)' : 'var(--muted)',
                border: showAssigner === 'secondary' ? '1px solid var(--accent)' : '1px solid transparent',
              }}
              title="Assign back screenshot"
            >
              {secondaryScreenshotId ? 'Back ✓' : 'Back'}
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAssigner(showAssigner === 'primary' ? false : 'primary');
            }}
            className="text-[10px] px-1.5 py-0.5 rounded transition-colors hover:bg-white/10"
            style={{
              background: screenshotId ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)',
              color: screenshotId ? 'var(--accent)' : 'var(--muted)',
            }}
            title="Assign screenshot"
          >
            {screenshotId ? 'Change' : 'Assign'}
          </button>
        )}

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

        {/* Assigner popover */}
        {showAssigner === 'primary' && (
          <ScreenshotAssigner
            screenshots={screenshots}
            currentScreenshotId={screenshotId}
            onAssign={(id) => onAssignScreenshot(slideId, id, false)}
            onClose={() => setShowAssigner(false)}
          />
        )}
        {showAssigner === 'secondary' && (
          <ScreenshotAssigner
            screenshots={screenshots}
            currentScreenshotId={secondaryScreenshotId ?? null}
            onAssign={(id) => onAssignScreenshot(slideId, id, true)}
            onClose={() => setShowAssigner(false)}
          />
        )}
      </div>
    </div>
  );
}
