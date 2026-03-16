'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';

export default function EcosystemSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc1 = screenshots[slideConfig.screenshotIndex]?.dataUrl || screenshots[0]?.dataUrl || null;
  const screenshotSrc2 = screenshots[(slideConfig.screenshotIndex + 1) % Math.max(screenshots.length, 1)]?.dataUrl || screenshots[0]?.dataUrl || null;
  const isIPad = device === 'ipad';
  const showDecorations = stylePreset !== 'flat';

  return (
    <SlideWrapper {...props}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(160deg, ${theme.bg} 0%, ${theme.accent}08 100%)`,
        }}
      />

      {showDecorations && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.7}
          bottom="-20%"
          left="10%"
          opacity={0.1}
          blur={120}
        />
      )}

      {/* Caption at top center */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: canvasH * 0.08,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          zIndex: 2,
        }}
      >
        <Caption
          categoryLabel={copy.categoryLabel}
          headline={copy.headline}
          canvasW={canvasW}
          color={theme.fg}
          accentColor={theme.accent}
          align="center"
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Two phones layered */}
      {/* Back phone */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-8%',
          width: isIPad ? '55%' : '65%',
          transform: 'translateY(15%) rotate(-4deg)',
          opacity: 0.55,
          zIndex: 1,
        }}
      >
        {isIPad ? (
          <IPad src={screenshotSrc2} />
        ) : (
          <Phone src={screenshotSrc2} />
        )}
      </div>

      {/* Front phone */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: '-4%',
          width: isIPad ? '60%' : '78%',
          transform: 'translateY(10%)',
          zIndex: 2,
        }}
      >
        {isIPad ? (
          <IPad src={screenshotSrc1} />
        ) : (
          <Phone src={screenshotSrc1} />
        )}
      </div>
    </SlideWrapper>
  );
}
