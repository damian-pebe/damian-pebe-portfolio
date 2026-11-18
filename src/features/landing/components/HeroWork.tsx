import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LanguageText } from "@/features/language/LanguageText";
import { pageHref } from "@/features/navigation/routes";
import { DeviceMockup } from "@/features/portfolio/components/DeviceMockup";
import type { Project } from "@/features/portfolio/data/projects";
import { useSite } from "@/features/site/SiteContext";

export function HeroWork({ highlights }: { highlights: Project[] }) {
  const { t, locale } = useSite();

  return (
    <aside className="hero-work" aria-label={t.hero.workLabel}>
      <Link className="hero-work-preview" href={pageHref("portfolio", locale)}>
        <div className="hero-work-heading">
          <span>
            <LanguageText effect="wipe">{t.hero.workLabel}</LanguageText>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </div>
        <div className="hero-work-stack">
          {highlights.map((project) => (
            <div className="hero-work-card" key={project.id}>
              <div className="hero-work-device" aria-hidden="true">
                <DeviceMockup project={project} priority variant="hero" />
              </div>
              <div className="hero-work-caption">
                <span>{project.name}</span>
                <span>
                  <LanguageText effect="fade">
                    {t.work.categories[project.category]}
                  </LanguageText>
                </span>
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">{t.hero.exploreWork}</span>
      </Link>
      <div className="hero-work-note">
        <span className="hero-work-marker" aria-hidden="true">
          ↳
        </span>
        <p>
          <strong>
            <LanguageText effect="fade">{t.hero.approachTitle}</LanguageText>
          </strong>
          <LanguageText effect="fade">
            {t.hero.approachDescription}
          </LanguageText>
        </p>
      </div>
    </aside>
  );
}
