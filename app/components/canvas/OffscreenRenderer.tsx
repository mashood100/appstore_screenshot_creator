'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { THEMES, IPHONE_W, IPHONE_H, IPAD_W, IPAD_H, RTL_LOCALES } from '../constants';
import { SlideProps, SlideConfig } from '../types';
import HeroSlide from '../slides/HeroSlide';
import DifferentiatorSlide from '../slides/DifferentiatorSlide';
import EcosystemSlide from '../slides/EcosystemSlide';
import CoreFeatureSlide from '../slides/CoreFeatureSlide';
import TrustSignalSlide from '../slides/TrustSignalSlide';
import MoreFeaturesSlide from '../slides/MoreFeaturesSlide';
import PanoramicSlide from '../slides/PanoramicSlide';

function getSlideComponent(type: string) {
  switch (type) {
    case 'hero': return HeroSlide;
    case 'differentiator': return DifferentiatorSlide;
    case 'ecosystem': return EcosystemSlide;
    case 'core-feature': return CoreFeatureSlide;
    case 'trust-signal': return TrustSignalSlide;
    case 'more-features': return MoreFeaturesSlide;
    case 'panoramic': return PanoramicSlide;
    default: return CoreFeatureSlide;
  }
}

export interface OffscreenRendererHandle {
  getSlideElement: (index: number) => HTMLDivElement | null;
  getSlideCount: () => number;
}

const OffscreenRenderer = forwardRef<OffscreenRendererHandle>(function OffscreenRenderer(_, ref) {
  const [state] = useDashboard();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Render at the exact export size so html-to-image captures correct dimensions
  const canvasW = state.exportSize.w;
  const canvasH = state.exportSize.h;
  const theme = state.themeId === 'custom'
    ? { bg: state.colors.background, fg: state.colors.text, accent: state.colors.accent, muted: '#6B7280' }
    : THEMES[state.themeId] || THEMES['clean-light'];
  const isRtl = RTL_LOCALES.has(state.activeLocale);

  useImperativeHandle(ref, () => ({
    getSlideElement: (index: number) => slideRefs.current[index] || null,
    getSlideCount: () => state.slides.length,
  }));

  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        opacity: 0,
        pointerEvents: 'none',
        fontFamily: `${state.fontFamily}, system-ui, sans-serif`,
      }}
      aria-hidden="true"
    >
      {state.slides.map((slideConfig: SlideConfig, index: number) => {
        const SlideComponent = getSlideComponent(slideConfig.type);
        const slideProps: SlideProps = {
          canvasW,
          canvasH,
          theme,
          copy: {
            slideId: slideConfig.id,
            categoryLabel: slideConfig.categoryLabel,
            headline: slideConfig.headline,
          },
          screenshots: state.screenshots,
          appIcon: state.appIcon,
          features: state.features,
          isRtl,
          device: state.device,
          uiElements: state.uiElements.map(e => e.dataUrl),
          stylePreset: state.stylePreset,
          slideConfig,
          fontFamily: state.fontFamily,
        };

        return (
          <div
            key={slideConfig.id}
            ref={(el) => { slideRefs.current[index] = el; }}
          >
            <SlideComponent {...slideProps} />
          </div>
        );
      })}
    </div>
  );
});

export default OffscreenRenderer;
