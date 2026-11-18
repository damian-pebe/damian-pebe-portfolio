import { build } from "esbuild";
await build({
  entryPoints: ["src/features/background/effects/metal.worker.ts"],
  outfile: "public/effects/metal-worker.js",
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  legalComments: "eof",
});
console.log("Bundled local background worker.");
