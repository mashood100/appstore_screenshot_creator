'use client';

import { categoryLabelSize, headlineSize } from '../constants';

interface CaptionProps {
  categoryLabel: string;
  headline: string;
  canvasW: number;
  color?: string;
  accentColor?: string;
  align?: 'left' | 'center' | 'right';
  isHero?: boolean;
}

export default function Caption({
  categoryLabel,
  headline,
  canvasW,
  color = '#171717',
  accentColor = '#5B7CFA',
  align = 'left',
  isHero = false,
}: CaptionProps) {
  const labelFontSize = categoryLabelSize(canvasW);
  const headlineFontSize = isHero ? canvasW * 0.1 : headlineSize(canvasW);

  return (
    <div style={{ textAlign: align }}>
      {categoryLabel && (
        <div
          style={{
            fontSize: labelFontSize,
            fontWeight: 600,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: canvasW * 0.015,
          }}
        >
          {categoryLabel}
        </div>
      )}
      <div
        style={{
          fontSize: headlineFontSize,
          fontWeight: 700,
          color,
          lineHeight: isHero ? 0.92 : 1.0,
          whiteSpace: 'pre-line',
        }}
        dangerouslySetInnerHTML={{ __html: headline.replace(/\n/g, '<br />') }}
      />
    </div>
  );
}
