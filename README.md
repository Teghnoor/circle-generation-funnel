# Circle Generation ⭕️ – Funnel

Eigenständiger Funnel (Next.js 16, Vercel):

1. **`/`**: Landingpage mit Intro-Standbild, „Was ist Circle Generation", Video-Stimmen, Vorher → heute, FAQ. Klick aufs Video öffnet das Opt-in (Vorname, E-Mail, Einwilligung). Am Handy scrollt ein Button unten mit.
2. **`/video`**: Trainingsvideo (VSL) mit eigenem Player. Gezählt wird nur echt geschaute Zeit, Vorspulen springt zurück. Ab **80 %** erscheint darunter der Calendly-Kalender fürs Erstgespräch, mit 48-Stunden-Countdown. Ohne Calendly-Link erscheint stattdessen ein Rückruf-Formular.
3. **`/danke`**: Bestätigung nach der Buchung (oder `?art=anfrage` nach dem Rückruf-Formular).

Texte, FAQ, Bilder, Clips, Zahlenleiste, Schwelle: `src/lib/funnel.ts`. Bilder und Clips liegen in `public/funnel/`.

**Herkunft:** Links mit `?src=fanpage3` (und `utm_*`) werden beim ersten Besuch gemerkt und mit jedem Webhook-Ereignis mitgeschickt; an Calendly geht `src` als `utm_source`.

## Umgebungsvariablen (Vercel → Settings → Environment Variables)

| Variable | Zweck |
| --- | --- |
| `NEXT_PUBLIC_FUNNEL_VIDEO_URL` | MP4 des Trainings (H.264/AAC, `faststart`). Ohne: Platzhalter aus `public/funnel/`. |
| `NEXT_PUBLIC_FUNNEL_VIDEO_POSTER` | Vorschaubild des Videos. |
| `NEXT_PUBLIC_FUNNEL_VIDEO_LAENGE` | Hinweis auf der Startseite, Standard `15 Minuten`. |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly-Link des Erstgesprächs. Das 48-Stunden-Buchungsfenster in Calendly selbst einstellen. |
| `NEXT_PUBLIC_FUNNEL_GESPRAECHE` | Anzahl Erstgespräche, Standard `17`. |
| `CALENDLY_TOKEN` | Optional: Personal Access Token. Dann zeigt die Seite „noch X von 17 frei", live gezählt. Ohne Token keine Zahl. |
| `CALENDLY_EVENT_TYPE`, `FUNNEL_GESPRAECHE_TAGE` | Optional: nur diesen Termintyp zählen (URI) und wie viele Tage voraus (Standard 7). |
| `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Optional: Pixel. Ereignisse: Lead (Opt-in), ViewContent (80 %), Schedule bzw. CompleteRegistration (Termin). |
| `NEXT_PUBLIC_SITE_URL` | Eigene Domain, z. B. `https://circlegeneration.com`, damit das Vorschaubild geteilter Links darauf zeigt. |
| `FUNNEL_WEBHOOK_URL` | Bekommt JSON mit `typ` = `optin`, `video_freigeschaltet`, `termin_gebucht`, `anmeldung`, jeweils mit Herkunft (`src`, `utm_*`). |
| `BLOB_READ_WRITE_TOKEN` | Optional: jeder Lead zusätzlich als Datei unter `funnel/<typ>/` im Vercel Blob. |
| `FUNNEL_TESTMODUS=1` | Testmodus auf Production (siehe unten). Vor dem Schalten von Werbung wieder entfernen. |

`NEXT_PUBLIC_*` wird beim Build eingebaut. Nach einer Änderung neu deployen.

## Alle Seiten ansehen (Testmodus)

Lokal, auf jedem Vercel-Preview-Deployment und mit `FUNNEL_TESTMODUS=1` ist der Testmodus an:

- `/vorschau`: Übersicht aller Seiten und Fortschritt zurücksetzen
- `/video`: geht ohne Opt-in auf
- `/video?frei=1`: Anmeldung sofort sichtbar
- `/video?ab=0.1`: schaltet schon nach 10 % frei

Auf Production ohne `FUNNEL_TESTMODUS` ist das alles aus.

## Lokal

```bash
npm install
npm run dev
```
