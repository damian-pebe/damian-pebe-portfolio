import {
  m,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useSite } from "@/features/site/SiteContext";
export function HeroWordmark() {
  const { locale, theme } = useSite();
  const previous = useRef(locale);
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  useEffect(() => {
    const glow =
      theme === "dark"
        ? "0 0 20px #ffffff40, 0 0 40px #ffffff1a, 0 0 60px #ffffff08"
        : "0 0 20px #00000008, 0 0 40px #00000000, 0 0 60px #00000000";
    const rest = {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      textShadow: glow,
    };
    if (previous.current === locale || reduced || !visible) {
      previous.current = locale;
      controls.set(rest);
      return;
    }
    previous.current = locale;
    const direction = locale === "es" ? -1 : 1;
    void controls.start({
      x: [0, direction * 24, direction * -5, 0],
      y: [0, -32, 6, 0],
      rotateY: [0, direction * 48, direction * -10, 0],
      rotateZ: [0, direction * 6, direction * -1.5, 0],
      scale: [1, 1.2, 0.98, 1],
      textShadow: [
        glow,
        theme === "dark"
          ? "0 0 30px #ffffffcf, 0 0 64px #ffffff99, 0 0 100px #ffffff52"
          : "0 0 30px #00000020, 0 0 64px #00000010, 0 0 100px #00000000",
        glow,
        glow,
      ],
      transition: {
        duration: 0.74,
        times: [0, 0.36, 0.72, 1],
        ease: [0.22, 1, 0.36, 1],
      },
    });
    return () => {
      controls.stop();
      controls.set(rest);
    };
  }, [locale, theme, controls, reduced, visible]);
  return (
    <m.span
      ref={ref}
      data-language-wordmark
      initial={false}
      animate={controls}
      style={{ transformPerspective: 700, transformOrigin: "50% 60%" }}
    >
      damian pérez
    </m.span>
  );
}
