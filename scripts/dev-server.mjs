import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const [, , rootArg = ".", portArg = "5173", host = "127.0.0.1"] = process.argv;

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const rootDir = resolve(repoRoot, rootArg);
const port = Number.parseInt(portArg, 10);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".ico", "image/x-icon"],
]);

function isInsideRoot(filePath) {
  return filePath === rootDir || filePath.startsWith(`${rootDir}${sep}`);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl ?? "/", "http://localhost");
  const decodedPath = decodeURIComponent(url.pathname);
  let filePath = resolve(join(rootDir, decodedPath));

  if (!isInsideRoot(filePath)) {
    return null;
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
  } catch {
    // Fall back below.
  }

  if (await fileExists(filePath)) {
    return filePath;
  }

  // Friendly fallback for bookmark/deep-link mistakes.
  return join(rootDir, "index.html");
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveRequestPath(request.url);

    if (!filePath || !(await fileExists(filePath))) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const contentType = mimeTypes.get(extname(filePath)) ?? "application/octet-stream";
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentType,
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Internal server error");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try a different port or stop the other server.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "localhost" : host;
  console.log(`Serving ${rootDir}`);
  console.log(`Local:   http://${displayHost}:${port}/`);
  if (host === "0.0.0.0") {
    console.log("Network: use this computer's LAN IP with the same port from another device.");
  }
});