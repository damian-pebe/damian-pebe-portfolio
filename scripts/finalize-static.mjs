import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
const output = path.resolve("out");
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(target)));
    else if (entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}
const hashes = new Set();
for (const file of await htmlFiles(output)) {
  let html = await readFile(file, "utf8");
  if (file === path.join(output, "en", "index.html")) {
    html = html.replace('<html lang="es"', '<html lang="en"');
    await writeFile(file, html);
  }
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    if (match[1])
      hashes.add(
        "'sha256-" +
          createHash("sha256").update(match[1]).digest("base64") +
          "'",
      );
  }
}
const headerTemplate = await readFile("public/_headers", "utf8");
const policy = headerTemplate.replace(
  "script-src 'self' 'unsafe-inline'",
  "script-src 'self' " + [...hashes].join(" "),
);
await writeFile(path.join(output, "_headers"), policy);
console.log(
  "Static language metadata and CSP finalized:",
  hashes.size,
  "inline script hashes.",
);
