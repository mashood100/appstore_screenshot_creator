'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { THEMES, IPHONE_W, IPHONE_H, IPAD_W, IPAD_H, RTL_LOCALES, MAX_SLIDES, SLIDE_DESIGNS } from '../constants';
import { SlideProps, SlideConfig, SlideType, TextPosition } from '../types';
import ScreenshotPreview from './ScreenshotPreview';
import SlideDesignPicker from './SlideDesignPicker';
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

function getSlideLabel(type: string, pairPosition?: 'left' | 'right') {
  switch (type) {
    case 'hero': return 'Hero';
    case 'differentiator': return 'Differentiator';
    case 'ecosystem': return 'Ecosystem';
    case 'core-feature': return 'Feature';
    case 'trust-signal': return 'Trust Signal';
    case 'more-features': return 'More Features';
    case 'panoramic': return pairPosition === 'right' ? 'Panoramic R' : 'Panoramic L';
    default: return 'Slide';
  }
}

interface PreviewGridProps {
  onExportSlide: (index: number) => void;
}

export default function PreviewGrid({ onExportSlide }: PreviewGridProps) {
  const [state, dispatch] = useDashboard();
  const [showPicker, setShowPicker] = useState(false);

  const canvasW = state.device === 'ipad' ? IPAD_W : IPHONE_W;
  const canvasH = state.device === 'ipad' ? IPAD_H : IPHONE_H;
  const theme = state.themeId === 'custom'
    ? { bg: state.colors.background, fg: state.colors.text, accent: state.colors.accent, muted: '#6B7280' }
    : THEMES[state.themeId] || THEMES['clean-light'];
  const isRtl = RTL_LOCALES.has(state.activeLocale);

  const canAddMore = state.slides.length < MAX_SLIDES;

  const handleAddSlide = (type: SlideType) => {
    const design = SLIDE_DESIGNS.find(d => d.type === type);
    if (!design) return;

    if (type === 'panoramic') {
      if (state.slides.length + 2 > MAX_SLIDES) return; // needs 2 slots
      // Panoramic adds a connected pair (2 slides)
      const leftSlide: SlideConfig = {
        id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'panoramic',
        categoryLabel: '',
        headline: 'Your App\nTagline Here',
        screenshotIndex: state.slides.length,
        layout: 'centered',
        pairPosition: 'left',
      };
      const rightSlide: SlideConfig = {
        id: `slide-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'panoramic',
        categoryLabel: '',
        headline: 'Another Great\nFeature',
        screenshotIndex: state.slides.length + 1,
        layout: 'centered',
        pairPosition: 'right',
      };
      dispatch({ type: 'ADD_SLIDE', payload: leftSlide });
      dispatch({ type: 'ADD_SLIDE', payload: rightSlide });
      setShowPicker(false);
      return;
    }

    const newSlide: SlideConfig = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: design.type,
      categoryLabel: design.defaultCategoryLabel,
      headline: design.defaultHeadline,
      screenshotIndex: state.slides.length,
      layout: design.defaultLayout,
    };

    dispatch({ type: 'ADD_SLIDE', payload: newSlide });
    setShowPicker(false);
  };

  const handleRemoveSlide = (slideId: string) => {
    dispatch({ type: 'REMOVE_SLIDE', payload: slideId });
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {/* Existing slides */}
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
            isEditable: true,
            onTextChange: (field, value) => {
              dispatch({
                type: 'UPDATE_SLIDE',
                payload: { id: slideConfig.id, changes: { [field]: value } },
              });
            },
            onPositionChange: (position: TextPosition) => {
              dispatch({
                type: 'UPDATE_SLIDE',
                payload: { id: slideConfig.id, changes: { textPosition: position } },
              });
            },
          };

          return (
            <ScreenshotPreview
              key={slideConfig.id}
              canvasW={canvasW}
              canvasH={canvasH}
              index={index}
              slideLabel={getSlideLabel(slideConfig.type, slideConfig.pairPosition)}
              isSelected={state.selectedSlideIndex === index}
              onSelect={() => dispatch({ type: 'SELECT_SLIDE', payload: index })}
              onExport={() => onExportSlide(index)}
              onRemove={() => handleRemoveSlide(slideConfig.id)}
              className=""
            >
              <SlideComponent {...slideProps} />
            </ScreenshotPreview>
          );
        })}

        {/* "+" Add Slide button */}
        {canAddMore && (
          <button
            onClick={() => setShowPicker(true)}
            className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-solid group"
            style={{
              minHeight: 280,
              borderColor: 'var(--card-border)',
              background: 'transparent',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-light transition-all group-hover:scale-110"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              }}
            >
              +
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Add Screenshot
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {state.slides.length}/{MAX_SLIDES} slots used
              </p>
            </div>
          </button>
        )}

        {/* Empty state */}
        {state.slides.length === 0 && !canAddMore && (
          <div
            className="col-span-full flex items-center justify-center rounded-lg border-2 border-dashed"
            style={{
              minHeight: 300,
              borderColor: 'var(--card-border)',
              color: 'var(--muted)',
            }}
          >
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No slides yet</p>
              <p className="text-sm">Click the + button to add your first screenshot design</p>
            </div>
          </div>
        )}
      </div>

      {/* Design picker modal */}
      {showPicker && (
        <SlideDesignPicker
          onSelect={handleAddSlide}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
