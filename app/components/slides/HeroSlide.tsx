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

export default function HeroSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, appIcon, device, slideConfig, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc = resolveScreenshot(screenshots, slideConfig.screenshotId);
  const isDevice = device === 'ipad';
  const sc = STYLE_CONFIGS[stylePreset];

  return (
    <SlideWrapper {...props}>
      {/* Base background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${sc.bgGradientAngle}deg, ${theme.bg} 0%, ${theme.bg}ee 60%, ${theme.accent}${hexOpacity(sc.gradientIntensity)} 100%)`,
        }}
      />

      {/* Accent overlay — adds accent color bleed into the background */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 100%, ${theme.accent}${hexOpacity(sc.accentBgOpacity)} 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decorative blobs */}
      {sc.showDecorations && (
        <>
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.6 * sc.decorationScale}
            top="-10%"
            right="-20%"
            opacity={sc.decorationOpacity}
            blur={sc.blur}
          />
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.4 * sc.decorationScale}
            bottom="10%"
            left="-15%"
            opacity={sc.decorationOpacity * 0.7}
            blur={sc.blur}
          />
        </>
      )}

      {/* Extra blobs for richer styles (dark-moody, gradient-heavy) */}
      {sc.extraBlobs >= 1 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.35 * sc.decorationScale}
          bottom="25%"
          right="5%"
          opacity={sc.decorationOpacity * 0.6}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.5 * sc.decorationScale}
          top="30%"
          left="50%"
          opacity={sc.decorationOpacity * 0.4}
          blur={sc.blur * 1.2}
        />
      )}

      {/* App icon */}
      {appIcon && (
        <div
          style={{
            position: 'absolute',
            top: canvasH * 0.08,
            left: '50%',
            transform: 'translateX(-50%)',
            width: canvasW * 0.12,
            height: canvasW * 0.12,
            borderRadius: canvasW * 0.027,
            overflow: 'hidden',
            boxShadow: `0 8px 24px rgba(0,0,0,0.15)${sc.deviceGlow > 0 ? `, 0 0 ${Math.round(40 * sc.deviceGlow)}px ${theme.accent}${hexOpacity(sc.deviceGlow * 0.5)}` : ''}`,
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

      {/* Hero headline */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: appIcon ? canvasH * 0.2 : canvasH * 0.12,
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
          isHero
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Device glow behind mockup */}
      {sc.deviceGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '55%',
            height: '35%',
            background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow)} 0%, transparent 70%)`,
            filter: `blur(${Math.round(40 * sc.deviceGlow)}px)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Device mockup at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${isDevice ? '8%' : '13%'})`,
          width: isDevice ? '70%' : '84%',
          zIndex: 1,
          filter: sc.deviceShadow > 0 ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})` : undefined,
        }}
      >
        {isDevice ? (
          <IPad src={screenshotSrc} />
        ) : (
          <Phone src={screenshotSrc} />
        )}
      </div>
    </SlideWrapper>
  );
}
