'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Phone from '../mockups/Phone';
import IPad from '../mockups/IPad';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';

export default function HeroSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, screenshots, appIcon, device, slideConfig, stylePreset, onTextChange, isEditable, onPositionChange } = props;
  const screenshotSrc = screenshots[slideConfig.screenshotIndex]?.dataUrl || screenshots[0]?.dataUrl || null;
  const isDevice = device === 'ipad';
  const showDecorations = stylePreset !== 'flat';

  return (
    <SlideWrapper {...props}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bg}ee 60%, ${theme.accent}15 100%)`,
        }}
      />

      {/* Decorative blobs */}
      {showDecorations && (
        <>
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.6}
            top="-10%"
            right="-20%"
            opacity={0.15}
            blur={100}
          />
          <GradientBlob
            color={theme.accent}
            size={canvasW * 0.4}
            bottom="10%"
            left="-15%"
            opacity={0.1}
            blur={80}
          />
        </>
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
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

      {/* Device mockup at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${isDevice ? '8%' : '13%'})`,
          width: isDevice ? '70%' : '84%',
          zIndex: 1,
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
