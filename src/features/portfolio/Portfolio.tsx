"use client";
import { useEffect, useState } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { copy, type Locale } from "@/i18n/copy";
import type { Project } from "./data/projects";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Approach } from "./components/Approach";
import { Contact } from "./components/Contact";
const ProjectDialog = dynamic(
  () =>
    import("./components/ProjectDialog").then((module) => module.ProjectDialog),
  { ssr: false },
);
export function Portfolio({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState<Project | null>(null);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div id="top">
          <a className="skip-link" href="#main">
            {t.skip}
          </a>
          <Header locale={locale} t={t} />
          <main id="main">
            <Hero t={t} />
            <div className="project-signatures shell" aria-hidden="true">
              <span>AgentOS</span>
              <span>omnicube</span>
              <span>Neurocity</span>
              <span>Fiscalité</span>
              <span>Constella</span>
              <span>rook.</span>
            </div>
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
