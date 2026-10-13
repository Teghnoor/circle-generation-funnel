# Circle Generation ⭕️ – Funnel

Eigenständiger Funnel (Next.js 16, Vercel):

1. **`/`**: Landingpage. Klick aufs Video öffnet das Opt-in (Vorname, E-Mail, Einwilligung).
2. **`/video`**: Trainingsvideo mit eigenem Player. Gezählt wird nur echt geschaute Zeit, Vorspulen springt zurück. Ab **80 %** wird darunter die Anmeldung freigeschaltet. Rückkehrer machen an ihrer Stelle weiter.
3. **`/danke`**: Bestätigung nach der Anmeldung.

Texte, FAQ, Links und Schwelle: `src/lib/funnel.ts`.

## Umgebungsvariablen (Vercel → Settings → Environment Variables)

| Variable | Zweck |
| --- | --- |
| `NEXT_PUBLIC_FUNNEL_VIDEO_URL` | MP4 des Trainings (H.264/AAC, `faststart`). Ohne: Platzhalter aus `public/funnel/`. |
| `NEXT_PUBLIC_FUNNEL_VIDEO_POSTER` | Vorschaubild des Videos. |
| `NEXT_PUBLIC_FUNNEL_VIDEO_LAENGE` | Optional, z. B. `28 min` für den Hinweis auf der Startseite. |
| `FUNNEL_WEBHOOK_URL` | Bekommt JSON mit `typ` = `optin`, `video_freigeschaltet`, `anmeldung` (Zapier, Make, Brevo, Klick-Tipp …). |
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
