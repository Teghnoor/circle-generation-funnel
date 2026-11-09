/**
 * Circle-Generation-Funnel: / (Opt-in) → /video (Training, ab 95 %
 * echter Sehzeit wird die Terminbuchung freigeschaltet) → /danke.
 *
 * Alles, was man vor dem Livegang anfassen muss, steht hier: Video, Schwelle,
 * Kalender, Texte, Bilder. Die Datei läuft auch im Browser — keine Geheimnisse
 * hier ablegen.
 */

/** Anteil des Videos, der wirklich geschaut sein muss (Tegh 04.11.: 95 %). */
export const FREISCHALTEN_AB = 0.95;

/**
 * Das Trainingsvideo (VSL). Am besten eine eigene MP4 (H.264/AAC, „faststart")
 * auf einem CDN — über NEXT_PUBLIC_FUNNEL_VIDEO_URL setzen. Ohne Variable läuft
 * das Platzhaltervideo aus public/funnel/.
 */
export const VIDEO_URL = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_URL || "/funnel/platzhalter.mp4";
/** Standbild aus dem Intro-Film. Wenn der VSL steht, gern durch ein festes Thumbnail ersetzen. */
/** Wistia-Media-ID der VSL. Gesetzt = Wistia-Player statt eigener mp4. */
export const WISTIA_ID = process.env.NEXT_PUBLIC_FUNNEL_WISTIA_ID || "5sm8v69d2p";
export const WISTIA_THUMBNAIL = "/funnel/koray-thumbnail.jpg";
export const VIDEO_POSTER = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_POSTER || "/funnel/training-poster.jpg";
/** Für Hinweise wie „ca. 15 Minuten". Leer = nicht anzeigen. */
export const VIDEO_LAENGE = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_LAENGE || "15 Minuten";

/** So viele Erstgespräche sind laut VSL frei. */
export const GESPRAECHE = Number(process.env.NEXT_PUBLIC_FUNNEL_GESPRAECHE) || 17;
/** Dauer des Erstgesprächs in Calendly (Event „Expertengespräch“, 09.11.: 30 Min.). */
export const GESPRAECH_MINUTEN = 30;
/** Nach der Freischaltung hat der Lead so lange Zeit, ein Gespräch zu buchen. */
export const BUCHUNGSFENSTER_STUNDEN = 48;
/**
 * Calendly-Link des Erstgesprächs, z. B. https://calendly.com/circle-generation/erstgespraech.
 * Ohne Link zeigt die Videoseite stattdessen ein Formular (Rückruf per WhatsApp).
 */
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/innertsbergeremanuel/expertengesprach-zur-ausbildung-circle-generation";

export const LINKS = {
  impressum: "https://circle-generation.webflow.io/privacy-policy",
  datenschutz: "https://circle-generation.webflow.io/datenschutzerklarung",
  agb: "https://circle-generation.webflow.io/agb",
  instagram: "https://www.instagram.com/therealgoldmann/",
  youtube: "https://www.youtube.com/@therealgoldmann",
  tiktok: "https://www.tiktok.com/@therealgoldmann",
};

/** Cookie, das die Startseite nach dem Opt-in setzt; ohne es leitet /video zurück. */
export const LEAD_COOKIE = "cg_lead";

/** Schlüssel im localStorage des Besuchers. */
export const SPEICHER = {
  /** Weiteste echt geschaute Stelle in Sekunden, je Video-URL. */
  position: (src: string) => `cg_pos:${src}`,
  frei: "cg_frei",
  /** Zeitpunkt der Freischaltung (ms) — Start des 48-Stunden-Fensters. */
  freiSeit: "cg_frei_seit",
  vorname: "cg_vorname",
  email: "cg_email",
  /** Herkunft des Besuchers (?src=, utm_…), beim ersten Besuch gemerkt. */
  herkunft: "cg_herkunft",
  /** Kennung des Mitglieds aus dem persönlichen Link (?ref=), mit Ablaufzeit. */
  ref: "cg_ref",
};

