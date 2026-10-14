import { Fuss, Marke, Schritte } from "@/components/funnel/teile";
import { LINKS } from "@/lib/funnel";

/** Ohne Calendly fragt der Lead nur einen Rückruf an — dann passen andere Schritte. */
const NACH_ANFRAGE = [
  { titel: "Handy bereithalten", text: "Innerhalb von 24 Stunden meldet sich jemand aus unserem Team per WhatsApp bei dir." },
  { titel: "Termin festlegen", text: "Gemeinsam sucht ihr einen Termin für dein kostenloses Erstgespräch." },
  { titel: "Erstgespräch", text: "Wir schauen gemeinsam, ob Circle Generation zu dir passt." },
];

const NAECHSTE = [
  { titel: "Postfach checken", text: "Die Terminbestätigung kommt per E-Mail. Schau auch im Spam-Ordner nach." },
  { titel: "WhatsApp vom Team", text: "Vor dem Gespräch meldet sich jemand aus unserem Team per WhatsApp bei dir." },
  { titel: "Erstgespräch", text: "Sei pünktlich und an einem ruhigen Ort. Wir schauen gemeinsam, ob Circle Generation zu dir passt." },
];

export default async function DankeSeite({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const anfrage = (await searchParams).art === "anfrage";
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
            {anfrage ? "Anfrage ist da" : "Dein Erstgespräch steht"} <span aria-hidden>⭕️</span>
          </h1>
          <p className="cg-text mt-4 max-w-xl text-[17px]">
            {anfrage
              ? "Super, wir haben deine Anfrage bekommen. Hier sind deine nächsten Schritte."
              : "Super, dein Termin ist eingetragen. Hier sind deine nächsten Schritte."}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <Schritte schritte={anfrage ? NACH_ANFRAGE : NAECHSTE} />
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
