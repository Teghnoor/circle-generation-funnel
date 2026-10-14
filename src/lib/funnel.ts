/**
 * Circle-Generation-Funnel: / (Opt-in) → /video (Training, ab 80 %
 * echter Sehzeit wird die Terminbuchung freigeschaltet) → /danke.
 *
 * Alles, was man vor dem Livegang anfassen muss, steht hier: Video, Schwelle,
 * Kalender, Texte, Bilder. Die Datei läuft auch im Browser — keine Geheimnisse
 * hier ablegen.
 */

/** Anteil des Videos, der wirklich geschaut sein muss. Der CTA im VSL kommt bei ca. 13:30 von 15:30. */
export const FREISCHALTEN_AB = 0.8;

/**
 * Das Trainingsvideo (VSL). Am besten eine eigene MP4 (H.264/AAC, „faststart")
 * auf einem CDN — über NEXT_PUBLIC_FUNNEL_VIDEO_URL setzen. Ohne Variable läuft
 * das Platzhaltervideo aus public/funnel/.
 */
export const VIDEO_URL = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_URL || "/funnel/platzhalter.mp4";
/** Standbild aus dem Intro-Film. Wenn der VSL steht, gern durch ein festes Thumbnail ersetzen. */
export const VIDEO_POSTER = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_POSTER || "/funnel/training-poster.jpg";
/** Für Hinweise wie „ca. 15 Minuten". Leer = nicht anzeigen. */
export const VIDEO_LAENGE = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_LAENGE || "15 Minuten";

/** So viele Erstgespräche sind laut VSL frei. */
export const GESPRAECHE = Number(process.env.NEXT_PUBLIC_FUNNEL_GESPRAECHE) || 17;
/** Nach der Freischaltung hat der Lead so lange Zeit, ein Gespräch zu buchen. */
export const BUCHUNGSFENSTER_STUNDEN = 48;
/**
 * Calendly-Link des Erstgesprächs, z. B. https://calendly.com/circle-generation/erstgespraech.
 * Ohne Link zeigt die Videoseite stattdessen ein Formular (Rückruf per WhatsApp).
 */
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

export const LINKS = {
  impressum: "https://circle-generation.webflow.io/privacy-policy",
  datenschutz: "https://circle-generation.webflow.io/datenschutzerklarung",
  agb: "https://circle-generation.webflow.io/agb",
  instagram: "https://www.instagram.com/therealgoldmann/",
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
export const REISE: { bild: string; datum: string; text: string; wer: string }[] = [
  { bild: "/funnel/reise/2024-05-anfang.jpg", datum: "Mai 2024", text: "Der Anfang", wer: "" },
  { bild: "/funnel/reise/2024-05-buero.jpg", datum: "Mai 2024", text: "Die ersten Schritte", wer: "" },
  { bild: "/funnel/reise/2024-11-nacht.jpg", datum: "Nov 2024", text: "Nächte durchgearbeitet", wer: "" },
  { bild: "/funnel/reise/2026-09-laptop.jpg", datum: "Sep 2026", text: "Heute", wer: "" },
  { bild: "/funnel/reise/2026-09-podcast.jpg", datum: "Sep 2026", text: "Heute", wer: "" },
];

/** Echte Auszahlungen. Nur echte Screenshots verwenden. */
export const BEWEISE: { bild: string; text: string }[] = [
  { bild: "/funnel/beweise/auszahlung-april.jpg", text: "Copecart-Auszahlung, April 2025" },
  { bild: "/funnel/beweise/auszahlung-maerz.jpg", text: "Copecart-Auszahlung, März 2025" },
];

/**
 * Zahlenleiste (z. B. { wert: "120+", text: "Mitglieder" }). Nur echte Zahlen
 * eintragen — solange die Liste leer ist, wird die Leiste nicht angezeigt.
 */
export const ZAHLEN: { wert: string; text: string }[] = [];
