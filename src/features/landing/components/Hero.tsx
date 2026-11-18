import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";
import { useHeroMotion } from "../hooks/useHeroMotion";
import { LanguageText } from "@/features/language/LanguageText";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { useSite } from "@/features/site/SiteContext";
import { HeroWordmark } from "./HeroWordmark";

export function Hero() {
  const { t, locale } = useSite();
  const { section, contentStyle } = useHeroMotion();
  return (
    <section
      ref={section}
      id="hero"
      className="landing-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-layout shell">
        <m.div className="landing-hero-content" style={contentStyle}>
          <p className="hero-role">
            <span aria-hidden="true" />
            <LanguageText effect="wipe">{t.hero.role}</LanguageText>
          </p>
          <h1 id="hero-title">
            <HeroWordmark />
          </h1>
          <p className="hero-description">
            <LanguageText effect="turn">{t.hero.description}</LanguageText>
          </p>
          <div className="hero-actions">
            <Link
              className="button button-primary"
              href={pageHref("portfolio", locale)}
            >
              <LanguageText effect="fade">{t.hero.secondary}</LanguageText>
              <ArrowUpRight size={17} />
            </Link>
            <button
              className="hero-contact"
              onClick={() => scrollToSection("contact")}
            >
              <LanguageText effect="fade">{t.hero.primary}</LanguageText>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </m.div>
        <div className="hero-bottom">
          <span className="hero-location">{t.hero.location}</span>
          <button
            className="hero-scroll"
            onClick={() => scrollToSection("approach")}
          >
            <LanguageText effect="fade">{t.hero.scroll}</LanguageText>
            <ArrowDown size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
