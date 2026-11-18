import { ArrowUpRight } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import type { Project } from "../data/projects";
import { DeviceMockup } from "./DeviceMockup";
export function ProjectCard({
  project,
  locale,
  t,
  onSelect,
}: {
  project: Project;
  locale: Locale;
  t: Copy;
  onSelect: (project: Project) => void;
}) {
  return (
    <button
      className={"project-card project-" + project.id}
      onClick={() => onSelect(project)}
    >
      <span className="sr-only">{t.work.view}: </span>
      <div className="project-visual" aria-hidden="true">
        <span className="project-pill">
          {t.work.categories[project.category]}
        </span>
        <div className="project-device">
          <DeviceMockup project={project} />
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
          <span className="sr-only">
            {t.work.categories[project.category]}
            {project.stage &&
              " / " +
                (project.stage === "Prototype"
                  ? t.work.prototype
                  : t.work.development)}
          </span>
          <p>{project[locale].tagline}</p>
        </div>
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </button>
  );
}
