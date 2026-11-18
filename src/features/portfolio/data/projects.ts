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
const assetVersion = "20261118-capture-themes";

/** The fallback is the original capture, never an inverted or fabricated theme. */
function capturePalette(project: Project, index: number, theme: Theme) {
  const capture = project.captures?.[index];
  const source = capture?.sources?.[theme] ?? capture?.src;
  return source?.match(/-(light|dark)\.webp$/)?.[1];
}
export const thumbnail = (project: Project, theme: Theme, small = false) => {
  const palette = capturePalette(project, 0, theme);
  return `/projects/${project.id}-${small ? "small" : "thumb"}${palette ? `-${palette}` : ""}.webp?v=${assetVersion}`;
};
export const galleryPreview = (
  project: Project,
  index: number,
  theme: Theme,
) => {
  const palette = capturePalette(project, index, theme);
  return `/projects/${project.id}-${String(index + 1).padStart(2, "0")}${palette ? `-${palette}` : ""}-preview.webp?v=${assetVersion}`;
};
export const gallery = (project: Project, theme: Theme) =>
  Array.from(
    { length: project.captures?.length ?? (project.second ? 2 : 1) },
    (_, index) => {
      const palette = capturePalette(project, index, theme);
      return `/projects/${project.id}-${String(index + 1).padStart(2, "0")}${palette ? `-${palette}` : ""}.webp?v=${assetVersion}`;
    },
  );
