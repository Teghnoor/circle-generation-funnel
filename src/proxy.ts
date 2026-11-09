import { NextResponse, type NextRequest } from "next/server";
import { WEITER_COOKIE, WEITER_PARAMETER, imAppBrowser } from "@/lib/im-app-browser";

/**
 * Startseite im In-App-Browser (Instagram, TikTok, …): zuerst der Hinweis
 * „Öffne den Link in deinem Browser“. Rewrite statt Redirect, damit die
 * Adresse samt ?ref= gleich bleibt — genau die öffnet der Besucher dann im
 * echten Browser. Normale Browser laufen hier unverändert durch.
 */
export function proxy(request: NextRequest) {
  const b = imAppBrowser(request.headers.get("user-agent"));
  if (!b) return NextResponse.next();
  if (request.nextUrl.searchParams.get(WEITER_PARAMETER) === "1" || request.cookies.get(WEITER_COOKIE)?.value === "1") {
    return NextResponse.next();
  }
  const ziel = request.nextUrl.clone();
  ziel.pathname = "/im-browser";
  const res = NextResponse.rewrite(ziel);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: "/",
};
