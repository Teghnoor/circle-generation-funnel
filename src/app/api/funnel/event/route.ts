import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LEAD_COOKIE, cookieLesen, leadMelden } from "@/lib/funnel-leads";

export const dynamic = "force-dynamic";

const MEILENSTEINE = new Set(["start", "25", "50", "75", "80", "100", "frei", "rettung", "termin", "inapp_hinweis", "inapp_weiter"]);

/** Calendly-Adressen, die mit der Buchung mitkommen — alles andere wird verworfen. */
function calendlyUri(v: unknown): string | null {
  const s = String(v ?? "");
  return /^https:\/\/api\.calendly\.com\/[\w/-]{1,200}$/.test(s) ? s : null;
}

/**
 * Video-Meilensteine und Terminbuchung. Im Log landen alle; an den Webhook
 * gehen nur Freischaltung und Termin. Damit kann das E-Mail-Tool z. B. allen,
 * die nicht bis 80 % gekommen sind, eine Erinnerung schicken, ohne pro Viertel
 * eine Aufgabe zu verbrauchen.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const m = String(body.m ?? "");
  if (!MEILENSTEINE.has(m)) return new NextResponse(null, { status: 204 });

  const lead = cookieLesen((await cookies()).get(LEAD_COOKIE)?.value);
  if (m.startsWith("inapp_")) {
    // Hinweis „Im Browser öffnen“: nur ins Log, keine Lead-Meldung.
    console.log(`[funnel] ${m} app=${/^[a-z]{1,12}$/.test(String(body.app)) ? body.app : "-"}`);
    return new NextResponse(null, { status: 204 });
  }
  console.log(`[funnel] video ${m} lead=${lead?.id ?? "-"} sek=${Number(body.sek) || 0}`);

  // Koray 05.11.: bei 80 % Laufzeit Lead-Status „VSL 80 %“ auf der Plattform.
  if (lead && m === "80") {
    await leadMelden({ typ: "video_80", id: lead.id, vorname: lead.vorname, email: lead.email, zeit: new Date().toISOString(), ...lead.herkunft });
  }

  if (lead && (m === "frei" || m === "rettung")) {
    await leadMelden({
      typ: "video_freigeschaltet",
      id: lead.id,
      vorname: lead.vorname,
      email: lead.email,
      zeit: new Date().toISOString(),
      grund: m === "frei" ? "schwelle_erreicht" : "video_laedt_nicht",
      ...lead.herkunft,
    });
  }

  if (m === "termin") {
    await leadMelden({
      typ: "termin_gebucht",
      id: lead?.id ?? "",
      vorname: lead?.vorname ?? "",
      email: lead?.email ?? "",
      zeit: new Date().toISOString(),
      termin: calendlyUri(body.termin),
      teilnehmer: calendlyUri(body.teilnehmer),
      ...lead?.herkunft,
    });
  }
  return new NextResponse(null, { status: 204 });
}
