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

export default function PanoramicSlide(props: SlideProps) {
  const {
    canvasW, canvasH, theme, copy, screenshots, appIcon, device,
    slideConfig, isRtl, stylePreset, onTextChange, isEditable, onPositionChange,
  } = props;

  const isLeft = slideConfig.pairPosition !== 'right';
  const isIPad = device === 'ipad';
  const sc = STYLE_CONFIGS[stylePreset];

  // Use theme colors so the slide follows the sidebar color picker
  const bg = theme.bg;
  const fg = theme.fg;

  // ─── Shared phone geometry (must match between left & right for alignment) ───
  const phoneW = isIPad ? 62 : 72;       // % of canvas width
  const phoneTop = 22;                    // % from top — same on both sides
  const phoneRotation = isRtl ? -12 : 12; // degrees
  const phoneOverhang = phoneW / 2;       // exactly half for even split between slides
  // Right slide: phone left = -(phoneW - phoneOverhang)
  const phoneContinuationLeft = -(phoneW - phoneOverhang);

  // Each side uses its own screenshot
  const screenshotSrc = resolveScreenshot(screenshots, slideConfig.screenshotId);

  if (isLeft) {
    return (
      <SlideWrapper {...props}>
        {/* Background gradient — flows rightward */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${bg} 0%, ${bg}ee 50%, ${theme.accent}${hexOpacity(sc.gradientIntensity * 1.5)} 100%)`,
          }}
        />

        {/* Subtle accent radial from bottom-right */}
        {sc.accentBgOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 85% 75%, ${theme.accent}${hexOpacity(sc.accentBgOpacity * 0.8)} 0%, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Decorative blobs */}
        {sc.showDecorations && (
          <>
            <GlowOrb
              color={theme.accent}
              size={canvasW * 0.5 * sc.decorationScale}
              top="20%"
              right="-10%"
              opacity={sc.decorationOpacity * 0.6}
            />
            <GradientBlob
              color={theme.accent}
              size={canvasW * 0.35 * sc.decorationScale}
              bottom="10%"
              left="5%"
              opacity={sc.decorationOpacity * 0.3}
              blur={sc.blur}
            />
          </>
        )}

        {/* App icon at top-left */}
        {appIcon && (
          <div
            style={{
              position: 'absolute',
              top: canvasH * 0.06,
              left: canvasW * 0.08,
              width: canvasW * 0.08,
              height: canvasW * 0.08,
              borderRadius: canvasW * 0.018,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              zIndex: 3,
            }}
          >
            <img src={appIcon} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Headline — top left area */}
        <DraggableCaption
          canvasW={canvasW}
          canvasH={canvasH}
          textPosition={slideConfig.textPosition}
          onPositionChange={onPositionChange}
          isEditable={isEditable}
          defaultStyle={{
            position: 'absolute',
            top: appIcon ? canvasH * 0.16 : canvasH * 0.1,
            left: canvasW * 0.08,
            width: '50%',
            zIndex: 3,
          }}
        >
          <Caption
            categoryLabel={copy.categoryLabel}
            headline={copy.headline}
            canvasW={canvasW}
            color={fg}
            accentColor={theme.accent}
            align={isRtl ? 'right' : 'left'}
            onTextChange={onTextChange}
            isEditable={isEditable}
          />
        </DraggableCaption>

        {/* Device glow behind phone */}
        {sc.deviceGlow > 0 && (
          <div
            style={{
              position: 'absolute',
              top: `${phoneTop + 10}%`,
              right: '0%',
              width: '55%',
              height: '45%',
              background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow * 0.7)} 0%, transparent 70%)`,
              filter: `blur(${Math.round(50 * sc.deviceGlow)}px)`,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Phone — tilted, extending past right edge */}
        <div
          style={{
            position: 'absolute',
            top: `${phoneTop}%`,
            right: `-${phoneOverhang}%`,
            width: `${phoneW}%`,
            transform: `rotate(${phoneRotation}deg)`,
            zIndex: 2,
            filter: sc.deviceShadow > 0
              ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})`
              : undefined,
          }}
        >
          {isIPad ? <IPad src={screenshotSrc} /> : <Phone src={screenshotSrc} />}
        </div>
      </SlideWrapper>
    );
  }

  // ─── RIGHT SLIDE ───────────────────────────────────────────

  const screenshotSrc2 = resolveScreenshot(screenshots, slideConfig.screenshotId);

  return (
    <SlideWrapper {...props}>
      {/* Background gradient — flows leftward (mirror of left) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(225deg, ${bg} 0%, ${bg}ee 50%, ${theme.accent}${hexOpacity(sc.gradientIntensity * 1.5)} 100%)`,
        }}
      />

      {/* Accent radial from top-left */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 15% 25%, ${theme.accent}${hexOpacity(sc.accentBgOpacity * 0.8)} 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Decorative blobs */}
      {sc.showDecorations && (
        <>
          <GlowOrb
            color={theme.accent}
            size={canvasW * 0.45 * sc.decorationScale}
            top="5%"
            left="-8%"
            opacity={sc.decorationOpacity * 0.5}
          />
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.35 * sc.decorationScale}
            bottom="20%"
            right="10%"
            opacity={sc.decorationOpacity * 0.3}
            blur={sc.blur}
          />
        </>
      )}

      {/* App icon / brand at top-right */}
      {appIcon && (
        <div
          style={{
            position: 'absolute',
            top: canvasH * 0.06,
            right: canvasW * 0.08,
            width: canvasW * 0.08,
            height: canvasW * 0.08,
            borderRadius: canvasW * 0.018,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 3,
          }}
        >
          <img src={appIcon} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Phone — continuation from left side, entering from left edge */}
      <div
        style={{
          position: 'absolute',
          top: `${phoneTop}%`,
          left: `${phoneContinuationLeft}%`,
          width: `${phoneW}%`,
          transform: `rotate(${phoneRotation}deg)`,
          zIndex: 1,
          filter: sc.deviceShadow > 0
            ? `drop-shadow(${getDeviceShadow(theme.accent, sc)})`
            : undefined,
        }}
      >
        {isIPad ? <IPad src={screenshotSrc2} /> : <Phone src={screenshotSrc2} />}
      </div>

      {/* Device glow behind continuation phone */}
      {sc.deviceGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            top: `${phoneTop + 5}%`,
            left: '0%',
            width: '45%',
            height: '40%',
            background: `radial-gradient(ellipse, ${theme.accent}${hexOpacity(sc.deviceGlow * 0.5)} 0%, transparent 70%)`,
            filter: `blur(${Math.round(40 * sc.deviceGlow)}px)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Headline — bottom right area */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          bottom: canvasH * 0.12,
          right: canvasW * 0.08,
          width: '55%',
          zIndex: 3,
        }}
      >
        <Caption
          categoryLabel={copy.categoryLabel}
          headline={copy.headline}
          canvasW={canvasW}
          color={fg}
          accentColor={theme.accent}
          align={isRtl ? 'left' : 'right'}
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Second app icon at bottom-left */}
      {appIcon && (
        <div
          style={{
            position: 'absolute',
            bottom: canvasH * 0.06,
            left: canvasW * 0.08,
            width: canvasW * 0.07,
            height: canvasW * 0.07,
            borderRadius: canvasW * 0.016,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 3,
            opacity: 0.9,
          }}
        >
          <img src={appIcon} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </SlideWrapper>
  );
}
