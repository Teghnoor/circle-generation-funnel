import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LEAD_COOKIE, cookieLesen, leadMelden } from "@/lib/funnel-leads";

export const dynamic = "force-dynamic";

const MEILENSTEINE = new Set(["start", "25", "50", "75", "80", "100", "frei", "rettung"]);

/**
 * Video-Meilensteine. Im Log landen alle; an den Webhook geht nur die
 * Freischaltung — damit kann das E-Mail-Tool z. B. allen, die nicht bis 80 %
 * gekommen sind, eine Erinnerung schicken, ohne pro Viertel eine Aufgabe zu
 * verbrauchen.
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
  console.log(`[funnel] video ${m} lead=${lead?.id ?? "-"} sek=${Number(body.sek) || 0}`);

  if (lead && (m === "frei" || m === "rettung")) {
    await leadMelden({
      typ: "video_freigeschaltet",
      id: lead.id,
      vorname: lead.vorname,
      email: lead.email,
      zeit: new Date().toISOString(),
      grund: m === "frei" ? "schwelle_erreicht" : "video_laedt_nicht",
    });
  }
  return new NextResponse(null, { status: 204 });
}
