import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import type { Copy } from "@/i18n/copy";
import { BackgroundPaths } from "../effects/BackgroundPaths";
export function Hero({ t }: { t: Copy }) {
  const reduced = useReducedMotion();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <BackgroundPaths />
      <div className="hero-content shell">
        <div className="hero-identity">
          <Image
            src="/portrait.webp"
            alt=""
            width={32}
            height={32}
            loading="eager"
          />
          <p>{t.hero.role}</p>
        </div>
        <h1 id="hero-title">
          <m.span
            initial={false}
            style={{ opacity: 1, transform: "none" }}
            animate={reduced ? undefined : { y: [30, 0], opacity: [0.4, 1] }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Damian Pérez<span className="hero-period">.</span>
          </m.span>
        </h1>
        <p className="hero-description">{t.hero.description}</p>
        <div className="hero-actions">
          <a className="hero-work-link" href="#work">
            {t.hero.secondary}
            <ArrowDown size={15} />
          </a>
          <span aria-hidden="true" />
          <a className="hero-contact-link" href="#contact">
            {t.hero.primary}
            <ArrowUpRight size={15} />
          </a>
        </div>
        <span className="hero-location">{t.hero.location}</span>
      </div>
    </section>
  );
}
