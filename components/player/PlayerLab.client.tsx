'use client';

/**
 * PlayerLab — client island for /lab/player.
 *
 * # Step 7 (final lab page chrome)
 *
 * This file is now the lab demo's chrome host. The section header (gold
 * "PSEFITONE LAB" tag + Playfair "Oynatıcı Cockpit" display title), the
 * atmospheric radial-glow layer, and the centered max-width frame all live
 * here — they migrated out of the now-deleted `AlphaTabPlayer.tsx`.
 *
 * The cockpit itself owns its internal chrome (toolbar, splitter, panes), so
 * this layer is purely presentational page scaffolding. CockpitGate keeps the
 * lazy-loading IntersectionObserver behavior from Step 6 — the AlphaTab chunk
 * still doesn't fetch until the cockpit is ~200 px from the viewport.
 *
 * # Why CSS classes (not inline styles)
 *
 * Step 5/6 used inline `style={{}}` props as temporary scaffolding. With proper
 * page chrome landed, all styling now flows through `.lab-player-page__*` rules
 * in `globals.css`. Zero inline styles in this file by design — it makes the
 * markup auditable and keeps the design tokens centralized.
 *
 * # Layout layer ownership
 *
 * `app/lab/player/layout.tsx` is the route-level viewport-owning surface
 * (`minHeight: 100vh` lives there). This component sits inside that layout
 * and owns the page-internal chrome only — `.lab-player-page` provides its
 * own `min-height: 100vh` so the gradient + glow fill the route surface.
 *
 * FpsMeter renders here so it pins to the viewport corner regardless of where
 * the cockpit sits in the page (it's `position: fixed` internally).
 */

import { Suspense } from 'react';
import CockpitGate from './CockpitGate';
import FpsMeter from './FpsMeter';
import { sampleLessonRecord } from '@/lib/player/lesson';

interface PlayerLabProps {
  /** Slice 4: forwarded from the server page. When true, `PlayerCockpit`
   *  mounts the admin-only `<SyncEditor />` below its body. */
  isAdmin: boolean;
}

export default function PlayerLab({ isAdmin }: PlayerLabProps) {
  return (
    <div className="lab-player-page">
      <div className="lab-player-page__glow" aria-hidden="true" />
      <header className="lab-player-page__header">
        <span className="lab-player-page__tag">PSEFITONE LAB</span>
        <h1 className="lab-player-page__title">
          <em>Oynatıcı</em> Cockpit
        </h1>
      </header>
      <div className="lab-player-page__frame">
        <CockpitGate
          storageKey="lab"
          lesson={sampleLessonRecord}
          isAdmin={isAdmin}
        />
      </div>
      {/*
        FpsMeter calls `useSearchParams()` which forces a CSR bailout under Next
        16's prerender pass. Wrapping it in a Suspense boundary lets the page
        prerender statically while the meter resolves on the client.
        Fallback is `null` because the meter itself renders null when `?fps`
        isn't set — there's no visible UI to fall back to.
      */}
      <Suspense fallback={null}>
        <FpsMeter />
      </Suspense>
    </div>
  );
}
