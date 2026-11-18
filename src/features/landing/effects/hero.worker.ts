import { createWebGLRenderer } from "./createWebGLRenderer";
import type { HeroCommand, HeroResponse } from "./heroProtocol";
const port = self as unknown as {
  onmessage: ((event: MessageEvent<HeroCommand>) => void) | null;
  postMessage(message: HeroResponse): void;
};
let renderer: Awaited<ReturnType<typeof createWebGLRenderer>> = null;
port.onmessage = async ({ data }) => {
  switch (data.type) {
    case "init":
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
