"use client";

import { useEffect, useState } from "react";
import { Marke } from "./teile";
import { WEITER_COOKIE, WEITER_PARAMETER, chromeIntent, zielOhneWeiter, type App, type System } from "@/lib/im-app-browser";

function melden(m: string, app: App) {
  try {
    const body = JSON.stringify({ m, app });
    if (!navigator.sendBeacon?.("/api/funnel/event", new Blob([body], { type: "application/json" }))) {
      fetch("/api/funnel/event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {}
}

async function kopieren(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Ältere WebViews: über ein unsichtbares Textfeld.
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      t.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      t.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const VERSUCHT = "cg_intent_versucht";

export function ImBrowserHinweis({ app, system, punkt, zeichen }: { app: App; system: System; punkt: string; zeichen: string }) {
  // Bei „fehler“ steht hier der Link zum Markieren.
  const [kopiert, setKopiert] = useState<{ status: "" | "ok" | "fehler"; text?: string }>({ status: "" });
  const ziel = () => zielOhneWeiter(window.location.href);

  useEffect(() => {
    const z = zielOhneWeiter(window.location.href);
    melden("inapp_hinweis", app);
    // Android: einmal pro Sitzung automatisch Chrome öffnen. Kein Rückfall-Link
    // im Intent, sonst lädt die App dieselbe Seite und es kreist.
    if (system === "android") {
      try {
        if (!sessionStorage.getItem(VERSUCHT)) {
          sessionStorage.setItem(VERSUCHT, "1");
          const i = chromeIntent(z);
          if (i) window.location.href = i;
        }
      } catch {}
    }
  }, [app, system]);

  function imBrowserOeffnen() {
    const i = chromeIntent(ziel());
    if (i) window.location.href = i;
  }

  async function linkKopieren() {
    const text = ziel();
    const ok = await kopieren(text);
    setKopiert(ok ? { status: "ok" } : { status: "fehler", text });
  }

  function trotzdemWeiter() {
    melden("inapp_weiter", app);
    try {
      document.cookie = `${WEITER_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
    } catch {}
    const u = new URL(ziel());
    u.searchParams.set(WEITER_PARAMETER, "1");
    window.location.replace(u.toString());
  }

  const browser = system === "android" ? "Chrome" : system === "ios" ? "Safari" : "deinem Browser";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden px-5 pb-10 pt-6">
      <div className="cg-schein" />

      {/* Pfeil oben rechts auf das Menü der App */}
      <div className="cg-pfeil pointer-events-none absolute right-3 top-2 z-10" aria-hidden>
        <svg viewBox="0 0 120 120" className="h-24 w-24">
          <path d="M18 104 C 40 70, 62 52, 96 26" fill="none" stroke="#ff2e32" strokeWidth="7" strokeLinecap="round" />
          <path d="M70 22 L 100 22 L 100 52" fill="none" stroke="#ff2e32" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-md flex-col items-center pt-16 text-center">
        <Marke klein />
        <h1 className="cg-h2 mt-8">Fast geschafft.</h1>
        <p className="cg-text mt-3 text-[17px]">
          Öffne den Link in {system === "andere" ? "deinem Browser" : browser}, damit das Training sauber läuft.
        </p>

        <ol className="cg-karte mt-8 w-full space-y-4 p-5 text-left">
          <li className="flex items-center gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ff2e32] text-[16px] font-semibold">1</span>
            <span className="text-[17px] leading-snug">
              Tippe oben rechts auf{" "}
              <span className="ml-1 inline-flex min-w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 font-bold tracking-wider">
                {zeichen}
              </span>
            </span>
          </li>
          <li className="flex items-center gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ff2e32] text-[16px] font-semibold">2</span>
            <span className="text-[17px] leading-snug">
              Wähle <span className="font-semibold">„{punkt}“</span>
            </span>
          </li>
        </ol>

        {system === "android" && (
          <button type="button" onClick={imBrowserOeffnen} className="cg-btn mt-7 w-full">
            Im Browser öffnen
          </button>
        )}
        {/* Auch unter Android: ohne Chrome oder wenn die App den Intent blockt, bleibt Kopieren. */}
        <p className="cg-text mt-7 text-[14px]">Klappt nicht? Link kopieren und in {browser} einfügen.</p>
        <button
          type="button"
          onClick={linkKopieren}
          className={system === "android" ? "mt-3 w-full rounded-full border border-white/20 px-6 py-3.5 text-[16px] font-semibold" : "cg-btn mt-3 w-full"}
        >
          {kopiert.status === "ok" ? "Link kopiert ✓" : "Link kopieren"}
        </button>
        {kopiert.status === "fehler" && kopiert.text && (
          <p className="mt-3 w-full select-all break-all rounded-xl bg-white/5 p-3 text-[13px] text-white/70">{kopiert.text}</p>
        )}

        <button type="button" onClick={trotzdemWeiter} className="mt-10 text-[13px] text-white/40 underline underline-offset-4">
          Trotzdem hier weiter
        </button>
      </div>
    </main>
  );
}
