import { Stack_Sans_Headline } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import "./globals.css";

const typeface = Stack_Sans_Headline({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-portfolio",
  adjustFontFallback: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Damian Pérez — Software, diseño e inteligencia artificial",
  description:
    "Soy Damian Pérez. Diseño y construyo productos digitales, plataformas e inteligencia artificial. De la primera idea al último detalle. Explora mi trabajo.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Damian Pérez",
    locale: "es_MX",
    url: "/",
    title: "Damian Pérez — Diseño, código y producto.",
    description:
      "Ingeniería de software, diseño e inteligencia artificial. De la primera idea al producto en producción.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Damian Pérez — Software, design & AI",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={typeface.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem("portfolio-theme")==="dark"?"dark":"light"}catch{document.documentElement.dataset.theme="light"}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
