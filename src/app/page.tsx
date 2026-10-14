import { HerkunftMerken, OptinAusloeser } from "@/components/funnel/optin";
import {
  Abschnitt,
  Beweise,
  Faq,
  Fuss,
  Leiste,
  Marke,
  NurFuerDich,
  Reise,
  Schritte,
  SoFunktioniert,
  Tag,
  VideoStimmen,
  Zahlen,
} from "@/components/funnel/teile";
import { FREISCHALTEN_AB, GESPRAECHE, VIDEO_LAENGE, VIDEO_POSTER } from "@/lib/funnel";

const SCHRITTE = [
  { titel: "Trag dich ein", text: "Vorname und E-Mail. Mehr brauchen wir nicht, um dir das Training freizuschalten." },
  {
    titel: "Schau das Training",
    text: `Nimm dir die Zeit. Ab ${Math.round(FREISCHALTEN_AB * 100)} % des Videos kannst du dein Erstgespräch buchen.`,
  },
  {
    titel: "Buch dein Erstgespräch",
    text: `Kostenlos und persönlich. Aktuell sind nur ${GESPRAECHE} Gespräche frei.`,
  },
];

export default function StartSeite() {
  return (
    <main className="pb-24 md:pb-0">
      <HerkunftMerken />
      <Leiste>Kostenloses Training · aktuell nur {GESPRAECHE} Erstgespräche frei</Leiste>

      <section className="relative px-4 pb-10 pt-8 md:pb-16 md:pt-12">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Marke />
          <div className="mt-7 md:mt-9">
            <Tag>Kostenloses Training{VIDEO_LAENGE ? ` · ca. ${VIDEO_LAENGE}` : ""}</Tag>
          </div>
          <h1 className="cg-h1 mt-5 max-w-4xl">
            Wie junge Leute mit <span className="cg-rot">fertigen Videos</span> und unserem Vertriebsteam ihr erstes Geld
            online verdienen.
          </h1>
          <p className="cg-text mt-5 max-w-2xl text-[17px] md:text-[19px]">
            Ohne Gesicht, ohne Vorwissen. Schau dir das kostenlose Training an.
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

      <Zahlen />

      <Abschnitt tag="Was ist Circle Generation" titel={<>Vom Video bis zur <span className="cg-rot">Provision</span></>}>
        <SoFunktioniert />
      </Abschnitt>

      <Abschnitt tag="So läuft's" titel="In drei Schritten zu deinem Erstgespräch">
        <Schritte schritte={SCHRITTE} />
      </Abschnitt>

      <Abschnitt id="stimmen" tag="Echte Ergebnisse" titel="Das sagen die, die es schon machen">
        <VideoStimmen />
      </Abschnitt>

      <Abschnitt tag="Vorher → heute" titel="Jeder hat mal klein angefangen">
        <Reise />
        <Beweise />
        <p className="mt-6 text-center text-[12px] text-white/40">
          Echte Auszahlungen. Ergebnisse sind nicht garantiert und hängen von deinem Einsatz ab.
        </p>
      </Abschnitt>

      <Abschnitt tag="Für wen" titel={<>Circle Generation <span aria-hidden>⭕️</span> ist für dich, wenn …</>}>
        <NurFuerDich />
      </Abschnitt>

      <Faq />

      <section className="px-4 pb-20 pt-4 text-center">
        <h2 className="cg-h2 mx-auto max-w-2xl">Bereit? Das Training wartet auf dich.</h2>
        <div className="mt-8">
          <OptinAusloeser>JETZT GRATIS ANSCHAUEN ⭕️</OptinAusloeser>
        </div>
      </section>

      <Fuss />
      <OptinAusloeser art="leiste">Training kostenlos ansehen ⭕️</OptinAusloeser>
    </main>
  );
}
