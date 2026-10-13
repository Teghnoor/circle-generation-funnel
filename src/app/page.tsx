import { OptinAusloeser } from "@/components/funnel/optin";
import { Abschnitt, Faq, Fuss, Leiste, Marke, NurFuerDich, Saeulen, Schritte, Stimmen, Tag } from "@/components/funnel/teile";
import { FREISCHALTEN_AB, VIDEO_LAENGE, VIDEO_POSTER } from "@/lib/funnel";

const SCHRITTE = [
  { titel: "Trag dich ein", text: "Vorname und E-Mail — mehr brauchen wir nicht, um dir das Training freizuschalten." },
  {
    titel: "Schau das Training",
    text: `Nimm dir die Zeit. Ab ${Math.round(FREISCHALTEN_AB * 100)} % des Videos wird die Anmeldung für dich freigeschaltet.`,
  },
  { titel: "Melde dich an", text: "Sichere dir einen der begrenzten Plätze im Videokurs und in der Community." },
];

export default function StartSeite() {
  return (
    <main>
      <Leiste>⚠️ Achtung: Dieses kostenlose Training ist nur für kurze Zeit online.</Leiste>

      <section className="relative px-4 pb-10 pt-8 md:pb-16 md:pt-12">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Marke />
          <div className="mt-8 md:mt-10">
            <Tag>Kostenloses Videotraining{VIDEO_LAENGE ? ` · ${VIDEO_LAENGE}` : ""}</Tag>
          </div>
          <h1 className="cg-h1 mt-5 max-w-4xl">
            Circle Generation <span aria-hidden>⭕️</span> – die Community, die dich{" "}
            <span className="cg-rot">wirklich nach vorne</span> bringt.
          </h1>
          <p className="cg-text mt-5 max-w-2xl text-[17px] md:text-[19px]">
            Schau dir das kostenlose Training an und finde heraus, wie das System funktioniert, für wen es gemacht ist — und
            wie du dir einen der begrenzten Plätze sicherst.
          </p>

          <div className="mt-8 w-full max-w-4xl md:mt-12">
            <OptinAusloeser art="video" poster={VIDEO_POSTER} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <OptinAusloeser>JETZT GRATIS ANSCHAUEN ⭕️</OptinAusloeser>
            <p className="text-[13px] text-white/50">Nur 100 Plätze · Persönlicher Ansprechpartner · Ohne Vorwissen</p>
          </div>
        </div>
      </section>

      <Abschnitt tag="So läuft's" titel={<>In drei Schritten zu Circle Generation <span aria-hidden>⭕️</span></>}>
        <Schritte schritte={SCHRITTE} />
      </Abschnitt>

      <Abschnitt tag="Für wen" titel={<>Circle Generation <span aria-hidden>⭕️</span> ist nur für dich, wenn …</>}>
        <NurFuerDich />
      </Abschnitt>

      <Abschnitt tag="Community" titel={<>Kein Kurs von der Stange. <span className="cg-rot">Ein Umfeld, das dich mitzieht.</span></>}>
        <Saeulen />
      </Abschnitt>

      <Stimmen />
      <Faq />

      <section className="px-4 pb-20 pt-4 text-center">
        <h2 className="cg-h2 mx-auto max-w-2xl">Bereit? Das Training wartet auf dich.</h2>
        <div className="mt-8">
          <OptinAusloeser>JETZT GRATIS ANSCHAUEN ⭕️</OptinAusloeser>
        </div>
      </section>

      <Fuss />
    </main>
  );
}
