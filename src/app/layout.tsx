import { Geist } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Damian Pérez — Software, diseño e inteligencia artificial",
  description:
    "Ideas grandes. Productos reales. Soy Damian Pérez: construyo software, plataformas e inteligencia artificial con diseño y precisión. Explora mis proyectos.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Damian Pérez",
    locale: "es_MX",
    url: "/",
    title: "Damian Pérez — Ideas grandes. Productos reales.",
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
  themeColor: "#08090b",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
