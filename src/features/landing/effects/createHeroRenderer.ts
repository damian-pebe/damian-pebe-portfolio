import { createWebGLRenderer } from "./createWebGLRenderer";
import type { HeroCommand, HeroRenderer, HeroResponse } from "./heroProtocol";
async function mainThreadRenderer(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Promise<HeroRenderer | null> {
  const renderer = await createWebGLRenderer(canvas, signal);
  return renderer
    ? {
        ...renderer,
        thread: "main",
        synchronizeTheme: async (time, dark) => renderer.paint(time, dark),
      }
    : null;
}

/** Keep GPU initialization and drawing outside the interaction thread. */
export async function createHeroRenderer(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Promise<HeroRenderer | null> {
  if (signal.aborted) return null;
  if (!canvas.transferControlToOffscreen || typeof Worker === "undefined")
    return mainThreadRenderer(canvas, signal);
  let worker: Worker;
  try {
    worker = new Worker("/effects/hero-worker.js", {
      type: "module",
      name: "portfolio-background",
    });
  } catch {
    return mainThreadRenderer(canvas, signal);
  }
  return new Promise((resolve) => {
    let settled = false,
      sequence = 0;
    const pending = new Map<number, () => void>();
    const snapshots = new Map<number, (bitmap: ImageBitmap | null) => void>();
    const send = (message: HeroCommand) => worker.postMessage(message);
    const dispose = () => {
      signal.removeEventListener("abort", abort);
      worker.terminate();
      pending.forEach((finish) => finish());
      pending.clear();
      snapshots.forEach((finish) => finish(null));
      snapshots.clear();
    };
    const fail = (report: boolean) => {
      dispose();
      if (!settled) {
        settled = true;
        resolve(null);
      } else if (report)
        canvas.dispatchEvent(
          new Event("webglcontextlost", { cancelable: true }),
        );
    };
    const abort = () => fail(false);
    signal.addEventListener("abort", abort, { once: true });
    worker.onerror = () => fail(true);
    worker.onmessage = ({ data }: MessageEvent<HeroResponse>) => {
      if (data.type === "snapshot") {
        const finish = snapshots.get(data.request);
        if (finish) finish(data.bitmap);
        else data.bitmap.close();
        snapshots.delete(data.request);
        return;
      }
      if (data.type === "lost") {
        fail(true);
        return;
      }
      if (data.type === "painted") {
        pending.get(data.request)?.();
        pending.delete(data.request);
        return;
      }
      if (settled) return;
      if (!data.available || signal.aborted) {
        fail(false);
        return;
      }
      settled = true;
      resolve({
        thread: "worker",
        resize: (width, height) => send({ type: "resize", width, height }),
        paint: (time, dark) => send({ type: "paint", time, dark }),
        synchronizeTheme: (time, dark) =>
          new Promise<void>((finish) => {
            const request = ++sequence;
            pending.set(request, finish);
            send({ type: "paint", time, dark, request });
          }),
        snapshot: (time, dark) =>
          new Promise<ImageBitmap | null>((finish) => {
            const request = ++sequence;
            const timeout = setTimeout(() => {
              snapshots.delete(request);
              finish(null);
            }, 400);
            snapshots.set(request, (bitmap) => {
              clearTimeout(timeout);
              finish(bitmap);
            });
            send({ type: "snapshot", time, dark, request });
          }),
        dispose,
      });
    };
    try {
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage(
        { type: "init", canvas: offscreen } satisfies HeroCommand,
        [offscreen],
      );
    } catch {
      fail(false);
    }
  });
}
