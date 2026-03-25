'use client';

import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useDashboard } from '../context/DashboardContext';
import { OffscreenRendererHandle } from '../canvas/OffscreenRenderer';
import { logScreenshotExported, logExportAllStarted, logExportAllCompleted } from '../../lib/analytics';

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useExport(rendererRef: React.RefObject<OffscreenRendererHandle | null>) {
  const [state, dispatch] = useDashboard();

  const getFilename = useCallback((index: number) => {
    const slideId = state.slides[index]?.type || 'slide';
    const { w, h } = state.exportSize;
    const paddedIndex = String(index + 1).padStart(2, '0');
    return `${paddedIndex}-${slideId}-${state.activeLocale}-${state.themeId}-${state.device}-${w}x${h}.png`;
  }, [state.slides, state.exportSize, state.activeLocale, state.themeId, state.device]);

  const exportSlide = useCallback(async (index: number) => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const el = renderer.getSlideElement(index);
    if (!el) return;

    const { w: W, h: H } = state.exportSize;
    const opts = { width: W, height: H, pixelRatio: 1, cacheBust: true };

    // Move on-screen for capture
    const parent = el.parentElement;
    if (parent) {
      parent.style.position = 'absolute';
      parent.style.left = '0px';
      parent.style.top = '0px';
      parent.style.opacity = '1';
      parent.style.zIndex = '-1';
    }

    try {
      // Double-call trick for font/image warmup
      await toPng(el, opts);
      const dataUrl = await toPng(el, opts);
      downloadDataUrl(dataUrl, getFilename(index));

      logScreenshotExported({
        slide_type: state.slides[index]?.type || 'unknown',
        device: state.device,
        theme: state.themeId,
        export_dimensions: `${W}x${H}`,
        locale: state.activeLocale,
      });
    } finally {
      // Move back off-screen
      if (parent) {
        parent.style.position = '';
        parent.style.left = '-9999px';
        parent.style.top = '0px';
        parent.style.opacity = '0';
        parent.style.zIndex = '';
      }
    }
  }, [state.exportSize, getFilename, rendererRef]);

  const exportAllSlides = useCallback(async () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const count = renderer.getSlideCount();
    dispatch({ type: 'SET_EXPORTING', payload: true });
    logExportAllStarted({ slide_count: count });

    try {
      for (let i = 0; i < count; i++) {
        dispatch({ type: 'SET_EXPORT_PROGRESS', payload: { current: i + 1, total: count } });
        await exportSlide(i);
        if (i < count - 1) await delay(300);
      }
      logExportAllCompleted({ slide_count: count });
    } finally {
      dispatch({ type: 'SET_EXPORTING', payload: false });
      dispatch({ type: 'SET_EXPORT_PROGRESS', payload: null });
    }
  }, [dispatch, exportSlide, rendererRef]);

  return { exportSlide, exportAllSlides };
}
