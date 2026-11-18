import { useEffect, useRef } from "react";
import { createThreadsRenderer } from "./createThreadsRenderer";
export function ClyraThreads() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const abort = new AbortController();
    let teardown = () => {};
    void createThreadsRenderer(canvas, abort.signal).then((renderer) => {
      if (abort.signal.aborted) {
        renderer?.dispose();
        return;
      }
      if (!renderer) {
        canvas.dataset.renderer = "fallback";
        return;
      }
      canvas.dataset.renderer = "webgl";
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      const saveData = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection?.saveData;
      const mouse: [number, number] = [0.5, 0.5],
        target: [number, number] = [0.5, 0.5];
      let raf = 0,
        time = 10,
        last = 0,
        onscreen = true,
        lost = false;
      const allowed = () =>
        onscreen && !document.hidden && !motion.matches && !saveData && !lost;
      const paint = () =>
        renderer.paint(
          time,
          mouse,
          document.documentElement.dataset.theme === "dark",
        );
      const tick = (now: number) => {
        raf = 0;
        if (!allowed()) return;
        if (now - last >= 1000 / 30) {
          time += Math.min((now - last) / 1000, 0.05);
          last = now;
          mouse[0] += (target[0] - mouse[0]) * 0.06;
          mouse[1] += (target[1] - mouse[1]) * 0.06;
          paint();
        }
        raf = requestAnimationFrame(tick);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        canvas.dataset.running = String(allowed());
        paint();
        if (allowed()) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);
        paint();
      };
      const size = new ResizeObserver(resize);
      const view = new IntersectionObserver(([entry]) => {
        onscreen = entry.isIntersecting;
        sync();
      });
      const theme = new MutationObserver(paint);
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || motion.matches) return;
        const rect = canvas.getBoundingClientRect();
        target[0] = (event.clientX - rect.left) / rect.width;
        target[1] = 1 - (event.clientY - rect.top) / rect.height;
      };
      const leave = () => {
        target[0] = 0.5;
        target[1] = 0.5;
      };
      const contextLost = (event: Event) => {
        event.preventDefault();
        lost = true;
        cancelAnimationFrame(raf);
        canvas.dataset.running = "false";
        canvas.dataset.renderer = "fallback";
      };
      const section = canvas.closest("section");
      resize();
      size.observe(canvas);
      view.observe(canvas);
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      section?.addEventListener("pointermove", move);
      section?.addEventListener("pointerleave", leave);
      canvas.addEventListener("webglcontextlost", contextLost);
      document.addEventListener("visibilitychange", sync);
      motion.addEventListener("change", sync);
      sync();
      teardown = () => {
        cancelAnimationFrame(raf);
        size.disconnect();
        view.disconnect();
        theme.disconnect();
        renderer.dispose();
        section?.removeEventListener("pointermove", move);
        section?.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("webglcontextlost", contextLost);
        document.removeEventListener("visibilitychange", sync);
        motion.removeEventListener("change", sync);
      };
    });
    return () => {
      abort.abort();
      teardown();
    };
  }, []);
  return (
    <div className="clyra-threads" aria-hidden="true">
      <canvas ref={ref} data-effect="clyra-threads" data-running="false" />
    </div>
  );
}
