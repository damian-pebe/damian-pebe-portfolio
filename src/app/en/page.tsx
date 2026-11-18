import type { Metadata } from "next";
import { Portfolio } from "@/features/portfolio/Portfolio";
export const metadata: Metadata = {
  title: "Damian Pérez — Software, design & artificial intelligence",
  description:
    "Big ideas. Real products. I'm Damian Pérez: I build software, platforms and AI with design and precision. Explore my work.",
  alternates: {
    canonical: "/en/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    title: "Damian Pérez — Big ideas. Real products.",
    description:
      "Software engineering, design and AI. From the first idea to a product in production.",
    locale: "en_US",
    url: "/en/",
    images: ["/og-image.png"],
  },
};
export default function EnglishHome() {
  return <Portfolio locale="en" />;
}
