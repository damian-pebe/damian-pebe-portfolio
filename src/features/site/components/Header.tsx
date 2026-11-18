import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LanguageText } from "@/features/language/LanguageText";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { useSite } from "../SiteContext";
import { BrandLink } from "./BrandLink";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
export function Header() {
  const { t, locale, page } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const check = () => setScrolled(scrollY > 24);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  const contact = () => {
    setMenuOpen(false);
    scrollToSection("contact");
  };
  const portfolioClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (
      page === "portfolio" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      scrollToSection("portfolio-intro", true);
    }
  };
  return (
    <header
      className="site-header"
      data-scrolled={scrolled}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="header-blur" aria-hidden="true" />
      <div className="header-row shell">
        <BrandLink className="wordmark" onNavigate={() => setMenuOpen(false)} />
        <nav className="desktop-navigation" aria-label={t.nav.main}>
          <Link
            href={pageHref("home", locale)}
            aria-current={page === "home" ? "page" : undefined}
            onClick={(event) => {
              if (
                page === "home" &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey &&
                !event.altKey
              ) {
                event.preventDefault();
                scrollToSection("hero", true);
              }
            }}
          >
            <LanguageText effect="fade">{t.nav.home}</LanguageText>
          </Link>
          <Link
            href={pageHref("portfolio", locale)}
            aria-current={page === "portfolio" ? "page" : undefined}
            onClick={portfolioClick}
          >
            <LanguageText effect="fade">{t.nav.portfolio}</LanguageText>
          </Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <LanguageToggle />
          <button className="nav-contact" onClick={contact}>
            <LanguageText effect="fade">{t.nav.contact}</LanguageText>
            <ArrowUpRight size={14} />
          </button>
          <button
            ref={menuButton}
            className="menu-toggle icon-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t.nav.close : t.nav.open}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="mobile-navigation shell"
          id="mobile-navigation"
          aria-label={t.nav.mobile}
        >
          <BrandLink
            className="mobile-home"
            onNavigate={() => setMenuOpen(false)}
          />
          <Link href={pageHref("portfolio", locale)} onClick={portfolioClick}>
            {t.nav.portfolio}
            <ArrowUpRight size={16} />
          </Link>
          <button onClick={contact}>
            {t.nav.contact}
            <ArrowUpRight size={16} />
          </button>
        </nav>
      )}
    </header>
  );
}
