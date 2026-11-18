export type MetalCommand =
  | { type: "init"; canvas: OffscreenCanvas }
  | { type: "snapshot"; time: number; dark: boolean; request: number }
  | { type: "resize"; width: number; height: number; pixelRatio: number }
  | { type: "pointer"; x: number; y: number; active: boolean }
  | { type: "paint"; time: number; dark: boolean; request?: number };
export type MetalResponse =
  | { type: "ready"; available: boolean }
  | { type: "painted"; request: number }
  | { type: "lost" }
  | { type: "snapshot"; request: number; bitmap: ImageBitmap };
export interface MetalRenderer {
  thread: "worker" | "main";
  resize(width: number, height: number, pixelRatio: number): void;
  pointer(x: number, y: number, active: boolean): void;
  paint(time: number, dark: boolean): void;
  synchronizeTheme(time: number, dark: boolean): Promise<void>;
  snapshot?(time: number, dark: boolean): Promise<ImageBitmap | null>;
  dispose(): void;
}
