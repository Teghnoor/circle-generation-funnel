/**
 * Circle-Generation-Funnel: / (Opt-in) → /video (Training, ab 80 %
 * echter Sehzeit wird die Anmeldung freigeschaltet) → /danke.
 *
 * Alles, was man vor dem Livegang anfassen muss, steht hier: Video, Schwelle,
 * Links. Die Datei läuft auch im Browser — keine Geheimnisse hier ablegen.
 */

/** Anteil des Videos, der wirklich geschaut sein muss. */
export const FREISCHALTEN_AB = 0.8;

/**
 * Das Trainingsvideo. Am besten eine eigene MP4 (H.264/AAC, „faststart"),
 * z. B. in Vercel Blob oder einem CDN — dann über NEXT_PUBLIC_FUNNEL_VIDEO_URL
 * setzen. Ohne Variable läuft das Platzhaltervideo aus public/funnel/.
 */
export const VIDEO_URL = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_URL || "/funnel/platzhalter.mp4";
export const VIDEO_POSTER = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_POSTER || "/funnel/platzhalter.jpg";
/** Nur für die Überschrift auf der Startseite, z. B. „28 min". Leer = nicht anzeigen. */
export const VIDEO_LAENGE = process.env.NEXT_PUBLIC_FUNNEL_VIDEO_LAENGE || "";

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
  vorname: "cg_vorname",
  email: "cg_email",
};

export type Faq = { frage: string; antwort: string };

export const FAQ: Faq[] = [
  {
    frage: "Für wen ist Circle Generation?",
    antwort:
      "Für junge Leute, die mehr wollen als den Standardweg — und bereit sind, dafür jeden Tag etwas zu tun. Vorwissen brauchst du keins.",
  },
  {
    frage: "Wie viel Zeit muss ich investieren?",
    antwort: "Plane ein bis zwei Stunden am Tag ein. Wichtiger als die Menge ist, dass du dranbleibst.",
  },
  {
    frage: "Warum muss ich das Video erst schauen?",
    antwort:
      "Weil im Training alles erklärt wird, was du vor der Anmeldung wissen musst. So kommen nur Leute in die Community, die wirklich verstanden haben, worum es geht.",
  },
  {
    frage: "Was passiert nach der Anmeldung?",
    antwort:
      "Wir schauen uns deine Anmeldung an und melden uns persönlich bei dir. Danach bekommst du Zugang zum Videokurs und zur Community.",
  },
  {
    frage: "Warum sind die Plätze begrenzt?",
    antwort:
      "Jedes Mitglied hat einen persönlichen Ansprechpartner. Das funktioniert nur mit einer begrenzten Zahl an Leuten — deshalb maximal 100.",
  },
];

export const SAEULEN = [
  {
    titel: "Wöchentliche Live-Calls",
    text: "Fragen klären, Fortschritte teilen, gemeinsam besser werden — jede Woche live.",
  },
  {
    titel: "Persönlicher Ansprechpartner",
    text: "Du bist nicht allein. Jemand aus dem Team begleitet dich vom ersten Tag an.",
  },
  {
    titel: "Videokurs Schritt für Schritt",
    text: "Ein klares System statt Zufall — aufgebaut so, dass du ohne Vorwissen starten kannst.",
  },
];

export const NUR_FUER_DICH_WENN = [
  "du selbstbestimmt leben willst, statt nur zu funktionieren",
  "du deiner Familie etwas zurückgeben möchtest",
  "du bereit bist, jeden Tag Zeit zu investieren",
  "du ehrgeizig bist und Verantwortung übernimmst",
  "du ein Umfeld suchst, das dich nach vorne zieht",
  "du offen für Feedback bist und lernen willst",
];

export type Stimme = { name: string; zitat: string; bild?: string };

/** Echte Erfolgsgeschichten eintragen — solange die Liste leer ist, fehlt der Abschnitt. */
export const STIMMEN: Stimme[] = [];
