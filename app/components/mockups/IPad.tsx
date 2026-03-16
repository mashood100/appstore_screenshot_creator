'use client';

import { CSSProperties } from 'react';

interface IPadProps {
  src: string | null;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}

export default function IPad({ src, alt = 'App screenshot', style, className }: IPadProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio: '770 / 1000',
        borderRadius: '4%',
        background: 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)',
        padding: '3%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {/* Bezel highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '4%',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }}
      />
      {/* Camera dot */}
      <div
        style={{
          position: 'absolute',
          top: '1.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0.8%',
          height: '0.6%',
          borderRadius: '50%',
          background: '#1a1a2e',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
      {/* Screen area */}
      <div
        style={{
          width: '92%',
          height: '94.4%',
          margin: '3% auto 2.6%',
          borderRadius: '2%',
          overflow: 'hidden',
          background: '#000',
          aspectRatio: '3 / 4',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            No Screenshot
          </div>
        )}
      </div>
    </div>
  );
}
