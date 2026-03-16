'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import GlowOrb from '../decorative/GlowOrb';

export default function CoreFeatureSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, device, slideConfig, isRtl, stylePreset } = props;
  const screenshotSrc = screenshots[slideConfig.screenshotIndex]?.dataUrl || screenshots[0]?.dataUrl || null;
  const isIPad = device === 'ipad';
  const showDecorations = stylePreset !== 'flat';

  const layout = slideConfig.layout || 'centered';

  const isCentered = layout === 'centered';
  const isOffsetRight = layout === 'offset-right';
  const isOffsetLeft = layout === 'offset-left';

  // Alternate background for visual rhythm
  const slideIndex = parseInt(slideConfig.id.replace('slide-', ''), 10) || 0;
  const isContrastSlide = slideIndex % 3 === 0;
  const bgColor = isContrastSlide
    ? `linear-gradient(180deg, ${theme.fg}f0 0%, ${theme.fg}e0 100%)`
    : `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bg}ee 100%)`;
  const textColor = isContrastSlide ? theme.bg : theme.fg;

  return (
    <SlideWrapper {...props} backgroundOverride={bgColor}>
      {showDecorations && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.4}
          top="20%"
          left={isCentered ? '30%' : isOffsetRight ? '5%' : '55%'}
          opacity={0.12}
        />
      )}

      {/* Caption */}
      <div
        style={{
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
        />
      </div>

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
