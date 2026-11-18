import Link from "next/link";
import { ArrowUpRight, Languages } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
export function Header({ locale, t }: { locale: Locale; t: Copy }) {
  return (
    <header className="site-header shell">
      <a href="#top" className="wordmark">
        <span className="monogram" aria-hidden="true">
          dp<span>✳</span>
        </span>
        <span>
          damian pebe<span className="wordmark-dot">.</span>
        </span>
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
