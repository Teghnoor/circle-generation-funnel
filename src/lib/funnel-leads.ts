import { put } from "@vercel/blob";
import { LEAD_COOKIE } from "./funnel";

/**
 * Leads aus dem Funnel. Jeder Eintrag geht an FUNNEL_WEBHOOK_URL (Zapier,
 * Make, Brevo, Klick-Tipp … — das Tool entscheidet, was daraus wird) und
 * zusätzlich als Datei in den privaten Blob-Speicher, damit nichts verloren
 * geht, falls der Webhook mal nicht antwortet.
 */

export type LeadTyp = "optin" | "video_freigeschaltet" | "termin_gebucht" | "anmeldung";

export type LeadDaten = {
  typ: LeadTyp;
  id: string;
  vorname: string;
  email: string;
  zeit: string;
  [feld: string]: unknown;
};

/** Was im Cookie steht — nur so viel, wie /video und die Events brauchen. */
export type LeadCookie = { id: string; vorname: string; email: string; herkunft?: Record<string, string> };

export const COOKIE_OPTIONEN = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 90,
};

export function cookieSchreiben(l: LeadCookie): string {
  return Buffer.from(JSON.stringify(l)).toString("base64url");
}

export function cookieLesen(wert: string | undefined): LeadCookie | null {
  if (!wert) return null;
  try {
    const l = JSON.parse(Buffer.from(wert, "base64url").toString("utf8"));
    if (typeof l?.id === "string" && typeof l?.email === "string") {
      const herkunft = l.herkunft && typeof l.herkunft === "object" ? (l.herkunft as Record<string, string>) : undefined;
      return { id: l.id, email: l.email, vorname: String(l.vorname ?? ""), herkunft };
    }
  } catch {}
  return null;
}

export { LEAD_COOKIE };

export function neueLeadId(): string {
  const zufall = crypto.getRandomValues(new Uint8Array(4));
  return `${Date.now()}-${Array.from(zufall, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailPruefen(roh: unknown): string | null {
  const e = String(roh ?? "").trim().toLowerCase();
  return e.length <= 120 && EMAIL.test(e) ? e : null;
}

export function text(roh: unknown, max: number): string {
  return String(roh ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

async function webhookSenden(d: LeadDaten): Promise<boolean> {
  const url = process.env.FUNNEL_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) console.error(`[funnel] Webhook antwortet ${r.status} für ${d.typ} ${d.id}`);
    return r.ok;
  } catch (e) {
    console.error(`[funnel] Webhook nicht erreichbar für ${d.typ} ${d.id}:`, e);
    return false;
  }
}

async function sichern(d: LeadDaten): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    await put(`funnel/${d.typ}/${d.id}.json`, JSON.stringify(d), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return true;
  } catch (e) {
    console.error(`[funnel] Blob-Sicherung fehlgeschlagen für ${d.typ} ${d.id}:`, e);
    return false;
  }
}

/**
 * Webhook und Sicherung laufen parallel. Der Besucher wartet darauf, bekommt
 * aber nie einen Fehler zu sehen — ein verlorener Lead ist schlimmer als ein
 * doppelter, und das Log zeigt, was schiefging.
 */
export async function leadMelden(d: LeadDaten): Promise<void> {
  const [webhook, blob] = await Promise.all([webhookSenden(d), sichern(d)]);
  if (!webhook && !blob) {
    console.log(`[funnel] ${d.typ} (weder Webhook noch Blob eingerichtet):`, JSON.stringify(d));
  }
}
