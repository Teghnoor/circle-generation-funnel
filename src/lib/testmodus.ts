/**
 * Testmodus: /video ohne Opt-in, `?frei=1` zeigt die Anmeldung sofort,
 * `?ab=0.1` senkt die Schwelle, /vorschau listet alle Seiten.
 *
 * An in der lokalen Entwicklung, auf Vercel-Preview-Deployments und mit
 * FUNNEL_TESTMODUS=1. Auf Production aus — sonst könnte jeder die 80 %
 * per Link umgehen. Vor dem Schalten von Werbung FUNNEL_TESTMODUS entfernen.
 */
export function testmodus(): boolean {
  // Großzügig lesen: im Vercel-Formular landet schnell ein Leerzeichen oder „true" statt „1".
  const wert = (process.env.FUNNEL_TESTMODUS ?? "").trim().toLowerCase();
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    ["1", "true", "ja", "yes", "on"].includes(wert)
  );
}
