'use client';

import { CSSProperties } from 'react';

interface GlowOrbProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  style?: CSSProperties;
}

export default function GlowOrb({
  color = '#8B5CF6',
  size = 200,
  top,
  left,
  right,
  bottom,
  opacity = 0.4,
  style,
}: GlowOrbProps) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, ${color}80 30%, transparent 70%)`,
        filter: `blur(${size * 0.3}px)`,
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
