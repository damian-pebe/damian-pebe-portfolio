import widths from "../data/captureWidths.json";

/** Match descriptors to the real source width, including smaller supplied captures. */
export function captureSrcSet(source: string) {
  const [path, query = ""] = source.split("?");
  const suffix = query ? `?${query}` : "";
  const name = path.slice("/projects/".length).replace(/\.webp$/, "");
  const cover = name.match(/^(.*)-(small|thumb)(-(light|dark))?$/);
  const stem = cover
    ? `${cover[1]}-01${cover[3] ?? ""}`
    : name.replace(/-preview$/, "");
  const nativeWidth = (widths as Record<string, number>)[stem];
  if (!nativeWidth) return undefined;
  const variants: [string, number][] = [[`${stem}-tiny`, 320]];
  if (cover) {
    variants.push(
      [`${cover[1]}-small${cover[3] ?? ""}`, 640],
      [`${cover[1]}-thumb${cover[3] ?? ""}`, 960],
    );
  } else if (/-preview$/.test(name)) {
    variants.push([name, 640]);
  } else {
    // Concepts have a single gallery image; real interfaces also have previews.
    if (/-(light|dark)$/.test(stem)) variants.push([`${stem}-preview`, 640]);
    variants.push([stem, 1600]);
  }
  const candidates = new Map<number, string>();
  for (const [file, width] of variants)
    candidates.set(
      Math.min(width, nativeWidth),
      `/projects/${file}.webp${suffix}`,
    );
  return [...candidates].map(([width, url]) => `${url} ${width}w`).join(", ");
}

export function frameSrcSet(source: string) {
  if (!source.endsWith(".webp")) return undefined;
  return `${source.replace(".webp", "-small.webp")} 320w, ${source.replace(".webp", "-medium.webp")} 640w, ${source} 1100w`;
}

export const frameSizes = {
  hero: "(max-width: 700px) 190px, 250px",
  card: "(max-width: 700px) calc(50vw - 42px), (max-width: 1100px) 28vw, 300px",
  featured: "(max-width: 700px) calc(100vw - 50px), 560px",
  detail: "(max-width: 700px) 88vw, 900px",
};
