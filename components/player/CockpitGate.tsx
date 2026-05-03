'use client';

/**
 * CockpitGate — IntersectionObserver lazy-load gate for PlayerCockpit (Step 6).
 *
 * # What this does
 *
 * Wraps the dynamic import of PlayerCockpit in an IntersectionObserver-driven
 * deferred render. Until the sentinel element comes within 200px of the viewport,
 * a lightweight placeholder is rendered. Once visible, the cockpit chunk (and its
 * transitive AlphaTab dependency, ~1.16 MB) is fetched asynchronously.
 *
 * # Why this matters
 *
 * AlphaTab is huge (~1.16 MB). For the current `/lab/player` route, the cockpit
 * is "the hero" (top-of-page), so the gate fires ~immediately. But for future
 * lesson-route embeds, the cockpit can be far below the fold. The gate defers
 * the chunk fetch until the user scrolls within range, saving startup time and
 * bandwidth for users who don't watch the notation.
 *
 * # Module-scope dynamic import
 *
 * The `const PlayerCockpit = dynamic(...)` call lives at MODULE scope, not inside
 * the component. This means all instances of <CockpitGate> on a page share the
 * same import promise. Once one fires the gate, the chunk is cached for any
 * others. For layouts with multiple embedded cockpits (future: multi-lesson
 * dashboard), this deduplicates the fetch.
 *
 * # Placeholder sizing
 *
 * The sentinel div must match the cockpit's intrinsic dimensions so the layout
 * doesn't jump when the dynamic import resolves. See `.cockpit-placeholder` CSS
 * in `app/globals.css`: `aspect-ratio: 16/9; min-height: 480px;`.
 *
 * # Accessibility
 *
 * The placeholder has `aria-busy="true"` + `role="status"` + `aria-live="polite"`
 * to signal loading state to assistive technology. No visible loading indicator
 * is required (the LoadingCard would be overkill for the placeholder).
 *
 * See distributed-sparking-hellman.md § "Lazy-loading mechanic (CockpitGate.tsx)".
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import LoadingCard from './LoadingCard';
import type { LessonPlayerRecord } from '@/lib/player/lesson';

const PlayerCockpit = dynamic(() => import('./PlayerCockpit'), {
  ssr: false,
  loading: () => <LoadingCard fillMode="parent" />,
});

interface CockpitGateProps {
  storageKey: string;
  lesson: LessonPlayerRecord;
  /** Slice 4: passes through to `<PlayerCockpit>` to gate `<SyncEditor />`. */
  isAdmin: boolean;
}

export default function CockpitGate(props: CockpitGateProps) {
  const [enter, setEnter] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || enter) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEnter(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enter]);

  if (!enter) {
    return (
      <div
        ref={sentinelRef}
        className="cockpit-placeholder"
        aria-busy="true"
        role="status"
        aria-live="polite"
      />
    );
  }
  return <PlayerCockpit {...props} />;
}
