import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

export function useHeroMotion() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.65], [0, 45]);
  return {
    section,
    contentStyle: { opacity: reduced ? 1 : opacity, y: reduced ? 0 : y },
  };
}
