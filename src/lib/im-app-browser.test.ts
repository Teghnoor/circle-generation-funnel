import { test } from "node:test";
import assert from "node:assert/strict";
import { chromeIntent, imAppBrowser, menuePunkt, menueZeichen, zielOhneWeiter } from "./im-app-browser.ts";

// Echte User-Agents, die ersten drei TikTok-Zeilen stammen aus den Klicks der Plattform (Nov. 2026).
const IN_APP: [string, string, string][] = [
  ["tiktok", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 musical_ly_47.5.0 BytedanceWebview/d8a21c6"],
  ["tiktok", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 27_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 musical_ly_47.5.0 BytedanceWebview/d8a21c6"],
  ["tiktok", "android", "Mozilla/5.0 (Linux; Android 14; SM-A546B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.146 Mobile Safari/537.36 trill_360503 BytedanceWebview/d8a21c6"],
  ["tiktok", "android", "Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 musical_ly_2023105030 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/31.5.3 ByteLocale/de ByteFullLocale/de Region/DE"],
  ["instagram", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 334.0.4.32.98 (iPhone15,3; iOS 17_5; de_DE; de; scale=3.00; 1290x2796; 606558450)"],
  ["instagram", "android", "Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.82 Mobile Safari/537.36 Instagram 327.0.0.42.89 Android (34/14; 480dpi; 1080x2340; samsung; SM-S918B; dm3q; qcom; de_DE; 587432140)"],
  ["threads", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Barcelona 330.0.0.25.88 (iPhone14,5; iOS 17_4; de_DE; de; scale=3.00; 1170x2532; 595066418)"],
  ["facebook", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.40.98;FBBV/612345678;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBID/phone;FBLC/de_DE;FBOP/5;FBRV/0]"],
  ["facebook", "android", "Mozilla/5.0 (Linux; Android 13; SM-G991B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.113 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/464.0.0.43.109;]"],
  ["messenger", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/460.0.0.38.109;FBBV/598765432;FBDV/iPhone14,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBCR/;FBID/phone;FBLC/de_DE;FBOP/5]"],
  ["messenger", "android", "Mozilla/5.0 (Linux; Android 12; SM-A525F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/440.0.0.31.116;]"],
  ["whatsapp", "android", "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36 WhatsApp/2.24.17.79"],
  ["snapchat", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Snapchat/13.1.0.33 (like Safari/8618.2.12.10.6, panda)"],
  ["linkedin", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.29.8143"],
  ["line", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.9.0"],
  ["twitter", "android", "Mozilla/5.0 (Linux; Android 13; SM-A536B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.144 Mobile Safari/537.36 TwitterAndroid"],
  ["pinterest", "ios", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [Pinterest/iOS]"],
];

const NORMAL = [
  // Safari, Chrome, Firefox, Edge, Samsung, Opera auf Handy und Desktop: nie Hinweis.
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.0 Mobile/15E148 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 EdgiOS/126.2592.56",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 OPR/83.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
  // Kein In-App-Browser erkennbar (TikTok iOS ohne Kennung), lieber normale Seite.
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  // Vorschau-Abrufe und Bots
  "WhatsApp/2.23.20.0 A",
  "WhatsApp/2.2433.1 i",
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
  "TelegramBot (like TwitterBot)",
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.126 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "curl/8.7.1",
  "",
];

test("In-App-Browser werden erkannt (App und System)", () => {
  for (const [app, system, ua] of IN_APP) assert.deepEqual(imAppBrowser(ua), { app, system }, ua);
});

test("Normale Browser und Bots sehen nie den Hinweis", () => {
  for (const ua of NORMAL) assert.equal(imAppBrowser(ua), null, ua);
  assert.equal(imAppBrowser(null), null);
  assert.equal(imAppBrowser(undefined), null);
});

test("Menüpunkt und Punkte passen zur App", () => {
  assert.equal(menuePunkt({ app: "instagram", system: "ios" }), "In externem Browser öffnen");
  assert.equal(menuePunkt({ app: "tiktok", system: "ios" }), "Im Browser öffnen");
  assert.equal(menuePunkt({ app: "facebook", system: "android" }), "Im externen Browser öffnen");
  assert.equal(menuePunkt({ app: "linkedin", system: "ios" }), "In Safari öffnen");
  assert.equal(menueZeichen({ app: "tiktok", system: "ios" }), "•••");
  assert.equal(menueZeichen({ app: "instagram", system: "android" }), "⋮");
});

test("Ziel behält ref und utm, nur der Überspringen-Parameter fällt weg", () => {
  assert.equal(
    zielOhneWeiter("https://circle-generation.com/?ref=zusga&utm_content=zusga&im_app=1"),
    "https://circle-generation.com/?ref=zusga&utm_content=zusga",
  );
  assert.equal(zielOhneWeiter("https://circle-generation.com/im-browser?ref=abcde"), "https://circle-generation.com/?ref=abcde");
});

test("Chrome-Intent für Android trägt ref mit", () => {
  assert.equal(
    chromeIntent("https://circle-generation.com/?ref=zusga&utm_content=zusga"),
    "intent://circle-generation.com/?ref=zusga&utm_content=zusga#Intent;scheme=https;package=com.android.chrome;end",
  );
  assert.equal(chromeIntent("http://localhost:3000/?ref=x"), null);
});