/** Link-Parameter, die als Herkunft mitgeschickt werden (z. B. ?src=fanpage3). */
export const HERKUNFT_PARAMETER = /^(src|ref|utm_[a-z]{2,10}|fbclid|gclid|ttclid)$/;

/* ------------------------------------------------------------------ */
/* Texte                                                               */
/* ------------------------------------------------------------------ */

/** „Was ist Circle Generation" — vom Video bis zur Provision. */
export const SO_FUNKTIONIERT = [
  { titel: "Videos posten", text: "Du bekommst fertige Videos und postest sie auf deinen Kanälen. Ohne Gesicht." },
  { titel: "Kommentare", text: "Interessenten melden sich in den Kommentaren und Nachrichten unter deinen Videos." },
  { titel: "Vertriebsteam", text: "Unser Vertriebsteam übernimmt die Gespräche und führt sie zum Abschluss." },
  { titel: "Provision", text: "Für jeden Abschluss, der über deine Videos kommt, bekommst du deine Provision." },
] as const;

export type Faq = { frage: string; antwort: string };

export const FAQ: Faq[] = [
  {
    frage: "Muss ich mein Gesicht zeigen?",
    antwort: "Nein. Du postest fertige Videos, dein Gesicht muss nirgends zu sehen sein.",
  },
  {
    frage: "Brauche ich Vorwissen?",
    antwort: "Nein. Im Training siehst du Schritt für Schritt, wie es funktioniert. Den Verkauf übernimmt unser Vertriebsteam.",
  },
  {
    frage: "Warum muss ich das Video erst schauen?",
    antwort:
      "Im Training wird alles erklärt, was du vor dem Erstgespräch wissen musst. So nutzen wir die Gespräche für Leute, die wirklich verstanden haben, worum es geht.",
  },
  {
    frage: "Was passiert im Erstgespräch?",
    antwort:
      "Wir lernen dich kennen, beantworten deine Fragen und schauen gemeinsam, ob Circle Generation zu dir passt. Das Gespräch ist kostenlos.",
  },
  {
    frage: `Warum gibt es nur ${GESPRAECHE} Gespräche?`,
    antwort: "Jedes Gespräch führt jemand aus unserem Team persönlich. Deshalb können wir nur eine begrenzte Zahl anbieten.",
  },
];

export const NUR_FUER_DICH_WENN = [
  "du dir online dein erstes eigenes Geld aufbauen willst",
  "du kein Gesicht zeigen und trotzdem starten möchtest",
  "du bereit bist, jeden Tag Zeit zu investieren",
  "du ehrgeizig bist und Verantwortung übernimmst",
  "du ein Umfeld suchst, das dich nach vorne zieht",
  "du offen für Feedback bist und lernen willst",
];

/* ------------------------------------------------------------------ */
/* Social Proof                                                        */
/* ------------------------------------------------------------------ */

export type VideoStimme = { titel: string; src: string; poster: string; hochkant?: boolean };

/** Kurze Clips aus dem OneDrive-Ordner „VSL CIRCLE GENERATION", komprimiert in public/funnel/stimmen. */
export const VIDEO_STIMMEN: VideoStimme[] = [
  { titel: "Erste große Provision verdient", src: "/funnel/stimmen/erste-provision.mp4", poster: "/funnel/stimmen/erste-provision.jpg" },
  { titel: "Ich hab's geschafft", src: "/funnel/stimmen/geschafft.mp4", poster: "/funnel/stimmen/geschafft.jpg" },
  { titel: "Nicht aufgeben", src: "/funnel/stimmen/nicht-aufgeben.mp4", poster: "/funnel/stimmen/nicht-aufgeben.jpg" },
  { titel: "Große Umsätze", src: "/funnel/stimmen/umsaetze.mp4", poster: "/funnel/stimmen/umsaetze.jpg" },
  { titel: "Hustle Nights", src: "/funnel/stimmen/hustle-nights.mp4", poster: "/funnel/stimmen/hustle-nights.jpg", hochkant: true },
  { titel: "Hustle Nights 2", src: "/funnel/stimmen/hustle-nights-2.mp4", poster: "/funnel/stimmen/hustle-nights-2.jpg", hochkant: true },
];

