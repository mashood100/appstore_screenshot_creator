'use client';

import { SlideProps } from '../types';
import SlideWrapper from './SlideWrapper';
import Caption from '../typography/Caption';
import DraggableCaption from './DraggableCaption';
import GradientBlob from '../decorative/GradientBlob';
import GlowOrb from '../decorative/GlowOrb';
import { STYLE_CONFIGS, hexOpacity } from '../constants';

export default function MoreFeaturesSlide(props: SlideProps) {
  const { canvasW, canvasH, theme, copy, appIcon, features, stylePreset, onTextChange, isEditable, onPositionChange, slideConfig } = props;
  const sc = STYLE_CONFIGS[stylePreset];

  // Dark background for contrast
  const bgGradient = `linear-gradient(${sc.bgGradientAngle}deg, ${theme.fg}f0 0%, ${theme.fg}e5 100%)`;
  const pillBg = `${theme.bg}18`;
  const pillBorder = `${theme.bg}25`;

  return (
    <SlideWrapper {...props} backgroundOverride={bgGradient}>
      {/* Accent ambient overlay */}
      {sc.accentBgOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 60%, ${theme.accent}${hexOpacity(sc.accentBgOpacity * 0.6)} 0%, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary decoration */}
      {sc.showDecorations && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.6 * sc.decorationScale}
          top="30%"
          left="20%"
          opacity={sc.decorationOpacity}
          blur={sc.blur}
        />
      )}

      {/* Extra blobs */}
      {sc.extraBlobs >= 1 && (
        <GlowOrb
          color={theme.accent}
          size={canvasW * 0.35 * sc.decorationScale}
          bottom="10%"
          right="10%"
          opacity={sc.decorationOpacity * 0.5}
        />
      )}
      {sc.extraBlobs >= 2 && (
        <GradientBlob
          color={theme.accent}
          size={canvasW * 0.4 * sc.decorationScale}
          top="5%"
          right="-5%"
          opacity={sc.decorationOpacity * 0.35}
          blur={sc.blur * 1.2}
        />
      )}

      {/* App icon at top center */}
      {appIcon && (
        <div
          style={{
            position: 'absolute',
            top: canvasH * 0.1,
            left: '50%',
            transform: 'translateX(-50%)',
            width: canvasW * 0.1,
            height: canvasW * 0.1,
            borderRadius: canvasW * 0.022,
            overflow: 'hidden',
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

      {/* Headline */}
      <DraggableCaption
        canvasW={canvasW}
        canvasH={canvasH}
        textPosition={slideConfig.textPosition}
        onPositionChange={onPositionChange}
        isEditable={isEditable}
        defaultStyle={{
          position: 'absolute',
          top: appIcon ? canvasH * 0.22 : canvasH * 0.12,
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
          color={theme.bg}
          accentColor={theme.accent}
          align="center"
          onTextChange={onTextChange}
          isEditable={isEditable}
        />
      </DraggableCaption>

      {/* Feature pills grid */}
      <div
        style={{
          position: 'absolute',
          top: canvasH * 0.4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '85%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: canvasW * 0.02,
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {features.length > 0 ? (
          features.map((feature) => (
            <div
              key={feature.id}
              style={{
                padding: `${canvasW * 0.018}px ${canvasW * 0.035}px`,
                borderRadius: canvasW * 0.06,
                background: pillBg,
                border: `1px solid ${pillBorder}`,
                color: theme.bg,
                fontSize: canvasW * 0.032,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {feature.title}
            </div>
          ))
        ) : (
          // Placeholder pills
          ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'].map((name, i) => (
            <div
              key={i}
              style={{
                padding: `${canvasW * 0.018}px ${canvasW * 0.035}px`,
                borderRadius: canvasW * 0.06,
                background: pillBg,
                border: `1px solid ${pillBorder}`,
                color: `${theme.bg}80`,
                fontSize: canvasW * 0.032,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </div>
          ))
        )}
      </div>
    </SlideWrapper>
  );
}
