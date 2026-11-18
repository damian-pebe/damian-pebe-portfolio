import { useState } from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Copy, Locale } from "@/i18n/copy";
import { projects, thumbnail, type Project } from "../data/projects";
import { LanguageText } from "../effects/LanguageText";
import { DeviceMockup } from "./DeviceMockup";

const featured = [
  "omnicube",
  "agentos",
  "neurocity",
  "fiscalite",
  "constella",
  "rook",
].map((id) => projects.find((project) => project.id === id)!);
export function FeaturedProjects({
  t,
  locale,
  onSelect,
}: {
  t: Copy;
  locale: Locale;
  onSelect: (project: Project) => void;
}) {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0),
    pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 100, damping: 22 }),
    rotateY = useSpring(pointerX, { stiffness: 100, damping: 22 });
  const project = featured[current];
  const move = (direction: number) =>
    setCurrent(
      (value) => (value + direction + featured.length) % featured.length,
    );
  return (
    <section className="featured shell" aria-labelledby="featured-title">
      <link
        rel="preload"
        as="image"
        href={thumbnail(featured[0])}
        fetchPriority="high"
      />
      <div className="featured-caption">
        <h2 id="featured-title">
          <LanguageText>{t.featured.title}</LanguageText>
        </h2>
        <span>{t.featured.label} / 06</span>
      </div>
      <div
        className="showcase"
        onPointerMove={(event) => {
          if (reduced || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set(
            ((event.clientX - rect.left - rect.width / 2) / rect.width) * 4,
          );
          pointerY.set((0.5 - (event.clientY - rect.top) / rect.height) * 3);
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        role="region"
        aria-label={t.featured.title}
        aria-roledescription={t.featured.carousel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="showcase-top">
          <span className="project-pill">
            <LanguageText>{t.work.categories[project.category]}</LanguageText>
          </span>
          <span className="showcase-edition">
            DAMIAN PÉREZ / {t.featured.edition}
          </span>
        </div>
        <m.div
          className="showcase-sheen"
          aria-hidden="true"
          initial={{ x: "-110%", opacity: 0 }}
          animate={
            reduced ? { opacity: 0 } : { x: "110%", opacity: [0, 0.6, 0] }
          }
          transition={{ duration: 1.5, delay: 0.3, ease: [0.2, 0.6, 0.3, 1] }}
        />
        <div className="showcase-stage">
          <AnimatePresence initial={false} mode="sync">
            <m.div
              key={project.id}
              className="showcase-device"
              style={{
                rotateX: reduced ? 0 : rotateX,
                rotateY: reduced ? 0 : rotateY,
                transformPerspective: 1200,
              }}
              initial={{
                opacity: 0,
                y: reduced ? 0 : 24,
                scale: reduced ? 1 : 0.96,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduced ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <DeviceMockup project={project} priority />
            </m.div>
          </AnimatePresence>
        </div>
        <div className="showcase-copy" aria-live="polite" aria-atomic="true">
          <m.div
            key={project.id}
            initial={false}
            style={{ opacity: 1, transform: "none" }}
            animate={reduced ? undefined : { y: [12, 0], opacity: [0.4, 1] }}
            transition={{ duration: 0.45 }}
          >
            <p className="showcase-kicker">
              <LanguageText>{project[locale].tagline}</LanguageText>
            </p>
            <h3>{project.name}</h3>
            <p className="showcase-description">
              {project[locale].description.split(". ")[0]}.
            </p>
          </m.div>
          <button
            className="button button-primary"
            onClick={() => onSelect(project)}
          >
            <LanguageText>{t.featured.discover}</LanguageText>
            <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="showcase-controls">
          <span>
            0{current + 1}
            <span> / 06</span>
          </span>
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label={t.featured.previous}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label={t.featured.next}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div
        className="featured-tabs"
        role="group"
        aria-label={t.featured.choose}
      >
        {featured.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={index === current}
            onClick={() => setCurrent(index)}
          >
            <span>0{index + 1}</span>
            {item.name}
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
    </section>
  );
}
