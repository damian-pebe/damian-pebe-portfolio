import { LanguageText } from "../effects/LanguageText";
import { ArrowUpRight, Languages, Moon, Sun } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { useTheme } from "../hooks/useTheme";
export function Header({
  locale,
  t,
  onLocaleChange,
}: {
  locale: Locale;
  t: Copy;
  onLocaleChange: (locale: Locale) => void;
}) {
  const { theme, toggle } = useTheme();
  return (
    <header className="site-header shell">
      <a href="#top" className="wordmark">
        <span>damian pebe.</span>
        <span className="wordmark-caption">/ {t.nav.portfolio}</span>
      </a>
      <nav
        aria-label={
          locale === "es" ? "Navegación principal" : "Main navigation"
        }
      >
        <a className="nav-work" href="#work">
          <LanguageText>{t.nav.work}</LanguageText>
        </a>
        <a className="nav-approach" href="#approach">
          <LanguageText>{t.nav.approach}</LanguageText>
        </a>
        <button
          className="theme-switch icon-button"
          onClick={toggle}
          aria-label={theme === "light" ? t.theme.dark : t.theme.light}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={17} />}
        </button>
        <a
          className="language-switch"
          href={locale === "es" ? "/en/" : "/"}
          hrefLang={locale === "es" ? "en" : "es"}
          lang={locale === "es" ? "en" : "es"}
          onClick={(event) => {
            if (
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey &&
              event.button === 0
            ) {
              event.preventDefault();
              onLocaleChange(locale === "es" ? "en" : "es");
            }
          }}
          aria-label={
            locale === "es"
              ? "EN — Switch to English"
              : "ES — Cambiar a español"
          }
        >
          <Languages size={15} />
          <span>{locale === "es" ? "EN" : "ES"}</span>
        </a>
        <a className="nav-contact" href="#contact">
          <LanguageText>{t.nav.contact}</LanguageText>
          <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
