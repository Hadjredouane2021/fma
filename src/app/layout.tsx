import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";

/* Gotham = typographie latine obligatoire (charte FMA), auto-hébergée via public/fonts/gotham/.
   Fichiers licenciés : déposer dans fonts-source/gotham/ puis npm run fonts:gotham */
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FMA - Fédération Marocaine de l'Assurance",
  description: "La Fédération Marocaine de l'Assurance, organe représentatif du secteur de l'assurance au Maroc.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={ibmPlexArabic.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
