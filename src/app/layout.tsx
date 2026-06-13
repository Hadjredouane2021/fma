import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Montserrat, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";

/* Gotham / URW Geometric Arabic : secours web — Outfit pour titres (look éditorial 2026) */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FMA - Fédération Marocaine de l'Assurance",
  description: "La Fédération Marocaine de l'Assurance, organe représentatif du secteur de l'assurance au Maroc.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${montserrat.variable} ${outfit.variable} ${ibmPlexArabic.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
