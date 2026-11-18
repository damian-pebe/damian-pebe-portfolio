import {
  themeSnapshotEvent,
  type ThemeSnapshotRequest,
} from "@/features/theme/freezeThemeSurfaces";
import { useEffect, useRef } from "react";
import { createMetalRenderer } from "../effects/createMetalRenderer";
export function useMetalBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // The hook owns the canvas lifetime, including Strict Mode and hot reload.
    const canvas = document.createElement("canvas");
    canvas.dataset.effect = "shader-metal";
    canvas.dataset.running = "false";
    canvas.dataset.themeSurface = "";
    container.appendChild(canvas);
    const abort = new AbortController();
    let teardown = () => {};
    void createMetalRenderer(canvas, abort.signal).then((renderer) => {
      if (abort.signal.aborted) {
        renderer?.dispose();
        return;
      }
      if (!renderer) {
        canvas.dataset.renderer = "fallback";
        return;
      }
      canvas.dataset.renderer = "webgl";
      canvas.dataset.thread = renderer.thread;
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      const saveData = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection?.saveData;
      let raf = 0,
        time = 11,
        last = 0,
        onscreen = true,
        lost = false;
      const allowed = () =>
        onscreen && !document.hidden && !motion.matches && !saveData && !lost;
      const paint = () => {
        if (!lost)
          renderer.paint(
            time,
            document.documentElement.dataset.theme === "dark",
          );
      };
      const synchronizeTheme = () => {
        if (lost) return;
        const dark = document.documentElement.dataset.theme === "dark";
        void renderer.synchronizeTheme(time, dark).then(() => {
          if (!abort.signal.aborted && !lost)
            canvas.dataset.paintedTheme = dark ? "dark" : "light";
        });
      };
      const tick = (now: number) => {
        raf = 0;
        if (!allowed()) return;
        if (now - last >= 1000 / 30) {
          time += Math.min((now - last) / 1000, 0.05) * 0.75;
          last = now;
          paint();
        }
        raf = requestAnimationFrame(tick);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        canvas.dataset.running = String(allowed());
        paint();
        if (allowed()) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        renderer.resize(rect.width, rect.height, window.devicePixelRatio || 1);
        paint();
      };
      const size = new ResizeObserver(resize);
      const view = new IntersectionObserver(([entry]) => {
        onscreen = entry.isIntersecting;
        sync();
      });
      const theme = new MutationObserver(synchronizeTheme);
      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !allowed()) return;
        const rect = canvas.getBoundingClientRect();
        renderer.pointer(
          (event.clientX - rect.left) / rect.width,
          1 - (event.clientY - rect.top) / rect.height,
          true,
        );
      };
      const pointerLeave = () => renderer.pointer(0.5, 0.5, false);
      const snapshot = (event: Event) => {
        const request = event as CustomEvent<ThemeSnapshotRequest>;
        request.detail.capture = renderer.snapshot?.(
          time,
          document.documentElement.dataset.theme === "dark",
        );
      };
      canvas.addEventListener(themeSnapshotEvent, snapshot);
      const contextLost = (event: Event) => {
        event.preventDefault();
        lost = true;
        cancelAnimationFrame(raf);
        canvas.dataset.running = "false";
        canvas.dataset.renderer = "fallback";
      };
      resize();
      size.observe(canvas);
      view.observe(canvas);
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      canvas.addEventListener("webglcontextlost", contextLost);
      document.addEventListener("visibilitychange", sync);
      window.addEventListener("pointermove", pointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", pointerLeave);
      motion.addEventListener("change", sync);
      sync();
      synchronizeTheme();
      teardown = () => {
        cancelAnimationFrame(raf);
        size.disconnect();
        view.disconnect();
        theme.disconnect();
        canvas.removeEventListener(themeSnapshotEvent, snapshot);
        renderer.dispose();
        canvas.removeEventListener("webglcontextlost", contextLost);
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener("pointermove", pointerMove);
        document.documentElement.removeEventListener(
          "pointerleave",
          pointerLeave,
        );
        motion.removeEventListener("change", sync);
      };
    });
    return () => {
      abort.abort();
      teardown();
      canvas.remove();
    };
  }, []);
  return ref;
}
