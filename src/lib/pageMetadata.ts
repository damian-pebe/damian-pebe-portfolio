import type { Metadata } from "next";
import type { Locale } from "@/i18n/copy";
import { pageHref, type PageKind } from "@/features/navigation/routes";
import { pageIdentity } from "./pageIdentity";
import { site } from "./site";

export function pageMetadata(locale: Locale, page: PageKind): Metadata {
  const identity = pageIdentity(locale, page);
  return {
    title: identity.title,
    description: identity.description,
    alternates: {
      canonical: pageHref(page, locale),
      languages: {
        es: pageHref(page, "es"),
        en: pageHref(page, "en"),
        "x-default": pageHref(page, "es"),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: identity.title,
      description: identity.description,
      url: identity.url,
      locale: identity.ogLocale,
      images: [
        {
          url: "/og-image.png?v=20261117-name",
          width: 1200,
          height: 630,
          alt: `${site.name} — Software, design & AI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
    },
  };
}
