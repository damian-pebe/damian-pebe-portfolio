import { useRef, type PointerEvent } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
export function useHeroMotion() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 }),
    springY = useSpring(y, { stiffness: 150, damping: 15 });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse" || !title.current) return;
    const rect = title.current.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(dx, dy);
    const strength =
      distance > 0 && distance < 400
        ? ((1 - distance / 400) * 50) / distance
        : 0;
    x.set(dx * strength);
    y.set(dy * strength);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };
  return {
    section,
    title,
    onPointerMove,
    onPointerLeave,
    contentStyle: {
      opacity: reduced ? 1 : opacity,
      scale: reduced ? 1 : scale,
    },
    titleStyle: { x: reduced ? 0 : springX, y: reduced ? 0 : springY },
  };
}
