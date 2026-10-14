"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CALENDLY_URL, SPEICHER } from "@/lib/funnel";
import { pixel } from "@/lib/pixel";
import GatedVideo, { ereignis, type FreiGrund } from "./gated-video";
import { Haken, Schloss } from "./teile";
import Termin from "./termin";

function lesen(k: string): string {
  try {
    return localStorage.getItem(k) || "";
  } catch {
    return "";
  }
}

/**
 * Video + Fortschritt + Anmeldung. Der Zustand „frei" lebt hier, weil das
 * Video ihn auslöst und die Karte darunter davon abhängt.
 */
export default function VideoFunnel({
  src,
  poster,
  schwelle,
  vorname: vornameServer,
  email: emailServer,
  startFrei = false,
}: {
  src: string;
  poster?: string;
  schwelle: number;
  vorname: string;
  email: string;
  /** Testmodus (`/video?frei=1`): Anmeldung sofort sichtbar. */
  startFrei?: boolean;
}) {
  const [frei, setFrei] = useState(startFrei);
  const [anteil, setAnteil] = useState(0);
  // Beginn des 48-Stunden-Fensters. Erst im Browser bekannt, deshalb rendert der Termin-Block erst danach.
  const [freiSeit, setFreiSeit] = useState<number | null>(null);
  const [kontakt, setKontakt] = useState({ vorname: vornameServer, email: emailServer });

  // Wer schon freigeschaltet war, muss nicht nochmal 80 % schauen.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (lesen(SPEICHER.frei) === "1") setFrei(true);
    setKontakt((m) => ({ vorname: m.vorname || lesen(SPEICHER.vorname), email: m.email || lesen(SPEICHER.email) }));
  }, []);

  useEffect(() => {
    if (!frei) return;
    let seit = Number(lesen(SPEICHER.freiSeit));
    if (!seit || startFrei) {
      seit = Date.now();
      try {
        localStorage.setItem(SPEICHER.freiSeit, String(seit));
      } catch {}
    }
    setFreiSeit(seit);
  }, [frei, startFrei]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const freischalten = useCallback((grund: FreiGrund) => {
    setFrei(true);
    try {
      localStorage.setItem(SPEICHER.frei, "1");
    } catch {}
    ereignis(grund);
    pixel("freigeschaltet");
  }, []);

  const prozent = Math.round(anteil * 100);
  const ziel = Math.round(schwelle * 100);

  return (
    <>
      <GatedVideo src={src} poster={poster} schwelle={schwelle} frei={frei} onAnteil={setAnteil} onFrei={freischalten} />

      <div className="mx-auto mt-5 w-full max-w-3xl" aria-live="polite">
        <div className="mb-2 flex items-center justify-between text-[13px] md:text-sm">
          <span className="font-medium">
            Dein Fortschritt: <span className="tabular-nums">{prozent} %</span>
          </span>
          <span className={frei ? "font-medium text-[#ff2e32]" : "text-white/55"}>
            {frei ? "✓ Erstgespräch freigeschaltet" : `Noch ${Math.max(ziel - prozent, 0)} % bis zur Freischaltung`}
          </span>
        </div>
        <div className="cg-fortschritt">
          <div className="cg-fuellung" style={{ width: `${frei ? Math.max(prozent, ziel) : prozent}%` }} />
          <div className="cg-marke" style={{ left: `${ziel}%` }} title={`${ziel} %`} />
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-3xl md:mt-10">
        {!frei ? (
          <Gesperrt ziel={ziel} prozent={prozent} />
        ) : CALENDLY_URL ? (
          freiSeit !== null && <Termin vorname={kontakt.vorname} email={kontakt.email} freiSeit={freiSeit} />
        ) : (
          <Anmeldung vornameServer={vornameServer} emailServer={emailServer} anteil={anteil} />
        )}
      </div>

      {frei && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/85 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
          <a href={CALENDLY_URL ? "#termin" : "#anmeldung"} className="cg-btn w-full py-3.5 text-[16px]">
            Jetzt Erstgespräch buchen ⭕️
          </a>
        </div>
      )}
    </>
  );
}

