import { HerkunftMerken, OptinAusloeser } from "@/components/funnel/optin";
import {
  Abschnitt,
  Fuss,
  Leiste,
  Marke,
  Umsaetze,
} from "@/components/funnel/teile";
import { GESPRAECHE, VIDEO_LAENGE, VIDEO_POSTER } from "@/lib/funnel";

export default function StartSeite() {
  return (
    <main className="pb-24 md:pb-0">
      <HerkunftMerken />
      <Leiste>Kostenloses Training · aktuell nur {GESPRAECHE} Erstgespräche frei</Leiste>

      <section className="relative px-4 pb-10 pt-8 md:pb-16 md:pt-12">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Marke />
          <h1 className="cg-h1 mt-7 max-w-4xl md:mt-9">
            Schau dir das <span className="cg-rot">kostenlose Videotraining</span>
            {VIDEO_LAENGE ? ` (${VIDEO_LAENGE})` : ""} jetzt an.
          </h1>
          <p className="cg-text mt-5 max-w-2xl text-[17px] md:text-[19px]">
            Wie junge Leute mit fertigen Videos und unserem Vertriebsteam ihr erstes Geld online verdienen. Ohne Gesicht, ohne Vorwissen.
          </p>

          <div className="mt-8 w-full max-w-4xl md:mt-12">
            <OptinAusloeser art="video" poster={VIDEO_POSTER} />
          </div>

          <div className="mt-8 hidden flex-col items-center gap-3 md:flex">
            <OptinAusloeser>JETZT GRATIS ANSCHAUEN ⭕️</OptinAusloeser>
          </div>
          <p className="mt-4 text-[13px] text-white/50">Kostenlos · Ohne Gesicht · Ohne Vorwissen</p>
        </div>
      </section>

      <Abschnitt tag="Echte Umsätze" titel="Allein im Oktober">
        <Umsaetze />
        <p className="mt-6 text-center text-[12px] text-white/40">
          Echte Screenshots, Kundendaten unkenntlich. Ergebnisse sind nicht garantiert und variieren individuell.
        </p>
      </Abschnitt>

      <section className="px-4 pb-20 pt-4 text-center">
        <div className="mt-4">
          <OptinAusloeser>JETZT GRATIS ANSCHAUEN ⭕️</OptinAusloeser>
        </div>
      </section>

      <Fuss />
      <OptinAusloeser art="leiste">Training kostenlos ansehen ⭕️</OptinAusloeser>
    </main>
  );
}
