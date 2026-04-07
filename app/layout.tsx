import type { Metadata } from "next";
import "./globals.css";
import GlobalSparkles from "@/components/GlobalSparkles";

export const metadata: Metadata = {
  title: "Psefitone Kickstarter — 2. Kohort | Çerkes Akordeon Programı",
  description:
    "Türkiye Çerkes diasporası için tasarlanan ilk modern akordeon metodolojisi. 10 haftada Çerkes müziğini anla ve ilk parçalarını çalmaya başla.",
};

function NoiseOverlay() {
  return (
    <div
      className="noise-overlay"
      aria-hidden="true"
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <GlobalSparkles />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