function Gesperrt({ ziel, prozent }: { ziel: number; prozent: number }) {
  return (
    <div className="cg-karte cg-gesperrt p-6 md:p-8">
      <div className="cg-unscharf" aria-hidden>
        <div className="mb-4 h-7 w-2/3 rounded-lg bg-white/20" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-12 rounded-xl bg-white/10" />
          <div className="h-12 rounded-xl bg-white/10" />
          <div className="h-12 rounded-xl bg-white/10" />
          <div className="h-12 rounded-xl bg-white/10" />
        </div>
        <div className="mt-4 h-14 rounded-full bg-[#ff2e32]/40" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-black/60">
          <Schloss className="h-6 w-6 text-[#ff2e32]" />
        </span>
        <p className="text-[19px] font-semibold tracking-[-0.02em] md:text-[22px]">
          Der Button erscheint, sobald du das Training geschaut hast.
        </p>
        <p className="cg-text max-w-md text-[15px]">
          Ab {ziel} % kannst du hier dein kostenloses Erstgespräch buchen.
          {prozent > 0 && <span className="text-white/80"> Du hast schon {prozent} % geschafft.</span>}
        </p>
      </div>
    </div>
  );
}

function Anmeldung({
  vornameServer,
  emailServer,
  anteil,
}: {
  vornameServer: string;
  emailServer: string;
  anteil: number;
}) {
  const router = useRouter();
  const [vorname, setVorname] = useState(vornameServer);
  const [email, setEmail] = useState(emailServer);
  const [telefon, setTelefon] = useState("");
  const [instagram, setInstagram] = useState("");
  const [ziel, setZiel] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!vornameServer) setVorname(lesen(SPEICHER.vorname));
    if (!emailServer) setEmail(lesen(SPEICHER.email));
  }, [vornameServer, emailServer]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function absenden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (laeuft) return;
    setFehler(null);
    setLaeuft(true);
    const firma = new FormData(e.currentTarget).get("firma");
    try {
      const r = await fetch("/api/funnel/anmeldung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vorname, email, telefon, instagram, ziel, firma, sehquote: anteil }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "Das hat nicht geklappt. Versuch es bitte nochmal.");
      router.push("/danke?art=anfrage");
    } catch (err) {
      setFehler(err instanceof Error ? err.message : "Das hat nicht geklappt.");
      setLaeuft(false);
    }
  }

  return (
    <div id="anmeldung" className="cg-karte cg-auftauchen relative overflow-hidden p-6 md:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ff2e32]/20 blur-3xl" />
      <div className="relative">
        <span className="cg-tag">
          <span className="cg-tag-punkt" /> Freigeschaltet
        </span>
        <h2 className="mt-4 text-[26px] font-semibold leading-tight tracking-[-0.035em] md:text-[34px]">
          Sichere dir dein kostenloses Erstgespräch <span aria-hidden>⭕️</span>
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-[15px] text-white/80">
          <li className="flex gap-2.5"><Haken /> Persönliches Gespräch mit unserem Team</li>
          <li className="flex gap-2.5"><Haken /> Wir zeigen dir, wie du mit fertigen Videos startest</li>
          <li className="flex gap-2.5"><Haken /> Kostenlos und unverbindlich, wir melden uns per WhatsApp</li>
        </ul>

        <form onSubmit={absenden} className="mt-7 grid gap-3 sm:grid-cols-2" noValidate>
          <input className="cg-eingabe" placeholder="Vorname" autoComplete="given-name" value={vorname} onChange={(e) => setVorname(e.target.value)} maxLength={40} required />
          <input className="cg-eingabe" type="email" inputMode="email" placeholder="E-Mail-Adresse" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} required />
          <input className="cg-eingabe" type="tel" inputMode="tel" placeholder="Handynummer (WhatsApp)" autoComplete="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} maxLength={30} required />
          <input className="cg-eingabe" placeholder="Instagram (optional)" autoComplete="off" value={instagram} onChange={(e) => setInstagram(e.target.value)} maxLength={60} />
          <textarea
            className="cg-eingabe min-h-[96px] resize-y sm:col-span-2"
            placeholder="Warum willst du Teil von Circle Generation werden? (optional)"
            value={ziel}
            onChange={(e) => setZiel(e.target.value)}
            maxLength={600}
          />
          <input name="firma" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          {fehler && <p className="rounded-xl bg-[#ff2e32]/10 px-3 py-2 text-[14px] text-[#ff7a7c] sm:col-span-2">{fehler}</p>}

          <button type="submit" className="cg-btn mt-2 w-full sm:col-span-2" disabled={laeuft}>
            {laeuft ? "Wird gesendet …" : "ERSTGESPRÄCH ANFRAGEN ⭕️"}
          </button>
          <p className="text-center text-[12px] text-white/40 sm:col-span-2">
            Kostenlos und unverbindlich. Wir melden uns innerhalb von 24 Stunden per WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}
