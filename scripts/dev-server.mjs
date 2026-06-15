import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [, , rootArg = ".", portArg = "5173", host = "127.0.0.1"] = process.argv;

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const rootDir = resolve(repoRoot, rootArg);
const port = Number.parseInt(portArg, 10);

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(repoRoot, "backend/.env"));

const stravaState = {
  accessToken: process.env.STRAVA_ACCESS_TOKEN ?? "",
  refreshToken: process.env.STRAVA_REFRESH_TOKEN ?? "",
  scope: "",
  athlete: null,
  activities: [],
  lastSync: null,
};

function toUnixTimestamp(value, fallbackDate) {
  const date = value ? new Date(value) : fallbackDate;
  return Math.floor(date.getTime() / 1000);
}

function getBackfillStartDate() {
  const configured = process.env.STRAVA_BACKFILL_START;
  if (configured) {
    const parsed = new Date(`${configured}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const now = new Date();
  return new Date(now.getFullYear(), 5, 1);
}

function mapStravaType(activity) {
  const sport = String(activity.sport_type || activity.type || "").toLowerCase();
  if (sport.includes("swim")) return "Swim";
  if (sport.includes("ride") || sport.includes("bike") || sport.includes("cycling")) return "Bike";
  if (sport.includes("hike") || sport.includes("walk")) return "Hiking";
  if (sport.includes("weight") || sport.includes("workout") || sport.includes("strength")) return "Strength";
  if (sport.includes("run")) return "Run";
  return activity.sport_type || activity.type || "Workout";
}

function mapStravaActivity(activity) {
  return {
    id: String(activity.id),
    name: activity.name,
    type: mapStravaType(activity),
    startTime: activity.start_date || activity.start_date_local,
    date: (activity.start_date_local || activity.start_date || "").slice(0, 10),
    duration: activity.elapsed_time ?? activity.moving_time ?? 0,
    distance: activity.distance ?? 0,
    calories: activity.kilojoules ? Math.round(activity.kilojoules) : null,
    raw: activity,
  };
}

async function refreshStravaToken() {
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET || !stravaState.refreshToken) {
    return;
  }

  const response = await fetch(process.env.STRAVA_TOKEN_URL || "https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: stravaState.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh Strava token: HTTP ${response.status}`);
  }

  const tokenData = await response.json();
  if (tokenData.access_token) {
    stravaState.accessToken = tokenData.access_token;
  }
  if (tokenData.refresh_token) {
    stravaState.refreshToken = tokenData.refresh_token;
  }
  if (tokenData.scope) {
    stravaState.scope = tokenData.scope;
  }
}

async function exchangeStravaCode(code) {
  const response = await fetch(process.env.STRAVA_TOKEN_URL || "https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange authorization code: HTTP ${response.status}`);
  }

  const tokenData = await response.json();
  stravaState.accessToken = tokenData.access_token || stravaState.accessToken;
  stravaState.refreshToken = tokenData.refresh_token || stravaState.refreshToken;
  stravaState.scope = tokenData.scope || stravaState.scope;
  stravaState.athlete = tokenData.athlete || null;
}

async function stravaRequest(path, { params = {}, retryOnAuth = true } = {}) {
  const base = process.env.STRAVA_API_BASE_URL || "https://www.strava.com/api/v3";
  const url = new URL(`${base}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${stravaState.accessToken}`,
    },
  });

  if (response.status === 401 && retryOnAuth) {
    await refreshStravaToken();
    return stravaRequest(path, { params, retryOnAuth: false });
  }

  if (!response.ok) {
    throw new Error(`Strava API request failed (${path}): HTTP ${response.status}`);
  }

  return response.json();
}

async function ensureStravaAthlete() {
  if (!stravaState.accessToken) return null;
  if (stravaState.athlete) return stravaState.athlete;

  const athlete = await stravaRequest("/athlete");
  stravaState.athlete = athlete;
  return athlete;
}

async function syncStravaActivities({ startDate, endDate } = {}) {
  if (!stravaState.accessToken) {
    throw new Error("No Strava access token configured");
  }

  const afterDate = startDate ? new Date(startDate) : getBackfillStartDate();
  const beforeDate = endDate ? new Date(endDate) : new Date();
  const after = toUnixTimestamp(null, afterDate);
  const before = toUnixTimestamp(null, beforeDate);

  const items = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const pageItems = await stravaRequest("/athlete/activities", {
      params: { after, before, page, per_page: perPage },
    });
    if (!Array.isArray(pageItems) || pageItems.length === 0) break;
    items.push(...pageItems);
    if (pageItems.length < perPage) break;
    page += 1;
  }

  stravaState.activities = items.map(mapStravaActivity);
  stravaState.lastSync = new Date().toISOString();
  await ensureStravaAthlete();
  return stravaState.activities;
}

