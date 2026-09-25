/**
 * Plan validator.
 *
 * Checks every week from `weeklyRules.firstEnforcedWeek` onward against the
 * composition and placement rules in plan.js. Run by `npm run build`, so a week
 * that drifts out of balance fails the build rather than shipping quietly.
 *
 * Exit codes: 0 = clean (warnings allowed), 1 = at least one violation.
 */

import {
  planWeeks,
  weeklyRules,
  weeklySwimYards,
  workoutLibraryByKey,
} from "../plan.js";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = (dateKey) => DOW[new Date(`${dateKey}T12:00:00`).getDay()];

const violations = [];
const warnings = [];

const fail = (week, message) => violations.push({ week, message });
const warn = (week, message) => warnings.push({ week, message });

/** A week can opt out of a rule it genuinely cannot meet (no pool, no gym). */
const isRelaxed = (weekEntry, rule) => (weekEntry.relaxed ?? []).includes(rule);

const categoriesOf = (session) => session.categories ?? [];
const isReal = (session) =>
  categoriesOf(session).some((category) => weeklyRules.realCategories.includes(category));

function countByCategory(sessions) {
  const counts = {};
  for (const session of sessions) {
    for (const category of categoriesOf(session)) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  return counts;
}

function checkWeek(weekEntry, swimYards) {
  const { week } = weekEntry;
  const days = Object.entries(weekEntry.days);
  const allSessions = days.flatMap(([, sessions]) => sessions);

  // ── Composition ──────────────────────────────────────────────────────────
  const counts = countByCategory(allSessions);
  for (const [category, rule] of Object.entries(weeklyRules.counts)) {
    if (isRelaxed(weekEntry, category)) continue;
    const actual = counts[category] ?? 0;
    if (actual < rule.min) {
      fail(week, `only ${actual} ${rule.label}, needs at least ${rule.min}`);
    } else if (actual > rule.max) {
      fail(week, `${actual} ${rule.label}, more than the ${rule.max} allowed`);
    }
  }

  if (!isRelaxed(weekEntry, "swimYards") && swimYards < weeklyRules.minSwimYards) {
    fail(week, `${swimYards.toLocaleString("en-US")} swim yd, under the ${weeklyRules.minSwimYards.toLocaleString("en-US")} yd floor`);
  }

  // ── Strength composition: both leg days, plus one upper ───────────────────
  if (!isRelaxed(weekEntry, "strength")) {
    const strengthKeys = allSessions
      .filter((session) => categoriesOf(session).includes("strength"))
      .map((session) => session.libraryKey)
      .filter(Boolean);

    const { lower, upper, travel } = weeklyRules.strengthComposition;
    const hasTravel = strengthKeys.some((key) => travel.includes(key));

    if (!hasTravel) {
      for (const key of lower) {
        if (!strengthKeys.includes(key)) {
          fail(week, `missing the ${workoutLibraryByKey[key].name} day`);
        }
      }
      if (!strengthKeys.some((key) => upper.includes(key))) {
        fail(week, "no upper-body strength day");
      }
    }
  }

  // ── Weekly load warning ──────────────────────────────────────────────────
  const realCount = allSessions.filter(isReal).length;
  if (realCount > weeklyRules.warnRealPerWeek) {
    warn(week, `${realCount} real sessions, above the ${weeklyRules.warnRealPerWeek} comfort ceiling`);
  }

  // ── Placement, per day ───────────────────────────────────────────────────
  for (const [dateKey, sessions] of days) {
    const where = `${dateKey} (${dayName(dateKey)})`;

    if (!sessions.length) {
      fail(week, `${where} is empty — every day gets at least mobility`);
      continue;
    }

    const real = sessions.filter(isReal);
    if (real.length > weeklyRules.maxRealPerDay) {
      fail(week, `${where} has ${real.length} real workouts, over the cap of ${weeklyRules.maxRealPerDay}`);
    }

    const mobility = sessions.filter((session) => categoriesOf(session).includes("mobility"));
    if (mobility.length > weeklyRules.maxMobilityPerDay) {
      fail(week, `${where} has ${mobility.length} mobility sessions — this is the stacked-recovery bug`);
    }

    // Two of the same category in one day means the day was not really planned.
    const seen = new Map();
    for (const session of real) {
      for (const category of categoriesOf(session)) {
        if (!weeklyRules.realCategories.includes(category)) continue;
        if (seen.has(category)) {
          fail(week, `${where} has two ${category} sessions: "${seen.get(category)}" and "${session.title}"`);
        }
        seen.set(category, session.title);
      }
    }
  }

  // ── Placement, across days: legs then a hard run ──────────────────────────
  const ordered = days.map(([dateKey, sessions]) => ({ dateKey, sessions }));
  for (let i = 0; i < ordered.length - 1; i += 1) {
    const todayKeys = ordered[i].sessions.map((session) => session.libraryKey);
    const tomorrowKeys = ordered[i + 1].sessions.map((session) => session.libraryKey);

    const legsToday = todayKeys.some((key) => weeklyRules.strengthComposition.lower.includes(key));
    const hardRunTomorrow = tomorrowKeys.some((key) => weeklyRules.hardRunTypes.includes(key));
    if (legsToday && hardRunTomorrow) {
      warn(week, `${ordered[i].dateKey} is a leg day and ${ordered[i + 1].dateKey} is a hard run — fresh legs would be better`);
    }

    const hardRunToday = todayKeys.some((key) => weeklyRules.hardRunTypes.includes(key));
    if (hardRunToday && hardRunTomorrow) {
      fail(week, `hard runs on consecutive days: ${ordered[i].dateKey} and ${ordered[i + 1].dateKey}`);
    }
  }
}

// ── Library integrity: every session outside week 1 should name its type ─────
function checkLibraryCoverage() {
  const untyped = [];
  for (const weekEntry of planWeeks) {
    if (weekEntry.week < weeklyRules.firstEnforcedWeek) continue;
    for (const [dateKey, sessions] of Object.entries(weekEntry.days)) {
      for (const session of sessions) {
        if (!session.libraryKey) untyped.push(`w${weekEntry.week} ${dateKey}: ${session.title}`);
        else if (!workoutLibraryByKey[session.libraryKey]) {
          fail(weekEntry.week, `${dateKey}: unknown library key "${session.libraryKey}"`);
        }
      }
    }
  }
  return untyped;
}

for (const weekEntry of planWeeks) {
  if (weekEntry.week < weeklyRules.firstEnforcedWeek) continue;
  checkWeek(weekEntry, weeklySwimYards[weekEntry.week - 1]?.yards ?? 0);
}

const untyped = checkLibraryCoverage();

// ── Report ───────────────────────────────────────────────────────────────────
const byWeek = (items) => {
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.week)) grouped.set(item.week, []);
    grouped.get(item.week).push(item.message);
  }
  return [...grouped.entries()].sort((a, b) => a[0] - b[0]);
};

if (untyped.length) {
  console.log(`\n  ${untyped.length} session(s) with no library type:`);
  for (const line of untyped.slice(0, 15)) console.log(`    ${line}`);
  if (untyped.length > 15) console.log(`    ...and ${untyped.length - 15} more`);
}

if (warnings.length) {
  console.log("\n  Warnings:");
  for (const [week, messages] of byWeek(warnings)) {
    for (const message of messages) console.log(`    week ${String(week).padStart(2)}  ${message}`);
  }
}

if (violations.length) {
  console.error("\n  Rule violations:");
  for (const [week, messages] of byWeek(violations)) {
    for (const message of messages) console.error(`    week ${String(week).padStart(2)}  ${message}`);
  }
  console.error(`\n  ${violations.length} violation(s). See weeklyRules in plan.js.\n`);
  process.exit(1);
}

const weeksChecked = planWeeks.filter((w) => w.week >= weeklyRules.firstEnforcedWeek).length;
console.log(
  `\n  Plan check passed: ${weeksChecked} weeks, ${warnings.length} warning(s), ${untyped.length} untyped session(s).\n`,
);
