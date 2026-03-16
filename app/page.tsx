'use client';

import { useRef, useCallback } from 'react';
import { DashboardProvider, useDashboard } from './components/context/DashboardContext';
import Sidebar from './components/sidebar/Sidebar';
import Toolbar from './components/toolbar/Toolbar';
import PreviewGrid from './components/canvas/PreviewGrid';
import OffscreenRenderer, { OffscreenRendererHandle } from './components/canvas/OffscreenRenderer';
import { useExport } from './components/export/useExport';

function Dashboard() {
  const [state] = useDashboard();
  const rendererRef = useRef<OffscreenRendererHandle>(null);
  const { exportSlide, exportAllSlides } = useExport(rendererRef);

  const handleExportCurrent = useCallback(() => {
    if (state.selectedSlideIndex !== null) {
      exportSlide(state.selectedSlideIndex);
    }
  }, [state.selectedSlideIndex, exportSlide]);

  const handleExportSlide = useCallback((index: number) => {
    exportSlide(index);
  }, [exportSlide]);

  return (
    <div className="flex h-screen" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          onExportCurrent={handleExportCurrent}
          onExportAll={exportAllSlides}
        />

        {/* Preview grid */}
        <div className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          <PreviewGrid onExportSlide={handleExportSlide} />
        </div>
      </div>

      {/* Offscreen renderer for export */}
      <OffscreenRenderer ref={rendererRef} />
    </div>
  );
}

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
