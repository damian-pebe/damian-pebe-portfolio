import type { Metadata } from "next";
import { Portfolio } from "@/features/portfolio/Portfolio";
export const metadata: Metadata = {
  title: "Damian Pérez — Software, design & artificial intelligence",
  description:
    "I'm Damian Pérez. I design and build digital products, platforms and AI. From the first idea to the finest detail. Explore my work.",
  alternates: {
    canonical: "/en/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    title: "Damian Pérez — Design, code and product.",
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
