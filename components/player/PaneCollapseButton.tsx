'use client';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

type ChevronDirection = 'left' | 'right' | 'up' | 'down';

interface PaneCollapseButtonProps {
  direction: ChevronDirection;
  onClick: () => void;
  ariaLabel: string;
}

export default function PaneCollapseButton({ direction, onClick, ariaLabel }: PaneCollapseButtonProps) {
  const Icon = { left: ChevronLeft, right: ChevronRight, up: ChevronUp, down: ChevronDown }[direction];
  return (
    <button
      type="button"
      className="psef-pane-collapse"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
