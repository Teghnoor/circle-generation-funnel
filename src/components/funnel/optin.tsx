"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LINKS, SPEICHER } from "@/lib/funnel";
import { PlayIcon } from "./teile";

function speichern(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {}
}

/** UTM-Parameter der Anzeige mitschicken, damit das E-Mail-Tool die Quelle kennt. */
function utmLesen(): Record<string, string> {
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [k, v] of p) if (k.startsWith("utm_") || k === "fbclid" || k === "gclid" || k === "ttclid") utm[k] = v;
  return utm;
}

/**
 * Alles, was auf der Startseite das Opt-in-Fenster öffnet. `art="video"` ist die
 * Vorschau mit Play-Knopf, sonst ein normaler Button.
 */
export function OptinAusloeser({
  art = "knopf",
  children,
  poster,
}: {
  art?: "knopf" | "video";
  children?: React.ReactNode;
  poster?: string;
}) {
  const [offen, setOffen] = useState(false);
  // Stabil, sonst fängt der Effekt im Fenster bei jedem Tastendruck neu an und klaut den Fokus.
  const schliessen = useCallback(() => setOffen(false), []);
  return (
    <>
      {art === "video" ? (
        <button
          type="button"
          onClick={() => setOffen(true)}
          className="cg-video-rahmen group block aspect-video w-full cursor-pointer text-left"
          aria-label="Video starten"
        >
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <span className="cg-play transition-transform group-hover:scale-105">
              <PlayIcon className="ml-1 h-9 w-9 text-white" />
            </span>
            <span className="text-lg font-semibold md:text-xl">Video starten</span>
            <span className="text-sm text-white/60">Klicke hier, um das kostenlose Training zu starten</span>
          </div>
        </button>
      ) : (
        <button type="button" onClick={() => setOffen(true)} className="cg-btn">
          {children}
        </button>
      )}
      {offen && <OptinFenster schliessen={schliessen} />}
    </>
  );
}

function OptinFenster({ schliessen }: { schliessen: () => void }) {
  const router = useRouter();
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const ersterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ersterRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    window.addEventListener("keydown", esc);
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = alt;
    };
  }, [schliessen]);

  async function absenden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (laeuft) return;
    setFehler(null);
    if (!ok) {
      setFehler("Bitte bestätige kurz die Einwilligung.");
      return;
    }
    setLaeuft(true);
    const firma = new FormData(e.currentTarget).get("firma");
    try {
      const r = await fetch("/api/funnel/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vorname,
          email,
          einwilligung: ok,
          firma,
          utm: utmLesen(),
          quelle: document.referrer || null,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "Das hat nicht geklappt. Versuch es bitte nochmal.");
      speichern(SPEICHER.vorname, vorname.trim());
      speichern(SPEICHER.email, email.trim());
      router.push("/video");
    } catch (err) {
      setFehler(err instanceof Error ? err.message : "Das hat nicht geklappt.");
      setLaeuft(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={schliessen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="optin-titel"
    >
      <div
        className="cg-karte cg-auftauchen relative w-full max-w-md rounded-b-none p-6 sm:rounded-b-[20px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={schliessen}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white"
          aria-label="Schließen"
        >
          ✕
        </button>

        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[var(--cg-rot)]">
            <span className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-1/2 rounded-full bg-[var(--cg-rot)]" />
            </span>
            Schritt 1 von 2
          </div>
          <h2 id="optin-titel" className="text-[24px] font-semibold tracking-[-0.03em]">
            Fast geschafft! Letzter Schritt …
          </h2>
          <p className="cg-text mt-1 text-[15px]">Wohin dürfen wir dir den Zugang zum Training schicken?</p>
        </div>

        <form onSubmit={absenden} className="flex flex-col gap-3" noValidate>
          <input
            ref={ersterRef}
            className="cg-eingabe"
            placeholder="Dein Vorname"
            autoComplete="given-name"
            value={vorname}
            onChange={(e) => setVorname(e.target.value)}
            maxLength={40}
            required
          />
          <input
            className="cg-eingabe"
            type="email"
            inputMode="email"
            placeholder="Deine beste E-Mail-Adresse"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            required
          />
          {/* Honeypot — für Menschen unsichtbar. */}
          <input name="firma" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          <label className="mt-1 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-white/65">
            <input
              type="checkbox"
              checked={ok}
              onChange={(e) => setOk(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff2e32]"
            />
            <span>
              Ich möchte das kostenlose Training und weitere Infos zu Circle Generation per E-Mail erhalten. Abmeldung
              jederzeit möglich. Es gilt die{" "}
              <a href={LINKS.datenschutz} target="_blank" rel="noreferrer" className="underline hover:text-white">
                Datenschutzerklärung
              </a>
              .
            </span>
          </label>

          {fehler && <p className="rounded-xl bg-[#ff2e32]/10 px-3 py-2 text-[14px] text-[#ff7a7c]">{fehler}</p>}

          <button type="submit" className="cg-btn mt-2 w-full" disabled={laeuft}>
            {laeuft ? "Wird freigeschaltet …" : "JETZT GRATIS ANSCHAUEN ⭕️"}
          </button>
          <p className="text-center text-[12px] text-white/40">🔒 Kein Spam. Deine Daten bleiben bei uns.</p>
        </form>
      </div>
    </div>
  );
}
