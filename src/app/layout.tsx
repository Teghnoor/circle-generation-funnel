import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import PixelSkripte from "@/components/funnel/pixel-skripte";
import "./globals.css";

// Geist wie auf circle-generation.webflow.io.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Absolute Adresse für das Vorschaubild geteilter Links (og:image). Eigene Domain über NEXT_PUBLIC_SITE_URL.
const basis =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const beschreibung =
  "Wie junge Leute mit fertigen Videos und unserem Vertriebsteam ihr erstes Geld online verdienen. Ohne Gesicht, ohne Vorwissen.";

export const metadata: Metadata = {
  metadataBase: new URL(basis),
  title: "Circle Generation ⭕️ – Kostenloses Training",
  description: beschreibung,
  openGraph: {
    title: "Circle Generation ⭕️ – Kostenloses Training",
    description: beschreibung,
    type: "website",
    locale: "de_DE",
  },
  // Nur über Werbung und Links erreichbar, nicht über Google.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`antialiased ${geist.variable}`}>
      <body className="funnel">
        {children}
        <PixelSkripte />
      </body>
    </html>
  );
}
