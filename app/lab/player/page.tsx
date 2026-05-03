import type { Metadata } from "next";
import PlayerLab from "@/components/player/PlayerLab.client";

export const metadata: Metadata = {
  title: "Oynatıcı — Psefitone Lab",
  description:
    "AlphaTab notation oynatıcısı için izole önizleme alanı. Geliştirme amaçlı.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * /lab/player — Server Component.
 * Hands off to the client island that owns the (future) AlphaTab dynamic import.
 * In this step the island only renders a Psefitone-themed loading card.
 */
export default function PlayerLabPage() {
  return <PlayerLab />;
}
