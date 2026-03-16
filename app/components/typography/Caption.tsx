'use client';

import React from 'react';
import { categoryLabelSize, headlineSize } from '../constants';

interface CaptionProps {
  categoryLabel: string;
  headline: string;
  canvasW: number;
  color?: string;
  accentColor?: string;
  align?: 'left' | 'center' | 'right';
  isHero?: boolean;
  onTextChange?: (field: 'headline' | 'categoryLabel', value: string) => void;
  isEditable?: boolean;
}

export default function Caption({
  categoryLabel,
  headline,
  canvasW,
  color = '#171717',
  accentColor = '#5B7CFA',
  align = 'left',
  isHero = false,
  onTextChange,
  isEditable = false,
}: CaptionProps) {
  const labelFontSize = categoryLabelSize(canvasW);
  const headlineFontSize = isHero ? canvasW * 0.1 : headlineSize(canvasW);

  const handleBlur = (field: 'headline' | 'categoryLabel') => (e: React.FocusEvent<HTMLDivElement>) => {
    if (onTextChange) {
      onTextChange(field, e.currentTarget.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    if (isEditable) e.stopPropagation();
  };

  return (
    <div style={{ textAlign: align }}>
      {(categoryLabel || isEditable) && (
        <div
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={handleBlur('categoryLabel')}
          onKeyDown={handleKeyDown}
          onClick={stopPropagation}
          data-placeholder="Add label..."
          style={{
            fontSize: labelFontSize,
            fontWeight: 600,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: canvasW * 0.015,
            outline: 'none',
            cursor: isEditable ? 'text' : 'default',
            minHeight: isEditable ? labelFontSize * 1.2 : undefined,
          }}
        >
          {categoryLabel}
        </div>
      )}
      <div
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={handleBlur('headline')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        onClick={stopPropagation}
        data-placeholder="Add headline..."
        style={{
          fontSize: headlineFontSize,
          fontWeight: 700,
          color,
          lineHeight: isHero ? 0.92 : 1.0,
          whiteSpace: 'pre-line',
          outline: 'none',
          cursor: isEditable ? 'text' : 'default',
          minHeight: isEditable ? headlineFontSize * 1.2 : undefined,
        }}
      >
        {headline}
      </div>
    </div>
  );
}
