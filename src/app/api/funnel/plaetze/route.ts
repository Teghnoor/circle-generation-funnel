import { NextResponse } from "next/server";
import { GESPRAECHE } from "@/lib/funnel";

export const dynamic = "force-dynamic";

/**
 * „Noch X von 17 Gesprächen frei" — live aus Calendly. Braucht CALENDLY_TOKEN
 * (Personal Access Token). Gezählt werden aktive Termine von jetzt bis
 * FUNNEL_GESPRAECHE_TAGE Tage voraus (Standard 7), auf Wunsch nur für einen
 * Termintyp (CALENDLY_EVENT_TYPE = URI des Termintyps).
 * Ohne Token kommt { frei: null } zurück, dann zeigt die Seite keine Zahl —
 * eine erfundene Zahl wäre schlimmer als keine.
 */

let zwischenspeicher: { zeit: number; frei: number } | null = null;
const GUELTIG_MS = 2 * 60_000;

async function calendly<T>(pfad: string, token: string): Promise<T> {
  const r = await fetch(`https://api.calendly.com${pfad}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(6000),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Calendly ${r.status} für ${pfad.split("?")[0]}`);
  return r.json() as Promise<T>;
}

async function gebuchteTermine(token: string): Promise<number> {
  const ich = await calendly<{ resource: { uri: string } }>("/users/me", token);
  const tage = Number(process.env.FUNNEL_GESPRAECHE_TAGE) || 7;
  const typ = process.env.CALENDLY_EVENT_TYPE || "";
  const von = new Date();
  const bis = new Date(von.getTime() + tage * 86_400_000);
  let seite: string | null =
    `/scheduled_events?user=${encodeURIComponent(ich.resource.uri)}&status=active&count=100` +
    `&min_start_time=${von.toISOString()}&max_start_time=${bis.toISOString()}`;
  let anzahl = 0;
  for (let i = 0; seite && i < 10; i++) {
    const d: { collection: { event_type: string }[]; pagination: { next_page: string | null } } = await calendly(seite, token);
    anzahl += d.collection.filter((e) => !typ || e.event_type === typ).length;
    seite = d.pagination.next_page ? d.pagination.next_page.replace("https://api.calendly.com", "") : null;
  }
  return anzahl;
}

export async function GET() {
  const token = process.env.CALENDLY_TOKEN;
  if (!token) return NextResponse.json({ frei: null, gesamt: GESPRAECHE });
  try {
    if (!zwischenspeicher || Date.now() - zwischenspeicher.zeit > GUELTIG_MS) {
      const gebucht = await gebuchteTermine(token);
      zwischenspeicher = { zeit: Date.now(), frei: Math.max(GESPRAECHE - gebucht, 0) };
    }
    return NextResponse.json(
      { frei: zwischenspeicher.frei, gesamt: GESPRAECHE },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } },
    );
  } catch (e) {
    console.error("[funnel] Calendly-Plätze nicht lesbar:", e);
    return NextResponse.json({ frei: null, gesamt: GESPRAECHE });
  }
}
