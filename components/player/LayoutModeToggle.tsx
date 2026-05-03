'use client';
import { PanelLeft, PanelTop } from 'lucide-react';

type LayoutMode = 'side-by-side' | 'stacked';

interface LayoutModeToggleProps {
  mode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
}

export default function LayoutModeToggle({ mode, onModeChange }: LayoutModeToggleProps) {
  return (
    <div className="psef-layout-toggle" role="group" aria-label="Düzen modu">
      <button
        type="button"
        className="psef-layout-toggle__btn"
        aria-pressed={mode === 'side-by-side'}
        aria-label="Yan Yana"
        title="Yan Yana"
        onClick={() => onModeChange('side-by-side')}
      >
        <PanelLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="psef-layout-toggle__btn"
        aria-pressed={mode === 'stacked'}
        aria-label="Üst Üste"
        title="Üst Üste"
        onClick={() => onModeChange('stacked')}
      >
        <PanelTop size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
