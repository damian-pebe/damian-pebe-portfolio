import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { gallery } from "../data/projectMedia";
import type { Project } from "../data/projects";
import { DeviceMockup } from "./DeviceMockup";
import { CaptureImage } from "./CaptureImage";
export function ProjectDialog({
  project,
  t,
  locale,
  onClose,
}: {
  project: Project;
  t: Copy;
  locale: Locale;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [slide, setSlide] = useState(0);
  const [raw, setRaw] = useState(false);
  const images = {
    light: gallery(project, "light"),
    dark: gallery(project, "dark"),
  };
  const imageCount = images.light.length;
  const content = project[locale];
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const move = (direction: number) =>
    setSlide((value) => (value + direction + imageCount) % imageCount);
  return (
    <dialog
      className="project-dialog"
      ref={dialog}
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <div className="dialog-inner">
        <button
          className="dialog-close icon-button"
          onClick={onClose}
          aria-label={t.work.close}
          autoFocus
        >
          <X size={22} />
        </button>
        <div className="dialog-heading">
          <p className="eyebrow">
            {t.work.categories[project.category]}
            {project.stage &&
              " / " +
                (project.stage === "Prototype"
                  ? t.work.prototype
                  : t.work.development)}
          </p>
          <h2 id="project-dialog-title">{project.name}</h2>
          <p>{content.tagline}</p>
        </div>
        {project.second && (
          <div className="gallery-toggle">
            <button onClick={() => setRaw(!raw)}>
              {raw ? t.work.mockup : t.work.capture}
            </button>
          </div>
        )}
        <div className="dialog-gallery">
          {!raw && project.second ? (
            <div className="dialog-mockup">
              <DeviceMockup
                project={project}
                slide={slide}
                detail
                priority
                alt={project.name + " — " + t.work.gallery + " " + (slide + 1)}
              />
            </div>
          ) : (
            <CaptureImage
              sources={{ light: images.light[slide], dark: images.dark[slide] }}
              alt={project.name + " — " + t.work.gallery + " " + (slide + 1)}
              width={1600}
              height={1000}
              sizes="(max-width: 700px) 94vw, 960px"
            />
          )}
          {imageCount > 1 && (
            <div className="gallery-controls">
              <button
                className="icon-button"
                onClick={() => move(-1)}
                aria-label={t.work.previous}
              >
                <ChevronLeft size={20} />
              </button>
              <span aria-live="polite">
                0{slide + 1} / 0{imageCount}
              </span>
              <button
                className="icon-button"
                onClick={() => move(1)}
                aria-label={t.work.next}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="dialog-story">
          <div>
            <p>{content.description}</p>
            <a
              className="text-link"
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.work.complete}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h3 className="eyebrow">{t.work.capabilities}</h3>
            <ul>
              {content.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {(!project.second ||
          [
            "omnicube",
            "neurocity",
            "gemelo",
            "opticore",
            "omnios",
            "kioskos",
          ].includes(project.id)) && (
          <p className="capture-note">
            {!project.second ? t.work.concept : t.work.demo}
          </p>
        )}
      </div>
    </dialog>
  );
}
