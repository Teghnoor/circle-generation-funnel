"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { CALENDLY_URL, GESPRAECH_MINUTEN, GESPRAECHE, SPEICHER } from "@/lib/funnel";
import { pixel } from "@/lib/pixel";
import { ereignis } from "./gated-video";

function herkunft(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SPEICHER.herkunft) || "{}");
  } catch {
    return {};
  }
}

/** Kennung des Mitglieds, nur solange sie gültig ist (30 Tage ab dem Klick auf den Link). */
function mitgliedRef(): string | null {
  try {
    const r = JSON.parse(localStorage.getItem(SPEICHER.ref) || "null");
    return r?.wert && r.bis > Date.now() ? String(r.wert) : null;
  } catch {
    return null;
  }
}

/**
 * Nach der Freischaltung: Calendly zum Buchen des Erstgesprächs und — nur wenn die Zahl live aus
 * Calendly kommt — „noch X von 17 Gesprächen frei". Tegh 10.11.: kein 48-Stunden-Fenster mehr,
 * kein Countdown, Buchung läuft nie ab.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Termin({ vorname, email, freiSeit }: { vorname: string; email: string; freiSeit: number }) {
  const router = useRouter();
  const [frei, setFrei] = useState<number | null>(null);

  // Freie Plätze nur anzeigen, wenn der Server sie aus Calendly lesen kann.
  useEffect(() => {
    let aus = false;
    fetch("/api/funnel/plaetze")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!aus && d && typeof d.frei === "number") setFrei(d.frei);
      })
      .catch(() => {});
    return () => {
      aus = true;
    };
  }, []);

  // Calendly meldet eine Buchung per postMessage an die Seite.
  useEffect(() => {
    function nachricht(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const d = e.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } };
      if (d?.event !== "calendly.event_scheduled") return;
      ereignis("termin", 0, { termin: d.payload?.event?.uri, teilnehmer: d.payload?.invitee?.uri });
      pixel("termin");
      try {
        localStorage.setItem("cg_termin", "1");
      } catch {}
      router.push("/danke");
    }
    window.addEventListener("message", nachricht);
    return () => window.removeEventListener("message", nachricht);
  }, [router]);

  const kalenderUrl = useMemo(() => {
    if (!CALENDLY_URL) return "";
    const u = new URL(CALENDLY_URL);
    if (vorname) u.searchParams.set("name", vorname);
    if (email) u.searchParams.set("email", email);
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("background_color", "111116");
    u.searchParams.set("text_color", "f5f5f7");
    u.searchParams.set("primary_color", "ff2e32");
    // Herkunft in Calendly sichtbar machen (z. B. src=fanpage3 → utm_source).
    const h = herkunft();
    const quelle = h.src || h.utm_source;
    if (quelle) u.searchParams.set("utm_source", quelle);
    if (h.utm_campaign) u.searchParams.set("utm_campaign", h.utm_campaign);
    if (h.utm_medium) u.searchParams.set("utm_medium", h.utm_medium);
    // Kennung des Mitglieds: Calendly liefert utm_content im Webhook mit,
    // so landet der Termin auf der Plattform beim richtigen Mitglied.
    const ref = mitgliedRef();
    if (ref) u.searchParams.set("utm_content", ref);
    return u.toString();
    // vorname/email reichen; die Herkunft ändert sich auf dieser Seite nicht.
  }, [vorname, email]);

  return (
    <div id="termin" className="cg-karte cg-auftauchen relative overflow-hidden p-5 md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ff2e32]/20 blur-3xl" />
      <div className="relative">
        <span className="cg-tag">
          <span className="cg-tag-punkt" /> Freigeschaltet
        </span>
        <h2 className="mt-4 text-[26px] font-semibold leading-tight tracking-[-0.035em] md:text-[34px]">
          Buch jetzt dein kostenloses Erstgespräch
        </h2>
        <p className="cg-text mt-2 text-[15px]">
          Such dir einen Termin aus. Nach der Buchung meldet sich unser Team per WhatsApp bei dir.
        </p>

        <div className="mt-5 flex flex-wrap items-stretch gap-3">
          {frei !== null && (
            <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
              <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/60">Freie Gespräche</div>
              <div className="mt-0.5 text-[26px] font-semibold tracking-tight">
                noch {frei} <span className="text-[16px] font-medium text-white/55">von {GESPRAECHE}</span>
              </div>
            </div>
          )}
        </div>

        {kalenderUrl && (
          <>
            {/* Tegh 09.11.: Calendly zeigt nur die Startzeit, deshalb Dauer und Zeitfenster als Hinweis darüber. */}
            <p className="mt-6 text-[14px] text-white/70">
              Jedes Gespräch dauert {GESPRAECH_MINUTEN} Minuten. Die Uhrzeit im Kalender ist der Beginn, z. B. 14:00 heißt 14:00–14:{GESPRAECH_MINUTEN} Uhr.
            </p>
            <div
              className="calendly-inline-widget mt-3 overflow-hidden rounded-2xl bg-white/5"
              data-url={kalenderUrl}
              style={{ minWidth: 280, height: 700 }}
            />
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
          </>
        )}
      </div>
    </div>
  );
}
