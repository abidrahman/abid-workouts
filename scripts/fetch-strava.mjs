/**
 * fetch-strava.mjs
 *
 * Run by GitHub Actions every hour. Fetches recent Strava activities,
 * transforms them into the format the frontend expects, and writes
 * data/activities.json to the repo.
 *
 * Required env vars (set as GitHub Actions secrets):
 *   STRAVA_CLIENT_ID
 *   STRAVA_CLIENT_SECRET
 *   STRAVA_REFRESH_TOKEN
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error("Missing required env vars: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN");
  process.exit(1);
}

// Step 1: Exchange refresh token for a fresh access token
const tokenRes = await fetch("https://www.strava.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    refresh_token: STRAVA_REFRESH_TOKEN,
    grant_type: "refresh_token",
  }),
});

if (!tokenRes.ok) {
  console.error("Token refresh failed:", tokenRes.status, await tokenRes.text());
  process.exit(1);
}

const { access_token } = await tokenRes.json();

// Step 2: Fetch recent activities (last 200, covering the full training window)
const activitiesRes = await fetch(
  "https://www.strava.com/api/v3/athlete/activities?per_page=200",
  { headers: { Authorization: `Bearer ${access_token}` } }
);

if (!activitiesRes.ok) {
  console.error("Activities fetch failed:", activitiesRes.status, await activitiesRes.text());
  process.exit(1);
}

const raw = await activitiesRes.json();

// Step 3: Transform to the shape the frontend expects
// Use start_date_local (athlete's local timezone) to avoid UTC date-shift bugs.
// No date filtering here — the frontend filters by training block window using
// calendarStartDate/calendarEndDate so it works across June, July, and August.
const activities = raw.map((a) => ({
  id: String(a.id),
  name: a.name,
  type: a.type,
  startTime: a.start_date_local,  // local time — no UTC date shift
  duration: a.moving_time,        // seconds
  distance: a.distance,           // metres
  elevationGain: a.total_elevation_gain,
}));

// Step 4: Write to data/activities.json
const outPath = join(repoRoot, "data", "activities.json");
await writeFile(outPath, JSON.stringify(activities, null, 2) + "\n");

console.log(`Wrote ${activities.length} activities to data/activities.json`);
