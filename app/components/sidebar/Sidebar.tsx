'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import ApiKeyInput from './ApiKeyInput';
import AppDescriptionInput from './AppDescriptionInput';
import GenerateButton from './GenerateButton';
import ScreenshotUploader from './ScreenshotUploader';
import IconUploader from './IconUploader';
import UIElementUploader from './UIElementUploader';
import ColorPicker from './ColorPicker';
import ThemeSelector from './ThemeSelector';
import StyleSelector from './StyleSelector';
import FontSelector from './FontSelector';
import FeatureListEditor from './FeatureListEditor';
import { MAX_SLIDES } from '../constants';
import LocaleManager from './LocaleManager';

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-white/5"
        style={{ color: 'var(--muted)' }}
      >
        {title}
        <span className="transition-transform" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [state, dispatch] = useDashboard();

  if (!state.sidebarOpen) {
    return (
      <div
        className="flex flex-col items-center py-4 gap-4"
        style={{
          width: 48,
          height: '100vh',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="w-8 h-8 rounded flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
          style={{ color: 'var(--sidebar-fg)' }}
          title="Open sidebar"
        >
          ☰
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col custom-scrollbar"
      style={{
        width: 320,
        height: '100vh',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div>
          <h1 className="text-sm font-bold" style={{ color: 'var(--sidebar-fg)' }}>
            Screenshot Generator
          </h1>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
            App Store Marketing Assets
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="w-7 h-7 rounded flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
          style={{ color: 'var(--muted)' }}
          title="Collapse sidebar"
        >
          ✕
        </button>
      </div>

      {/* Configuration */}
      <Section title="Configuration" defaultOpen={true}>
        <ApiKeyInput />
        <AppDescriptionInput />
        <GenerateButton />
      </Section>

      {/* Screenshots */}
      <Section title="Screenshots" defaultOpen={true}>
        <ScreenshotUploader />
        <IconUploader />
        <UIElementUploader />
      </Section>

      {/* Design */}
      <Section title="Design" defaultOpen={true}>
        <ColorPicker />
        <ThemeSelector />
        <StyleSelector />
        <FontSelector />
      </Section>

      {/* Content */}
      <Section title="Content" defaultOpen={true}>
        <FeatureListEditor />
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--sidebar-fg)' }}>
            Slides
          </label>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {state.slides.length}/{MAX_SLIDES} — Use the + button in the preview area to add slides
          </p>
        </div>
      </Section>

      {/* Localization */}
      <Section title="Localization" defaultOpen={false}>
        <LocaleManager />
      </Section>
    </div>
  );
}
