import { forwardRef, useCallback, useLayoutEffect, useRef } from "react";
import { AnimatePresence, m, useInView, useIsPresent } from "framer-motion";
import { useReducedMotion } from "framer-motion";

import { languageVariants } from "./languageMotion";
import type { LanguageEffect, LanguageMotionContext } from "./languageMotion";

function textContent(text: string, emphasis?: string) {
  return emphasis && text.endsWith(emphasis) ? (
    <span>
      {text.slice(0, -emphasis.length)}
      <em>{emphasis}</em>
    </span>
  ) : (
    text
  );
}

const LanguageLayer = forwardRef<
  HTMLSpanElement,
  { text: string; emphasis?: string; context: LanguageMotionContext }
>(function LanguageLayer({ text, emphasis, context }, ref) {
  const present = useIsPresent();
  const element = useRef<HTMLSpanElement | null>(null);
  const attach = useCallback(
    (node: HTMLSpanElement | null) => {
      element.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    // popLayout rounds offsetWidth. Keep subpixel text width so an outgoing
    // line cannot wrap to a second line halfway through its transition.
    const observer = new ResizeObserver(([entry]) => {
      if (!node.hasAttribute("data-motion-pop-id")) {
        node.style.setProperty(
          "--language-measured-width",
          `${entry.contentRect.width + 1}px`,
        );
        if (context.effect === "turn") {
          node.style.setProperty(
            "--language-depth",
            `${entry.contentRect.height / 2}px`,
          );
        }
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [context.effect]);

  return (
    <m.span
      ref={attach}
      className="clyra-language-layer"
      aria-hidden={
        (!present && context.effect !== "fade" && context.effect !== "wipe") ||
        undefined
      }
      custom={context}
      variants={languageVariants}
      initial="incoming"
      animate="visible"
      exit="outgoing"
    >
      {textContent(text, emphasis)}
    </m.span>
  );
});

/** Copy changes animate; links, controls, artwork and focus stay mounted. */
export function LanguageText({
  children,
  align = "start",
  emphasis,
  effect = "roll",
}: {
  children: string;
  align?: "start" | "center" | "end";
  emphasis?: string;
  effect?: LanguageEffect;
}) {
  const surface = useRef<HTMLSpanElement>(null);
  const visible = useInView(surface);
  const reduced = useReducedMotion();
  const enabled = visible && !reduced;
  const context = { surface, enabled, effect };

  return (
    <m.span
      ref={surface}
      className="clyra-language-text"
      data-language-surface
      data-language-align={align}
      data-language-effect={effect}
      layout={
        enabled && effect === "roll" && align !== "center" ? "position" : false
      }
      transition={{ layout: { duration: 0.64, ease: [0.65, 0, 0.35, 1] } }}
    >
      {enabled ? (
        <AnimatePresence
          initial={false}
          mode={effect === "fade" || effect === "wipe" ? "wait" : "popLayout"}
          custom={context}
          anchorX={align === "end" ? "right" : "left"}
        >
          <LanguageLayer
            key={children}
            text={children}
            emphasis={emphasis}
            context={context}
          />
        </AnimatePresence>
      ) : (
        <span className="clyra-language-layer">
          {textContent(children, emphasis)}
        </span>
      )}
    </m.span>
  );
}
