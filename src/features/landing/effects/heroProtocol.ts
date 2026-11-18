export type HeroCommand =
  | { type: "init"; canvas: OffscreenCanvas }
  | { type: "resize"; width: number; height: number }
  | { type: "paint"; time: number; dark: boolean; request?: number };
export type HeroResponse =
  | { type: "ready"; available: boolean }
  | { type: "painted"; request: number }
  | { type: "lost" };
export interface HeroRenderer {
  thread: "worker" | "main";
  resize(width: number, height: number): void;
  paint(time: number, dark: boolean): void;
  synchronizeTheme(time: number, dark: boolean): Promise<void>;
  dispose(): void;
}
