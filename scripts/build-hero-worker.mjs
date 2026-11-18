import { build } from "esbuild";
await build({
  entryPoints: ["src/features/landing/effects/hero.worker.ts"],
  outfile: "public/effects/hero-worker.js",
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  legalComments: "eof",
});
console.log("Bundled local background worker.");
