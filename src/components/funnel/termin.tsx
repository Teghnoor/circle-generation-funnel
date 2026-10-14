"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { BUCHUNGSFENSTER_STUNDEN, CALENDLY_URL, GESPRAECHE, LINKS, SPEICHER } from "@/lib/funnel";
import { pixel } from "@/lib/pixel";
import { ereignis } from "./gated-video";

function zweistellig(n: number) {
  return n.toString().padStart(2, "0");
}

function herkunft(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SPEICHER.herkunft) || "{}");
  } catch {
    return {};
  }
}

/**
 * Nach der Freischaltung: Calendly zum Buchen des Erstgesprächs, ein
 * Countdown für das 48-Stunden-Fenster und — nur wenn die Zahl live aus
 * Calendly kommt — „noch X von 17 Gesprächen frei".
 */
export default function Termin({ vorname, email, freiSeit }: { vorname: string; email: string; freiSeit: number }) {
  const router = useRouter();
  const ende = freiSeit + BUCHUNGSFENSTER_STUNDEN * 3_600_000;
  const [jetzt, setJetzt] = useState(() => Date.now());
  const [frei, setFrei] = useState<number | null>(null);

  useEffect(() => {
    const uhr = setInterval(() => setJetzt(Date.now()), 1000);
    return () => clearInterval(uhr);
  }, []);

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
    return u.toString();
    // vorname/email reichen; die Herkunft ändert sich auf dieser Seite nicht.
  }, [vorname, email]);

  const rest = Math.max(ende - jetzt, 0);
  const abgelaufen = rest === 0;
  const h = Math.floor(rest / 3_600_000);
  const m = Math.floor((rest % 3_600_000) / 60_000);
  const s = Math.floor((rest % 60_000) / 1000);

  if (abgelaufen) {
    return (
      <div id="termin" className="cg-karte p-6 text-center md:p-9">
        <p className="text-[22px] font-semibold tracking-[-0.03em]">Dein Zeitfenster ist abgelaufen</p>
        <p className="cg-text mx-auto mt-2 max-w-md text-[15px]">
          Die {BUCHUNGSFENSTER_STUNDEN} Stunden für dein Erstgespräch sind vorbei. Schreib uns auf{" "}
          <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="underline">
            Instagram
          </a>
          , falls du trotzdem noch einen Termin möchtest.
        </p>
      </div>
    );
  }

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
          Du hast nur diese eine Chance: Das Zeitfenster gilt {BUCHUNGSFENSTER_STUNDEN} Stunden ab jetzt. Nach der Buchung
          meldet sich unser Team per WhatsApp bei dir.
        </p>

        <div className="mt-5 flex flex-wrap items-stretch gap-3">
          <div className="rounded-2xl border border-[#ff2e32]/40 bg-[#ff2e32]/10 px-4 py-3" aria-live="off">
            <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/60">Zeitfenster endet in</div>
            <div className="mt-0.5 font-mono text-[26px] font-semibold tabular-nums tracking-tight text-white">
              {zweistellig(h)}:{zweistellig(m)}:{zweistellig(s)}
            </div>
          </div>
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
            <div
              className="calendly-inline-widget mt-6 overflow-hidden rounded-2xl bg-white/5"
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
