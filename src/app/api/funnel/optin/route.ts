import { NextResponse } from "next/server";
import {
  COOKIE_OPTIONEN,
  LEAD_COOKIE,
  cookieSchreiben,
  emailPruefen,
  leadMelden,
  neueLeadId,
  text,
} from "@/lib/funnel-leads";

export const dynamic = "force-dynamic";

/** Schritt 1: Vorname + E-Mail → Cookie, danach darf /video geöffnet werden. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: Menschen sehen das Feld nicht. Bots bekommen ein „ok" ohne Wirkung.
  if (text(body.firma, 100)) return NextResponse.json({ ok: true });

  const vorname = text(body.vorname, 40);
  if (!vorname) return NextResponse.json({ fehler: "Bitte gib deinen Vornamen ein." }, { status: 400 });
  const email = emailPruefen(body.email);
  if (!email) return NextResponse.json({ fehler: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
  if (body.einwilligung !== true) {
    return NextResponse.json({ fehler: "Bitte bestätige die Einwilligung." }, { status: 400 });
  }

  const utm: Record<string, string> = {};
  if (body.utm && typeof body.utm === "object") {
    for (const [k, v] of Object.entries(body.utm as Record<string, unknown>)) {
      if (/^utm_[a-z]{2,10}$|^fbclid$|^gclid$|^ttclid$/.test(k)) utm[k] = text(v, 200);
    }
  }

  const id = neueLeadId();
  await leadMelden({
    typ: "optin",
    id,
    vorname,
    email,
    zeit: new Date().toISOString(),
    einwilligung: true,
    quelle: text(body.quelle, 300) || null,
    ...utm,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(LEAD_COOKIE, cookieSchreiben({ id, vorname, email }), COOKIE_OPTIONEN);
  return res;
}
