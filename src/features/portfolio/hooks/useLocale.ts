import { useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/copy";
import { site } from "@/lib/site";
const eventName = "portfolio-locale";
const snapshot = (): Locale =>
  location.pathname.startsWith("/en") ? "en" : "es";
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener("popstate", listener);
  };
}
export function useLocale(initial: Locale) {
  const locale = useSyncExternalStore(subscribe, snapshot, () => initial);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.languageTransition = "running";
    const english = locale === "en";
    document.title = english
      ? "Damian Pérez — Software, design & artificial intelligence"
      : "Damian Pérez — Software, diseño e inteligencia artificial";
    const url = site.url + (english ? "/en/" : "/");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", url);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", english ? "en_US" : "es_MX");
    const description = english
      ? "I'm Damian Pérez. I design and build digital products, platforms and AI. From the first idea to the finest detail. Explore my work."
      : "Soy Damian Pérez. Diseño y construyo productos digitales, plataformas e inteligencia artificial. De la primera idea al último detalle. Explora mi trabajo.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    const socialTitle = english
      ? "Damian Pérez — Design, code and product."
      : "Damian Pérez — Diseño, código y producto.";
    const socialDescription = english
      ? "Software engineering, design and AI. From the first idea to a product in production."
      : "Ingeniería de software, diseño e inteligencia artificial. De la primera idea al producto en producción.";
    for (const [selector, value] of [
      ['meta[property="og:title"]', socialTitle],
      ['meta[name="twitter:title"]', socialTitle],
      ['meta[property="og:description"]', socialDescription],
      ['meta[name="twitter:description"]', socialDescription],
    ]) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
    const timer = setTimeout(
      () => delete document.documentElement.dataset.languageTransition,
      900,
    );
    return () => clearTimeout(timer);
  }, [locale]);
  const change = (next: Locale) => {
    if (next === locale) return;
    history.pushState(null, "", next === "en" ? "/en/" : "/");
    window.dispatchEvent(new Event(eventName));
  };
  return { locale, change };
}
