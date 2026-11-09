/**
 * Erkennt In-App-Browser (Instagram, TikTok, Facebook, WhatsApp …) am
 * User-Agent. Dort landen Besucher aus der Bio und verlieren beim Wechsel in
 * den echten Browser Cookies und localStorage. Darum bekommen sie auf der
 * Startseite zuerst den Hinweis „Öffne den Link in deinem Browser“.
 *
 * Nur bewährte Muster, nichts raten: Safari, Chrome, Firefox, Samsung Internet
 * usw. dürfen hier NIE hängen bleiben. Lieber einen In-App-Browser übersehen.
 * Läuft in proxy.ts (Edge) und im Browser, darum ohne Abhängigkeiten.
 */

export type App =
  | "instagram"
  | "threads"
  | "facebook"
  | "messenger"
  | "tiktok"
  | "whatsapp"
  | "snapchat"
  | "linkedin"
  | "line"
  | "twitter"
  | "pinterest";

export type System = "ios" | "android" | "andere";

export type ImAppBrowser = { app: App; system: System };

// Reihenfolge zählt: Messenger und Threads vor Facebook/Instagram, weil ihre
// Kennungen in derselben Zeile stehen können.
const MUSTER: [App, RegExp][] = [
  ["messenger", /MessengerForiOS|MessengerLiteForiOS|FBAN\/Messenger|FB_IAB\/(?:Orca|MESSENGER)|Orca-Android/i],
  ["threads", /\bBarcelona \d/],
  ["instagram", /\bInstagram[ /]\d/i],
  ["facebook", /\bFBAN\/|\bFBAV\/|\bFB_IAB\/|\bFBIOS\b|\bFB4A\b|\[FB/],
  ["tiktok", /musical_ly|BytedanceWebview|\btrill_\d|\bTikTok[ /]\d|ByteLocale/i],
  ["whatsapp", /\bWhatsApp\/\d/i],
  ["snapchat", /\bSnapchat\/\d/i],
  ["linkedin", /\bLinkedInApp\b/i],
  ["line", /\bLine\/\d/],
  ["twitter", /\bTwitter for (?:iPhone|iPad)\b|\bTwitterAndroid\b/i],
  ["pinterest", /\bPinterest(?:\/| for )/i],
];

export function systemVon(ua: string): System {
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "andere";
}

/** In-App-Browser oder null (normaler Browser, Bot, leer). */
export function imAppBrowser(ua: string | null | undefined): ImAppBrowser | null {
  if (!ua) return null;
  // Vorschau-Abrufe der Apps (z. B. „WhatsApp/2.23.20.0 A“, facebookexternalhit)
  // geben sich nicht als Mozilla aus; die bekommen die normale Seite.
  if (!/^Mozilla\//.test(ua)) return null;
  if (/bot\b|crawler|spider|facebookexternalhit|HeadlessChrome/i.test(ua)) return null;
  for (const [app, re] of MUSTER) if (re.test(ua)) return { app, system: systemVon(ua) };
  return null;
}

/** So heißt der Menüpunkt in der jeweiligen App (deutsche Oberfläche). */
export function menuePunkt(b: ImAppBrowser): string {
  const browser = b.system === "android" ? "Chrome" : b.system === "ios" ? "Safari" : "Browser";
  switch (b.app) {
    case "instagram":
    case "threads":
      return "In externem Browser öffnen";
    case "facebook":
    case "messenger":
      return "Im externen Browser öffnen";
    case "twitter":
    case "linkedin":
    case "snapchat":
    case "pinterest":
      return b.system === "andere" ? "Im Browser öffnen" : `In ${browser} öffnen`;
    default:
      return "Im Browser öffnen";
  }
}

/** Die drei Punkte oben rechts: iPhone waagrecht, Android senkrecht. */
export function menueZeichen(b: ImAppBrowser): string {
  return b.system === "android" ? "⋮" : "•••";
}

/** Parameter, mit dem „Trotzdem hier weiter“ den Hinweis überspringt. */
export const WEITER_PARAMETER = "im_app";
export const WEITER_COOKIE = "cg_im_app";

/** Ziel-URL ohne den Überspringen-Parameter (ref, utm usw. bleiben). */
export function zielOhneWeiter(href: string): string {
  const u = new URL(href);
  u.searchParams.delete(WEITER_PARAMETER);
  if (u.pathname === "/im-browser") u.pathname = "/";
  return u.toString();
}

/** Android: Chrome direkt öffnen. Nur https-Ziele. */
export function chromeIntent(href: string): string | null {
  const u = new URL(href);
  if (u.protocol !== "https:") return null;
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;end`;
}
