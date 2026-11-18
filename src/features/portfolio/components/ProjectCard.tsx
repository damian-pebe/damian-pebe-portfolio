import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { thumbnail, type Project } from "../data/projects";
export function ProjectCard({
  project,
  locale,
  t,
  index,
  onSelect,
}: {
  project: Project;
  locale: Locale;
  t: Copy;
  index: number;
  onSelect: (project: Project) => void;
}) {
  return (
    <button
      className={"project-card project-" + project.id}
      onClick={() => onSelect(project)}
    >
      <span className="sr-only">{t.work.view}: </span>
      <div className="project-visual">
        <div className="project-glow" />
        <span className="project-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={21} />
        </span>
        <div className="project-screen">
          <div className="browser-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <i>{project.name.toLowerCase()}</i>
          </div>
          <picture>
            <source
              srcSet={`/projects/${project.id}-small.webp 640w, ${thumbnail(project)} 960w`}
              sizes="(max-width: 700px) calc(100vw - 80px), (max-width: 1440px) calc(50vw - 110px), 590px"
            />
            <Image
              src={thumbnail(project)}
              alt=""
              width={960}
              height={600}
              sizes="(max-width: 700px) 92vw, 46vw"
              loading="lazy"
              style={{ objectPosition: project.position }}
            />
          </picture>
        </div>
        {project.stage && (
          <span className="stage-badge">
            {project.stage === "Prototype"
              ? t.work.prototype
              : t.work.development}
          </span>
        )}
      </div>
      <div className="project-caption">
        <div>
          <h3>{project.name}</h3>
          <p>{project[locale].tagline}</p>
        </div>
        <span className="project-category">
          {t.work.categories[project.category]}
        </span>
      </div>
    </button>
  );
}
