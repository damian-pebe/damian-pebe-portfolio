import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/en/"].map((path) => ({
    url: site.url + path,
    alternates: { languages: { es: site.url + "/", en: site.url + "/en/" } },
  }));
}
