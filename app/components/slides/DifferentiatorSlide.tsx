'use client';

import { SlideProps, resolveScreenshot } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GlowOrb from '../decorative/GlowOrb';
import GradientBlob from '../decorative/GradientBlob';
import { STYLE_CONFIGS, hexOpacity, getDeviceShadow } from '../constants';

export default function DifferentiatorSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, isRtl, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc = resolveScreenshot(screenshots, slideConfig.screenshotId);
  const isIPad = device === 'ipad';
  const sc = STYLE_CONFIGS[stylePreset];

  // Glow position follows device side
  const deviceSide = isRtl ? 'left' : 'right';

  return (
    <SlideWrapper {...props}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${sc.bgGradientAngle}deg, ${theme.bg} 0%, ${theme.bg}dd 70%, ${theme.accent}${hexOpacity(sc.gradientIntensity)} 100%)`,
        }}
      />

      {/* Accent overlay — radiates from device side */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at ${isRtl ? '20%' : '80%'} 70%, ${theme.accent}${hexOpacity(sc.accentBgOpacity)} 0%, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decoration */}
      {sc.showDecorations && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.5 * sc.decorationScale}
          top="30%"
          right={isRtl ? undefined : '-15%'}
          left={isRtl ? '-15%' : undefined}
          opacity={sc.decorationOpacity}
        />
      )}

      {/* Extra blobs */}
      {sc.extraBlobs >= 1 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.4 * sc.decorationScale}
          top="5%"
          left={isRtl ? undefined : '10%'}
          right={isRtl ? '10%' : undefined}
          opacity={sc.decorationOpacity * 0.5}
          blur={sc.blur * 1.2}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.3 * sc.decorationScale}
          bottom="40%"
          left="50%"
          opacity={sc.decorationOpacity * 0.35}
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

      {/* Device glow */}
      {sc.deviceGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            [deviceSide]: '-5%',
            width: '50%',
            height: '35%',
            background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow)} 0%, transparent 70%)`,
            filter: `blur(${Math.round(35 * sc.deviceGlow)}px)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

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
          filter: sc.deviceShadow > 0 ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})` : undefined,
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
