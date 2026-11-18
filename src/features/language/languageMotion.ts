import type { RefObject } from "react";
import type { Variants } from "framer-motion";

export type LanguageEffect = "roll" | "turn" | "wipe" | "fade";
export interface LanguageMotionContext {
  surface: RefObject<HTMLSpanElement | null>;
  enabled: boolean;
  effect: LanguageEffect;
}

function waveDelay({ surface, enabled, effect }: LanguageMotionContext) {
  if (!enabled || !surface.current) return 0;
  const text = surface.current.getBoundingClientRect();
  const button = document
    .querySelector(".language-switch")
    ?.getBoundingClientRect();
  return (
    Math.min(
      Math.hypot(text.left - (button?.left ?? innerWidth), text.top - 40) /
        Math.hypot(innerWidth, innerHeight),
      1,
    ) * (effect === "turn" ? 0.04 : 0.09)
  );
}

/** Motion follows the role of the text instead of applying one gesture everywhere. */
export const languageVariants: Variants = {
  incoming: ({ effect }: LanguageMotionContext) => {
    switch (effect) {
      case "fade":
        return { opacity: 0 };
      case "wipe":
        return { clipPath: "inset(0% 100% 0% 0%)", filter: "brightness(1.25)" };
      case "turn":
        return { rotateX: -90, filter: "brightness(0.55)" };
      default:
        return { y: "100%", clipPath: "inset(0% -2px 100% -2px)" };
    }
  },
  visible: (context: LanguageMotionContext) => {
    switch (context.effect) {
      case "fade":
        return {
          opacity: 1,
          transition: {
            duration: context.enabled ? 0.26 : 0,
            ease: [0.22, 1, 0.36, 1],
          },
        };
      case "wipe":
        return {
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "brightness(1)",
          transition: {
            duration: context.enabled ? 0.4 : 0,
            ease: [0.22, 1, 0.36, 1],
          },
        };
      case "turn":
        return {
          rotateX: 0,
          filter: "brightness(1)",
          transition: {
            duration: context.enabled ? 0.7 : 0,
            delay: waveDelay(context),
            ease: [0.45, 0, 0.2, 1],
          },
        };
      default:
        return {
          y: "0%",
          clipPath: "inset(0% -2px 0% -2px)",
          transition: {
            duration: context.enabled ? 0.64 : 0,
            delay: waveDelay(context),
            ease: [0.65, 0, 0.35, 1],
          },
        };
    }
  },
  outgoing: (context: LanguageMotionContext) => {
    switch (context.effect) {
      case "fade":
        return {
          opacity: 0,
          transition: {
            duration: context.enabled ? 0.16 : 0,
            ease: [0.4, 0, 1, 1],
          },
        };
      case "wipe":
        return {
          clipPath: "inset(0% 0% 0% 100%)",
          filter: "brightness(1.25)",
          transition: {
            duration: context.enabled ? 0.22 : 0,
            ease: [0.4, 0, 1, 1],
          },
        };
      case "turn":
        return {
          rotateX: context.enabled ? 90 : 0,
          filter: "brightness(0.55)",
          transition: {
            duration: context.enabled ? 0.7 : 0,
            delay: waveDelay(context),
            ease: [0.45, 0, 0.2, 1],
          },
        };
      default:
        return {
          y: context.enabled ? "-100%" : "0%",
          clipPath: "inset(100% -2px 0% -2px)",
          transition: {
            duration: context.enabled ? 0.64 : 0,
            delay: waveDelay(context),
            ease: [0.65, 0, 0.35, 1],
          },
        };
    }
  },
};
