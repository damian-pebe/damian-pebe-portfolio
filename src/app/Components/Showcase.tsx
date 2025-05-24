"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Showcase() {
  const baseImages = ["/portfolio.jpg", "/portfolio.jpg"];
  const images = [...baseImages, ...baseImages];

  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(baseImages.length);
  const [direction, setDirection] = useState(0); 

  useEffect(() => {
    scrollTo(current, false);
  }, []);

  const scrollTo = (index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement;
    if (slide) {
      container.scrollTo({
        left: slide.offsetLeft - (container.offsetWidth - slide.offsetWidth) / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    setCurrent(index);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollLeft, offsetWidth } = container;
    const center = scrollLeft + offsetWidth / 2;

    let closestIndex = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const diff = Math.abs(center - elCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    setCurrent(closestIndex);
  };

  const centerNearest = () => {
    scrollTo(current);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const total = images.length;
    if (current === 0) {
      scrollTo(baseImages.length, false);
    } else if (current === total - 1) {
      scrollTo(baseImages.length - 1, false);
    }
  }, [current]);

  const handleNext = () => {
    setDirection(1);
    scrollTo(current + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    scrollTo(current - 1);
  };

  return (
    <div className="relative w-full overflow-hidden px-4 py-8">
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          onMouseUp={centerNearest}
          onTouchEnd={centerNearest}
          className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide cursor-grab px-24"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
         {images.map((src, idx) => {
  const isActive = idx === current;
  const isNeighbor = Math.abs(idx - current) === 1;

  const scale = isActive ? "scale-100" : isNeighbor ? "scale-95" : "scale-90";
  const opacity = isActive ? "opacity-100" : isNeighbor ? "opacity-80" : "opacity-60";

  return (
    <div
      key={idx}
      className={`shrink-0 snap-center transform transition-all duration-500 ease-in-out ${scale} ${opacity}`}
style={{ width: "55%", flex: "0 0 55%" }}
    >
      <Image
        src={src}
        alt={`slide-${idx}`}
        width={700}
        height={400}
        className="w-full h-[400px] object-cover rounded-3xl shadow-xl"
      />
    </div>
  );
})}

        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
