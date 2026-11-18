import catalog from "./projects.json";
import type { Copy } from "@/i18n/copy";
import type { Theme } from "@/features/theme/useTheme";
export type Category = keyof Copy["work"]["categories"];
export interface ProjectCapture {
  src: string;
  sources?: Record<Theme, string>;
  position: string;
}
export interface Project {
  id: string;
  name: string;
  category: Category;
  stage: string | null;
  source: string;
  cover: string;
  second: string | null;
  captures?: ProjectCapture[];
  position: string;
  alt: string;
  en: { tagline: string; description: string; capabilities: string[] };
  es: { tagline: string; description: string; capabilities: string[] };
}
export const projects = catalog as Project[];
