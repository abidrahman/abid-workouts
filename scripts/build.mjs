import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(repoRoot, "dist");

const staticFiles = ["index.html", "styles.css", "app.js", "site.webmanifest"];

async function copyStaticFiles() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await Promise.all(
    staticFiles.map((fileName) => copyFile(join(repoRoot, fileName), join(distDir, fileName))),
  );

  // GitHub Pages should serve files as-is instead of running them through Jekyll.
  await writeFile(join(distDir, ".nojekyll"), "");

  // The app is hash-routed, but a 404 fallback makes accidental deep links friendlier.
  await copyFile(join(repoRoot, "index.html"), join(distDir, "404.html"));
}

await copyStaticFiles();

console.log("Built static site into dist/");