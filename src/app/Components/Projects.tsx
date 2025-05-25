"use client";
import React from "react";

import { motion, Transition } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUpRight } from "react-bootstrap-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  const projects = [
    {
      title: "Aura Tejida",
      description: "E-commerce website for handmade crochet products",
      image: "/auraTejidaHero.jpg",
      logo: "/damianCrop.jpg",
      link: "https://luxoflex.vercel.app",
    },
    {
      title: "Luxoflex",
      description: "A pretty website for label design",
      image: "/luxoflexHero.jpg",
      logo: "/luxoflex.png",
      link: "https://luxoflex.vercel.app",
    },
    {
      title: "PetWalks",
      description: "Mobile app for pet walking",
      image: "/petwalks.png",
      logo: "/petwalksLogo.png",
      link: "https://luxoflex.vercel.app",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center md:pt-16 px-4 sm:px-6">
      <Badge className="bg-gradient-to-r from-zinc-700 via-black to-zinc-700 text-white mb-10">
        New Projects
      </Badge>
      <BlurText
        text="Crafted to Impress,"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-black font-black font-careny text-6xl mb-6 sm:mb-8 text-center w-full flex justify-center items-center"
      />
      <BlurText
        text="Build to Perform"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-black font-ephesis text-6xl mb-6 sm:mb-8 text-center w-full flex justify-center items-center"
      />
      <div className="h-0.5 w-1/3 bg-black/60 rounded-sm my-3" />
      <div>
        <BlurText
          text="Explore my latest projects that showcase my skills and creativity."
          delay={150}
          animateBy="words"
          direction="top"
          className="text-zinc-700 font-poppins tracking-widest text-base sm:text-sm mb-6 sm:mb-8 text-center w-full flex justify-center items-center"
        />
      </div>
      <div className="py-16 sm:py-16 flex flex-wrap justify-center gap-10">
        {projects.map((item, index) => (
          <div
            key={index}
            className="hover:cursor-pointer group relative flex flex-col items-center justify-center overflow-hidden rounded-[30px] w-full sm:max-w-[500px] md:max-w-[80%] lg:md:max-w-[50%] h-full md:h-[50%]"
          >
            <img
              src={item.image}
              alt="Projects"
              className="object-cover w-full rounded-3xl group-hover:scale-100 sm:scale-105 transition-transform duration-1000"
            />
            <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 md:translate-y-full transition-all duration-700 group-hover:-translate-y-2">
              <div className="flex items-center justify-between bg-[#FAFAFA] rounded-[40px] shadow-md px-4 sm:px-6 py-2 md:py-4 mb-1 w-full mt-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-10 sm:h-12 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={item.logo}
                      alt={item.title}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-black text-base">
                      {item.title}
                    </h2>
                    <p className="hidden md:flex text-gray-500 text-xs md:text-sm ">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all transform hover:-translate-y-1 border hover:border-black/10 shadow-xl shadow-black/10 hover:shadow-black/30 duration-700 text-xs sm:text-sm"
                >
                  View Project <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

        const spanTransition: Transition & { ease: (t: number) => number } = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

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
