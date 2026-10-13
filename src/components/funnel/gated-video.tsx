"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPEICHER } from "@/lib/funnel";
import { PlayIcon } from "./teile";

/**
 * Das Trainingsvideo mit eigener Steuerung. Gezählt wird nur, was wirklich
 * gelaufen ist: `weitesteStelle` wächst ausschließlich durch normales
 * Abspielen (kleine Schritte zwischen zwei timeupdate-Events). Wer nach vorn
 * spult, landet wieder dort; zurückspulen ist erlaubt. Eine reine
 * currentTime-Prüfung wäre mit einem Sprung ans Ende erledigt.
 */

/** Größter Abstand zwischen zwei timeupdate-Events, der noch als „gelaufen" zählt. */
const MAX_SCHRITT = 1.5;
/** So viel Spielraum beim Vorspulen, damit Rundungen nicht zurückspringen. */
const TOLERANZ = 0.75;
/** Kommt nach dem Klick auf Play so lange kein Bild, gilt das Video als kaputt. */
const RETTUNG_NACH_MS = 30_000;
const MEILENSTEINE = [0.25, 0.5, 0.75, 1] as const;

export type FreiGrund = "frei" | "rettung";

export function ereignis(m: string, sek = 0) {
  try {
    fetch("/api/funnel/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ m, sek: Math.round(sek) }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function zeit(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function GatedVideo({
  src,
  poster,
  schwelle,
  frei,
  onAnteil,
  onFrei,
}: {
  src: string;
  poster?: string;
  schwelle: number;
  frei: boolean;
  onAnteil: (anteil: number) => void;
  onFrei: (grund: FreiGrund) => void;
}) {
  const huelle = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const weitesteStelle = useRef(0);
  const letzteZeit = useRef(0);
  const dauer = useRef(0);
  const gemeldet = useRef(new Set<number>());
  const zuletztGesichert = useRef(0);
  const freiRef = useRef(frei);
  const rettungsUhr = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [gestartet, setGestartet] = useState(false);
  const [spielt, setSpielt] = useState(false);
  const [laedt, setLaedt] = useState(false);
  const [stumm, setStumm] = useState(false);
  const [jetzt, setJetzt] = useState(0);
  const [gesamt, setGesamt] = useState(0);
  const [weiteste, setWeiteste] = useState(0);
  const [kaputt, setKaputt] = useState(false);
  const [hinweis, setHinweis] = useState<string | null>(null);

  useEffect(() => {
    freiRef.current = frei;
  }, [frei]);

  const sichern = useCallback(
    (sofort = false) => {
      const w = weitesteStelle.current;
      if (!sofort && Math.abs(w - zuletztGesichert.current) < 3) return;
      zuletztGesichert.current = w;
      try {
        localStorage.setItem(SPEICHER.position(src), String(Math.floor(w)));
      } catch {}
    },
    [src],
  );

  const auswerten = useCallback(() => {
    const d = dauer.current;
    if (!d) return;
    const anteil = Math.min(weitesteStelle.current / d, 1);
    setWeiteste(weitesteStelle.current);
    onAnteil(anteil);
    for (const m of MEILENSTEINE) {
      if (anteil >= m - 0.005 && !gemeldet.current.has(m)) {
        gemeldet.current.add(m);
        ereignis(String(Math.round(m * 100)), weitesteStelle.current);
      }
    }
    if (anteil >= schwelle && !freiRef.current) {
      freiRef.current = true;
      onFrei("frei");
      setHinweis("✓ Anmeldung freigeschaltet — direkt unter dem Video");
      setTimeout(() => setHinweis(null), 7000);
    }
  }, [onAnteil, onFrei, schwelle]);

  // Rückkehrer: dort weitermachen, wo sie aufgehört haben, und bereits
  // erreichte Meilensteine nicht nochmal melden.
  const metadatenDa = useCallback(() => {
    const v = video.current;
    if (!v) return;
    dauer.current = v.duration;
    setGesamt(v.duration);
    let gespeichert = 0;
    try {
      gespeichert = Number(localStorage.getItem(SPEICHER.position(src))) || 0;
    } catch {}
    if (gespeichert > 0 && gespeichert < v.duration) {
      weitesteStelle.current = gespeichert;
      zuletztGesichert.current = gespeichert;
      for (const m of MEILENSTEINE) if (gespeichert / v.duration >= m - 0.005) gemeldet.current.add(m);
      // Kurz vor dem Ende neu anfangen statt nach drei Sekunden fertig zu sein.
      const start = gespeichert > v.duration - 5 ? 0 : gespeichert;
      v.currentTime = start;
      letzteZeit.current = start;
      setJetzt(start);
    }
    auswerten();
  }, [auswerten, src]);

  const zeitLaeuft = useCallback(() => {
    const v = video.current;
    if (!v) return;
    const t = v.currentTime;
    const schritt = t - letzteZeit.current;
    if (!v.seeking && schritt > 0 && schritt <= MAX_SCHRITT && t > weitesteStelle.current) {
      weitesteStelle.current = t;
    }
    letzteZeit.current = t;
    setJetzt(t);
    if (t > 0 && rettungsUhr.current) {
      clearTimeout(rettungsUhr.current);
      rettungsUhr.current = null;
    }
    auswerten();
    sichern();
  }, [auswerten, sichern]);

  const spult = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.currentTime > weitesteStelle.current + TOLERANZ) {
      v.currentTime = weitesteStelle.current;
      setHinweis("Vorspulen geht leider nicht — das Training wirkt nur am Stück.");
      setTimeout(() => setHinweis(null), 3500);
    }
    letzteZeit.current = v.currentTime;
  }, []);

  const geschwindigkeit = useCallback(() => {
    const v = video.current;
    if (v && v.playbackRate > 1) v.playbackRate = 1;
  }, []);

  const rettung = useCallback(() => {
    setKaputt(true);
    if (!freiRef.current) {
      freiRef.current = true;
      onFrei("rettung");
    }
  }, [onFrei]);

  const umschalten = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) {
      if (!gestartet) {
        setGestartet(true);
        ereignis("start", v.currentTime);
        // Lädt das Video gar nicht erst, bekommt der Besucher die Anmeldung trotzdem.
        rettungsUhr.current = setTimeout(() => {
          if ((video.current?.currentTime ?? 0) === 0) rettung();
        }, RETTUNG_NACH_MS);
      }
      v.play().catch(() => {
        // Autoplay-Sperre mit Ton: stumm nochmal versuchen.
        v.muted = true;
        setStumm(true);
        v.play().catch(() => {});
      });
    } else {
      v.pause();
    }
  }, [gestartet, rettung]);

  // Steht die Dauer schon fest, bevor React die Events anhängt (Cache,
  // schnelles Netz), kommt loadedmetadata nie bei uns an.
  useEffect(() => {
    if ((video.current?.readyState ?? 0) >= 1 && !dauer.current) metadatenDa();
  }, [metadatenDa]);

  useEffect(
    () => () => {
      if (rettungsUhr.current) clearTimeout(rettungsUhr.current);
      sichern(true);
    },
    [sichern],
  );

  // Seite verlassen → Stand sichern, auch mitten im 3-Sekunden-Takt.
  useEffect(() => {
    const weg = () => sichern(true);
    window.addEventListener("pagehide", weg);
    return () => window.removeEventListener("pagehide", weg);
  }, [sichern]);

  function vollbild() {
    const h = huelle.current;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (h?.requestFullscreen) {
      h.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    } else {
      v?.webkitEnterFullscreen?.();
    }
  }

  function ton() {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setStumm(v.muted);
  }

  function taste(e: React.KeyboardEvent) {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      umschalten();
    } else if (e.key === "m") {
      ton();
    } else if (e.key === "f") {
      vollbild();
    }
  }

  const fortsetzen = !gestartet && weiteste > 5 && gesamt > 0;
  const pos = gesamt ? (jetzt / gesamt) * 100 : 0;
  const weit = gesamt ? (weiteste / gesamt) * 100 : 0;

  return (
    <div
      ref={huelle}
      className="cg-video-rahmen group/video aspect-video w-full select-none outline-none"
      tabIndex={0}
      onKeyDown={taste}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        className="absolute inset-0 h-full w-full bg-black object-contain"
        onLoadedMetadata={metadatenDa}
        onTimeUpdate={zeitLaeuft}
        onSeeking={spult}
        onRateChange={geschwindigkeit}
        onPlay={() => setSpielt(true)}
        onPause={() => {
          setSpielt(false);
          sichern(true);
        }}
        onEnded={() => {
          setSpielt(false);
          sichern(true);
        }}
        onWaiting={() => setLaedt(true)}
        onPlaying={() => setLaedt(false)}
        onCanPlay={() => setLaedt(false)}
        onError={rettung}
        onClick={umschalten}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Start / Pause: großer Knopf in der Mitte */}
      {!spielt && !kaputt && (
        <button
          type="button"
          onClick={umschalten}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 text-center backdrop-blur-[2px]"
          aria-label={gestartet || fortsetzen ? "Weiter ansehen" : "Video starten"}
        >
          <span className="cg-play">
            <PlayIcon className="ml-1 h-9 w-9 text-white" />
          </span>
          <span className="text-lg font-semibold md:text-xl">
            {fortsetzen ? `Weiter ansehen ab ${zeit(weiteste)}` : gestartet ? "Weiter ansehen" : "Training starten"}
          </span>
          {!gestartet && <span className="text-sm text-white/60">Ton an — es lohnt sich bis zum Ende.</span>}
        </button>
      )}

      {laedt && spielt && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}

      {kaputt && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-6 text-center">
          <p className="text-lg font-semibold">Das Video lädt gerade nicht.</p>
          <p className="cg-text max-w-sm text-sm">Lade die Seite neu. Die Anmeldung unter dem Video ist für dich schon freigeschaltet.</p>
        </div>
      )}

      {hinweis && (
        <div className="cg-auftauchen pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-2 text-[13px] font-medium backdrop-blur md:text-sm">
          {hinweis}
        </div>
      )}

      {/* Leiste unten — ohne Spulregler, nur Anzeige. */}
      {gestartet && !kaputt && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-8 transition-opacity md:px-4 ${
            spielt ? "opacity-0 group-hover/video:opacity-100 group-focus-within/video:opacity-100" : "opacity-100"
          }`}
        >
          <div className="relative mb-2.5 h-1 overflow-hidden rounded-full bg-white/15">
            <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${weit}%` }} />
            <div className="absolute inset-y-0 left-0 bg-[#ff2e32]" style={{ width: `${pos}%` }} />
          </div>
          <div className="flex items-center gap-3 text-[13px] text-white/85">
            <button type="button" onClick={umschalten} className="grid h-8 w-8 place-items-center" aria-label={spielt ? "Pause" : "Abspielen"}>
              {spielt ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <span className="tabular-nums">
              {zeit(jetzt)} / {zeit(gesamt)}
            </span>
            <span className="flex-1" />
            <button type="button" onClick={ton} className="grid h-8 w-8 place-items-center" aria-label={stumm ? "Ton an" : "Ton aus"}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
                {stumm ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
              </svg>
            </button>
            <button type="button" onClick={vollbild} className="grid h-8 w-8 place-items-center" aria-label="Vollbild">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
