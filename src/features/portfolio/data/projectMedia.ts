import type { Theme } from "@/features/theme/useTheme";
import type { Project } from "./projects";

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
