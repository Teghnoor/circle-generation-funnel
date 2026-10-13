import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Geist wie auf circle-generation.webflow.io.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Circle Generation ⭕️ – Kostenloses Videotraining",
  description: "Die Community, die dich wirklich nach vorne bringt. Schau dir das kostenlose Training an.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`antialiased ${geist.variable}`}>
      <body className="funnel">{children}</body>
    </html>
  );
}
