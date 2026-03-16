'use client';

import { CSSProperties } from 'react';
import { SC_L, SC_T, SC_W, SC_H, SC_RX, SC_RY } from '../constants';

interface PhoneProps {
  src: string | null;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}

export default function Phone({ src, alt = 'App screenshot', style, className }: PhoneProps) {
  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {/* Phone frame */}
      <img
        src="/mockup.png"
        alt="iPhone frame"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        draggable={false}
      />
      {/* Screen content */}
      <div
        style={{
          position: 'absolute',
          left: `${SC_L}%`,
          top: `${SC_T}%`,
          width: `${SC_W}%`,
          height: `${SC_H}%`,
          borderRadius: `${SC_RX}% / ${SC_RY}%`,
          overflow: 'hidden',
          background: '#000',
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
