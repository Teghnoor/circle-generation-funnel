"use client";

import { createElement, useEffect, useRef } from "react";
import { SPEICHER } from "@/lib/funnel";
import { ereignis, type FreiGrund } from "./gated-video";

/**
 * Das Trainingsvideo über Wistia (Teghs Embed). Gezählt wird wie beim eigenen
 * Player nur, was wirklich gelaufen ist: die weiteste Stelle wächst nur in
 * kleinen Schritten beim normalen Abspielen. Vorspulen bringt nichts.
 */

const MAX_SCHRITT = 1.5;
const TAKT_MS = 500;
const MEILENSTEINE = [0.25, 0.5, 0.75, 1] as const;

type WistiaApi = { time: () => number; duration: () => number; state: () => string };
type WistiaEl = HTMLElement & { currentTime?: number; duration?: number; paused?: boolean; state?: string };
type WQ = Array<{ id: string; onReady: (v: WistiaApi) => void }>;

function skript(src: string, modul = false) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  if (modul) s.type = "module";
  document.head.appendChild(s);
}

export default function WistiaVideo({
  mediaId,
  schwelle,
  frei,
  onAnteil,
  onFrei,
}: {
  mediaId: string;
  schwelle: number;
  frei: boolean;
  onAnteil: (anteil: number) => void;
  onFrei: (grund: FreiGrund) => void;
}) {
  const el = useRef<WistiaEl | null>(null);
  const api = useRef<WistiaApi | null>(null);
  const weiteste = useRef(0);
  const letzte = useRef(0);
  const gemeldet = useRef(new Set<number>());
  const gestartet = useRef(false);
  const freiRef = useRef(frei);
  useEffect(() => {
    freiRef.current = frei;
  }, [frei]);

  useEffect(() => {
    skript("https://fast.wistia.com/player.js");
    skript(`https://fast.wistia.com/embed/${mediaId}.js`, true);
    const w = window as unknown as { _wq?: WQ };
    w._wq = w._wq || [];
    w._wq.push({ id: mediaId, onReady: (v) => (api.current = v) });

    const schluessel = SPEICHER.position(`wistia:${mediaId}`);
    try {
      weiteste.current = Number(localStorage.getItem(schluessel)) || 0;
    } catch {}

    const takt = setInterval(() => {
      const a = api.current;
      const e = el.current;
      const t = a ? a.time() : e?.currentTime ?? 0;
      const d = a ? a.duration() : e?.duration ?? 0;
      const laeuft = a ? a.state() === "playing" : e?.state === "playing";
      if (!d || !Number.isFinite(d)) return;
      if (laeuft && !gestartet.current) {
        gestartet.current = true;
        ereignis("start", t);
      }
      const schritt = t - letzte.current;
      if (laeuft && schritt > 0 && schritt <= MAX_SCHRITT && letzte.current <= weiteste.current + MAX_SCHRITT) {
        weiteste.current = Math.max(weiteste.current, t);
        try {
          localStorage.setItem(schluessel, String(Math.floor(weiteste.current)));
        } catch {}
      }
      letzte.current = t;
      const anteil = Math.min(1, weiteste.current / d);
      onAnteil(anteil);
      for (const m of MEILENSTEINE) {
        if (anteil >= m - 0.005 && !gemeldet.current.has(m)) {
          gemeldet.current.add(m);
          ereignis(String(Math.round(m * 100)), weiteste.current);
        }
      }
      if (anteil >= schwelle && !freiRef.current) {
        freiRef.current = true;
        onFrei("frei");
      }
    }, TAKT_MS);
    return () => clearInterval(takt);
  }, [mediaId, schwelle, onAnteil, onFrei]);

  return (
    <div className="cg-video-rahmen w-full overflow-hidden">
      <style>{`wistia-player[media-id='${mediaId}']:not(:defined){background:center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
      {createElement("wistia-player", { ref: el, "media-id": mediaId, aspect: "1.7777777777777777" })}
    </div>
  );
}
