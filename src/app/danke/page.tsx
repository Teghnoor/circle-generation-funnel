import { Fuss, Marke, Schritte } from "@/components/funnel/teile";
import { LINKS } from "@/lib/funnel";

const NAECHSTE = [
  { titel: "Postfach checken", text: "Du bekommst gleich eine Bestätigung per E-Mail. Schau auch im Spam-Ordner nach." },
  { titel: "Wir melden uns", text: "Innerhalb von 24 Stunden meldet sich jemand aus dem Team per WhatsApp bei dir." },
  { titel: "Start in der Community", text: "Nach dem kurzen Gespräch bekommst du Zugang zum Videokurs und zu den Live-Calls." },
];

export default function DankeSeite() {
  return (
    <main>
      <section className="relative px-4 pb-6 pt-10 md:pt-14">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Marke />
          <div className="cg-auftauchen mt-10 grid h-20 w-20 place-items-center rounded-full border border-[#ff2e32]/40 bg-[#ff2e32]/10 shadow-[0_0_60px_-10px_rgba(255,46,50,0.6)]">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#ff2e32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h1 className="cg-h1 mt-7">
            Du bist dabei <span aria-hidden>⭕️</span>
          </h1>
          <p className="cg-text mt-4 max-w-xl text-[17px]">
            Deine Anmeldung ist eingegangen. Ab jetzt geht es nur noch nach vorne — hier sind deine nächsten Schritte.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <Schritte schritte={NAECHSTE} />
        <div className="mt-10 text-center">
          <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="cg-btn">
            Folge uns auf Instagram
          </a>
        </div>
      </section>

      <Fuss />
    </main>
  );
}
