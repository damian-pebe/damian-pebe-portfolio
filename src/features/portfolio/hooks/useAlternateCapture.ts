import { useEffect, type RefObject } from "react";

/** Warm only visible alternate captures, without fetching unopened galleries. */
export function useAlternateCapture(
  ref: RefObject<HTMLImageElement | null>,
  alternate: string | undefined,
  srcSet?: string,
  sizes?: string,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !alternate) return;
    if (
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData
    )
      return;
    const warm = () => {
      const image = new Image();
      image.fetchPriority = "low";
      if (sizes) image.sizes = sizes;
      if (srcSet) image.srcset = srcSet;
      image.src = alternate;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (element.complete) warm();
      else element.addEventListener("load", warm, { once: true });
      observer.disconnect();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("load", warm);
    };
  }, [ref, alternate, srcSet, sizes]);
}
