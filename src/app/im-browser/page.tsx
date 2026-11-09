import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ImBrowserHinweis } from "@/components/funnel/im-browser-hinweis";
import { imAppBrowser, menuePunkt, menueZeichen } from "@/lib/im-app-browser";

// Hängt am User-Agent, darum pro Anfrage.
export const dynamic = "force-dynamic";

export const metadata = { title: "Circle Generation ⭕️ – Im Browser öffnen" };

/**
 * Landet hier nur per Rewrite aus proxy.ts (Startseite im In-App-Browser).
 * Die Adresse in der Leiste bleibt die Startseite samt ?ref=.
 */
export default async function ImBrowserSeite() {
  const ua = (await headers()).get("user-agent");
  const b = imAppBrowser(ua);
  // Direkt aufgerufen in einem normalen Browser: nie den Hinweis zeigen.
  if (!b) redirect("/");
  return <ImBrowserHinweis app={b.app} system={b.system} punkt={menuePunkt(b)} zeichen={menueZeichen(b)} />;
}
