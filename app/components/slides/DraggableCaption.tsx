'use client';

import React, { useRef, useState, useCallback, CSSProperties, ReactNode } from 'react';
import { TextPosition } from '../types';

const DRAG_THRESHOLD = 4; // pixels of movement before drag starts

interface DraggableCaptionProps {
  canvasW: number;
  canvasH: number;
  textPosition?: TextPosition;
  onPositionChange?: (position: TextPosition) => void;
  isEditable?: boolean;
  defaultStyle: CSSProperties;
  children: ReactNode;
}

export default function DraggableCaption({
  canvasW,
  canvasH,
  textPosition,
  onPositionChange,
  isEditable = false,
  defaultStyle,
  children,
}: DraggableCaptionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const getScale = useCallback(() => {
    const el = ref.current?.closest('[data-slide-canvas]');
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    return rect.width / canvasW;
  }, [canvasW]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isEditable || !onPositionChange) return;
    if (e.button !== 0) return;

    const scale = getScale();
    const startX = e.clientX;
    const startY = e.clientY;
    let isDragging = false;

    // Current position in canvas space (percentage)
    const startPos = textPosition || {
      x: ((ref.current!.offsetLeft + ref.current!.offsetWidth / 2) / canvasW) * 100,
      y: (ref.current!.offsetTop / canvasH) * 100,
    };

    const onMove = (me: PointerEvent) => {
      const totalDx = me.clientX - startX;
      const totalDy = me.clientY - startY;

      if (!isDragging) {
        // Check if we've moved past the threshold
        if (Math.abs(totalDx) < DRAG_THRESHOLD && Math.abs(totalDy) < DRAG_THRESHOLD) return;
        // Start dragging — prevent text selection and blur any focused editable
        isDragging = true;
        setDragging(true);
        const active = document.activeElement as HTMLElement;
        if (active?.getAttribute('contenteditable') === 'true') {
          active.blur();
        }
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
      }

      const dx = totalDx / scale;
      const dy = totalDy / scale;
      const newX = Math.max(0, Math.min(100, startPos.x + (dx / canvasW) * 100));
      const newY = Math.max(0, Math.min(100, startPos.y + (dy / canvasH) * 100));
      setDragPos({ x: newX, y: newY });
    };

    const onUp = (ue: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';

      if (isDragging) {
        setDragging(false);
        const dx = (ue.clientX - startX) / scale;
        const dy = (ue.clientY - startY) / scale;
        const finalX = Math.max(0, Math.min(100, startPos.x + (dx / canvasW) * 100));
        const finalY = Math.max(0, Math.min(100, startPos.y + (dy / canvasH) * 100));
        setDragPos(null);
        onPositionChange({ x: finalX, y: finalY });
      }
      // If not dragging, it was a click — let the browser handle contentEditable focus naturally
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [isEditable, onPositionChange, textPosition, canvasW, canvasH, getScale]);

  // If we have a custom position (from state or drag), use it
  const activePos = dragPos || textPosition;

  const style: CSSProperties = activePos
    ? {
        position: 'absolute',
        left: `${activePos.x}%`,
        top: `${activePos.y}%`,
        transform: 'translateX(-50%)',
        width: defaultStyle.width || '80%',
        zIndex: 2,
        cursor: isEditable && onPositionChange ? (dragging ? 'grabbing' : 'grab') : 'default',
      }
    : {
        ...defaultStyle,
        cursor: isEditable && onPositionChange ? (dragging ? 'grabbing' : 'grab') : 'default',
      };

  return (
    <div
      ref={ref}
      style={style}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
}
