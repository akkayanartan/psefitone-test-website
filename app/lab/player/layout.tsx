import type { Metadata } from "next";

/**
 * Lean layout for the /lab/player sandbox.
 *
 * Inherits <html>/<body>/fonts/noise overlay/Analytics/SpeedInsights from
 * the root layout. Intentionally does NOT mount: CountdownBanner, ProgressBar,
 * Nav, SectionTracker, or any marketing-only UI. GlobalSparkles is mounted in
 * the root layout (out of scope for this step to remove); a later step that
 * gates on 60 fps will revisit if needed.
 *
 * The route is sandbox / preview territory — keep it out of search.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlayerLabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      style={{ background: "var(--brand-dark)", minHeight: "100vh" }}
    >
      {children}
    </main>
  );
}
