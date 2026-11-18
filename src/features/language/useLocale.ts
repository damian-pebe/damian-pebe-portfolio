import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import type { Locale } from "@/i18n/copy";
import { pageHref, type PageKind } from "@/features/navigation/routes";
import { pageIdentity } from "@/lib/pageIdentity";
import { transitionLanguage } from "./languageTransition";
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
export function useLocale(initial: Locale, page: PageKind) {
  const locale = useSyncExternalStore(subscribe, snapshot, () => initial);
  const [changing, setChanging] = useState(false);
  const busy = useRef(false);
  useEffect(() => {
    const identity = pageIdentity(locale, page);
    document.documentElement.lang = locale;
    document.title = identity.title;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", identity.url);
    for (const [selector, value] of [
      ['meta[property="og:url"]', identity.url],
      ['meta[property="og:locale"]', identity.ogLocale],
      ['meta[name="description"]', identity.description],
      ['meta[property="og:title"]', identity.title],
      ['meta[name="twitter:title"]', identity.title],
      ['meta[property="og:description"]', identity.description],
      ['meta[name="twitter:description"]', identity.description],
    ])
      document.querySelector(selector)?.setAttribute("content", value);
  }, [locale, page]);
  const change = async (next: Locale) => {
    if (next === locale || busy.current) return;
    busy.current = true;
    setChanging(true);
    try {
      await transitionLanguage(() =>
        flushSync(() => {
          history.pushState(null, "", pageHref(page, next));
          window.dispatchEvent(new Event(eventName));
        }),
      );
    } finally {
      busy.current = false;
      setChanging(false);
    }
  };
  return { locale, changing, change };
}
