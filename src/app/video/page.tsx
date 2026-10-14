import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VideoFunnel from "@/components/funnel/video-funnel";
import { Abschnitt, Faq, Fuss, Leiste, Marke, NurFuerDich, SoFunktioniert, VideoStimmen } from "@/components/funnel/teile";
import { FREISCHALTEN_AB, GESPRAECHE, LEAD_COOKIE, VIDEO_POSTER, VIDEO_URL } from "@/lib/funnel";
import { cookieLesen } from "@/lib/funnel-leads";
import { testmodus } from "@/lib/testmodus";

/** Schwelle zum Testen überschreiben (`/video?ab=0.05`) — nur im Testmodus. */
function schwelleAus(ab: string | string[] | undefined, test: boolean): number {
  const n = Number(Array.isArray(ab) ? ab[0] : ab);
  return test && n > 0 && n <= 1 ? n : FREISCHALTEN_AB;
}

export default async function VideoSeite({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const test = testmodus();
  // Im Testmodus geht die Seite auch ohne Opt-in auf.
  const lead = cookieLesen((await cookies()).get(LEAD_COOKIE)?.value) ?? (test ? { id: "", vorname: "", email: "" } : null);
  // Ohne Opt-in kein Training — zurück zum Eintragen.
  if (!lead) redirect("/");

  const schwelle = schwelleAus(params.ab, test);
  const ziel = Math.round(schwelle * 100);
  const startFrei = test && params.frei === "1";

  return (
    <main className="pb-24 md:pb-0">
      {test && (
        <Link href="/vorschau" className="block bg-white px-4 py-1.5 text-center text-[12px] font-medium text-black">
          Testmodus · {startFrei ? "Erstgespräch freigeschaltet" : `Schwelle ${ziel} %`} · alle Seiten →
        </Link>
      )}
      <Leiste>Schau das Training bis zum Ende · danach kannst du eins von {GESPRAECHE} Erstgesprächen buchen</Leiste>

      <section className="relative px-4 pb-6 pt-7 md:pt-10">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Marke />
          <h1 className="cg-h1 mt-7 max-w-4xl md:mt-9">
            {lead.vorname ? `${lead.vorname}, dein` : "Dein"} Training ist <span className="cg-rot">bereit</span>.
          </h1>
          <p className="cg-text mt-4 max-w-2xl text-[16px] md:text-[18px]">
            Nimm dir die Zeit, schalte den Ton an und schau bis zum Schluss. Danach weißt du genau, wie Circle Generation{" "}
            <span aria-hidden>⭕️</span> funktioniert und ob es zu dir passt.
          </p>

          <div className="mt-8 w-full max-w-4xl md:mt-10">
            <VideoFunnel src={VIDEO_URL} poster={VIDEO_POSTER} schwelle={schwelle} vorname={lead.vorname} email={lead.email} startFrei={startFrei} />
          </div>

          <p className="mt-12 text-[15px] font-medium text-white/40 md:text-lg">↓ Das erwartet dich in Circle Generation ↓</p>
        </div>
      </section>

      <Abschnitt tag="Was ist Circle Generation" titel={<>Vom Video bis zur <span className="cg-rot">Provision</span></>}>
        <SoFunktioniert />
      </Abschnitt>

      <Abschnitt tag="Echte Ergebnisse" titel="Das sagen die, die es schon machen">
        <VideoStimmen />
      </Abschnitt>

      <Abschnitt tag="Für wen" titel={<>Circle Generation <span aria-hidden>⭕️</span> ist für dich, wenn …</>}>
        <NurFuerDich />
      </Abschnitt>

      <Faq />
      <Fuss />
    </main>
  );
}
