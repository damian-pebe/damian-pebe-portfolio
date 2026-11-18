import { useEffect, useRef } from "react";
import { drawRibbon, type RibbonFrame } from "./drawRibbon";
export function BackgroundPaths() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const frame: RibbonFrame = {
      width: 0,
      height: 0,
      time: 19,
      pointerX: 0,
      pointerY: 0,
      influence: 0,
    };
    let raf = 0,
      previous = 0,
      onscreen = true,
      pointerOn = false;
    const canAnimate = () =>
      onscreen && !document.hidden && !motion.matches && !connection?.saveData;
    const paint = () => drawRibbon(ctx, frame);
    const resize = () => {
      const rect = canvas.getBoundingClientRect(),
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      frame.width = rect.width;
      frame.height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };
    const tick = (now: number) => {
      raf = 0;
      if (!canAnimate()) return;
      if (now - previous >= 1000 / 30) {
        frame.time += Math.min((now - previous) / 1000, 0.05) * 0.4;
        frame.influence += ((pointerOn ? 1 : 0) - frame.influence) * 0.09;
        previous = now;
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.dataset.running = String(canAnimate());
      if (canAnimate()) {
        previous = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        frame.influence = 0;
        paint();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      sync();
    });
    const sizing = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(paint);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const target = canvas.closest("section");
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !canAnimate()) return;
      const rect = canvas.getBoundingClientRect();
      frame.pointerX = event.clientX - rect.left;
      frame.pointerY = event.clientY - rect.top;
      pointerOn = true;
    };
    const leave = () => {
      pointerOn = false;
    };
    resize();
    observer.observe(canvas);
    sizing.observe(canvas);
    target?.addEventListener("pointermove", move);
    target?.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizing.disconnect();
      themeObserver.disconnect();
      target?.removeEventListener("pointermove", move);
      target?.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);
  return (
    <div className="background-paths" aria-hidden="true">
      <canvas ref={canvasRef} data-effect="background-paths" />
    </div>
  );
}
