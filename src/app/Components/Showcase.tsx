"use client";

export default function Showcase() {
  return (
    <div className="justify-items-center items-center flex justify-center py-20">
      <Carousel
        autoplay={true}
        autoplayDelay={1000}
        loop={true}
        round={false}
      />
    </div>
  );
}

import { useEffect, useState, useRef, JSX } from "react";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import { Github } from "react-bootstrap-icons";
import Link from "next/link";
import { Link2 } from "lucide-react";
import {
  github_damian_pebe_portfolio,
  github_auratejida,
  github_luxoflex,
  web_damian_pebe_portfolio,
  web_auratejida,
  web_luxoflex,
  github_latteStore,
  web_latteStore,
  github_fancy,
  web_fancy,
} from "@/Environment/SocialsLinks";

export interface CarouselItem {
  githubRepo: string;
  webPageLink: string;
  title: string;
  image: string;
  icon: JSX.Element;
}

export interface CarouselProps {
  items?: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    githubRepo: github_auratejida,
    webPageLink: web_auratejida,
    title: "Aura Tejida",
    image: "/auraHero.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_auratejida,
    webPageLink: web_auratejida,
    title: "Aura Tejida Catalog",
    image: "/auraTejidaCatalog.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_auratejida,
    webPageLink: web_auratejida,
    title: "Aura Tejida Showcase",
    image: "/auraTejidaShowcase.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_luxoflex,
    webPageLink: web_luxoflex,
    title: "Luxoflex",
    image: "/luxoflexHero.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_luxoflex,
    webPageLink: web_luxoflex,
    title: "Luxoflex Materiales",
    image: "/luxoflexMateriales.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },

  {
    githubRepo: github_latteStore,
    webPageLink: web_latteStore,
    title: "Latte Heaven",
    image: "/latteHeaven.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_latteStore,
    webPageLink: web_latteStore,
    title: "Latte Heaven Menu",
    image: "/latteHeavenMenu.jpg",
    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_fancy,
    webPageLink: web_fancy,
    title: "Fancy Microblading",
    image: "/fancyStudio.jpg",
    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_fancy,
    webPageLink: web_fancy,
    title: "Fancy Microblading",
    image: "/fancyStudioServices.jpg",
    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_fancy,
    webPageLink: web_fancy,
    title: "Fancy Microblading",
    image: "/fancyStudioTestimonials.jpg",
    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
  {
    githubRepo: github_damian_pebe_portfolio,
    webPageLink: web_damian_pebe_portfolio,
    title: "Personal Portfolio",
    image: "/portfolio.jpg",

    icon: <Github className="h-[16px] w-[16px] text-white" />,
  },
].sort(() => Math.random() - 0.5);

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function Carousel({
  items = DEFAULT_ITEMS,
  autoplay = true,
  autoplayDelay = 500,
  loop = true,
  round = false,
}: CarouselProps): JSX.Element {
  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [itemWidth, setItemWidth] = useState(400);
  const trackItemOffset = itemWidth + GAP;

  useEffect(() => {
    const updateItemWidth = () => {
      const width =
        window.innerWidth < 640
          ? window.innerWidth - 60
          : (window.innerWidth * 2) / 3;
      setItemWidth(width);
    };

    updateItemWidth(); // Set on mount
    window.addEventListener("resize", updateItemWidth); // Update on resize

    return () => window.removeEventListener("resize", updateItemWidth);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    if (autoplay && !isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-2 md:p-4 w-full  ${
        round
          ? "rounded-full border border-white"
          : "rounded-[24px] border border-[#222]"
      }`}
      style={{
        ...(round &&
          containerRef.current && {
            height: `${containerRef.current.offsetWidth / 2}px`,
          }),
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${
            currentIndex * trackItemOffset + itemWidth / 2
          }px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          return (
            <motion.div
              key={index}
              className={`group relative shrink-0 flex flex-col h-[150px] md:h-[500px] ${
                round
                  ? "items-center justify-center text-center bg-[#060606] border-0"
                  : "items-start justify-between border border-[#222] rounded-[12px]"
              } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              <div className={`${round ? "p-0 m-0" : "mb-4 p-5"}`}>
                <Link
                  href={item.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 text-xl items-center justify-center rounded-full bg-[#060606] transform hover:-translate-y-2 duration-700 hover:shadow-lg shadow-black/30 hover:shadow-black/60"
                >
                  {item.icon}
                </Link>
              </div>
              <div className="absolute bottom-0 translate-y-full transition-all duration-1000 group-hover:translate-y-0 w-full py-2 bg-[#fafafa82] rounded-t-3xl">
                <Link
                  href={item.webPageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center gap-x-5 mb-1 font-plaster text-sm sm:text-base md:text-lg lg:text-xl text-black text-center underline"
                >
                  {item.title} <Link2 />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div
        className={`flex w-full justify-center ${
          round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
        }`}
      >
        <div className="mt-4 flex w-[150px] justify-between gap-2">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? round
                    ? "bg-white"
                    : "bg-[#333333]"
                  : round
                  ? "bg-[#555]"
                  : "bg-[rgba(51,51,51,0.4)]"
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
