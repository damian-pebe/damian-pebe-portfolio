import { useEffect, type RefObject } from "react";

/** Warm only visible alternate captures, without fetching unopened galleries. */
export function useAlternateCapture(
  ref: RefObject<HTMLImageElement | null>,
  alternate: string | undefined,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !alternate) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const image = new Image();
      image.fetchPriority = "low";
      image.src = alternate;
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, alternate]);
}
