import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LEAD_COOKIE, cookieLesen, emailPruefen, leadMelden, neueLeadId, text } from "@/lib/funnel-leads";

export const dynamic = "force-dynamic";

/** Schritt 3: die freigeschaltete Anmeldung nach dem Video. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  }

  if (text(body.firma, 100)) return NextResponse.json({ ok: true });

  const vorname = text(body.vorname, 40);
  if (!vorname) return NextResponse.json({ fehler: "Bitte gib deinen Vornamen ein." }, { status: 400 });
  const email = emailPruefen(body.email);
  if (!email) return NextResponse.json({ fehler: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
  const telefon = text(body.telefon, 30);
  if (telefon.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ fehler: "Bitte gib deine Handynummer ein, damit wir dich erreichen." }, { status: 400 });
  }

  const lead = cookieLesen((await cookies()).get(LEAD_COOKIE)?.value);
  const sehquote = Number(body.sehquote);

  await leadMelden({
    typ: "anmeldung",
    // Gleiche ID wie beim Opt-in, damit das E-Mail-Tool beide Einträge zusammenführen kann.
    id: lead?.id ?? neueLeadId(),
    vorname,
    email,
    zeit: new Date().toISOString(),
    telefon,
    instagram: text(body.instagram, 60).replace(/^@/, "") || null,
    alter: text(body.alter, 3) || null,
    ziel: text(body.ziel, 600) || null,
    sehquote: Number.isFinite(sehquote) ? Math.round(Math.min(Math.max(sehquote, 0), 1) * 100) : null,
    optinEmail: lead && lead.email !== email ? lead.email : undefined,
  });

  return NextResponse.json({ ok: true });
}
