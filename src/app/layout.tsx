import { Stack_Sans_Headline } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { SiteShell } from "@/features/site/SiteShell";
import { pageMetadata } from "@/lib/pageMetadata";
import "./globals.css";

const typeface = Stack_Sans_Headline({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-portfolio",
  adjustFontFallback: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata("es", "home"),
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
