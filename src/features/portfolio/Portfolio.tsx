"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSite } from "@/features/site/SiteContext";
import { LanguageText } from "@/features/language/LanguageText";
import type { Project } from "./data/projects";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Projects } from "./components/Projects";
const ProjectDialog = dynamic(
  () =>
    import("./components/ProjectDialog").then((module) => module.ProjectDialog),
  { ssr: false },
);
export function Portfolio() {
  const { t, locale } = useSite();
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <>
      <section
        id="portfolio-intro"
        className="portfolio-intro shell"
        tabIndex={-1}
        aria-labelledby="portfolio-title"
      >
        <p className="eyebrow">{t.portfolio.eyebrow}</p>
        <div>
          <h1 id="portfolio-title">
            <LanguageText effect="turn">{t.portfolio.title}</LanguageText>
          </h1>
          <p>
            <LanguageText effect="fade">{t.work.subtitle}</LanguageText>
          </p>
        </div>
      </section>
      <FeaturedProjects t={t} locale={locale} onSelect={setSelected} />
      <Projects t={t} locale={locale} onSelect={setSelected} />
      {selected && (
        <ProjectDialog
          key={selected.id}
          project={selected}
          locale={locale}
          t={t}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
