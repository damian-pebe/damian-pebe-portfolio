import Link from "next/link";
import { ArrowUpRight, Languages, Moon, Sun } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { useTheme } from "../hooks/useTheme";
export function Header({ locale, t }: { locale: Locale; t: Copy }) {
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
          {t.nav.work}
        </a>
        <a className="nav-approach" href="#approach">
          {t.nav.approach}
        </a>
        <button
          className="theme-switch icon-button"
          onClick={toggle}
          aria-label={theme === "light" ? t.theme.dark : t.theme.light}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={17} />}
        </button>
        <Link
          className="language-switch"
          href={locale === "es" ? "/en/" : "/"}
          hrefLang={locale === "es" ? "en" : "es"}
          lang={locale === "es" ? "en" : "es"}
          scroll={false}
          aria-label={
            locale === "es"
              ? "EN — Switch to English"
              : "ES — Cambiar a español"
          }
        >
          <Languages size={15} />
          <span>{locale === "es" ? "EN" : "ES"}</span>
        </Link>
        <a className="nav-contact" href="#contact">
          {t.nav.contact}
          <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
