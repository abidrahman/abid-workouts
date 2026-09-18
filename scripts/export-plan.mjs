import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
import {
  planWeeks,
  plannedSessionsByDate,
  weeklySwimYards,
  runRamp,
  phases,
  swimPaceZones,
  swimSendOffs,
  swimDrillProgression,
  swimReadinessChecklist,
  heartRateZones,
  lowerLegProtocol,
  strengthTemplates,
  weekTargets,
  blockMeta,
  summaryCards,
} from "../plan.js";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseYards(session) {
  const m = String(session.duration ?? "").match(/([\d,]+)\s*yd/i);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

function parseKm(session) {
  const hay = `${session.title ?? ""} ${session.duration ?? ""} ${session.note ?? ""}`;
  // Prefer an explicit distance in the title, e.g. "Easy run — 5 km" or "Race — 5 mi (8 km)".
  const title = String(session.title ?? "").match(/([\d.]+)\s*km/i);
  if (title) return Number(title[1]);
  const dur = String(session.duration ?? "").match(/([\d.]+)\s*km/i);
  if (dur) return Number(dur[1]);
  const any = hay.match(/\(([\d.]+)\s*km\)/i);
  return any ? Number(any[1]) : 0;
}

const rows = [];
planWeeks.forEach((week) => {
  Object.entries(week.days).forEach(([dateKey, sessions]) => {
    (sessions ?? []).forEach((session) => {
      const d = new Date(`${dateKey}T00:00:00`);
      const cat = session.categories[0] ?? "other";
      rows.push({
        date: dateKey,
        day: DAY[d.getDay()],
        week: week.week,
        phase: week.phase ?? "",
        theme: week.theme ?? "",
        focus: week.focus ?? "",
        category: cat,
        categories: session.categories.join(", "),
        title: session.title,
        duration: session.duration,
        yards: cat === "swim" ? (session.yards ?? parseYards(session)) : 0,
        km: cat === "run" ? parseKm(session) : 0,
        note: session.note ?? "",
        locked: Boolean(session.rescheduleLocked),
      });
    });
  });
});

// Validate the extraction against plan.js's own derived numbers.
const swimByWeek = {};
const runByWeek = {};
rows.forEach((r) => {
  swimByWeek[r.week] = (swimByWeek[r.week] ?? 0) + r.yards;
  runByWeek[r.week] = (runByWeek[r.week] ?? 0) + r.km;
});

const problems = [];
const swimExpected = new Map(weeklySwimYards.map((w) => [w.week, w.yards]));
planWeeks.forEach((w) => {
  const expected = swimExpected.get(w.week);
  if (expected != null && swimByWeek[w.week] !== expected) {
    problems.push(`W${w.week} swim: extracted ${swimByWeek[w.week]} vs plan ${expected}`);
  }
});
runRamp.forEach((r) => {
  const weekNum = Number(String(r.week).match(/\d+/)?.[0]);
  const got = Math.round((runByWeek[weekNum] ?? 0) * 10) / 10;
  const want = Number(String(r.volume).match(/[\d.]+/)?.[0] ?? NaN);
  if (Number.isFinite(want) && Math.abs(got - want) > 0.51) {
    problems.push(`W${weekNum} run: extracted ${got} km vs runRamp ${r.volume}`);
  }
});

fs.writeFileSync(
  path.join(ROOT, "plan-export.json"),
  JSON.stringify(
    {
      blockMeta,
      summaryCards,
      rows,
      phases,
      weekTargets,
      swimPaceZones,
      swimSendOffs,
      swimDrillProgression,
      swimReadinessChecklist,
      heartRateZones,
      lowerLegProtocol,
      strengthTemplates,
      runRamp,
      weeklySwimYards,
    },
    null,
    1,
  ),
);

console.log(`rows: ${rows.length}`);
console.log(`swim by week: ${JSON.stringify(swimByWeek)}`);
console.log(`run by week:  ${JSON.stringify(Object.fromEntries(Object.entries(runByWeek).map(([k, v]) => [k, Math.round(v * 10) / 10])))}`);
console.log(`\nvalidation problems: ${problems.length}`);
problems.forEach((p) => console.log("  " + p));
