import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { projects, type Category, type Project } from "../data/projects";
import { ProjectCard } from "./ProjectCard";
import { LanguageText } from "@/features/language/LanguageText";
import { Reveal } from "@/components/Reveal";
export function Projects({
  t,
  locale,
  onSelect,
}: {
  t: Copy;
  locale: Locale;
  onSelect: (project: Project) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState<Category | "all">("all");
  const shown =
    category === "all"
      ? expanded
        ? projects
        : projects.slice(0, 8)
      : projects.filter((project) => project.category === category);
  return (
    <section
      id="work"
      className="work section shell"
      aria-labelledby="work-title"
    >
      <Reveal>
        <p className="eyebrow">{t.work.eyebrow}</p>
        <div className="section-heading">
          <h2 id="work-title">
            <LanguageText effect="turn">{t.work.title}</LanguageText>
          </h2>
          <p>
            <LanguageText effect="fade">{t.work.subtitle}</LanguageText>
          </p>
        </div>
      </Reveal>
      <div className="project-filters" role="group" aria-label={t.nav.work}>
        <button
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          <LanguageText>{t.work.all}</LanguageText>
          <span>23</span>
        </button>
        {(Object.entries(t.work.categories) as [Category, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              <LanguageText>{label}</LanguageText>
            </button>
          ),
        )}
      </div>
      <div
        className="project-grid"
        aria-live="polite"
        aria-relevant="additions removals"
        key={category}
      >
        {shown.map((project, index) => (
          <Reveal key={project.id} delay={(index % 2) * 0.05}>
            <ProjectCard
              project={project}
              t={t}
              locale={locale}
              onSelect={onSelect}
            />
          </Reveal>
        ))}
      </div>
      {category === "all" && (
        <div className="more-projects">
          <button
            className="button button-outline"
            aria-expanded={expanded}
            onClick={() => {
              setExpanded(!expanded);
              if (expanded)
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "instant" });
            }}
          >
            {expanded ? t.work.less : t.work.more}
            {expanded ? <ArrowUp size={17} /> : <ArrowDown size={17} />}
          </button>
        </div>
      )}
    </section>
  );
}
