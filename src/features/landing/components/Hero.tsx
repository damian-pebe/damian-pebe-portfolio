import Link from "next/link";
import { ArrowDown, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { m } from "framer-motion";
import { useHeroMotion } from "../hooks/useHeroMotion";
import { LanguageText } from "@/features/language/LanguageText";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { useSite } from "@/features/site/SiteContext";
import { HeroShader } from "../effects/HeroShader";
import { HeroWordmark } from "./HeroWordmark";
export function Hero() {
  const { t, locale } = useSite();
  const {
    section,
    title,
    contentStyle,
    titleStyle,
    onPointerMove,
    onPointerLeave,
  } = useHeroMotion();
  return (
    <section
      ref={section}
      id="hero"
      className="landing-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <HeroShader />
      <m.div className="landing-hero-content" style={contentStyle}>
        <div className="hero-chip button button-primary">
          <Sparkles size={14} />
          <LanguageText align="center" effect="wipe">
            {t.hero.role}
          </LanguageText>
        </div>
        <div className="hero-brand-position">
          <m.h1 ref={title} id="hero-title" style={titleStyle}>
            <HeroWordmark />
          </m.h1>
          <span className="hero-hairline" aria-hidden="true" />
        </div>
        <p className="hero-description">
          <LanguageText align="center" effect="turn" emphasis={t.hero.emphasis}>
            {t.hero.description}
          </LanguageText>
        </p>
        <div className="hero-actions">
          <button
            className="button button-primary"
            onClick={() => scrollToSection("contact")}
          >
            <LanguageText effect="fade" align="center">
              {t.hero.primary}
            </LanguageText>
            <Mail size={16} />
          </button>
          <Link
            className="button button-primary"
            href={pageHref("portfolio", locale)}
          >
            <LanguageText effect="fade" align="center">
              {t.hero.secondary}
            </LanguageText>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </m.div>
      <button
        className="hero-scroll"
        onClick={() => scrollToSection("approach")}
      >
        <LanguageText effect="fade" align="center">
          {t.hero.scroll}
        </LanguageText>
        <ArrowDown size={16} />
      </button>
      <span className="hero-location">{t.hero.location}</span>
    </section>
  );
}
