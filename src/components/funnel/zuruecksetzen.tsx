"use client";

import { useState } from "react";

/** Löscht Fortschritt, Freischaltung und gemerkte Daten — wie ein neuer Besucher. */
export default function Zuruecksetzen() {
  const [fertig, setFertig] = useState(false);
  function los() {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith("cg_")) localStorage.removeItem(k);
    } catch {}
    setFertig(true);
  }
  return (
    <button type="button" onClick={los} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/80 hover:text-white">
      {fertig ? "✓ Zurückgesetzt" : "Meinen Fortschritt zurücksetzen"}
    </button>
  );
}
