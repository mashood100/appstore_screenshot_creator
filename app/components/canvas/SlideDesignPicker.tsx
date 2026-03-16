'use client';

import { SLIDE_DESIGNS, IPHONE_W, IPHONE_H, THEMES } from '../constants';
import { SlideType, SlideProps, SlideConfig } from '../types';
import { useDashboard } from '../context/DashboardContext';
import HeroSlide from '../slides/HeroSlide';
import DifferentiatorSlide from '../slides/DifferentiatorSlide';
import EcosystemSlide from '../slides/EcosystemSlide';
import CoreFeatureSlide from '../slides/CoreFeatureSlide';
import TrustSignalSlide from '../slides/TrustSignalSlide';
import MoreFeaturesSlide from '../slides/MoreFeaturesSlide';

function getSlideComponent(type: string) {
  switch (type) {
    case 'hero': return HeroSlide;
    case 'differentiator': return DifferentiatorSlide;
    case 'ecosystem': return EcosystemSlide;
    case 'core-feature': return CoreFeatureSlide;
    case 'trust-signal': return TrustSignalSlide;
    case 'more-features': return MoreFeaturesSlide;
    default: return CoreFeatureSlide;
  }
}

const PREVIEW_WIDTH = 160;
const PREVIEW_SCALE = PREVIEW_WIDTH / IPHONE_W;

interface SlideDesignPickerProps {
  onSelect: (type: SlideType) => void;
  onClose: () => void;
}

export default function SlideDesignPicker({ onSelect, onClose }: SlideDesignPickerProps) {
  const [state] = useDashboard();
  const theme = THEMES[state.themeId] || THEMES['clean-light'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full rounded-xl shadow-2xl"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          maxHeight: '85vh',
          maxWidth: 720,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--card-border)' }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
              Choose a Screenshot Design
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Select a layout to add to your screenshots
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors hover:bg-black/5"
            style={{ color: 'var(--muted)' }}
          >
            x
          </button>
        </div>

        {/* Design grid with live previews */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 overflow-y-auto"
          style={{ maxHeight: 'calc(85vh - 70px)' }}
        >
          {SLIDE_DESIGNS.map((design) => {
            const SlideComponent = getSlideComponent(design.type);
            const previewConfig: SlideConfig = {
              id: `preview-${design.type}`,
              type: design.type,
              categoryLabel: design.defaultCategoryLabel,
              headline: design.defaultHeadline,
              screenshotIndex: 0,
              layout: design.defaultLayout,
            };
            const slideProps: SlideProps = {
              canvasW: IPHONE_W,
              canvasH: IPHONE_H,
              theme,
              copy: {
                slideId: previewConfig.id,
                categoryLabel: design.defaultCategoryLabel,
                headline: design.defaultHeadline,
              },
              screenshots: state.screenshots,
              appIcon: state.appIcon,
              features: state.features,
              isRtl: false,
              device: 'iphone',
              uiElements: [],
              stylePreset: state.stylePreset,
              slideConfig: previewConfig,
            };

            return (
              <button
                key={design.type}
                onClick={() => onSelect(design.type)}
                className="flex flex-col rounded-lg overflow-hidden text-left transition-all hover:shadow-lg group"
                style={{
                  border: '1px solid var(--card-border)',
                  background: 'var(--background)',
                }}
              >
                {/* Live mini preview */}
                <div
                  className="overflow-hidden"
                  style={{
                    width: '100%',
                    height: IPHONE_H * PREVIEW_SCALE,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${PREVIEW_SCALE})`,
                      transformOrigin: 'top left',
                      width: IPHONE_W,
                      height: IPHONE_H,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    <SlideComponent {...slideProps} />
                  </div>

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  >
                    <span
                      className="px-3 py-1.5 rounded-md text-xs font-semibold"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      Select
                    </span>
                  </div>
                </div>

                {/* Label + description */}
                <div
                  className="px-3 py-2.5"
                  style={{ borderTop: '1px solid var(--card-border)' }}
                >
                  <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {design.label}
                  </div>
                  <p
                    className="text-[11px] mt-0.5 leading-snug"
                    style={{ color: 'var(--muted)' }}
                  >
                    {design.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
