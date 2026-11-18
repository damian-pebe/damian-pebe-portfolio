"use client";
import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [18, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
