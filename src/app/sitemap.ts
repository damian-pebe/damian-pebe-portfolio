import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { pageHref, type PageKind } from "@/features/navigation/routes";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return (["home", "portfolio"] as PageKind[]).flatMap((page) =>
    (["es", "en"] as const).map((locale) => ({
      url: site.url + pageHref(page, locale),
      alternates: {
        languages: {
          es: site.url + pageHref(page, "es"),
          en: site.url + pageHref(page, "en"),
        },
      },
    })),
  );
}
