"use client";
import { useState } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { copy, type Locale } from "@/i18n/copy";
import type { Project } from "./data/projects";
import { GlassFilter } from "./components/GlassFilter";
import { useLocale } from "./hooks/useLocale";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Projects } from "./components/Projects";
import { Approach } from "./components/Approach";
import { Contact } from "./components/Contact";
const ProjectDialog = dynamic(
  () =>
    import("./components/ProjectDialog").then((module) => module.ProjectDialog),
  { ssr: false },
);
export function Portfolio({ locale: initialLocale }: { locale: Locale }) {
  const { locale, change } = useLocale(initialLocale);
  const t = copy[locale];
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div id="top">
          <GlassFilter />
          <a className="skip-link" href="#main">
            {t.skip}
          </a>
          <Header locale={locale} t={t} onLocaleChange={change} />
          <main id="main">
            <Hero t={t} locale={locale} />
            <FeaturedProjects t={t} locale={locale} onSelect={setSelected} />
            <Projects locale={locale} t={t} onSelect={setSelected} />
            <Approach t={t} />
            <Contact t={t} />
          </main>
          {selected && (
            <ProjectDialog
              key={selected.id}
              project={selected}
              locale={locale}
              t={t}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
