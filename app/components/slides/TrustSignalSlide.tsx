'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';

export default function TrustSignalSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, appIcon, stylePreset, onTextChange, isEditable, onPositionChange, slideConfig } = props;
  const showDecorations = stylePreset !== 'flat';

  // Contrast slide — inverted colors
  const bgGradient = `linear-gradient(180deg, ${theme.fg} 0%, ${theme.fg}f5 100%)`;

  return (
    <SlideWrapper {...props} backgroundOverride={bgGradient}>
      {showDecorations && (
        <>
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.8}
            top="10%"
            left="10%"
            opacity={0.08}
            blur={120}
          />
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.5}
            bottom="20%"
            right="5%"
            opacity={0.06}
            blur={100}
          />
        </>
      )}

      {/* Large centered headline */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          zIndex: 2,
        }}
      >
        <Caption
          categoryLabel={copy.categoryLabel}
          headline={copy.headline}
          canvasW={canvasW}
          color={theme.bg}
          accentColor={theme.accent}
          align="center"
          isHero
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Small app icon at bottom */}
      {appIcon && (
        <div
          style={{
            position: 'absolute',
            bottom: canvasH * 0.1,
            left: '50%',
            transform: 'translateX(-50%)',
            width: canvasW * 0.08,
            height: canvasW * 0.08,
            borderRadius: canvasW * 0.018,
            overflow: 'hidden',
            opacity: 0.8,
            zIndex: 2,
          }}
        >
          <img
            src={appIcon}
            alt="App icon"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
    </SlideWrapper>
  );
}
