/**
 * Meta- und TikTok-Pixel, falls eingerichtet (NEXT_PUBLIC_META_PIXEL_ID,
 * NEXT_PUBLIC_TIKTOK_PIXEL_ID). Ohne IDs passiert nichts.
 */

type Ereignis = "lead" | "freigeschaltet" | "termin";

const META: Record<Ereignis, string> = { lead: "Lead", freigeschaltet: "ViewContent", termin: "Schedule" };
const TIKTOK: Record<Ereignis, string> = { lead: "SubmitForm", freigeschaltet: "ViewContent", termin: "CompleteRegistration" };

type Fenster = Window & {
  fbq?: (...a: unknown[]) => void;
  ttq?: { track: (name: string, daten?: Record<string, unknown>) => void };
};

export function pixel(e: Ereignis) {
  if (typeof window === "undefined") return;
  const w = window as Fenster;
  try {
    w.fbq?.("track", META[e]);
  } catch {}
  try {
    w.ttq?.track(TIKTOK[e]);
  } catch {}
}
