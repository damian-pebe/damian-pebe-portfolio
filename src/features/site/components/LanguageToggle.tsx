import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Languages } from "lucide-react";
import { pageHref } from "@/features/navigation/routes";
import { useSite } from "../SiteContext";
export function LanguageToggle() {
  const { locale, page, changeLocale, themeChanging, languageChanging } =
    useSite();
  const reduced = useReducedMotion();
  const target = locale === "es" ? "en" : "es";
  const busy = themeChanging || languageChanging;
  return (
    <a
      className="language-switch"
      href={pageHref(page, target)}
      hrefLang={target}
      lang={target}
      aria-label={
        target === "en" ? "EN — Switch to English" : "ES — Cambiar a español"
      }
      aria-disabled={busy || undefined}
      onClick={(event) => {
        if (
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        if (!busy) void changeLocale(target);
      }}
    >
      <Languages size={15} aria-hidden="true" />
      <span className="language-label" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={target}
            initial={{ y: reduced ? 0 : 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : -15, opacity: 0 }}
            transition={{
              duration: reduced ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {target.toUpperCase()}
          </m.span>
        </AnimatePresence>
      </span>
    </a>
  );
}
