import catalog from "./projects.json";
import type { Copy } from "@/i18n/copy";
export type Category = keyof Copy["work"]["categories"];
export interface Project {
  id: string;
  name: string;
  category: Category;
  stage: string | null;
  source: string;
  cover: string;
  second: string | null;
  captures?: string[];
  position: string;
  alt: string;
  en: { tagline: string; description: string; capabilities: string[] };
  es: { tagline: string; description: string; capabilities: string[] };
}
export const projects = catalog as Project[];
const assetVersion = "20261117-monochrome";
export const thumbnail = (project: Project, small = false) =>
  `/projects/${project.id}-${small ? "small" : "thumb"}.webp?v=${assetVersion}`;
export const galleryPreview = (project: Project, index: number) =>
  `/projects/${project.id}-${String(index + 1).padStart(2, "0")}-preview.webp?v=${assetVersion}`;
export const gallery = (project: Project) =>
  Array.from(
    { length: project.captures?.length ?? (project.second ? 2 : 1) },
    (_, index) =>
      `/projects/${project.id}-${String(index + 1).padStart(2, "0")}.webp?v=${assetVersion}`,
  );
