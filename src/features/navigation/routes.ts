import type { Locale } from "@/i18n/copy";

export type PageKind = "home" | "portfolio";
export function pageFromPath(pathname: string): PageKind {
  return pathname.split("/").includes("portfolio") ? "portfolio" : "home";
}
export function pageHref(page: PageKind, locale: Locale) {
  return `${locale === "en" ? "/en" : ""}${page === "portfolio" ? "/portfolio" : ""}/`;
}
