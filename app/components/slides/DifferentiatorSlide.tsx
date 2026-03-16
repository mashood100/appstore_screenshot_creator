'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GlowOrb from '../decorative/GlowOrb';

export default function DifferentiatorSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, isRtl, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc = screenshots[slideConfig.screenshotIndex]?.dataUrl || screenshots[1]?.dataUrl || screenshots[0]?.dataUrl || null;
  const isIPad = device === 'ipad';
  const showDecorations = stylePreset !== 'flat';

  return (
    <SlideWrapper {...props}>
      {/* Subtle gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg}dd 70%, ${theme.accent}10 100%)`,
        }}
      />

      {showDecorations && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.5}
          top="30%"
          right={isRtl ? undefined : '-15%'}
          left={isRtl ? '-15%' : undefined}
          opacity={0.12}
        />
      )}

      {/* Caption at top */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: canvasH * 0.1,
          left: isRtl ? undefined : canvasW * 0.08,
          right: isRtl ? canvasW * 0.08 : undefined,
          width: '55%',
          zIndex: 2,
        }}
      >
        <Caption
          categoryLabel={copy.categoryLabel}
          headline={copy.headline}
          canvasW={canvasW}
          color={theme.fg}
          accentColor={theme.accent}
          align={isRtl ? 'right' : 'left'}
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Phone offset to the right (or left for RTL) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: isRtl ? undefined : '-4%',
          left: isRtl ? '-4%' : undefined,
          width: isIPad ? '65%' : '78%',
          transform: `translateY(10%) rotate(${isRtl ? '-2' : '2'}deg)`,
          zIndex: 1,
        }}
      >
        {isIPad ? (
          <IPad src={screenshotSrc} />
        ) : (
          <Phone src={screenshotSrc} />
        )}
      </div>
    </SlideWrapper>
  );
}
