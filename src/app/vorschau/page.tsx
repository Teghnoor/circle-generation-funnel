import Link from "next/link";
import { notFound } from "next/navigation";
import { Marke } from "@/components/funnel/teile";
import Zuruecksetzen from "@/components/funnel/zuruecksetzen";
import { FREISCHALTEN_AB } from "@/lib/funnel";
import { testmodus } from "@/lib/testmodus";

// Testmodus wird pro Anfrage geprüft, nicht beim Build festgeschrieben.
export const dynamic = "force-dynamic";

const ZIEL = Math.round(FREISCHALTEN_AB * 100);

const SEITEN = [
  { href: "/", titel: "1 · Start", text: "Landingpage mit Video-Vorschau. Klick auf das Video oder einen Button öffnet das Opt-in-Fenster." },
  { href: "/video", titel: "2 · Video (gesperrt)", text: `So sieht ein Besucher die Seite: Anmeldung gesperrt bis ${ZIEL} % echter Sehzeit, Vorspulen blockiert.` },
  { href: "/video?ab=0.1", titel: "2 · Video (Schnelltest)", text: "Schaltet schon nach 10 % frei — zum Durchklicken des Ablaufs, ohne das ganze Video zu schauen." },
  { href: "/video?frei=1", titel: "2 · Video (freigeschaltet)", text: "Anmeldeformular sofort sichtbar, so wie nach dem Schauen." },
  { href: "/danke", titel: "3 · Danke", text: "Bestätigung nach der Anmeldung mit den nächsten Schritten." },
];

export default function Vorschau() {
  if (!testmodus()) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Marke />
      <h1 className="cg-h2 mt-8 text-center">Funnel-Vorschau</h1>
      <p className="cg-text mx-auto mt-3 max-w-xl text-center text-[15px]">
        Nur im Testmodus erreichbar (lokal, Vercel-Preview oder FUNNEL_TESTMODUS=1). Hier öffnet sich jede Seite ohne Opt-in.
        Auf Production ohne Testmodus durchlaufen Besucher den normalen Ablauf.
      </p>
      <div className="mt-10 grid gap-3">
        {SEITEN.map((s) => (
          <Link key={s.href} href={s.href} className="cg-karte block p-5 transition-colors hover:border-[#ff2e32]/60">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[17px] font-semibold">{s.titel}</span>
              <span className="font-mono text-[13px] text-[#ff2e32]">{s.href} →</span>
            </div>
            <p className="cg-text mt-1.5 text-[14px]">{s.text}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <Zuruecksetzen />
        <p className="text-[12px] text-white/40">Danach siehst du /video wieder wie ein neuer Besucher (Position und Freischaltung vergessen).</p>
      </div>
    </main>
  );
}
