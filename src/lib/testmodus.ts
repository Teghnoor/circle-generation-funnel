/**
 * Testmodus: /video ohne Opt-in, `?frei=1` zeigt die Anmeldung sofort,
 * `?ab=0.1` senkt die Schwelle, /vorschau listet alle Seiten.
 *
 * An in der lokalen Entwicklung, auf Vercel-Preview-Deployments und mit
 * FUNNEL_TESTMODUS=1. Auf Production aus — sonst könnte jeder die 80 %
 * per Link umgehen. Vor dem Schalten von Werbung FUNNEL_TESTMODUS entfernen.
 */
export function testmodus(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.FUNNEL_TESTMODUS === "1"
  );
}
