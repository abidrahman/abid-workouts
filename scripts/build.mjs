import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(repoRoot, "dist");

const staticFiles = ["index.html", "styles.css", "site.webmanifest"];
const staticDirs = ["data"];

async function copyStaticFiles() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  await Promise.all(
    staticFiles.map((fileName) => copyFile(join(repoRoot, fileName), join(distDir, fileName))),
  );

  await Promise.all(
    staticDirs.map(async (dirName) => {
      await mkdir(join(distDir, dirName), { recursive: true });
      await cp(join(repoRoot, dirName), join(distDir, dirName), { recursive: true });
    }),
  );

  // GitHub Pages should serve files as-is instead of running them through Jekyll.
  await writeFile(join(distDir, ".nojekyll"), "");

  // The app is hash-routed, but a 404 fallback makes accidental deep links friendlier.
  await copyFile(join(repoRoot, "index.html"), join(distDir, "404.html"));
}

async function bundleJS() {
  await build({
    entryPoints: [join(repoRoot, "app.js")],
    bundle: true,
    format: "esm",
    outfile: join(distDir, "app.js"),
    platform: "browser",
  });
}

await copyStaticFiles();
await bundleJS();

console.log("Built static site into dist/");