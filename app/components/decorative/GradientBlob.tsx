'use client';

import { CSSProperties } from 'react';

interface GradientBlobProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  blur?: number;
  opacity?: number;
  style?: CSSProperties;
}

export default function GradientBlob({
  color = '#5B7CFA',
  size = 400,
  top,
  left,
  right,
  bottom,
  blur = 80,
  opacity = 0.3,
  style,
}: GradientBlobProps) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        top,
        left,
        right,
        bottom,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
