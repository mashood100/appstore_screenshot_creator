'use client';

import { CSSProperties, ReactNode } from 'react';
import { ThemeTokens } from '../types';

interface SlideWrapperProps {
  canvasW: number;
  canvasH: number;
  theme: ThemeTokens;
  isRtl?: boolean;
  fontFamily?: string;
  backgroundOverride?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export default function SlideWrapper({
  canvasW,
  canvasH,
  theme,
  isRtl = false,
  fontFamily = 'Inter, system-ui, sans-serif',
  backgroundOverride,
  children,
  style,
}: SlideWrapperProps) {
  return (
    <div
      data-slide-canvas
      style={{
        width: canvasW,
        height: canvasH,
        position: 'relative',
        overflow: 'hidden',
        background: backgroundOverride || theme.bg,
        color: theme.fg,
        fontFamily,
        direction: isRtl ? 'rtl' : 'ltr',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
