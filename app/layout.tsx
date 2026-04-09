import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import GlobalSparkles from "@/components/GlobalSparkles";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

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
      <body className={`${playfair.variable} ${montserrat.variable}`}>
        <a href="#main-content" className="skip-nav">
          Ana içeriğe geç
        </a>
        <GlobalSparkles />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