/**
 * Der Weg „vorher → heute" in Fotos. `wer` ist der Name der Person auf dem
 * Foto — leer lassen, bis klar ist, wer wer ist.
 */
export const REISE: { bild: string; datum: string; text: string; wer: string }[] = [];  // Koray-Fotos auf Wunsch Tegh 01.11. entfernt

/** Echte Auszahlungen. Nur echte Screenshots verwenden. */
export const BEWEISE: { bild: string; text: string }[] = [];  // auf Wunsch Tegh 01.11. entfernt

/**
 * Nachrichten aus der Community (WhatsApp-Screenshots, 01.11.2026 von Tegh).
 * Telefonnummern und fremde Namen sind unkenntlich gemacht.
 */
export const NACHRICHTEN: { bild: string; breite: number; hoehe: number; wer: string; zitat?: string }[] = [
  { bild: "/funnel/nachrichten/sarah.jpg", breite: 617, hoehe: 1280, wer: "Sarah", zitat: "Hätte am Anfang nicht gedacht, dass ich so schnell mein erstes Ergebnis sehen würde." },
  { bild: "/funnel/nachrichten/mo.jpg", breite: 616, hoehe: 1280, wer: "Mo", zitat: "Vor ein paar Wochen hätte ich niemals gedacht, dass ich mir nebenbei online etwas Eigenes aufbauen kann." },
  { bild: "/funnel/nachrichten/max.jpg", breite: 620, hoehe: 1280, wer: "Max", zitat: "Hätte wirklich nicht gedacht, dass sich dadurch so viel verändern kann." },
  { bild: "/funnel/nachrichten/lisa.jpg", breite: 619, hoehe: 1280, wer: "Lisa", zitat: "Man ist nicht komplett auf sich allein gestellt, sondern bekommt Unterstützung." },
  { bild: "/funnel/nachrichten/marilyn-provision.jpg", breite: 753, hoehe: 1280, wer: "Marilyn", zitat: "Das hier ist meine erste Provision, und es zeigt einfach: Es funktioniert!" },
  { bild: "/funnel/nachrichten/killian.jpg", breite: 617, hoehe: 1280, wer: "Killian", zitat: "Ich bin deutlich disziplinierter geworden und baue mir Schritt für Schritt etwas Eigenes auf." },
  { bild: "/funnel/nachrichten/ellina.jpg", breite: 1054, hoehe: 770, wer: "Ellina" },
  { bild: "/funnel/nachrichten/marilyn-call.jpg", breite: 1280, hoehe: 998, wer: "Marilyn" },
];

/**
 * Zahlenleiste (z. B. { wert: "120+", text: "Mitglieder" }). Nur echte Zahlen
 * eintragen — solange die Liste leer ist, wird die Leiste nicht angezeigt.
 */
export const ZAHLEN: { wert: string; text: string }[] = [];

/**
 * Umsatz-Screenshots (Copecart/Digistore, Oktober 2026, 02.11. von Tegh).
 * Bestellnummern und Kundendaten sind unkenntlich, Tabellenkopf abgeschnitten.
 * Laufen als Band von links nach rechts.
 */
export const UMSAETZE: { bild: string; breite: number; hoehe: number }[] = [
  { bild: "/funnel/umsaetze/oktober-1.jpg", breite: 1360, hoehe: 720 },
  { bild: "/funnel/umsaetze/oktober-2.jpg", breite: 656, hoehe: 720 },
  { bild: "/funnel/umsaetze/oktober-3.jpg", breite: 1454, hoehe: 720 },
  { bild: "/funnel/umsaetze/oktober-4.jpg", breite: 616, hoehe: 720 },
  { bild: "/funnel/umsaetze/oktober-5.jpg", breite: 1466, hoehe: 720 },
  { bild: "/funnel/umsaetze/oktober-6.jpg", breite: 1150, hoehe: 720 },
];