function buildDailyMetrics(activities, startDate, endDate) {
  const byDate = new Map();
  for (const activity of activities) {
    if (!activity.date) continue;
    const entry = byDate.get(activity.date) || { calories: 0 };
    if (typeof activity.calories === "number") entry.calories += activity.calories;
    byDate.set(activity.date, entry);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const metrics = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateKey = date.toISOString().slice(0, 10);
    const dayData = byDate.get(dateKey) || { calories: 0 };
    metrics.push({
      dateKey,
      sleepDuration: null,
      sleepScore: null,
      calories: dayData.calories || 0,
      steps: null,
      fetchedAt: Date.now(),
    });
  }

  return metrics;
}

// Import backend functions
let syncFunctions = null;
try {
  const syncModule = await import(pathToFileURL(resolve(repoRoot, "backend/functions/sync.js")).href);
  syncFunctions = syncModule;
} catch (error) {
  console.warn("Could not load backend sync functions:", error.message);
}

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

function parseJsonBody(body) {
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return null;
  }
}

async function handleApiRequest(request, response) {
  try {
    const url = new URL(request.url, "http://localhost");
    const pathname = url.pathname;

    if (pathname === "/api/auth/status" && request.method === "GET") {
      try {
        const athlete = await ensureStravaAthlete();
        const user = athlete ? `${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() : "Strava user";
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            connected: Boolean(stravaState.accessToken),
            user: user || "Strava user",
            lastSync: stravaState.lastSync,
            scope: stravaState.scope || null,
          })
        );
      } catch {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify({ connected: false }));
      }
      return;
    }

    if (pathname === "/api/auth/authorize" && request.method === "POST") {
      const authUrl = new URL(process.env.STRAVA_AUTH_URL || "https://www.strava.com/oauth/authorize");
      authUrl.searchParams.set("client_id", process.env.STRAVA_CLIENT_ID || "");
      authUrl.searchParams.set("redirect_uri", process.env.STRAVA_REDIRECT_URI || "http://127.0.0.1:5173/auth/callback");
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("approval_prompt", "force");
      authUrl.searchParams.set("scope", "read,activity:read,activity:read_all");
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ authUrl: authUrl.toString() }));
      return;
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      stravaState.accessToken = "";
      stravaState.refreshToken = "";
      stravaState.athlete = null;
      stravaState.activities = [];
      stravaState.lastSync = null;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ success: true }));
      return;
    }

    if (pathname === "/api/sync" && request.method === "POST") {
      try {
        const activities = await syncStravaActivities();
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            count: activities.length,
            start: (getBackfillStartDate()).toISOString().slice(0, 10),
            end: new Date().toISOString().slice(0, 10),
          })
        );
      } catch (error) {
        response.writeHead(500, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            error: error.message,
            hint: "Reconnect Strava and grant activity access (activity:read or activity:read_all).",
            scope: stravaState.scope || null,
          })
        );
      }
      return;
    }

    if (pathname === "/api/activities" && request.method === "GET") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ activities: stravaState.activities }));
      return;
    }

    if (pathname === "/api/metrics" && request.method === "GET") {
      const start = url.searchParams.get("start") || (getBackfillStartDate()).toISOString().slice(0, 10);
      const end = url.searchParams.get("end") || new Date().toISOString().slice(0, 10);
      const metrics = buildDailyMetrics(stravaState.activities, start, end);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(metrics));
      return;
    }

    // Handle sync-activities endpoint
    if (pathname === "/api/sync-activities") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      if (!syncFunctions) {
        response.writeHead(500, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "Sync functions not loaded" }));
        return;
      }

      // Read request body
      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", async () => {
        const data = parseJsonBody(body);
        if (!data) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }

        const {
          activities = [],
          workoutPlanByDate = {},
          currentTracking = {},
        } = data;

        const result = syncFunctions.syncActivitiesAgainstPlan(
          activities,
          workoutPlanByDate,
          currentTracking
        );

        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(result));
      });

      return;
    }

    // Unknown API endpoint
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Endpoint not found" }));
  } catch (error) {
    console.error("API error:", error);
    response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Internal server error" }));
  }
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    if (requestUrl.pathname === "/auth/callback") {
      const code = requestUrl.searchParams.get("code");
      const error = requestUrl.searchParams.get("error");
      if (error) {
        response.writeHead(302, { location: "/#calendar" });
        response.end();
        return;
      }

      if (code) {
        try {
          await exchangeStravaCode(code);
        } catch (exchangeError) {
          console.error(exchangeError);
        }
      }

      response.writeHead(302, { location: "/#calendar" });
      response.end();
      return;
    }

    // Handle API routes
    if (request.url?.startsWith("/api/")) {
      return handleApiRequest(request, response);
    }

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