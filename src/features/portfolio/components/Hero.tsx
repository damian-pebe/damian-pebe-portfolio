import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  m,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Copy, Locale } from "@/i18n/copy";
import { ClyraThreads } from "../effects/ClyraThreads";
import { LanguageText } from "../effects/LanguageText";
export function Hero({ t, locale }: { t: Copy; locale: Locale }) {
  const reduced = useReducedMotion();
  const previous = useRef(locale);
  const controls = useAnimationControls();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  useEffect(() => {
    if (previous.current === locale) return;
    previous.current = locale;
    if (reduced) return;
    const direction = locale === "es" ? -1 : 1;
    void controls.start({
      y: [0, -9, 2, 0],
      rotateY: [0, direction * 20, direction * -3, 0],
      rotateZ: [0, direction * 1.5, 0],
      scale: [1, 1.06, 1],
      transition: { duration: 0.74, ease: [0.22, 1, 0.36, 1] },
    });
    return () => controls.stop();
  }, [locale, controls, reduced]);
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(
          Math.max(
            -8,
            Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.022),
          ),
        );
        y.set(
          Math.max(
            -5,
            Math.min(5, (event.clientY - rect.top - rect.height / 2) * 0.04),
          ),
        );
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <ClyraThreads />
      <div className="hero-content shell">
        <div className="hero-identity">
          <Image
            src="/portrait.webp"
            alt=""
            width={26}
            height={26}
            loading="eager"
          />
          <p>
            <LanguageText effect="fade" align="center">
              {t.hero.role}
            </LanguageText>
          </p>
        </div>
        <h1 id="hero-title">
          <m.span
            style={{ x: reduced ? 0 : springX, y: reduced ? 0 : springY }}
          >
            <m.span
              initial={false}
              animate={controls}
              style={{ transformPerspective: 700, transformOrigin: "50% 60%" }}
            >
              Damian Pérez.
            </m.span>
          </m.span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-description">
            <LanguageText effect="turn" align="center">
              {t.hero.description}
            </LanguageText>
          </p>
          <div className="hero-actions">
            <a className="hero-work-link" href="#work">
              <LanguageText>{t.hero.secondary}</LanguageText>
              <span className="hero-arrow">
                <ArrowDown size={14} />
              </span>
            </a>
            <a className="hero-contact-link" href="#contact">
              <LanguageText>{t.hero.primary}</LanguageText>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
