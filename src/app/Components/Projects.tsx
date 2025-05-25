"use client";
import React from "react";
import Image from "next/image";

export default function Projects() {
  return (
    <div className="flex flex-col items-center justify-center py-20">

   
      <BlurText
        text="Crafted to Impress,"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-black font-black font-careny text-6xl mb-8 text-center w-full flex justify-center items-center"
      />
      <BlurText
        text="Build to Perform"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-black font-careny text-6xl mb-8 text-center w-full flex justify-center items-center"
      />

      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl">
        <Image
          src="/auraTejidaHero.jpg"
          alt="Projects"
          width={600}
          height={600}
          className="rounded-3xl group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 flex justify-between items-center translate-y-full transition-all duration-500 group-hover:-translate-y-2 bg-[#FAFAFA] rounded-3xl p-4 w-[580px]">
          <Image
            className="rounded-full group-hover:-rotate-6 duration-700"
            src="/damianCrop.jpg"
            width={60}
            height={60}
            alt="Profile Picture"
          />
          <button className="flex justify-center items-center p-4 bg-gray-500 rounded-full font-careny h-full">
            Visit Site <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

import { motion, Transition } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronRight } from "react-bootstrap-icons";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        };
        (spanTransition as any).ease = easing;

        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};
