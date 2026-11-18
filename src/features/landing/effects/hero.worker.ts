import { createWebGLRenderer } from "./createWebGLRenderer";
import type { HeroCommand, HeroResponse } from "./heroProtocol";
const port = self as unknown as {
  onmessage: ((event: MessageEvent<HeroCommand>) => void) | null;
  postMessage(message: HeroResponse, transfer?: Transferable[]): void;
};
let canvas: OffscreenCanvas | null = null;
let renderer: Awaited<ReturnType<typeof createWebGLRenderer>> = null;
port.onmessage = async ({ data }) => {
  switch (data.type) {
    case "init":
      canvas = data.canvas;
      data.canvas.addEventListener("webglcontextlost", () =>
        port.postMessage({ type: "lost" }),
      );
      try {
        renderer = await createWebGLRenderer(
          data.canvas,
          new AbortController().signal,
        );
        port.postMessage({ type: "ready", available: !!renderer });
      } catch {
        port.postMessage({ type: "ready", available: false });
      }
      break;
    case "snapshot":
      if (canvas && renderer) {
        renderer.paint(data.time, data.dark);
        const bitmap = canvas.transferToImageBitmap();
        renderer.paint(data.time, data.dark);
        port.postMessage({ type: "snapshot", request: data.request, bitmap }, [
          bitmap,
        ]);
      }
      break;
    case "resize":
      renderer?.resize(data.width, data.height);
      break;
    case "paint":
      renderer?.paint(data.time, data.dark);
      if (data.request !== undefined) {
        const request = data.request;
        requestAnimationFrame(() =>
          port.postMessage({ type: "painted", request }),
        );
      }
      break;
  }
};
