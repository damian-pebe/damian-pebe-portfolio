import { execFileSync } from "node:child_process";
import { readFile, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import sharp from "sharp";

// Only the published, permanently redacted portfolio collection is imported.
const sourceRevision = "1d44066ceb3d96c6abf98bdd8f5798caa58addd5";
const source = process.argv[2];
if (!source)
  throw new Error(
    "Usage: node scripts/import-project-captures.mjs <clyra-checkout>",
  );
const sourceRoot = resolve(source);
const root = fileURLToPath(new URL("../", import.meta.url));
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: sourceRoot,
  encoding: "utf8",
}).trim();
if (revision !== sourceRevision)
  throw new Error("Review the source revision before importing new captures.");
const sourcePaths = [
  "src/pages/portfolio/data/media.ts",
  "public/portfolio/projects",
];
const dirty = execFileSync(
  "git",
  ["status", "--porcelain", "--", ...sourcePaths],
  { cwd: sourceRoot, encoding: "utf8" },
);
if (dirty.trim())
  throw new Error(
    "Source captures and their manifest must match the published revision.",
  );
const mediaCode = await readFile(join(sourceRoot, sourcePaths[0]), "utf8");
const { code } = await transform(mediaCode, { loader: "ts", format: "esm" });
const { projectMedia } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
const catalogPath = join(root, "src/features/portfolio/data/projects.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
let paired = 0;
let supplied = 0;
let outputCount = 0;
for (const project of catalog) {
  if (!project.second) continue;
  const captures = Object.entries(projectMedia[project.id] ?? {}).sort(
    ([a], [b]) => Number(a) - Number(b),
  );
  if (captures.length !== project.captures.length)
    throw new Error(`Capture count changed for ${project.id}`);
  project.captures = [];
  for (const [slot, capture] of captures) {
    project.captures.push({
      src: capture.src,
      ...(capture.sources && { sources: capture.sources }),
      position: capture.position,
    });
    supplied++;
    if (capture.sources) paired++;
    for (const asset of new Set(
      Object.values(capture.sources ?? { original: capture.src }),
    )) {
      const match = asset.match(
        /^\/portfolio\/projects\/([a-z0-9-]+)\/(\d{2})-(light|dark)\.webp$/,
      );
      if (!match || match[1] !== project.id)
        throw new Error(`Unexpected public asset: ${asset}`);
      const [, id, number, palette] = match;
      const input = await readFile(join(sourceRoot, "public", asset));
      const variants = [
        [`${id}-${number}-${palette}`, 1600, 82],
        [`${id}-${number}-${palette}-preview`, 640, 78],
      ];
      if (Number(slot) === 1)
        variants.push(
          [`${id}-thumb-${palette}`, 960, 80],
          [`${id}-small-${palette}`, 640, 78],
        );
      for (const [name, width, quality] of variants) {
        await sharp(input)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality })
          .toFile(join(root, "public/projects", `${name}.webp`));
        outputCount++;
      }
    }
  }
}
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
// Remove only the obsolete theme-blind exports after the complete import succeeds.
for (const project of catalog.filter((item) => item.second)) {
  const obsolete = [`${project.id}-thumb`, `${project.id}-small`];
  for (let index = 0; index < project.captures.length; index++) {
    const stem = `${project.id}-${String(index + 1).padStart(2, "0")}`;
    obsolete.push(stem, `${stem}-preview`);
  }
  for (const name of obsolete)
    await rm(join(root, "public/projects", `${name}.webp`), { force: true });
}
console.log(
  JSON.stringify({
    sourceRevision,
    captures: supplied,
    paired,
    singlePalette: supplied - paired,
    files: outputCount,
  }),
);
