import type { Locale } from "@/i18n/copy";
import { pageHref, type PageKind } from "@/features/navigation/routes";
import { site } from "./site";

export function pageIdentity(locale: Locale, page: PageKind) {
  const en = locale === "en";
  return {
    title:
      page === "portfolio"
        ? `${site.name} — ${en ? "Selected work" : "Portafolio"}`
        : `${site.name} — ${en ? "Software, design & AI" : "Software, diseño e IA"}`,
    description: en
      ? `I'm ${site.name}. Software engineering, design and AI. From the first idea to a real product. Explore what I build with Clyra.`
      : `Soy ${site.name}. Ingeniería de software, diseño e IA. De la primera idea al producto real. Explora lo que construyo con Clyra.`,
    url: site.url + pageHref(page, locale),
    ogLocale: en ? "en_US" : "es_MX",
  };
}
