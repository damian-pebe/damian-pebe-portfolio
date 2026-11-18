import { freezeThemeSurfaces } from "./freezeThemeSurfaces";
import { waitForThemePaint } from "./waitForThemePaint";
export type ThemeOrigin = { x: number; y: number };

/** Reveal the new palette from the control without duplicating the live DOM. */
export function revealTheme(update: () => void, origin?: ThemeOrigin) {
  const root = document.documentElement;
  if (
    !document.startViewTransition ||
    document.visibilityState !== "visible" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return { finished: Promise.resolve(), cancel: () => {} };
  }

  const x = Math.max(0, Math.min(origin?.x ?? innerWidth / 2, innerWidth));
  const y = Math.max(0, Math.min(origin?.y ?? 40, innerHeight));
  const radius =
    Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 2;
  root.dataset.themeTransition = "reveal";
  let committed = false;
  let releaseSurfaces = () => {};
  const commit = () => {
    if (committed) return;
    committed = true;
    update();
    releaseSurfaces();
    // Keep the old snapshot until visible theme-specific captures can paint.
    // Preloading fetches the other variant; decode completes its preparation.
    const captures = Array.from(
      document.querySelectorAll<HTMLImageElement>("img[data-theme-image]"),
    ).filter((image) => {
      const rect = image.getBoundingClientRect();
      return (
        rect.bottom > 0 &&
        rect.top < innerHeight &&
        rect.right > 0 &&
        rect.left < innerWidth
      );
    });
    return Promise.allSettled([
      waitForThemePaint(),
      ...captures.map((image) => image.decode()),
    ]).then(() => {});
  };
  let transition: ViewTransition | undefined;
  let animation: Animation | undefined;
  let cancelled = false;
  const finished = (async () => {
    try {
      releaseSurfaces = await freezeThemeSurfaces();
      if (cancelled) {
        await commit();
        return;
      }
      transition = document.startViewTransition(commit);
      await transition.ready;
      if (cancelled) return;
      animation = root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 900,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
          fill: "both",
        },
      );
      await animation.finished;
    } catch {
      // A hidden tab, resize or route change can legitimately skip the capture.
      commit();
    } finally {
      releaseSurfaces();
      transition?.skipTransition();
      await transition?.finished.catch(() => {});
      animation?.cancel();
      delete root.dataset.themeTransition;
    }
  })();

  return {
    finished,
    cancel: () => {
      cancelled = true;
      animation?.cancel();
      transition?.skipTransition();
    },
  };
}
