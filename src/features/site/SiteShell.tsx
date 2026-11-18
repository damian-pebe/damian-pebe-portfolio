"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LazyMotion,
  domAnimation,
  LayoutGroup,
  MotionConfig,
} from "framer-motion";
import { copy } from "@/i18n/copy";
import { useLocale } from "@/features/language/useLocale";
import { useTheme } from "@/features/theme/useTheme";
import { pageFromPath } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { SiteContext } from "./SiteContext";
import { useLegacyFragments } from "./hooks/useLegacyFragments";
import { Header } from "./components/Header";
import { GlassFilter } from "./components/GlassFilter";
import { Contact } from "./components/Contact";
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const page = pageFromPath(pathname);
  const language = useLocale(pathname.startsWith("/en") ? "en" : "es", page);
  const preference = useTheme(pathname);
  const t = copy[language.locale];
  useLegacyFragments(language.locale);
  return (
    <SiteContext.Provider
      value={{
        locale: language.locale,
        t,
        page,
        theme: preference.theme,
        languageChanging: language.changing,
        themeChanging: preference.changing,
        changeLocale: language.change,
        toggleTheme: preference.toggle,
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <LayoutGroup>
            <div id="top">
              <GlassFilter />
              <button
                className="skip-link"
                onClick={() => scrollToSection("main", true)}
              >
                {t.skip}
              </button>
              <Header />
              <main id="main" tabIndex={-1}>
                {children}
              </main>
              <Contact t={t} />
            </div>
          </LayoutGroup>
        </MotionConfig>
      </LazyMotion>
    </SiteContext.Provider>
  );
}
