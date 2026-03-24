'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';
import GlowOrb from '../decorative/GlowOrb';
import { STYLE_CONFIGS, hexOpacity } from '../constants';

export default function TrustSignalSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, appIcon, stylePreset, onTextChange, isEditable, onPositionChange, slideConfig } = props;
  const sc = STYLE_CONFIGS[stylePreset];

  // Contrast slide — inverted colors
  const bgGradient = `linear-gradient(${sc.bgGradientAngle}deg, ${theme.fg} 0%, ${theme.fg}f5 100%)`;

  return (
    <SlideWrapper {...props} backgroundOverride={bgGradient}>
      {/* Accent ambient overlay */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${theme.accent}${hexOpacity(sc.accentBgOpacity * 0.8)} 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decorations */}
      {sc.showDecorations && (
        <>
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.8 * sc.decorationScale}
            top="10%"
            left="10%"
            opacity={sc.decorationOpacity}
            blur={sc.blur}
          />
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.5 * sc.decorationScale}
            bottom="20%"
            right="5%"
            opacity={sc.decorationOpacity * 0.7}
            blur={sc.blur}
          />
        </>
      )}

      {/* Extra blobs for rich styles */}
      {sc.extraBlobs >= 1 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.4 * sc.decorationScale}
          top="50%"
          right="20%"
          opacity={sc.decorationOpacity * 0.5}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.6 * sc.decorationScale}
          bottom="5%"
          left="30%"
          opacity={sc.decorationOpacity * 0.35}
          blur={sc.blur * 1.3}
        />
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
            boxShadow: sc.deviceGlow > 0 ? `0 0 ${Math.round(30 * sc.deviceGlow)}px ${theme.accent}${hexOpacity(sc.deviceGlow * 0.4)}` : undefined,
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
