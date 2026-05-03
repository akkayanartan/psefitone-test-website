import type { Metadata } from "next";
import PlayerLab from "@/components/player/PlayerLab.client";
import { readSessionFromCookies } from "@/lib/admin/auth";

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
 *
 * # Slice 4 admin gate
 *
 * Reads the admin session here on the server and passes a boolean down to
 * the client tree. When true, `PlayerCockpit` mounts `<SyncEditor />` below
 * the cockpit body so the instructor can tune trim/offset/BPM values.
 *
 * `readSessionFromCookies()` throws when `SESSION_SECRET` is missing
 * (Vercel prod has no admin env wired). We catch and treat as `false` so
 * the marketing-shaped lab page still renders. Combined with `proxy.ts`
 * 404'ing all `/api/admin/*` on Vercel, this means SyncEditor naturally
 * hides on prod and admin sync writes are impossible there.
 */
export default async function PlayerLabPage() {
  let isAdmin = false;
  try {
    isAdmin = await readSessionFromCookies();
  } catch {
    isAdmin = false;
  }
  return <PlayerLab isAdmin={isAdmin} />;
}
