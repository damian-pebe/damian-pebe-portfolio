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
      <div className="hero-halo" aria-hidden="true" />
      <div className="hero-content shell">
        <div className="hero-identity">
          <Image
            src="/portrait.webp"
            alt="Damian Pérez Becerril"
            width={44}
            height={44}
            priority
          />
          <div>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <p className="identity-role">{t.hero.role}</p>
          </div>
        </div>
        <h1 id="hero-title" className="hero-title" key={t.hero.line1}>
          {[t.hero.line1, t.hero.line2].map((line, index) => (
            <span className="hero-line" key={line}>
              <m.span
                className={index ? "silver-text" : undefined}
                initial={false}
                animate={
                  reduced
                    ? undefined
                    : {
                        y: [35, 0],
                        opacity: [0.35, 1],
                        filter: ["blur(5px)", "blur(0px)"],
                      }
                }
                transition={{
                  duration: 0.85,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </m.span>
            </span>
          ))}
        </h1>
        <div className="hero-bottom">
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              {t.hero.primary}
              <ArrowUpRight size={18} />
            </a>
            <a className="button button-quiet" href="#work">
              {t.hero.secondary}
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="hero-meta">
          <span>
            <i aria-hidden="true" />
            {t.hero.location}
          </span>
          <a href="#work">
            {t.hero.scroll}
            <ArrowDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
