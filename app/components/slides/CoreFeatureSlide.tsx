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

export default function CoreFeatureSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, isRtl, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc = resolveScreenshot(screenshots, slideConfig.screenshotId);
  const isIPad = device === 'ipad';
  const sc = STYLE_CONFIGS[stylePreset];

  const layout = slideConfig.layout || 'centered';

  const isCentered = layout === 'centered';
  const isOffsetRight = layout === 'offset-right';
  const isOffsetLeft = layout === 'offset-left';

  // Alternate background for visual rhythm
  const slideIndex = parseInt(slideConfig.id.replace('slide-', ''), 10) || 0;
  const isContrastSlide = slideIndex % 3 === 0;
  const bgColor = isContrastSlide
    ? `linear-gradient(${sc.bgGradientAngle}deg, ${theme.fg}f0 0%, ${theme.fg}e0 100%)`
    : `linear-gradient(${sc.bgGradientAngle}deg, ${theme.bg} 0%, ${theme.bg}ee 100%)`;
  const textColor = isContrastSlide ? theme.bg : theme.fg;

  // Glow position follows the device position
  const glowLeft = isCentered ? '50%' : isOffsetRight ? '70%' : '30%';

  return (
    <SlideWrapper {...props} backgroundOverride={bgColor}>
      {/* Accent overlay */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at ${glowLeft} 80%, ${theme.accent}${hexOpacity(sc.accentBgOpacity)} 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decoration */}
      {sc.showDecorations && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.4 * sc.decorationScale}
          top="20%"
          left={isCentered ? '30%' : isOffsetRight ? '5%' : '55%'}
          opacity={sc.decorationOpacity}
        />
      )}

      {/* Extra blobs */}
      {sc.extraBlobs >= 1 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.35 * sc.decorationScale}
          bottom="15%"
          right={isCentered ? '10%' : isOffsetRight ? '30%' : '-5%'}
          opacity={sc.decorationOpacity * 0.5}
          blur={sc.blur}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.25 * sc.decorationScale}
          top="5%"
          right="15%"
          opacity={sc.decorationOpacity * 0.4}
        />
      )}

      {/* Caption */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: canvasH * 0.08,
          left: isCentered ? '50%' : isOffsetLeft || isRtl ? undefined : canvasW * 0.08,
          right: isOffsetLeft || isRtl ? canvasW * 0.08 : undefined,
          transform: isCentered ? 'translateX(-50%)' : undefined,
          width: isCentered ? '80%' : '55%',
          zIndex: 2,
        }}
      >
        <Caption
          categoryLabel={copy.categoryLabel}
          headline={copy.headline}
          canvasW={canvasW}
          color={textColor}
          accentColor={theme.accent}
          align={isCentered ? 'center' : (isOffsetLeft || isRtl) ? 'right' : 'left'}
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Device glow */}
      {sc.deviceGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: glowLeft,
            transform: 'translateX(-50%)',
            width: '50%',
            height: '30%',
            background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow)} 0%, transparent 70%)`,
            filter: `blur(${Math.round(35 * sc.deviceGlow)}px)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          ...(isCentered
            ? { left: '50%', transform: `translateX(-50%) translateY(13%)` }
            : isOffsetRight
            ? { right: '-4%', transform: 'translateY(10%) rotate(2deg)' }
            : { left: '-4%', transform: 'translateY(10%) rotate(-2deg)' }),
          width: isIPad
            ? isCentered ? '65%' : '60%'
            : isCentered ? '84%' : '75%',
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
