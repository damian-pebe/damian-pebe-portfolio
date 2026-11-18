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
  position: string;
  alt: string;
  en: { tagline: string; description: string; capabilities: string[] };
  es: { tagline: string; description: string; capabilities: string[] };
}
export const projects = catalog as Project[];
export const thumbnail = (project: Project) =>
  "/projects/" + project.id + "-thumb.webp";
export const gallery = (project: Project) => [
  "/projects/" + project.id + "-01.webp",
  ...(project.second ? ["/projects/" + project.id + "-02.webp"] : []),
];
