import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = JSON.parse(
  await readFile(
    join(root, "src/features/portfolio/data/projects.json"),
    "utf8",
  ),
);
const widths = {};
let files = 0;
for (const project of catalog) {
  const stems = new Set();
  if (!project.captures) stems.add(`${project.id}-01`);
  for (const capture of project.captures ?? []) {
    for (const source of Object.values(
      capture.sources ?? { original: capture.src },
    )) {
      stems.add(
        `${project.id}-${source.split("/").at(-1).replace(".webp", "")}`,
      );
    }
  }
  for (const stem of stems) {
    const original = join(root, "public/projects", `${stem}.webp`);
    widths[stem] = (await sharp(original).metadata()).width;
    await sharp(original)
      .resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(join(root, "public/projects", `${stem}-tiny.webp`));
    files++;
  }
}
for (const name of await readdir(join(root, "public/mockups"))) {
  if (!name.endsWith(".webp") || /-(small|medium)\.webp$/.test(name)) continue;
  const original = join(root, "public/mockups", name);
  for (const [suffix, width] of [
    ["small", 320],
    ["medium", 640],
  ]) {
    await sharp(original)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(
        join(root, "public/mockups", name.replace(".webp", `-${suffix}.webp`)),
      );
    files++;
  }
}
await writeFile(
  join(root, "src/features/portfolio/data/captureWidths.json"),
  JSON.stringify(widths, null, 2) + "\n",
);
console.log(
  `Generated ${files} responsive images without changing their framing.`,
);
