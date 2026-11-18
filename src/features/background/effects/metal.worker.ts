import { createWebGLRenderer } from "./createWebGLRenderer";
import type { MetalCommand, MetalResponse } from "./metalProtocol";
const port = self as unknown as {
  onmessage: ((event: MessageEvent<MetalCommand>) => void) | null;
  postMessage(message: MetalResponse, transfer?: Transferable[]): void;
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
      renderer?.resize(data.width, data.height, data.pixelRatio);
      break;
    case "pointer":
      renderer?.pointer(data.x, data.y, data.active);
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
