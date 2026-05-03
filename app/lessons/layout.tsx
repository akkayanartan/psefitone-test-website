import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ders Kütüphanesi · Psefitone",
  robots: { index: false, follow: false }
};

export default function LessonsLayout({
  children
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
