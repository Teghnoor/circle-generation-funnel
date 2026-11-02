import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VideoFunnel from "@/components/funnel/video-funnel";
import { Fuss, Leiste, Marke, StimmenKarten, Umsaetze } from "@/components/funnel/teile";
import { FREISCHALTEN_AB, LEAD_COOKIE, VIDEO_LAENGE, VIDEO_POSTER, VIDEO_URL } from "@/lib/funnel";
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
  // „15 Minuten“ → „15 min“ wie bei connectundcollect.
  const laenge = VIDEO_LAENGE.replace(/\s*Minuten?$/i, " min");

  return (
    <main className="pb-24">
      {test && (
        <Link href="/vorschau" className="block bg-white px-4 py-1.5 text-center text-[12px] font-medium text-black">
          Testmodus · {startFrei ? "Erstgespräch freigeschaltet" : `Schwelle ${ziel} %`} · alle Seiten →
        </Link>
      )}
      <Leiste>Der anfängerfreundliche Weg, mit fertigen Videos online dein erstes eigenes Geld zu verdienen</Leiste>

      <section className="relative px-4 pb-6 pt-7 md:pt-10">
        <div className="cg-schein" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Marke />
          <h1 className="cg-h1 mt-7 max-w-3xl md:mt-9">
            Schau dir das Videotraining{laenge && <span className="whitespace-nowrap"> ({laenge})</span>}
            <br />
            jetzt an, bevor ich es bald offline nehme…
          </h1>

          <div className="mt-8 w-full max-w-4xl md:mt-10">
            <VideoFunnel src={VIDEO_URL} poster={VIDEO_POSTER} schwelle={schwelle} vorname={lead.vorname} email={lead.email} startFrei={startFrei} />
          </div>

          <p className="mt-14 text-[15px] font-medium text-white/50 md:text-lg">↓ Das sagen die, die es bereits nutzen ↓</p>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <StimmenKarten />
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="cg-h2 mb-8 text-center">Ergebnisse von Circle Generation:</h2>
          <Umsaetze />
          <p className="mt-6 text-center text-[12px] text-white/40">Ergebnisse sind nicht garantiert und variieren individuell.</p>
        </div>
      </section>

      <Fuss />
    </main>
  );
}
