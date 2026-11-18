import {
  m,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useSite } from "@/features/site/SiteContext";
import { site } from "@/lib/site";

/** A brief refractive shift accompanies a language change without moving the layout. */
export function HeroWordmark() {
  const { locale } = useSite();
  const previous = useRef(locale);
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  useEffect(() => {
    const rest = { y: 0, filter: "blur(0px)", opacity: 1 };
    if (previous.current === locale || reduced || !visible) {
      previous.current = locale;
      controls.set(rest);
      return;
    }
    previous.current = locale;
    void controls.start({
      y: [0, -5, 0],
      filter: ["blur(0px)", "blur(3px)", "blur(0px)"],
      opacity: [1, 0.45, 1],
      transition: {
        duration: 0.65,
        times: [0, 0.35, 1],
        ease: [0.22, 1, 0.36, 1],
      },
    });
    return () => {
      controls.stop();
      controls.set(rest);
    };
  }, [locale, controls, reduced, visible]);
  return (
    <m.span ref={ref} data-language-wordmark initial={false} animate={controls}>
      {site.name}
    </m.span>
  );
}
