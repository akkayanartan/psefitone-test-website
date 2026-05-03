'use client';

/**
 * LoadingCard — Psefitone-themed loading state.
 * Extracted from PlayerLab.client.tsx Step 1.
 *
 * The card uses CSS custom properties exclusively (--brand-dark, --brand-primary, etc).
 * The fillMode prop controls the outer container's height behavior:
 *   - 'viewport': minHeight: '100vh' — fills viewport (lab page usage, preserves current visual)
 *   - 'parent': height: '100%' — fits parent (default; embeddable in CockpitGate + dynamic loading fallback)
 */

interface LoadingCardProps {
  fillMode?: 'viewport' | 'parent';
}

export default function LoadingCard({ fillMode = 'parent' }: LoadingCardProps) {
  const outerStyle =
    fillMode === 'viewport'
      ? { minHeight: '100vh' }
      : { height: '100%' };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        ...outerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--section-pad-v) var(--section-pad-h)',
        background: 'var(--brand-dark)',
      }}
    >
      {/* Atmospheric glow — radial wash of brand-secondary, low alpha. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(134,41,255,0.18), transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem 2.25rem',
          background: 'var(--brand-dark3)',
          border: '1px solid var(--brand-border)',
          borderRadius: '4px',
          textAlign: 'center',
          boxShadow:
            '0 4px 20px rgba(134, 41, 255, 0.12), 0 1px 6px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Section tag — gold, ALL-CAPS, tight tracking */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--brand-accent)',
            marginBottom: '1rem',
          }}
        >
          PSEFITONE LAB
        </span>

        {/* Heading — Playfair Display, italic accent in lavender, pulses on opacity only */}
        <h1
          className="player-loading-heading"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 500,
            lineHeight: 1.22,
            letterSpacing: '-0.015em',
            color: '#fff',
            margin: '0 0 0.75rem',
          }}
        >
          <em
            style={{
              fontStyle: 'italic',
              color: 'var(--brand-primary)',
            }}
          >
            Oynatıcı
          </em>{' '}
          yükleniyor…
        </h1>

        {/* Subtitle — Montserrat, muted */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            fontWeight: 400,
            color: 'var(--brand-muted)',
            margin: 0,
          }}
        >
          AlphaTab notation motoru başlatılıyor.
        </p>

        {/* Local style: opacity-only keyframe for the heading. No transition-all,
            no transform, no layout property animation. */}
        <style>{`
          .player-loading-heading {
            animation: psefitone-loading-pulse 1.6s ease-in-out infinite;
          }
          @keyframes psefitone-loading-pulse {
            0%, 100% { opacity: 0.85; }
            50%      { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .player-loading-heading {
              animation: none;
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
