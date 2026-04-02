'use client';

import { SlideProps, resolveScreenshot } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';
import GlowOrb from '../decorative/GlowOrb';
import { STYLE_CONFIGS, hexOpacity, getDeviceShadow } from '../constants';

export default function EcosystemSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc1 = resolveScreenshot(screenshots, slideConfig.screenshotId);
  const screenshotSrc2 = resolveScreenshot(screenshots, slideConfig.secondaryScreenshotId);
  const isIPad = device === 'ipad';
  const sc = STYLE_CONFIGS[stylePreset];

  return (
    <SlideWrapper {...props}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${sc.bgGradientAngle}deg, ${theme.bg} 0%, ${theme.accent}${hexOpacity(sc.gradientIntensity)} 100%)`,
        }}
      />

      {/* Accent overlay — bottom center where devices overlap */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 55% 85%, ${theme.accent}${hexOpacity(sc.accentBgOpacity)} 0%, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decoration */}
      {sc.showDecorations && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.7 * sc.decorationScale}
          bottom="-20%"
          left="10%"
          opacity={sc.decorationOpacity}
          blur={sc.blur}
        />
      )}

      {/* Extra blobs */}
      {sc.extraBlobs >= 1 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.35 * sc.decorationScale}
          top="15%"
          right="-5%"
          opacity={sc.decorationOpacity * 0.5}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.45 * sc.decorationScale}
          top="40%"
          left="-10%"
          opacity={sc.decorationOpacity * 0.4}
          blur={sc.blur * 1.1}
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
          zIndex: 3,
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

      {/* Device glow behind both phones */}
      {sc.deviceGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '45%',
            transform: 'translateX(-50%)',
            width: '65%',
            height: '35%',
            background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow * 0.8)} 0%, transparent 70%)`,
            filter: `blur(${Math.round(40 * sc.deviceGlow)}px)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

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
          filter: sc.deviceShadow > 0 ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})` : undefined,
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
          filter: sc.deviceShadow > 0 ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})` : undefined,
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
