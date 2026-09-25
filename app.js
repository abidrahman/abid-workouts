import {
  blockMeta,
  swimPaceZones,
  swimSendOffs,
  swimTests,
  swimTestTarget,
  heartRateZones,
  summaryCards,
  phases,
  weekTargets,
  swimMethodologyCards,
  swimDrillProgression,
  swimDrills,
  swimReadinessChecklist,
  runRamp,
  lowerLegProtocol,
  strengthTemplates,
  planWeeks,
  plannedSessionsByDate,
  phaseKeyByDate,
  calendarPhaseLabels,
  weeklySwimYards,
  weekByDateKey,
} from "./plan.js";

const calendarWeekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const calendarStartDate = new Date(2026, 8, 21);
const calendarEndDate = new Date(2026, 11, 31);

// Legacy bridge from the retired June 2026 block. Intentionally empty.
const weekOneTrackingIdsByDate = {};
const weekOneDatesByTrackingId = Object.fromEntries(
  Object.entries(weekOneTrackingIdsByDate).map(([dateKey, trackingId]) => [trackingId, dateKey]),
);

const STORAGE_KEY = "baker-lake-union-week-1-tracking-v1";
const CALENDAR_STORAGE_KEY = "baker-lake-union-calendar-tracking-v1";
const CALENDAR_UI_STORAGE_KEY = "baker-lake-union-calendar-ui-v1";
const CALENDAR_RESCHEDULE_STORAGE_KEY = "baker-lake-union-calendar-reschedule-v1";
const CALENDAR_RESCHEDULE_WINDOW_DAYS = 3;
const calendarMoveOffsets = [-3, -2, -1, 1, 2, 3];
const calendarCategoryFilters = ["all", "swim", "run", "bike", "strength", "cardio", "mobility"];
const calendarStatusFilters = ["all", "incomplete", "complete"];
const calendarViewModes = ["compact", "detailed"];
const calendarFilterLabels = {
  all: "all workout types",
  swim: "swim",
  run: "run",
  bike: "bike",
  strength: "strength",
  cardio: "cardio",
  mobility: "mobility",
};
const calendarCategoryDisplayLabels = {
  swim: "Swim",
  run: "Run",
  bike: "Bike",
  strength: "Strength",
  cardio: "Cardio",
  mobility: "Mobility",
  default: "Workout",
};
const calendarMilestones = {
  swim: { dateKey: "2026-12-31", label: "2,000 yd continuous" },
  run: { dateKey: blockMeta.raceDateKey, label: "Reindeer Romp 5 mi" },
  bike: { dateKey: "2026-12-31", label: "winter base complete" },
  strength: { dateKey: blockMeta.raceDateKey, label: "Reindeer Romp 5 mi" },
  cardio: { dateKey: "2026-12-31", label: "winter base complete" },
  mobility: { dateKey: blockMeta.raceDateKey, label: "Reindeer Romp 5 mi" },
  default: { dateKey: blockMeta.raceDateKey, label: "Reindeer Romp 5 mi" },
};
const METRICS_STORAGE_KEY = "workout-metrics";
const METRICS_CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

// Phase 3: Auto-matched activities pulled from the connected provider (Strava).
let syncedActivities = [];

const AUTO_MATCHED_STORAGE_KEY = "workout-auto-matched-v1";
const MANUAL_MATCH_STORAGE_KEY = "workout-manual-matches-v1";
const EXTRA_WORKOUTS_STORAGE_KEY = "workout-extra-unplanned-v1";
const DISMISSED_ACTIVITIES_KEY = "workout-dismissed-activities-v1";
let unresolvedActivityMatches = [];

function getDismissedActivities() {
  try {
    const raw = window.localStorage.getItem(DISMISSED_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function dismissActivity(activityId) {
  const dismissed = getDismissedActivities();
  dismissed[String(activityId)] = true;
  window.localStorage.setItem(DISMISSED_ACTIVITIES_KEY, JSON.stringify(dismissed));
}

function isActivityDismissed(activityId) {
  return !!getDismissedActivities()[String(activityId)];
}

function normalizeActivityTypeDisplay(type) {
  const text = String(type ?? "").toLowerCase();
  if (/(swim|pool|open water)/.test(text)) return "Swim";
  if (/(ride|bike|cycling)/.test(text)) return "Bike";
  if (/(run|trail run)/.test(text)) return "Run";
  if (/(hike|walk)/.test(text)) return "Hike";
  if (/(strength|weight|gym|workout)/.test(text)) return "Strength";
  if (/(recovery|mobility|yoga)/.test(text)) return "Recovery";
  return type || "Activity";
}

function getAutoMatchedActivities() {
  try {
    const raw = window.localStorage.getItem(AUTO_MATCHED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAutoMatchedActivities(matched) {
  window.localStorage.setItem(AUTO_MATCHED_STORAGE_KEY, JSON.stringify(matched));
}

function loadManualActivityMatches() {
  try {
    const raw = window.localStorage.getItem(MANUAL_MATCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveManualActivityMatches(matches) {
  window.localStorage.setItem(MANUAL_MATCH_STORAGE_KEY, JSON.stringify(matches));
  // Sync each match to Firestore
  Object.entries(matches).forEach(([activityId, data]) => {
    api.saveActivityMatch(activityId, data.sessionId || data.workoutId, data).catch(() => {});
  });
}

function loadExtraWorkouts() {
  try {
    const raw = window.localStorage.getItem(EXTRA_WORKOUTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveExtraWorkouts(extra) {
  window.localStorage.setItem(EXTRA_WORKOUTS_STORAGE_KEY, JSON.stringify(extra));
  // Sync each extra workout to Firestore
  Object.entries(extra).forEach(([activityId, data]) => {
    api.saveExtraWorkout(activityId, data).catch(() => {});
  });
}

function getActivityDateKey(activity) {
  if (activity?.date && /^\d{4}-\d{2}-\d{2}$/.test(activity.date)) return activity.date;
  if (activity?.startTime) {
    const parsed = new Date(activity.startTime);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return null;
}

function normalizeActivityCategory(activityType) {
  const type = (activityType || "").toLowerCase();
  if (type.includes("swim")) return "swim";
  // Run is checked before hike so "trail run" and "treadmill run" do not fall through to hiking.
  if (/(^|[^a-z])(run|jog)/.test(type)) return "run";
  if (/(ride|bike|cycl|spin)/.test(type)) return "bike";
  if (/(weight|strength|workout|training)/.test(type)) return "strength";
  if (/(hike|walk|trail|mountaineer|snowshoe|stair|row|ski|elliptical)/.test(type)) return "cardio";
  if (/(yoga|stretch|mobility|pilates)/.test(type)) return "mobility";
  return "strength";
}

function parsePlannedMinutes(durationText) {
  const text = String(durationText ?? "");
  const rangeMatch = text.match(/(\d{1,3})\s*[–-]\s*(\d{1,3})\s*min/i);
  if (rangeMatch) {
    return {
      min: Number.parseInt(rangeMatch[1], 10),
      max: Number.parseInt(rangeMatch[2], 10),
    };
  }

  const singleMatch = text.match(/(\d{1,3})\s*min/i);
  if (singleMatch) {
    const value = Number.parseInt(singleMatch[1], 10);
    return { min: value, max: value };
  }

  return null;
}

function getCalendarSessionById(sessionId) {
  return getAllCalendarSessions().find((session) => session.id === sessionId) ?? null;
}

function scoreSessionCandidate(activity, session) {
  const activityCategory = normalizeActivityCategory(activity?.type);
  const activityDateKey = getActivityDateKey(activity);
  const activityMinutes = Number.isFinite(activity?.duration) ? Math.round(activity.duration / 60) : null;
  const plannedMinutes = parsePlannedMinutes(session.duration);
  const daysDelta = activityDateKey ? Math.abs(getDaysBetweenDateKeys(activityDateKey, session.dateKey)) : 99;
  const typeMatch = activityCategory ? session.categories.includes(activityCategory) : false;
  const durationMidpoint = plannedMinutes ? (plannedMinutes.min + plannedMinutes.max) / 2 : null;
  const durationDelta = activityMinutes !== null && durationMidpoint !== null
    ? Math.abs(activityMinutes - durationMidpoint)
    : 999;

  // Allow cross-category matching: strength ↔ cardio (for stairmaster/vertical training)
  const isStrengthActivity = activityCategory === "strength";
  const isCardioSession = session.categories.includes("cardio");
  const crossCategoryMatch = isStrengthActivity && isCardioSession;

  let score = 0;
  if (typeMatch) score += 60;
  else if (crossCategoryMatch) score += 35; // Cross-category bonus (lower than exact match)
  
  if (daysDelta === 0) score += 30;
  else if (daysDelta === 1) score += 15;
  else if (daysDelta === 2) score += 6;

  if (durationDelta <= 10) score += 12;
  else if (durationDelta <= 25) score += 6;

  return score;
}

function getSuggestedSessionsForActivity(activity, limit = 6) {
  return getAllCalendarSessions()
    .map((session) => ({ session, score: scoreSessionCandidate(activity, session) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.session);
}

function getLinkedSessionForActivity(activityId) {
  const manualMatches = loadManualActivityMatches();
  const manualMatch = manualMatches[activityId];
  if (manualMatch?.workoutId) {
    return getCalendarSessionById(manualMatch.workoutId);
  }

  const autoMatched = getAutoMatchedActivities();
  const autoEntry = Object.entries(autoMatched).find(([, value]) => value?.activityId === activityId);
  if (autoEntry) {
    return getCalendarSessionById(autoEntry[0]);
  }

  return null;
}

function getAvailableActivitiesForSession(session, limit = 12) {
  return syncedActivities
    .filter((activity) => {
      const activityId = String(activity.id);
      return (
        !getLinkedSessionForActivity(activityId) &&
        !isActivityMarkedAsExtra(activityId) &&
        !isActivityDismissed(activityId)
      );
    })
    .map((activity) => ({
      activity,
      score: scoreSessionCandidate(activity, session),
      dateKey: getActivityDateKey(activity) ?? "",
    }))
    .sort((a, b) => b.score - a.score || b.dateKey.localeCompare(a.dateKey))
    .slice(0, limit)
    .map((item) => item.activity);
}

function isActivityMarkedAsExtra(activityId) {
  const extra = loadExtraWorkouts();
  return !!extra[activityId];
}

function renderActivityMatchQueue() {
  const queueEl = document.querySelector("#activity-resolution-list");
  const sectionEl = document.querySelector("#activity-resolution");
  if (!queueEl || !sectionEl) return;

  const unresolved = unresolvedActivityMatches.filter((item) =>
    !getLinkedSessionForActivity(item.activity.id) &&
    !isActivityMarkedAsExtra(item.activity.id) &&
    !isActivityDismissed(item.activity.id)
  );
  if (!unresolved.length) {
    sectionEl.hidden = true;
    queueEl.innerHTML = "";
    return;
  }

  sectionEl.hidden = false;
  queueEl.innerHTML = unresolved
    .map((item) => {
      const activity = item.activity;
      const activityId = escapeHtml(String(activity.id));
      const activityDate = escapeHtml(getActivityDateKey(activity) ?? "Unknown date");
      const activityType = escapeHtml(normalizeActivityTypeDisplay(activity.type));
      const activityName = escapeHtml(activity.name ?? "");
      const duration = activity.duration ? `${Math.round(activity.duration / 60)} min` : null;
      const distance = activity.distance ? `${(activity.distance / 1000).toFixed(1)} km` : null;
      const elevation = activity.elevationGain ? `↑${Math.round(activity.elevationGain)} m` : null;
      const metaChips = [duration, distance, elevation].filter(Boolean)
        .map((v) => `<span class="activity-meta-chip">${escapeHtml(v)}</span>`).join("");
      const options = item.candidates
        .map(
          (session) =>
            `<option value="${escapeHtml(session.id)}">${escapeHtml(session.dateKey)} · ${escapeHtml(session.title)}</option>`,
        )
        .join("");
      return `
        <article class="activity-resolution-item">
          <div class="activity-resolution-item__header">
            <strong>${activityType}${activityName ? ` — ${activityName}` : ""}</strong>
            <span>${activityDate}</span>
          </div>
          ${metaChips ? `<div class="activity-resolution-item__meta">${metaChips}</div>` : ""}
          <p class="activity-resolution-item__reason">${escapeHtml(item.reason ?? "Needs manual linking")}</p>
          <div class="activity-resolution-item__controls">
            <select data-manual-match-select="${activityId}">
              <option value="">Select workout…</option>
              ${options}
            </select>
            <button class="button button--small button--primary" type="button" data-manual-match-link="${activityId}">
              Link
            </button>
            <button class="button button--small" type="button" data-mark-extra="${activityId}">
              Extra
            </button>
            <button class="button button--small button--ghost" type="button" data-dismiss-activity="${activityId}">
              Dismiss
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function applyManualActivityMatch(activityId, sessionId) {
  const session = getCalendarSessionById(sessionId);
  if (!session) {
    showToast("Could not find selected workout.");
    return;
  }

  const manualMatches = loadManualActivityMatches();
  manualMatches[activityId] = {
    workoutId: session.id,
    linkedAt: new Date().toISOString(),
  };
  saveManualActivityMatches(manualMatches);

  const nextTracking = calendarTracking[session.id] ?? {};
  calendarTracking[session.id] = {
    ...nextTracking,
    completed: true,
    activityId,
    manualLinkedAt: new Date().toISOString(),
  };

  saveCalendarTracking();
  renderCalendar();
  renderActivityMatchQueue();
  ActivityManager.renderActivityList(syncedActivities);
  showToast(`Linked to ${session.title}`);
  if (isMatchingTabActive()) renderMatchingTab();
  if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
}

function markActivityAsExtra(activityId) {
  const activity = syncedActivities.find((a) => String(a.id) === activityId);
  if (!activity) {
    showToast("Could not find activity.");
    return;
  }

  const extra = loadExtraWorkouts();
  extra[activityId] = {
    activity,
    markedAt: new Date().toISOString(),
  };
  saveExtraWorkouts(extra);

  renderCalendar();
  renderActivityMatchQueue();
  ActivityManager.renderActivityList(syncedActivities);
  showToast(`Marked "${activity.name}" as extra workout`);
  if (isMatchingTabActive()) renderMatchingTab();
  if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
}

let skippedReviewSessions = new Set();
let matchingTabEventsAttached = false;

function isMatchingTabActive() {
  return !!document.querySelector('[data-tab-panel="matching"].is-active');
}

function isStrengthHistoryTabActive() {
  return !!document.querySelector('[data-tab-panel="strength-history"].is-active');
}

function renderStrengthHistoryTab() {
  const summaryEl = document.querySelector("#strength-history-summary");
  const sectionEl = document.querySelector("#strength-history-section");
  if (!summaryEl || !sectionEl) return;

  const sessions = getStrengthWorkoutSessionsFromStorage();
  const entries = getStrengthHistoryEntries();

  if (!entries.length) {
    summaryEl.textContent = "No strength sessions logged yet.";
    sectionEl.innerHTML = '<p class="small-note">Finish a workout in Workout Mode to start building your history.</p>';
    return;
  }

  const byExercise = entries.reduce((map, entry) => {
    const key = entry.exerciseKey;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
    return map;
  }, new Map());

  summaryEl.textContent = `${sessions.length} workout sessions · ${entries.length} logged sets · ${byExercise.size} exercises`;
  sectionEl.innerHTML = `
    <div class="strength-history">
      ${[...byExercise.entries()]
        .sort((a, b) => b[1][0].timestamp - a[1][0].timestamp)
        .map(([exerciseKey, exerciseEntries]) => {
          const exerciseName = exerciseEntries[0]?.exerciseName || getExerciseNameFromOptions(null, exerciseKey);
          return `
            <article class="strength-history-card">
              <h3>${escapeHtml(exerciseName)}</h3>
              <div class="strength-history-card__rows">
                ${exerciseEntries
                  .map((entry) => {
                    const noteText = entry.note ? `<p class="strength-history-card__note">${escapeHtml(entry.note)}</p>` : "";
                    return `
                      <div class="strength-history-card__row">
                        <div>
                          <strong>${escapeHtml(`${entry.weight} × ${entry.reps}`)}</strong>
                          <p>${escapeHtml(entry.sessionTitle)}</p>
                          ${noteText}
                        </div>
                        <span>${escapeHtml(entry.date)}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function formatMatchingDate(dateKey) {
  if (!dateKey) return "";
  const date = new Date(dateKey + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getLinkedActivityForSession(sessionId) {
  const autoMatched = getAutoMatchedActivities();
  if (autoMatched[sessionId]) {
    const activityId = autoMatched[sessionId].activityId;
    return syncedActivities.find((a) => String(a.id) === activityId) ?? null;
  }
  const manualMatches = loadManualActivityMatches();
  const manualEntry = Object.entries(manualMatches).find(([, m]) => m.workoutId === sessionId);
  if (manualEntry) {
    const activityId = manualEntry[0];
    return syncedActivities.find((a) => String(a.id) === activityId) ?? null;
  }
  return null;
}

function unlinkActivity(activityId) {
  const id = String(activityId);
  const manualMatches = loadManualActivityMatches();
  delete manualMatches[id];
  saveManualActivityMatches(manualMatches);

  const autoMatched = getAutoMatchedActivities();
  for (const [sessionId, entry] of Object.entries(autoMatched)) {
    if (String(entry?.activityId) === id) {
      delete autoMatched[sessionId];
      const trackEntry = calendarTracking[sessionId];
      if (trackEntry && String(trackEntry.activityId) === id) {
        calendarTracking[sessionId] = { ...trackEntry, completed: false };
        delete calendarTracking[sessionId].activityId;
        delete calendarTracking[sessionId].autoCheckedAt;
      }
      break;
    }
  }
  saveAutoMatchedActivities(autoMatched);
  saveCalendarTracking();

  renderCalendar();
  renderMatchingTab();
  showToast("Activity unlinked");
}

function unlinkFromExtra(activityId) {
  const extra = loadExtraWorkouts();
  delete extra[String(activityId)];
  saveExtraWorkouts(extra);
  renderCalendar();
  renderMatchingTab();
}

function restoreDismissed(activityId) {
  const dismissed = getDismissedActivities();
  delete dismissed[String(activityId)];
  window.localStorage.setItem(DISMISSED_ACTIVITIES_KEY, JSON.stringify(dismissed));
  renderMatchingTab();
}

function renderMatchingTab() {
  const container = document.querySelector("#matching-tracker");
  if (!container) return;

  const sessions = getAllCalendarSessions();
  const activities = [...syncedActivities].sort((a, b) => {
    const aKey = getActivityDateKey(a) || "";
    const bKey = getActivityDateKey(b) || "";
    return bKey.localeCompare(aKey);
  });

  const linkedSessionIds = new Set(
    sessions.filter((s) => getLinkedActivityForSession(s.id)).map((s) => s.id)
  );

  const linkedCount = linkedSessionIds.size;
  const summaryEl = document.querySelector("#matching-summary");
  if (summaryEl) {
    summaryEl.textContent = `${linkedCount}/${sessions.length} sessions linked · ${activities.length} Strava activities`;
  }

  // Section A: Needs Review
  const reviewItems = [];
  const todayKey = dateToKey(new Date());
  for (const session of sessions) {
    if (linkedSessionIds.has(session.id)) continue;
    if (skippedReviewSessions.has(session.id)) continue;
    if (session.dateKey > todayKey) continue;
    const candidates = activities
      .filter(
        (a) =>
          !getLinkedSessionForActivity(String(a.id)) &&
          !isActivityMarkedAsExtra(String(a.id)) &&
          !isActivityDismissed(String(a.id))
      )
      .map((a) => ({ activity: a, score: scoreSessionCandidate(a, session) }))
      .filter((item) => item.score >= 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    if (candidates.length > 0) {
      reviewItems.push({ session, candidates });
    }
  }

  const reviewEl = document.querySelector("#matching-needs-review");
  if (reviewEl) {
    if (reviewItems.length === 0) {
      reviewEl.innerHTML = "";
    } else {
      reviewEl.innerHTML = `
        <div class="matching-block">
          <div class="matching-block__header">
            <h3>Needs Review</h3>
            <span class="matching-block__count">${reviewItems.length}</span>
          </div>
          <div class="matching-review-list">
            ${reviewItems
              .map((item) => {
                const sessionIdEsc = escapeHtml(item.session.id);
                const dateStr = escapeHtml(formatMatchingDate(item.session.dateKey));
                const title = escapeHtml((item.session.title || "").slice(0, 60));
                const chips = item.candidates
                  .map((c) => {
                    const actId = escapeHtml(String(c.activity.id));
                    const actName = escapeHtml(
                      (c.activity.name || normalizeActivityTypeDisplay(c.activity.type)).slice(0, 40)
                    );
                    const actDate = escapeHtml(formatMatchingDate(getActivityDateKey(c.activity)));
                    const dur = c.activity.duration ? `${Math.round(c.activity.duration / 60)}m` : "";
                    return `<button class="matching-candidate-chip" type="button" data-link-candidate data-candidate-activity="${actId}" data-candidate-session="${sessionIdEsc}">${actName}${actDate ? ` · ${actDate}` : ""}${dur ? ` · ${dur}` : ""}</button>`;
                  })
                  .join("");
                return `
                <div class="matching-review-card">
                  <div class="matching-review-card__session">
                    <strong>${dateStr} · ${title}</strong>
                  </div>
                  <div class="matching-review-card__candidates">
                    ${chips}
                    <button class="matching-candidate-chip matching-candidate-chip--skip" type="button" data-skip-session="${sessionIdEsc}">Skip</button>
                  </div>
                </div>`;
              })
              .join("")}
          </div>
        </div>`;
    }
  }

  // Section B: All Scheduled Workouts grouped by week
  const weekGroups = new Map();
  for (const session of sessions) {
    const date = new Date(session.dateKey + "T00:00:00");
    const day = date.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    const weekKey = dateToKey(monday);
    if (!weekGroups.has(weekKey)) weekGroups.set(weekKey, []);
    weekGroups.get(weekKey).push(session);
  }

  const workoutsEl = document.querySelector("#matching-workouts-section");
  if (workoutsEl) {
    const sortedWeeks = [...weekGroups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    workoutsEl.innerHTML = `
      <div class="matching-block">
        <div class="matching-block__header">
          <h3>All Scheduled Workouts</h3>
          <span class="matching-block__count">${sessions.length}</span>
        </div>
        ${sortedWeeks
          .map(([weekKey, weekSessions]) => {
            const weekDate = new Date(weekKey + "T00:00:00");
            const weekEnd = new Date(weekDate);
            weekEnd.setDate(weekDate.getDate() + 6);
            const weekLabel = `${formatMatchingDate(weekKey)} – ${formatMatchingDate(dateToKey(weekEnd))}`;
            return `
            <div class="matching-week">
              <h4 class="matching-week__label">${escapeHtml(weekLabel)}</h4>
              ${weekSessions
                .map((session) => {
                  const sessionIdEsc = escapeHtml(session.id);
                  const linked = getLinkedActivityForSession(session.id);
                  const linkedClass = linked ? "matching-row--linked" : "matching-row--unlinked";
                  const dateStr = escapeHtml(formatMatchingDate(session.dateKey));
                  const title = escapeHtml((session.title || "").slice(0, 40));
                  const linkedActivityName = linked
                    ? escapeHtml((linked.name || normalizeActivityTypeDisplay(linked.type)).slice(0, 40))
                    : "";
                  const availableActivities = activities
                    .filter((a) => !getLinkedSessionForActivity(String(a.id)))
                    .map((a) => {
                      const aId = escapeHtml(String(a.id));
                      const aName = escapeHtml(
                        (a.name || normalizeActivityTypeDisplay(a.type)).slice(0, 50)
                      );
                      const aDate = escapeHtml(formatMatchingDate(getActivityDateKey(a)));
                      return `<option value="${aId}">${aName}${aDate ? ` (${aDate})` : ""}</option>`;
                    })
                    .join("");
                  const detailsInner = linked
                    ? `<div class="matching-linked-detail">
                        ${session.duration ? `<p><strong>Planned:</strong> ${escapeHtml(session.duration)}</p>` : ""}
                        ${session.note ? `<p class="matching-note">${escapeHtml(session.note.slice(0, 100))}</p>` : ""}
                        <p><strong>Activity:</strong> ${escapeHtml(linked.name || normalizeActivityTypeDisplay(linked.type))}
                          ${linked.duration ? ` · ⏱ ${Math.round(linked.duration / 60)} min` : ""}
                          ${linked.distance ? ` · ${(linked.distance / 1000).toFixed(1)} km` : ""}
                          ${linked.elevationGain ? ` · ↑${Math.round(linked.elevationGain)} m` : ""}
                        </p>
                        <button class="button button--small button--ghost" type="button" data-unlink-activity="${escapeHtml(String(linked.id))}">Unlink</button>
                      </div>`
                    : `${session.duration ? `<p><strong>Planned:</strong> ${escapeHtml(session.duration)}</p>` : ""}
                       ${session.note ? `<p class="matching-note">${escapeHtml(session.note.slice(0, 100))}</p>` : ""}
                       <div class="matching-link-controls">
                         <select data-workout-link-select="${sessionIdEsc}">
                           <option value="">Select activity…</option>
                           ${availableActivities}
                         </select>
                         <button class="button button--small button--primary" type="button" data-workout-link="${sessionIdEsc}">Link</button>
                       </div>`;
                  return `
                  <div class="matching-row ${linkedClass}">
                    <div class="matching-row__toggle" data-expand-row>
                      <span class="matching-row__dot"></span>
                      <span class="matching-row__date">${dateStr}</span>
                      <span class="matching-row__title">${title}</span>
                      ${linked ? `<span class="matching-row__linked-activity">${linkedActivityName}</span>` : ""}
                    </div>
                    <div class="matching-row__details" hidden>
                      <div class="matching-row__details-inner">${detailsInner}</div>
                    </div>
                  </div>`;
                })
                .join("")}
            </div>`;
          })
          .join("")}
      </div>`;
  }

  // Section C: All Strava Activities
  const activitiesEl = document.querySelector("#matching-activities-section");
  if (activitiesEl) {
    activitiesEl.innerHTML = `
      <div class="matching-block">
        <div class="matching-block__header">
          <h3>All Strava Activities</h3>
          <span class="matching-block__count">${activities.length}</span>
        </div>
        <div class="matching-activities-list">
          ${
            activities.length === 0
              ? `<p class="matching-empty">No Strava activities synced yet.</p>`
              : activities
                  .map((activity) => {
                    const actId = String(activity.id);
                    const actIdEsc = escapeHtml(actId);
                    const isLinked = !!getLinkedSessionForActivity(actId);
                    const isExtra = isActivityMarkedAsExtra(actId);
                    const isDismissed = isActivityDismissed(actId);
                    const linkedSession = isLinked ? getLinkedSessionForActivity(actId) : null;
                    const typeBadge = escapeHtml(normalizeActivityTypeDisplay(activity.type));
                    const name = escapeHtml((activity.name || "").slice(0, 40));
                    const dateStr = escapeHtml(formatMatchingDate(getActivityDateKey(activity)));
                    const duration = activity.duration
                      ? `${Math.round(activity.duration / 60)} min`
                      : "—";
                    let statusBadge = "";
                    if (isLinked)
                      statusBadge = `<span class="matching-status-badge matching-status-badge--linked">✓ Linked</span>`;
                    else if (isExtra)
                      statusBadge = `<span class="matching-status-badge matching-status-badge--extra">Extra</span>`;
                    else if (isDismissed)
                      statusBadge = `<span class="matching-status-badge matching-status-badge--dismissed">Dismissed</span>`;
                    const availableSessions = sessions
                      .filter((s) => !getLinkedActivityForSession(s.id))
                      .map((s) => {
                        const sId = escapeHtml(s.id);
                        const sTitle = escapeHtml((s.title || "").slice(0, 50));
                        const sDate = escapeHtml(s.dateKey || "");
                        return `<option value="${sId}">${sDate} · ${sTitle}</option>`;
                      })
                      .join("");
                    let detailsInner;
                    const metaLine = [
                      activity.duration ? `⏱ ${Math.round(activity.duration / 60)} min` : "",
                      activity.distance ? `${(activity.distance / 1000).toFixed(1)} km` : "",
                      activity.elevationGain ? `↑${Math.round(activity.elevationGain)} m` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    if (isLinked) {
                      detailsInner = `
                        ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
                        <p><strong>Linked to:</strong> ${escapeHtml(linkedSession?.title || "Unknown workout")}</p>
                        <button class="button button--small button--ghost" type="button" data-unlink-activity="${actIdEsc}">Unlink</button>`;
                    } else if (isExtra) {
                      detailsInner = `
                        ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
                        <p>Marked as extra workout</p>
                        <button class="button button--small button--ghost" type="button" data-unlink-from-extra="${actIdEsc}">Remove from extra</button>`;
                    } else if (isDismissed) {
                      detailsInner = `
                        ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
                        <p>Dismissed</p>
                        <button class="button button--small button--ghost" type="button" data-restore-dismissed="${actIdEsc}">Restore</button>`;
                    } else {
                      detailsInner = `
                        ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
                        <div class="matching-link-controls">
                          <select data-activity-link-select="${actIdEsc}">
                            <option value="">Link to workout…</option>
                            ${availableSessions}
                          </select>
                          <button class="button button--small button--primary" type="button" data-activity-link="${actIdEsc}">Link</button>
                          <button class="button button--small" type="button" data-mark-extra-activity="${actIdEsc}">Mark as Extra</button>
                          <button class="button button--small button--ghost" type="button" data-dismiss-activity-row="${actIdEsc}">Dismiss</button>
                        </div>`;
                    }
                    return `
                    <div class="matching-row">
                      <div class="matching-row__toggle" data-expand-row>
                        <span class="matching-type-badge">${typeBadge}</span>
                        <span class="matching-row__title">${name || typeBadge}</span>
                        <span class="matching-row__date">${dateStr}</span>
                        <span class="matching-row__duration">${escapeHtml(duration)}</span>
                        ${statusBadge}
                      </div>
                      <div class="matching-row__details" hidden>
                        <div class="matching-row__details-inner">${detailsInner}</div>
                      </div>
                    </div>`;
                  })
                  .join("")
          }
        </div>
      </div>`;
  }

  attachMatchingTabEvents();
}

function attachMatchingTabEvents() {
  if (matchingTabEventsAttached) return;
  const container = document.querySelector("#matching-tracker");
  if (!container) return;
  matchingTabEventsAttached = true;

  container.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const expandTrigger = event.target.closest("[data-expand-row]");
    if (expandTrigger) {
      const row = expandTrigger.closest(".matching-row");
      const details = row?.querySelector(".matching-row__details");
      if (details) details.hidden = !details.hidden;
      return;
    }

    const candidateChip = event.target.closest("[data-link-candidate]");
    if (candidateChip) {
      const activityId = candidateChip.dataset.candidateActivity;
      const sessionId = candidateChip.dataset.candidateSession;
      if (activityId && sessionId) applyManualActivityMatch(activityId, sessionId);
      return;
    }

    const skipBtn = event.target.closest("[data-skip-session]");
    if (skipBtn) {
      const sessionId = skipBtn.dataset.skipSession;
      if (sessionId) {
        skippedReviewSessions.add(sessionId);
        renderMatchingTab();
      }
      return;
    }

    const workoutLinkBtn = event.target.closest("[data-workout-link]");
    if (workoutLinkBtn) {
      const sessionId = workoutLinkBtn.dataset.workoutLink;
      const select = container.querySelector(`[data-workout-link-select="${CSS.escape(sessionId)}"]`);
      const activityId = select?.value;
      if (!activityId) { showToast("Select an activity first."); return; }
      applyManualActivityMatch(activityId, sessionId);
      return;
    }

    const unlinkBtn = event.target.closest("[data-unlink-activity]");
    if (unlinkBtn) {
      unlinkActivity(unlinkBtn.dataset.unlinkActivity);
      return;
    }

    const activityLinkBtn = event.target.closest("[data-activity-link]");
    if (activityLinkBtn) {
      const activityId = activityLinkBtn.dataset.activityLink;
      const select = container.querySelector(`[data-activity-link-select="${CSS.escape(activityId)}"]`);
      const sessionId = select?.value;
      if (!sessionId) { showToast("Select a workout first."); return; }
      applyManualActivityMatch(activityId, sessionId);
      return;
    }

    const markExtraBtn = event.target.closest("[data-mark-extra-activity]");
    if (markExtraBtn) {
      markActivityAsExtra(markExtraBtn.dataset.markExtraActivity);
      return;
    }

    const dismissBtn = event.target.closest("[data-dismiss-activity-row]");
    if (dismissBtn) {
      dismissActivity(dismissBtn.dataset.dismissActivityRow);
      renderMatchingTab();
      return;
    }

    const restoreBtn = event.target.closest("[data-restore-dismissed]");
    if (restoreBtn) {
      restoreDismissed(restoreBtn.dataset.restoreDismissed);
      return;
    }

    const unlinkExtraBtn = event.target.closest("[data-unlink-from-extra]");
    if (unlinkExtraBtn) {
      unlinkFromExtra(unlinkExtraBtn.dataset.unlinkFromExtra);
      return;
    }
  });
}

function setUnresolvedMatchQueue(syncResult) {
  const nextQueue = [];
  const byId = new Map(getAllCalendarSessions().map((session) => [session.id, session]));

  (syncResult.conflicts || []).forEach((item) => {
    const activity = item.activity;
    if (!activity?.id) return;
    const fromCandidates = (item.candidates || []).map((id) => byId.get(id)).filter(Boolean);
    const fallback = getSuggestedSessionsForActivity(activity);
    nextQueue.push({
      activity,
      reason: item.reason || "Multiple possible matches",
      candidates: fromCandidates.length ? fromCandidates : fallback,
    });
  });

  (syncResult.unmatched || []).forEach((item) => {
    const activity = item.activity;
    if (!activity?.id) return;
    const candidates = getSuggestedSessionsForActivity(activity);
    if (candidates.length) {
      nextQueue.push({
        activity,
        reason: item.reason || "No confident auto-match",
        candidates,
      });
    }
  });

  unresolvedActivityMatches = nextQueue;
  renderActivityMatchQueue();
}

async function syncActivities() {
  // Client-side auto-matching using the same scoring logic
  if (!syncedActivities.length) return;

  const autoMatched = getAutoMatchedActivities();
  const manualMatches = loadManualActivityMatches();
  const extra = loadExtraWorkouts();
  let changed = false;
  const conflicts = [];

  for (const activity of syncedActivities) {
    const id = String(activity.id);
    // Skip already resolved activities
    if (autoMatched[id] || manualMatches[id] || extra[id]) continue;
    // Skip if already auto-matched to a session (keyed by session id not activity id)
    const alreadyAutoChecked = Object.values(autoMatched).some((v) => v?.activityId === id);
    if (alreadyAutoChecked) continue;

    const scored = getAllCalendarSessions()
      .map((session) => ({ session, score: scoreSessionCandidate(activity, session) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) continue;

    const best = scored[0];
    // High confidence: type + same day (score >= 90)
    if (best.score >= 90) {
      autoMatched[best.session.id] = {
        activityId: id,
        confidence: "high",
        timestamp: new Date().toISOString(),
      };
      if (!calendarTracking[best.session.id]) calendarTracking[best.session.id] = {};
      calendarTracking[best.session.id].completed = true;
      calendarTracking[best.session.id].autoCheckedAt = new Date().toISOString();
      calendarTracking[best.session.id].activityId = id;
      changed = true;
    } else {
      // Lower confidence — add to manual resolution queue
      conflicts.push({ activity, candidates: scored.slice(0, 6).map((s) => s.session) });
    }
  }

  if (changed) {
    saveAutoMatchedActivities(autoMatched);
    saveCalendarTracking();
    renderCalendar();
  }

  // Populate the manual match queue for unresolved activities
  unresolvedActivityMatches = conflicts.map(({ activity, candidates }) => ({
    activity,
    reason: "Possible match — please confirm",
    candidates,
  }));
  renderActivityMatchQueue();
}

const tabIds = ["calendar", "plan", "matching", "strength-history"];
const tabAliases = {
  dashboard: "calendar",
  overview: "calendar",
  "today-panel": "calendar",
  "today-workouts": "calendar",
  "calendar-tracker": "calendar",
  "plan-tracker": "plan",
  "the-plan": "plan",
  phases: "plan",
  "phase-timeline": "plan",
  "swim-plan": "plan",
  "run-ramp": "plan",
  "match-activities": "matching",
  "strength-history-tracker": "strength-history",
  "strength-history": "strength-history",
  "tracking-summary": "calendar",
};

// ── Firebase / cross-device sync ──────────────────────────────────────────────
import * as api from './app-api.js';

// Single-user personal app: every device shares ONE Firestore document tree, which
// is the source of truth for cross-device sync. The id MUST be identical on every
// device, so it is a fixed constant — NOT a per-device random value. (A random
// per-device id was the reason changes on mobile never showed up on the laptop:
// each device wrote to its own users/{id}/... tree.)
const APP_USER_ID_KEY = 'abid-workouts-user-id';
const SHARED_USER_ID = 'abid-primary';
// Stable Firestore document id under which the full-state blobs (workout tracking,
// calendar tracking, strength logs) are stored. A single fixed doc keeps reads
// deterministic across days and devices instead of scattering blobs under per-day
// date keys.
const SYNC_DOC_KEY = 'current';
const _userId = SHARED_USER_ID;
// Mirror to localStorage for reference/debugging, overriding any legacy per-device id.
try { localStorage.setItem(APP_USER_ID_KEY, _userId); } catch { /* ignore */ }
api.initializeAPI(_userId);

// ── Startup sync: seed once, then pull-only ───────────────────────────────────
// Model (no merge conflicts, single source of truth):
//   • The FIRST device opened after this ships finds an un-seeded cloud tree and
//     PUSHES its local data up, then marks the tree seeded.
//   • Every device after that finds a seeded tree and PULLS cloud down, REPLACING
//     its local copy. It never merges its own local state up on load, so there is
//     nothing to conflict-resolve. (Ongoing edits still sync normally afterward.)
// Runs asynchronously so it never blocks the initial render.

async function seedCloudFromLocal() {
  const localTracking = loadTracking();
  const localCalendar = loadCalendarTracking();
  const localReschedules = loadCalendarReschedules();
  const localUi = loadCalendarUiState();
  const localMatches = loadManualActivityMatches();
  const localExtras = loadExtraWorkouts();
  let localStrength = {};
  try { localStrength = JSON.parse(localStorage.getItem('strengthLogs')) || {}; } catch { localStrength = {}; }

  const ops = [
    api.saveTracking(SYNC_DOC_KEY, localTracking),
    api.saveCalendarTracking(SYNC_DOC_KEY, localCalendar),
    api.saveStrengthLogs(SYNC_DOC_KEY, localStrength),
    api.saveCalendarReschedules(localReschedules),
    api.saveCalendarUiState(localUi),
  ];
  for (const [activityId, data] of Object.entries(localMatches)) {
    ops.push(api.saveActivityMatch(activityId, data.sessionId || data.workoutId, data));
  }
  for (const [activityId, data] of Object.entries(localExtras)) {
    ops.push(api.saveExtraWorkout(activityId, data));
  }
  await Promise.all(ops);
  console.log('[Sync] Seeded Firestore from this device — it is now the source of truth.');
}

async function pullCloudReplaceLocal() {
  const [bulk, reschedulesCloud, trackingCloud, calendarTrackingCloud, strengthLogsCloud, uiStateCloud] =
    await Promise.all([
      api.loadAllUserData(),
      api.loadCalendarReschedules(),
      api.loadTracking(SYNC_DOC_KEY),
      api.loadCalendarTracking(SYNC_DOC_KEY),
      api.loadStrengthLogs(SYNC_DOC_KEY),
      api.loadCalendarUiState(),
    ]);
  const { activityMatches = {}, extraWorkouts = {} } = bulk || {};

  // Replace manual activity matches + extra workouts (cloud is authoritative)
  window.localStorage.setItem(MANUAL_MATCH_STORAGE_KEY, JSON.stringify(activityMatches || {}));
  window.localStorage.setItem(EXTRA_WORKOUTS_STORAGE_KEY, JSON.stringify(extraWorkouts || {}));

  // Replace calendar reschedules
  calendarReschedules = reschedulesCloud || {};
  window.localStorage.setItem(CALENDAR_RESCHEDULE_STORAGE_KEY, JSON.stringify(calendarReschedules));

  // Replace daily workout tracking (stored as the `sessions` blob)
  tracking = (trackingCloud && trackingCloud.sessions) || {};
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));

  // Replace calendar tracking (strip sync metadata fields)
  let cloudCalendar = {};
  if (calendarTrackingCloud && Object.keys(calendarTrackingCloud).length) {
    const { updatedAt, date, ...rest } = calendarTrackingCloud;
    cloudCalendar = rest;
  }
  calendarTracking = cloudCalendar;
  window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(calendarTracking));

  // Replace calendar UI state (reuse local validation)
  if (uiStateCloud && Object.keys(uiStateCloud).length) {
    const { updatedAt, ...cloudUi } = uiStateCloud;
    window.localStorage.setItem(CALENDAR_UI_STORAGE_KEY, JSON.stringify(cloudUi));
    calendarUiState = loadCalendarUiState();
  }

  // Replace strength logs
  const cloudStrength = strengthLogsCloud || {};
  const normalizedStrengthLogs =
    typeof StrengthWorkoutManager !== "undefined" && StrengthWorkoutManager?.migrateStrengthLogs
      ? StrengthWorkoutManager.migrateStrengthLogs(cloudStrength)
      : cloudStrength;
  localStorage.setItem('strengthLogs', JSON.stringify(normalizedStrengthLogs));
  if (typeof StrengthWorkoutManager !== 'undefined' && StrengthWorkoutManager) {
    StrengthWorkoutManager.workoutLogs = normalizedStrengthLogs;
  }

  // Re-render so pulled data shows up without a manual reload
  calendarDays = buildCalendarDays();
  renderCalendar();
  renderTrackingSummary();
  renderActivityMatchQueue();
  if (isMatchingTabActive()) renderMatchingTab();
  if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
  console.log('[Sync] Pulled Firestore state and replaced local (cloud is source of truth).');
}

async function initSync() {
  try {
    const meta = await api.loadSyncMeta();
    if (!meta.ok) {
      // Couldn't reach Firestore (offline / transient). Leave local untouched and
      // let normal background writes reconcile once connectivity returns — never
      // re-seed on an unconfirmed read, or we could clobber good cloud data.
      console.warn('[Sync] Could not reach Firestore on startup; using local data for now.');
      return;
    }
    if (meta.exists && meta.data && meta.data.seeded) {
      await pullCloudReplaceLocal();
    } else {
      await seedCloudFromLocal();
      await api.markSeeded({ seededBy: _userId });
    }
  } catch (e) {
    console.warn('[Sync] Startup sync failed:', e);
  }
}
initSync();

// ─────────────────────────────────────────────────────────────────────────────

let activeFilter = "all";
const defaultCalendarUiState = Object.freeze({
  categoryFilter: "all",
  statusFilter: "all",
  view: "compact",
});
let calendarUiState = loadCalendarUiState();
let tracking = loadTracking();
let calendarTracking = loadCalendarTracking();
let calendarReschedules = loadCalendarReschedules();
let cachedMetrics = loadMetricsFromStorage();
let calendarDays = buildCalendarDays();
let calendarEventsAttached = false;
let todayPanelEventsAttached = false;
let siteNavEventsAttached = false;
let lastCalendarDetailTrigger = null;
let calendarDragState = null;
let calendarSuppressNextClick = false;

function loadTracking() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Could not load tracking state", error);
    return {};
  }
}

function saveTracking() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
  // Background cloud sync under a stable doc so all devices read the same blob
  api.saveTracking(SYNC_DOC_KEY, tracking).catch(() => {});
}

function getDayTracking(id) {
  const saved = tracking[id] ?? {};
  return {
    completed: false,
    ...saved,
  };
}

function loadCalendarTracking() {
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Could not load calendar tracking state", error);
    return {};
  }
}

function saveCalendarTracking() {
  window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(calendarTracking));
  api.saveCalendarTracking(SYNC_DOC_KEY, calendarTracking).catch(() => {});
}

function loadCalendarReschedules() {
  try {
    const raw = window.localStorage.getItem(CALENDAR_RESCHEDULE_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch (error) {
    console.warn("Could not load calendar reschedule state", error);
    return {};
  }
}

function saveCalendarReschedules() {
  window.localStorage.setItem(CALENDAR_RESCHEDULE_STORAGE_KEY, JSON.stringify(calendarReschedules));
  api.saveCalendarReschedules(calendarReschedules).catch(() => {});
}

function loadCalendarUiState() {
  try {
    const raw = window.localStorage.getItem(CALENDAR_UI_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      categoryFilter: calendarCategoryFilters.includes(saved.categoryFilter)
        ? saved.categoryFilter
        : defaultCalendarUiState.categoryFilter,
      statusFilter: calendarStatusFilters.includes(saved.statusFilter)
        ? saved.statusFilter
        : defaultCalendarUiState.statusFilter,
      view: calendarViewModes.includes(saved.view) ? saved.view : defaultCalendarUiState.view,
    };
  } catch (error) {
    console.warn("Could not load calendar UI state", error);
    return defaultCalendarUiState;
  }
}

function saveCalendarUiState() {
  window.localStorage.setItem(CALENDAR_UI_STORAGE_KEY, JSON.stringify(calendarUiState));
  api.saveCalendarUiState(calendarUiState).catch(() => {});
}

function loadMetricsFromStorage() {
  try {
    const raw = window.localStorage.getItem(METRICS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Could not load metrics from storage", error);
    return {};
  }
}

function saveMetricsToStorage(metrics) {
  try {
    window.localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
  } catch (error) {
    console.warn("Could not save metrics to storage", error);
  }
}

function fetchDailyMetrics(dateRange = null) {
  // No backend server available — metrics are loaded from local storage only.
  return Promise.resolve([]);
}

function cacheMetrics(metricsArray) {
  // Merge new metrics with cached ones
  if (!Array.isArray(metricsArray)) return;
  
  metricsArray.forEach((metric) => {
    const dateKey = metric.dateKey;
    if (dateKey && typeof dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      cachedMetrics[dateKey] = {
        ...cachedMetrics[dateKey],
        sleepDuration: metric.sleepDuration ?? metric.sleepMinutes,
        sleepScore: metric.sleepScore,
        calories: metric.calories,
        steps: metric.steps,
        fetchedAt: Date.now(),
      };
    }
  });
  
  saveMetricsToStorage(cachedMetrics);
}

function getMetricsForDate(dateKey) {
  const cached = cachedMetrics[dateKey];
  if (cached) return cached;
  
  return null;
}

function formatMetrics(metrics) {
  if (!metrics) return null;
  
  const sleepDuration = metrics.sleepDuration ?? metrics.sleepMinutes;
  const sleepScore = metrics.sleepScore;
  const calories = metrics.calories;
  const steps = metrics.steps;
  
  const display = {
    sleep: sleepDuration ? formatSleepDuration(sleepDuration) : null,
    sleepScore: sleepScore || null,
    calories: calories ? formatCalories(calories) : null,
    steps: steps ? formatSteps(steps) : null,
    color: getMetricsColor(metrics),
  };
  
  return display;
}

function formatCalories(calories) {
  return new Intl.NumberFormat("en-US").format(Math.round(calories));
}

function formatSteps(steps) {
  if (steps >= 10000) {
    return `${(steps / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-US").format(steps);
}

function getMetricsColor(metrics) {
  if (!metrics) return "neutral";
  
  const sleepDuration = metrics.sleepDuration ?? metrics.sleepMinutes;
  const steps = metrics.steps;
  const calories = metrics.calories;
  
  // Color coding: good (green), warning (yellow), concern (red)
  let concern = false;
  let warning = false;
  
  // Sleep quality
  if (sleepDuration && sleepDuration < 360) {
    concern = true; // <6h
  } else if (sleepDuration && sleepDuration < 420) {
    warning = true; // <7h
  }
  
  // Steps
  if (steps && steps < 5000) {
    concern = true;
  } else if (steps && steps < 8000) {
    warning = true;
  }
  
  // Calories (healthy range ~2000-2800 for active person)
  if (calories && (calories < 1500 || calories > 3500)) {
    warning = true;
  }
  
  if (concern) return "concern";
  if (warning) return "warning";
  return "good";
}

function isCacheStale(fetchedAt) {
  if (!fetchedAt) return true;
  return Date.now() - fetchedAt > METRICS_CACHE_MAX_AGE;
}

function getTimeAgo(timestamp) {
  if (!timestamp) return "never";
  
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarPhaseKey(dateKey) {
  return phaseKeyByDate[dateKey] ?? "winterbase";
}

function isCalendarDateKey(dateKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey ?? ""));
}

function isDateKeyWithinCalendar(dateKey) {
  if (!isCalendarDateKey(dateKey)) return false;
  return dateKey >= dateToKey(calendarStartDate) && dateKey <= dateToKey(calendarEndDate);
}

function addDaysToDateKey(dateKey, offset) {
  const date = parseCalendarDateKey(dateKey);
  date.setDate(date.getDate() + offset);
  return dateToKey(date);
}

function clampDateKeyToCalendar(dateKey) {
  if (dateKey < dateToKey(calendarStartDate)) return dateToKey(calendarStartDate);
  if (dateKey > dateToKey(calendarEndDate)) return dateToKey(calendarEndDate);
  return dateKey;
}

function getCalendarSessionBaseId(session, plannedDateKey, index) {
  return session.id ?? `calendar-${plannedDateKey}-${index + 1}`;
}

function getCalendarSessionMoveWindow(session = {}) {
  return session.rescheduleWindowDays ?? CALENDAR_RESCHEDULE_WINDOW_DAYS;
}

function isCalendarSessionLocked(session = {}) {
  return Boolean(session.rescheduleLocked ?? session.locked);
}

function isDateAllowedForCalendarSession(dateKey, plannedDateKey, session = {}) {
  if (isCalendarSessionLocked(session, plannedDateKey)) return dateKey === plannedDateKey;
  if (!isDateKeyWithinCalendar(dateKey)) return false;
  return Math.abs(getDaysBetweenDateKeys(plannedDateKey, dateKey)) <= getCalendarSessionMoveWindow(session);
}

function getCalendarSessionAllowedDateRange(session) {
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const windowDays = getCalendarSessionMoveWindow(session);

  return {
    start: clampDateKeyToCalendar(addDaysToDateKey(plannedDateKey, -windowDays)),
    end: clampDateKeyToCalendar(addDaysToDateKey(plannedDateKey, windowDays)),
  };
}

function getPlannedCalendarSessionsForDate(date, dateKey) {
  return plannedSessionsByDate[dateKey] ?? [];
}

function normalizeCalendarSession(session, index, plannedDateKey) {
  const id = getCalendarSessionBaseId(session, plannedDateKey, index);
  const savedDateKey = calendarReschedules[id];
  const currentDateKey = isDateAllowedForCalendarSession(savedDateKey, plannedDateKey, session)
    ? savedDateKey
    : plannedDateKey;

  return {
    ...session,
    id,
    dateKey: currentDateKey,
    plannedDateKey,
    plannedSortKey: `${plannedDateKey}-${String(index + 1).padStart(2, "0")}`,
    isRescheduled: currentDateKey !== plannedDateKey,
    rescheduleWindowDays: getCalendarSessionMoveWindow(session),
    rescheduleLocked: isCalendarSessionLocked(session, plannedDateKey),
    categories: [...new Set(session.categories)],
  };
}

function buildCalendarDays() {
  const days = [];
  const daysByDateKey = new Map();

  for (
    let cursor = new Date(calendarStartDate);
    cursor <= calendarEndDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const date = new Date(cursor);
    const dateKey = dateToKey(date);
    const phaseKey = getCalendarPhaseKey(dateKey);

    const day = {
      date,
      dateKey,
      dayOfMonth: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      weekday: date.getDay(),
      phaseKey,
      sessions: [],
    };

    days.push(day);
    daysByDateKey.set(dateKey, day);
  }

  days.forEach((plannedDay) => {
    const templateSessions = getPlannedCalendarSessionsForDate(
      plannedDay.date,
      plannedDay.dateKey,
      plannedDay.phaseKey,
    );

    templateSessions.forEach((session, index) => {
      const normalizedSession = normalizeCalendarSession(session, index, plannedDay.dateKey);
      const targetDay = daysByDateKey.get(normalizedSession.dateKey) ?? plannedDay;
      targetDay.sessions.push(normalizedSession);
    });
  });

  days.forEach((day) => {
    day.sessions.sort((a, b) => a.plannedSortKey.localeCompare(b.plannedSortKey));
  });

  return days;
}

function getCalendarSessionCompleted(session) {
  const saved = calendarTracking[session.id];
  if (typeof saved === "boolean") return saved;
  if (typeof saved?.completed === "boolean") return saved.completed;

  const weekOneTrackingId = weekOneTrackingIdsByDate[session.plannedDateKey ?? session.dateKey];
  return weekOneTrackingId ? getDayTracking(weekOneTrackingId).completed : false;
}

function getCalendarDayCompletion(day) {
  const total = day.sessions.length;
  const completed = day.sessions.filter((session) => getCalendarSessionCompleted(session)).length;
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    isComplete: total > 0 && completed === total,
  };
}

function getAllCalendarSessions() {
  return calendarDays.flatMap((day) => day.sessions);
}

function getCalendarSessionsByPlannedDateKey(plannedDateKey) {
  return getAllCalendarSessions().filter((session) => session.plannedDateKey === plannedDateKey);
}

function getCalendarPlannedDateCompletion(plannedDateKey) {
  const sessions = getCalendarSessionsByPlannedDateKey(plannedDateKey);
  const completed = sessions.filter((session) => getCalendarSessionCompleted(session)).length;

  return {
    completed,
    total: sessions.length,
    isComplete: sessions.length > 0 && completed === sessions.length,
  };
}

function getCalendarDayByDateKey(dateKey) {
  return calendarDays.find((day) => day.dateKey === dateKey);
}

function materializeCalendarDayTracking(dateKey) {
  const day = getCalendarDayByDateKey(dateKey);
  if (!day) return;

  day.sessions.forEach((session) => {
    if (calendarTracking[session.id] === undefined) {
      calendarTracking[session.id] = { completed: getCalendarSessionCompleted(session) };
    }
  });
}

function syncCalendarFromDetailedTracking(trackingId, completed) {
  const dateKey = weekOneDatesByTrackingId[trackingId];
  if (!dateKey) return;

  getCalendarSessionsByPlannedDateKey(dateKey).forEach((session) => {
    calendarTracking[session.id] = { completed };
  });
  saveCalendarTracking();
  renderCalendar();
  attachCalendarEvents();
}

function syncDetailedTrackingFromCalendar(dateKey) {
  const plannedDateKey = dateKey;
  const trackingId = weekOneTrackingIdsByDate[plannedDateKey];
  if (!trackingId) return;

  tracking[trackingId] = {
    ...getDayTracking(trackingId),
    completed: getCalendarPlannedDateCompletion(plannedDateKey).isComplete,
  };
  saveTracking();
}

function normalizeBrandingText(value) {
  return value == null ? "" : String(value);
}

function escapeHtml(value) {
  return normalizeBrandingText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPreviousDateKey(dateKey) {
  const date = parseCalendarDateKey(dateKey);
  date.setDate(date.getDate() - 1);
  return dateToKey(date);
}

function formatSleepDuration(minutes) {
  const roundedMinutes = Math.round(minutes);
  const hours = Math.floor(roundedMinutes / 60);
  const remainderMinutes = roundedMinutes % 60;

  if (!hours) return `${remainderMinutes}m`;
  return `${hours}h ${String(remainderMinutes).padStart(2, "0")}m`;
}

function hasActiveCalendarFilters() {
  return calendarUiState.categoryFilter !== "all" || calendarUiState.statusFilter !== "all";
}

function calendarSessionPrimaryCategory(session) {
  return session.categories[0] ?? "default";
}

function getCalendarCategoryLabel(category) {
  return calendarCategoryDisplayLabels[category] ?? calendarCategoryDisplayLabels.default;
}

function getCalendarSessionCompactCategory(session) {
  const trainingCategory = session.categories.find((category) => category !== "mobility");
  return trainingCategory ?? calendarSessionPrimaryCategory(session);
}

function getCalendarSessionCompactLabel(session) {
  const trainingCategories = session.categories.filter((category) => category !== "mobility");
  const displayCategories = trainingCategories.length ? trainingCategories : session.categories;

  if (displayCategories.length > 1) {
    return displayCategories.slice(0, 2).map(getCalendarCategoryLabel).join("/");
  }

  return getCalendarCategoryLabel(displayCategories[0] ?? "default");
}

function extractCalendarYardage(...values) {
  for (const value of values) {
    const match = String(value ?? "").match(/\b\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?\s*yd\b/i);
    if (match) {
      return match[0].replace(/\s*([–-])\s*/, "$1").replace(/yd/i, "yd");
    }
  }

  return "";
}

function formatCalendarCompactDuration(duration) {
  const compactDuration = String(duration ?? "").replace(/\s+target$/i, "").trim();
  return compactDuration || "planned";
}

function getStrengthCompactDescriptor(session) {
  if (session.compactDescriptor) return session.compactDescriptor;

  const title = String(session.title ?? "").toLowerCase();
  const text = `${title} ${session.note ?? ""}`.toLowerCase();

  if (/weighted\s*pull|pull-up|pullup/.test(text)) return "weighted pull-up";
  if (/bulgarian|split\s*squat/.test(text)) return "split squat";
  if (/rdl|romanian/.test(text)) return "RDL";
  if (/durability|step[-\s]?ups?/.test(text)) return "durability";
  if (/hamstring/.test(text)) return "hamstrings";
  if (/hinge|deadlift|rdl|romanian/.test(text)) return "hinge";
  if (/pull\s*(\/|\+|and)\s*core/.test(title) || /\bpull\b/.test(title)) return "pull";
  if (/\bcore\b|plank|hollow|dead bug|carry|carries|trunk/.test(text)) return "core";
  if (/row|pulldown|chin|scapular|hang/.test(text)) return "pull";
  if (/squat|lunge|legs|split squat/.test(text)) return "legs";
  if (/maintenance|micro-dose|full-body|rebuild/.test(text)) return "maintenance";

  return "strength";
}

function getRecoveryCompactDescriptor(session) {
  const text = `${session.title ?? ""} ${session.note ?? ""}`.toLowerCase();

  if (/rest|travel/.test(text)) return "rest";
  if (/mobility/.test(text)) return "mobility";
  if (/logistics|pack|gear/.test(text)) return "logistics";
  if (/optional/.test(String(session.duration ?? "").toLowerCase())) return "optional";

  return formatCalendarCompactDuration(session.duration);
}

function getCalendarSessionCompactDescriptor(session) {
  if (session.compactDescriptor) return session.compactDescriptor;

  const compactCategory = getCalendarSessionCompactCategory(session);

  if (compactCategory === "swim") {
    return extractCalendarYardage(session.duration, session.title, session.note) || formatCalendarCompactDuration(session.duration);
  }

  if (compactCategory === "strength") {
    return getStrengthCompactDescriptor(session);
  }

  if (compactCategory === "mobility") {
    return getRecoveryCompactDescriptor(session);
  }

  return formatCalendarCompactDuration(session.duration);
}

function sessionMatchesCalendarFilters(session) {
  const matchesCategory =
    calendarUiState.categoryFilter === "all" || session.categories.includes(calendarUiState.categoryFilter);
  const completed = getCalendarSessionCompleted(session);
  const matchesStatus =
    calendarUiState.statusFilter === "all" ||
    (calendarUiState.statusFilter === "complete" && completed) ||
    (calendarUiState.statusFilter === "incomplete" && !completed);

  return matchesCategory && matchesStatus;
}

function getFilteredCalendarSessions(day) {
  return day.sessions.filter((session) => sessionMatchesCalendarFilters(session));
}

function getVisibleCalendarSessionCount() {
  return calendarDays.reduce((sum, day) => sum + getFilteredCalendarSessions(day).length, 0);
}

function setCalendarUiState(nextState) {
  calendarUiState = { ...calendarUiState, ...nextState };
  saveCalendarUiState();
  renderCalendar();
}

function recoverCalendarFiltersIfEverythingHidden() {
  const totalSessions = getAllCalendarSessions().length;
  if (!totalSessions || getVisibleCalendarSessionCount() > 0) return;

  const hasRestrictiveFilter = calendarUiState.categoryFilter !== "all" || calendarUiState.statusFilter !== "all";
  if (!hasRestrictiveFilter) return;

  calendarUiState = {
    ...calendarUiState,
    categoryFilter: defaultCalendarUiState.categoryFilter,
    statusFilter: defaultCalendarUiState.statusFilter,
  };
  saveCalendarUiState();
  showToast("Calendar filters were reset so workouts are visible.");
}

function renderCalendarControls() {
  document.querySelectorAll("[data-calendar-category-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.calendarCategoryFilter === calendarUiState.categoryFilter);
  });

  document.querySelectorAll("[data-calendar-status-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.calendarStatusFilter === calendarUiState.statusFilter);
  });

  document.querySelectorAll("[data-calendar-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.calendarView === calendarUiState.view);
  });

  const summaryEl = document.querySelector("#calendar-filter-summary");
  if (!summaryEl) return;

  const visibleSessions = getVisibleCalendarSessionCount();
  const totalSessions = getAllCalendarSessions().length;
  const statusCopy = {
    all: "any completion status",
    incomplete: "incomplete workouts only",
    complete: "completed workouts only",
  }[calendarUiState.statusFilter];
  const densityCopy = calendarUiState.view === "compact" ? "Compact" : "Detailed";
  const viewHint =
    calendarUiState.view === "compact"
      ? "Compact cards show discipline + descriptor; click any workout for details."
      : "Detailed cards show title, duration, tags, and notes.";

  summaryEl.textContent = `${densityCopy} view showing ${visibleSessions}/${totalSessions} workouts · ${calendarFilterLabels[calendarUiState.categoryFilter]} · ${statusCopy}. ${viewHint} Open a workout to move it up to ${CALENDAR_RESCHEDULE_WINDOW_DAYS} days earlier/later.`;
}

function formatCalendarDate(day) {
  return `${calendarWeekdayNames[day.weekday]}, ${calendarMonthNames[day.month]} ${day.dayOfMonth}, ${day.year}`;
}

function formatCalendarDateKeyShort(dateKey) {
  const date = parseCalendarDateKey(dateKey);
  return `${calendarMonthNames[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

function formatCalendarDateKeyLong(dateKey) {
  const date = parseCalendarDateKey(dateKey);
  return `${calendarWeekdayNames[date.getDay()]}, ${calendarMonthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getCalendarSessionMovedCopy(session) {
  if (!session.isRescheduled) return "";
  return `Moved from ${formatCalendarDateKeyShort(session.plannedDateKey)}`;
}

function renderCalendarSessionMovedBadge(session) {
  const movedCopy = getCalendarSessionMovedCopy(session);
  if (!movedCopy) return "";
  return `<span class="calendar-session__move-badge">${escapeHtml(movedCopy)}</span>`;
}

function renderAutoCheckBadge(autoMatchInfo) {
  if (!autoMatchInfo) return "";
  const timestamp = new Date(autoMatchInfo.timestamp);
  const dateStr = timestamp.toLocaleDateString();
  const timeStr = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const tooltip = `Auto-matched from Strava on ${dateStr} at ${timeStr} (${autoMatchInfo.confidence} confidence)`;
  
  return `<span class="calendar-session__auto-check-badge" title="${escapeHtml(tooltip)}">✓ Auto-matched</span>`;
}

function renderCalendarRescheduleControls(session) {
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const isLocked = isCalendarSessionLocked(session, plannedDateKey);

  if (isLocked) {
    return `
      <section class="calendar-detail__section calendar-reschedule" aria-label="Move this workout">
        <h4>Move this workout</h4>
        <p>This workout is fixed on the calendar because it is a milestone, event, or special logistics day.</p>
      </section>
    `;
  }

  const range = getCalendarSessionAllowedDateRange(session);
  const quickMoveButtons = calendarMoveOffsets
    .map((offset) => {
      const targetDateKey = addDaysToDateKey(plannedDateKey, offset);
      const isAllowed = isDateAllowedForCalendarSession(targetDateKey, plannedDateKey, session);
      const isCurrent = targetDateKey === session.dateKey;
      if (!isAllowed) return "";

      return `
        <button
          class="calendar-move-button ${isCurrent ? "is-active" : ""}"
          type="button"
          data-calendar-move-session="${session.id}"
          data-calendar-move-date="${targetDateKey}"
          ${isCurrent ? "disabled" : ""}
        >
          ${offset > 0 ? `+${offset}` : offset}d
        </button>
      `;
    })
    .join("");

  return `
    <section class="calendar-detail__section calendar-reschedule" aria-label="Move this workout" data-calendar-reschedule-controls="${session.id}">
      <h4>Move this workout</h4>
      <p>
        Original date: <strong>${escapeHtml(formatCalendarDateKeyLong(plannedDateKey))}</strong>.
        Current date: <strong>${escapeHtml(formatCalendarDateKeyLong(session.dateKey))}</strong>.
        You can move it within ${session.rescheduleWindowDays} days as long as it still gets done.
      </p>
      <div class="calendar-reschedule__quick" aria-label="Quick move options">
        ${quickMoveButtons}
      </div>
      <div class="calendar-reschedule__custom">
        <label class="field">
          <span>Choose date</span>
          <input type="date" min="${range.start}" max="${range.end}" value="${session.dateKey}" data-calendar-move-input="${session.id}" />
        </label>
        <button class="button button--secondary" type="button" data-calendar-move-apply="${session.id}">Apply move</button>
        ${session.isRescheduled ? `<button class="button button--ghost-dark" type="button" data-calendar-reset-date="${session.id}">Reset date</button>` : ""}
      </div>
    </section>
  `;
}

function refreshCalendarAfterScheduleChange(sessionId) {
  calendarDays = buildCalendarDays();
  renderCalendar();

  const dialog = document.querySelector("#calendar-detail-dialog");
  if (dialog?.dataset.calendarSessionId === sessionId && !dialog.hidden) {
    renderCalendarSessionDetail(sessionId);
  }
}

function rescheduleCalendarSession(sessionId, targetDateKey) {
  const context = getCalendarSessionContext(sessionId);
  if (!context) {
    showToast("Workout not found.");
    return;
  }

  const { session } = context;
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;

  if (!isDateAllowedForCalendarSession(targetDateKey, plannedDateKey, session)) {
    showToast(`Choose a date within ${session.rescheduleWindowDays} days of the original plan.`);
    return;
  }

  if (targetDateKey === plannedDateKey) {
    delete calendarReschedules[sessionId];
  } else {
    calendarReschedules[sessionId] = targetDateKey;
  }

  saveCalendarReschedules();
  refreshCalendarAfterScheduleChange(sessionId);
  showToast(targetDateKey === plannedDateKey ? "Workout reset to its original date." : `Workout moved to ${formatCalendarDateKeyShort(targetDateKey)}.`);
}

function resetCalendarSessionDate(sessionId) {
  if (!calendarReschedules[sessionId]) return;
  delete calendarReschedules[sessionId];
  saveCalendarReschedules();
  refreshCalendarAfterScheduleChange(sessionId);
  showToast("Workout reset to its original date.");
}

function isCalendarSessionDraggable(session = {}) {
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  return Boolean(session.id && plannedDateKey && !isCalendarSessionLocked(session, plannedDateKey));
}

function getCalendarSessionAllowedDateKeys(session) {
  if (!isCalendarSessionDraggable(session)) return [];

  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const range = getCalendarSessionAllowedDateRange(session);
  const dateKeys = [];

  for (
    let cursor = parseCalendarDateKey(range.start);
    dateToKey(cursor) <= range.end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateKey = dateToKey(cursor);
    if (isDateAllowedForCalendarSession(dateKey, plannedDateKey, session)) {
      dateKeys.push(dateKey);
    }
  }

  return dateKeys;
}

function getCalendarDayDropElement(target) {
  if (!(target instanceof Element)) return null;
  return target.closest("[data-calendar-day]");
}

function beginCalendarSessionDrag(sessionId) {
  const context = getCalendarSessionContext(sessionId);
  if (!context || !isCalendarSessionDraggable(context.session)) return false;

  const { session } = context;
  const allowedDateKeys = getCalendarSessionAllowedDateKeys(session);
  if (!allowedDateKeys.length) return false;

  calendarDragState = {
    sessionId,
    sourceDateKey: session.dateKey,
    plannedDateKey: session.plannedDateKey ?? session.dateKey,
    allowedDateKeys: new Set(allowedDateKeys),
  };

  document.body.classList.add("has-calendar-drag");
  applyCalendarDragClasses();
  return true;
}

function applyCalendarDragClasses() {
  document.querySelectorAll("[data-calendar-day]").forEach((dayEl) => {
    const dateKey = dayEl.dataset.calendarDay;
    const isValid = Boolean(calendarDragState?.allowedDateKeys.has(dateKey));
    dayEl.classList.toggle("is-valid-drop-target", isValid);
    dayEl.classList.toggle("is-invalid-drop-target", Boolean(calendarDragState && !isValid));
    dayEl.classList.toggle("is-drag-source-day", Boolean(calendarDragState && dateKey === calendarDragState.sourceDateKey));
  });

  document.querySelectorAll("[data-calendar-session-card]").forEach((card) => {
    card.classList.toggle(
      "is-drag-source-session",
      Boolean(calendarDragState && card.dataset.calendarSessionCard === calendarDragState.sessionId),
    );
  });
}

function clearCalendarDragState() {
  calendarDragState = null;
  document.body.classList.remove("has-calendar-drag");

  document
    .querySelectorAll(
      ".is-valid-drop-target, .is-invalid-drop-target, .is-drag-source-day, .is-drop-hover, .is-drag-source-session, .is-dragging",
    )
    .forEach((el) => {
      el.classList.remove(
        "is-valid-drop-target",
        "is-invalid-drop-target",
        "is-drag-source-day",
        "is-drop-hover",
        "is-drag-source-session",
        "is-dragging",
      );
    });

  window.setTimeout(() => {
    calendarSuppressNextClick = false;
  }, 200);
}

function handleCalendarDragStart(event) {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest(".calendar-session__toggle")) {
    event.preventDefault();
    return;
  }

  const card = event.target.closest('[data-calendar-session-card][data-calendar-draggable="true"]');
  if (!card) return;

  const sessionId = card.dataset.calendarSessionCard;
  if (!sessionId || !beginCalendarSessionDrag(sessionId)) {
    event.preventDefault();
    return;
  }

  calendarSuppressNextClick = true;
  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", sessionId);
}

function handleCalendarDragOver(event) {
  if (!calendarDragState) return;

  const dayEl = getCalendarDayDropElement(event.target);
  const dateKey = dayEl?.dataset.calendarDay;
  const isValid = Boolean(dateKey && calendarDragState.allowedDateKeys.has(dateKey));

  if (isValid) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    dayEl.classList.add("is-drop-hover");
  } else if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "none";
  }
}

function handleCalendarDragLeave(event) {
  if (!calendarDragState) return;

  const dayEl = getCalendarDayDropElement(event.target);
  if (!dayEl) return;

  const relatedTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null;
  if (!relatedTarget || !dayEl.contains(relatedTarget)) {
    dayEl.classList.remove("is-drop-hover");
  }
}

function handleCalendarDrop(event) {
  if (!calendarDragState) return;

  const dayEl = getCalendarDayDropElement(event.target);
  const targetDateKey = dayEl?.dataset.calendarDay;
  const sessionId = calendarDragState.sessionId;
  const isValid = Boolean(targetDateKey && calendarDragState.allowedDateKeys.has(targetDateKey));

  event.preventDefault();
  clearCalendarDragState();

  if (isValid) {
    rescheduleCalendarSession(sessionId, targetDateKey);
  } else {
    showToast("That day is outside this workout's move window.");
  }
}

function handleCalendarDragEnd() {
  if (calendarDragState) clearCalendarDragState();
}

function getCalendarSessionContext(sessionId) {
  for (const day of calendarDays) {
    const session = day.sessions.find((item) => item.id === sessionId);
    if (session) return { day, session };
  }

  return null;
}

function getDetailedWorkoutForDate(dateKey) {
  const trackingId = weekOneTrackingIdsByDate[dateKey];
  // The retired June 2026 block had long-form daily writeups. The fall block carries its
  // detail on each calendar session instead.
  return null;
}

function parseCalendarDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDaysBetweenDateKeys(fromDateKey, toDateKey) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseCalendarDateKey(toDateKey) - parseCalendarDateKey(fromDateKey)) / msPerDay);
}

function getCalendarSessionMilestoneContext(session) {
  const category = getCalendarSessionCompactCategory(session);
  const milestone = calendarMilestones[category] ?? calendarMilestones.default;
  const categorySessions = getAllCalendarSessions().filter(
    (item) => item.categories.includes(category) && item.dateKey <= milestone.dateKey,
  );
  const sessionIndex = categorySessions.findIndex((item) => item.id === session.id);
  const daysUntil = getDaysBetweenDateKeys(session.dateKey, milestone.dateKey);
  const label = getCalendarCategoryLabel(category);

  if (sessionIndex >= 0 && daysUntil >= 0) {
    return `${label} session ${sessionIndex + 1}/${categorySessions.length} before ${milestone.label} (${daysUntil} days out).`;
  }

  if (daysUntil < 0) {
    return `${label} maintenance after ${milestone.label}; keep the rhythm without forcing load.`;
  }

  return `${label} workout in the ${calendarPhaseLabels[getCalendarPhaseKey(session.dateKey)] ?? "training"} phase.`;
}

function getCalendarSessionCoachingCue(session) {
  const category = getCalendarSessionCompactCategory(session);
  const text = `${session.title} ${session.note}`.toLowerCase();

  if (category === "swim") {
    if (/lake union/.test(text)) return "Execution day: use support, conditions, and shoulder comfort as the go/no-go filters.";
    if (/open-water|sighting|race-distance|continuous|checkpoint/.test(text)) {
      return "Key swim cue: stay relaxed, sight briefly, and progress only while breathing and shoulders remain calm.";
    }
    return "Key swim cue: make technique quality the win before chasing yardage.";
  }

  if (category === "cardio") {
    if (/baker|summit/.test(text)) return "Execution focus: steady pacing, fueling, hydration, foot care, and communication.";
    if (/hike|uphill|vertical/.test(text)) return "Mountain cue: build vertical durability gradually and protect the downhill/shin response.";
    return "Cardio cue: this is aerobic volume on a day the legs are otherwise free — keep it conversational.";
  }

  if (category === "strength") {
    return "Strength cue: crisp reps, no grinding, and leave enough in reserve for the next endurance session.";
  }

  if (category === "bike") {
    return "Bike cue: keep this low-impact aerobic unless the plan explicitly says otherwise.";
  }

  if (category === "mobility") {
    return "Mobility cue: finish feeling better than when you started. This is the cheapest injury insurance in the plan.";
  }

  return "Use this session to support the larger Summer 2026 progression.";
}

function getBlockCategoryKeywords(category) {
  return {
    swim: ["swim", "pool", "sighting", "catch", "breathing", "continuous"],
    bike: ["bike", "spin", "cycling"],
    strength: ["strength", "accessory", "core", "pull", "pull-up", "rdl", "romanian", "squat", "split", "hinge", "deadlift", "calf", "tibialis", "durability"],
    hike: ["hike", "stair", "uphill", "incline", "simulation", "pack", "vertical", "fueling"],
    cardio: ["hike", "stair", "uphill", "incline", "simulation", "pack", "vertical", "fueling", "erg", "row", "ski"],
    mobility: ["mobility", "prehab", "stretch", "flexibility", "rest", "reset"],
  }[category] ?? [];
}

function getSignificantWords(value) {
  const stopWords = new Set([
    "and",
    "the",
    "with",
    "easy",
    "short",
    "long",
    "optional",
    "workout",
    "session",
    "work",
    "zone",
    "base",
  ]);

  return String(value ?? "")
    .toLowerCase()
    .replace(/[–—/()+]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4 && !stopWords.has(word));
}

function blockMatchesCalendarSession(block, session) {
  const blockTitle = block.title.toLowerCase();
  const blockText = `${block.title} ${(block.items ?? []).join(" ")}`.toLowerCase();
  const sessionWords = getSignificantWords(`${session.title} ${session.note}`);
  const categoryTitleMatch = session.categories.some((category) =>
    getBlockCategoryKeywords(category).some((keyword) => blockTitle.includes(keyword)),
  );
  const wordMatchCount = sessionWords.filter((word) => blockText.includes(word)).length;

  return categoryTitleMatch || wordMatchCount >= 2;
}

function getWorkoutSpecificBlocks(detailedWorkout, session, day) {
  if (!detailedWorkout) return [];

  const nonTrackBlocks = detailedWorkout.blocks.filter((block) => !/^track$/i.test(block.title.trim()));

  if (day.sessions.length <= 1) return nonTrackBlocks;

  const matchedBlocks = nonTrackBlocks.filter((block) => blockMatchesCalendarSession(block, session));

  return matchedBlocks;
}

// Sentence splitter that leaves "2.5 hr", "1:05", and parenthetical asides intact.
function splitNoteIntoSentences(note) {
  return String(note ?? "")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"(])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

const prescriptionStepPattern =
  /^(pre-swim|pre-set|warm-?up|wu\b|build|drill|main|pull|kick|swim down|cool-?down|cd\b|finish|then\b|session:|lifts?:)|^\d+\s*[×x]\s*\d/i;

// Everything below is derived from the session's own plan.js note so the summary
// and the step list can never disagree. Nothing here is invented.
function buildBlocksFromNote(session) {
  const sentences = splitNoteIntoSentences(session.note);
  if (!sentences.length) return [];

  const steps = [];
  const cues = [];
  sentences.forEach((sentence) => {
    if (prescriptionStepPattern.test(sentence)) steps.push(sentence);
    else cues.push(sentence);
  });

  const blocks = [];
  if (steps.length) blocks.push({ title: "The session", items: steps });
  if (cues.length) blocks.push({ title: steps.length ? "Why / how" : "How to execute", items: cues });
  return blocks;
}

// Drills are described once in plan.js and referenced by name in the notes, so
// the prescription stays short and the teaching lives in one place.
function noteMentions(haystack, label) {
  const needle = label.toLowerCase();
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    // "NO PADDLES this week" must not pull in the paddles card.
    if (!/\bno\s$/.test(haystack.slice(Math.max(0, index - 4), index))) return true;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return false;
}

function findDrillsInNote(note) {
  const haystack = String(note ?? "").toLowerCase();
  return swimDrills.filter((drill) =>
    [drill.name, ...(drill.aliases ?? [])].some((label) => noteMentions(haystack, label)),
  );
}

function getStrengthTemplateForSession(session) {
  const title = String(session.title ?? "");
  return (
    strengthTemplates.find((template) => template.title === title) ??
    strengthTemplates.find((template) => {
      const letter = title.match(/^strength\s+([ab])\b/i)?.[1];
      return letter ? new RegExp(`^strength\\s+${letter}\\b`, "i").test(template.title) : false;
    }) ??
    null
  );
}

function getSessionDetailBlocks(session, workoutBlocks) {
  if (workoutBlocks?.length) return workoutBlocks;

  const blocks = [];

  // Strength days carry their prescription in strengthTemplates, not in the note.
  if (session.categories.includes("strength")) {
    const template = getStrengthTemplateForSession(session);
    if (template) {
      blocks.push({ title: "Lifts", items: [...template.exercises] });
      buildBlocksFromNote(session).forEach((block) => blocks.push({ ...block, title: "Today's focus" }));
      if (template.focus) blocks.push({ title: "Template focus", items: splitNoteIntoSentences(template.focus) });
      return blocks;
    }
  }

  const noteBlocks = buildBlocksFromNote(session);

  // Swim notes name their drills; attach the explanation for each one mentioned.
  if (session.categories.includes("swim")) {
    const drills = findDrillsInNote(session.note);
    if (drills.length) noteBlocks.push({ title: "Drills in this session", drills });
  }

  if (noteBlocks.length) return noteBlocks;

  return [{ title: "The session", items: ["Follow the session as written on the calendar."] }];
}

function renderCalendarDetailBlocks(blocks) {
  if (!blocks.length) {
    return `
      <p class="calendar-detail__note">
        Detailed steps are not available for this session yet.
      </p>
    `;
  }

  return `
    <div class="calendar-detail__blocks">
      ${blocks
        .map(
          (block) => `
            <article class="calendar-detail__block">
              <h5>${escapeHtml(block.title)}</h5>
              ${
                block.drills
                  ? renderDrillList(block.drills)
                  : `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              }
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDrillList(drills) {
  return `<dl class="drill-list">${renderDrillItems(drills)}</dl>`;
}

function renderDrillItems(drills) {
  return drills
    .map(
      (drill) => `
        <div class="drill">
          <dt>
            <span class="drill__name">${escapeHtml(drill.name)}</span>
            <span class="drill__gear">${escapeHtml(drill.gear)}</span>
          </dt>
          <dd>
            <p class="drill__what">${escapeHtml(drill.what)}</p>
            <p class="drill__feel"><strong>Feel for:</strong> ${escapeHtml(drill.feel)}</p>
            ${drill.mistake ? `<p class="drill__mistake"><strong>Watch for:</strong> ${escapeHtml(drill.mistake)}</p>` : ""}
            ${drill.why ? `<p class="drill__why">${escapeHtml(drill.why)}</p>` : ""}
          </dd>
        </div>
      `,
    )
    .join("");
}

const strengthExerciseAliases = [
  { regex: /\bweighted pull-?ups?\b/i, name: "Weighted pull-up" },
  { regex: /\bpull-?ups?\b/i, name: "Pull-up" },
  { regex: /\blat pulldowns?\b/i, name: "Lat pulldown" },
  { regex: /\b(barbell|dumbbell|cable|seated)\s+rows?\b/i, name: "Row" },
  { regex: /\brows?\b/i, name: "Row" },
  { regex: /\bface pulls?\b/i, name: "Face pull" },
  { regex: /\bhammer curls?\b/i, name: "Hammer curl" },
  { regex: /\bcurls?\b/i, name: "Biceps curl" },
  { regex: /\brdl\b|\bromanian deadlifts?\b/i, name: "Romanian deadlift" },
  { regex: /\bdeadlifts?\b/i, name: "Deadlift" },
  { regex: /\bhip thrusts?\b/i, name: "Hip thrust" },
  { regex: /\bhamstring curls?\b/i, name: "Hamstring curl" },
  { regex: /\b(back extension|hyperextension)s?\b/i, name: "Back extension" },
  { regex: /\bbulgarian split squats?\b/i, name: "Bulgarian split squat" },
  { regex: /\bsplit squats?\b/i, name: "Split squat" },
  { regex: /\bgoblet squats?\b/i, name: "Goblet squat" },
  { regex: /\bcalf raises?\b/i, name: "Calf raise" },
  { regex: /\btibialis raises?\b/i, name: "Tibialis raise" },
  { regex: /\bplanks?\b/i, name: "Plank" },
  { regex: /\bdead bugs?\b/i, name: "Dead bug" },
  { regex: /\bpallof press(?:es)?\b/i, name: "Pallof press" },
  { regex: /\bscapular pulls?\b/i, name: "Scapular pull-up" },
];

const strengthExerciseTemplates = [
  {
    matcher: /\bpull|biceps|row|pull-?up|lat|scap/i,
    exercises: [
      "Weighted pull-up",
      "Pull-up",
      "Row",
      "Lat pulldown",
      "Face pull",
      "Biceps curl",
      "Hammer curl",
    ],
  },
  {
    matcher: /\brdl|hinge|hamstring|posterior|deadlift|glute/i,
    exercises: [
      "Romanian deadlift",
      "Smith Bulgarian split squat",
      "Hip thrust",
      "Hamstring curl",
      "Back extension",
      "Standing calf raise",
      "Tibialis raise",
      "Pallof press",
      "Dead bug",
      "Plank",
    ],
  },
  {
    matcher: /\bbulgarian|split squat|quad|hips and core/i,
    exercises: [
      "Smith Bulgarian split squat",
      "Bulgarian split squat",
      "Box step-up",
      "Seated calf raise",
      "Copenhagen plank",
      "Banded lateral walk",
      "Side plank with hip abduction",
      "Weighted pull-up",
      "Lat pulldown",
      "Split squat",
      "Goblet squat",
      "Tibialis raise",
      "Plank",
    ],
  },
  {
    matcher: /\bcore|abs|primer|mobility|recovery/i,
    exercises: ["Dead bug", "Plank", "Pallof press", "Scapular pull-up"],
  },
];

function normalizeExerciseName(name) {
  return String(name ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function toExerciseKey(name) {
  return normalizeExerciseName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addExerciseOption(optionMap, name, source = "") {
  const normalizedName = normalizeExerciseName(name);
  if (!normalizedName) return;
  const key = toExerciseKey(normalizedName);
  if (!key) return;
  if (!optionMap.has(key)) {
    optionMap.set(key, { key, name: normalizedName, source });
  }
}

function parseStrengthExercisesFromBlocks(blocks = []) {
  const optionMap = new Map();
  const ignorePrefixes = new Set([
    "warm-up",
    "warm up",
    "main lift",
    "main block",
    "main set",
    "accessory",
    "support",
    "finish",
    "cooldown",
    "cool-down",
    "progression cue",
    "pre-swim shoulder prep",
    "lower leg",
  ]);

  blocks.forEach((block) => {
    (block.items ?? []).forEach((item) => {
      const line = String(item ?? "").trim();
      if (!line) return;

      const headingMatch = line.match(/^([^:]+):/);
      if (headingMatch) {
        const heading = normalizeExerciseName(headingMatch[1]);
        if (heading && !ignorePrefixes.has(heading.toLowerCase())) {
          addExerciseOption(optionMap, heading, "block-heading");
        }
      }

      strengthExerciseAliases.forEach((alias) => {
        if (alias.regex.test(line)) addExerciseOption(optionMap, alias.name, "block-item");
      });
    });
  });

  return [...optionMap.values()];
}

function getStrengthExerciseOptions(day, session) {
  const text = `${session.title ?? ""} ${session.note ?? ""}`;
  const detailedWorkout = getDetailedWorkoutForDate(day.dateKey);
  const workoutBlocks = getWorkoutSpecificBlocks(detailedWorkout, session, day);
  const detailBlocks = getSessionDetailBlocks(session, workoutBlocks);
  const parsedOptions = parseStrengthExercisesFromBlocks(detailBlocks);
  const optionMap = new Map(parsedOptions.map((option) => [option.key, option]));

  strengthExerciseTemplates.forEach((template) => {
    if (template.matcher.test(text)) {
      template.exercises.forEach((exerciseName) => addExerciseOption(optionMap, exerciseName, "template"));
    }
  });

  if (!optionMap.size) {
    ["Primary strength set", "Accessory set", "Core set"].forEach((exerciseName) =>
      addExerciseOption(optionMap, exerciseName, "fallback"),
    );
  }

  return [...optionMap.values()];
}

function getExerciseNameFromOptions(workout, exerciseKey) {
  const match = workout?.availableExercises?.find((exercise) => exercise.key === exerciseKey);
  if (match?.name) return match.name;
  return exerciseKey.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readStrengthLogsFromStorage() {
  try {
    const raw = localStorage.getItem("strengthLogs");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getStrengthWorkoutSessionsFromStorage() {
  const logs = readStrengthLogsFromStorage();
  const sessions = Object.entries(logs)
    .map(([logKey, log]) => {
      if (!log || typeof log !== "object" || !log.exerciseLogs || typeof log.exerciseLogs !== "object") return null;
      return {
        logKey,
        ...log,
        timestamp: Number.isFinite(log.timestamp) ? log.timestamp : Date.parse(`${log.date ?? ""}T00:00:00`) || 0,
      };
    })
    .filter(Boolean);

  return sessions.sort((a, b) => b.timestamp - a.timestamp);
}

function getStrengthHistoryEntries() {
  const sessions = getStrengthWorkoutSessionsFromStorage();
  const entries = [];

  sessions.forEach((session) => {
    Object.entries(session.exerciseLogs || {}).forEach(([exerciseKey, sets]) => {
      const exerciseName = getExerciseNameFromOptions(session, exerciseKey);
      const note = session.exerciseNotes?.[exerciseKey] ?? "";
      (sets || []).forEach((set, setIndex) => {
        if (!set?.weight && !set?.reps) return;
        entries.push({
          sessionTitle: session.title || "Strength workout",
          date: session.date || "",
          dateDisplay: session.dateDisplay || session.date || "",
          timestamp: session.timestamp || 0,
          exerciseKey,
          exerciseName,
          note,
          setIndex,
          weight: set?.weight ?? "",
          reps: set?.reps ?? "",
        });
      });
    });
  });

  return entries.sort((a, b) => b.timestamp - a.timestamp || b.setIndex - a.setIndex);
}

function renderStrengthQuickHistory(session, day) {
  const exerciseOptions = getStrengthExerciseOptions(day, session);
  const entries = getStrengthHistoryEntries();
  const exerciseKeys = new Set(exerciseOptions.map((exercise) => exercise.key));
  const scopedEntries = entries.filter((entry) => exerciseKeys.has(entry.exerciseKey));

  if (!scopedEntries.length) {
    return `
      <section class="calendar-detail__section strength-history-quick">
        <h4>Recent strength history</h4>
        <p class="calendar-detail__note">No previous logged sets yet for this workout’s exercises.</p>
      </section>
    `;
  }

  const grouped = exerciseOptions
    .map((exercise) => ({
      exercise,
      entries: scopedEntries.filter((entry) => entry.exerciseKey === exercise.key).slice(0, 5),
    }))
    .filter((group) => group.entries.length);

  if (!grouped.length) return "";

  return `
    <section class="calendar-detail__section strength-history-quick">
      <h4>Recent strength history</h4>
      <div class="strength-history-quick__groups">
        ${grouped
          .map(
            (group) => `
              <article class="strength-history-quick__group">
                <h5>${escapeHtml(group.exercise.name)}</h5>
                <ul>
                  ${group.entries
                    .map(
                      (entry) => `
                        <li>
                          <span>${escapeHtml(entry.date)}</span>
                          <strong>${escapeHtml(`${entry.weight} × ${entry.reps}`)}</strong>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function getCalendarJumpTargetDateKey() {
  const todayKey = dateToKey(new Date());
  if (getCalendarDayByDateKey(todayKey)) return todayKey;

  const nextIncompleteDay = calendarDays.find(
    (day) => day.dateKey >= todayKey && day.sessions.length && !getCalendarDayCompletion(day).isComplete,
  );
  const firstIncompleteDay = calendarDays.find(
    (day) => day.sessions.length && !getCalendarDayCompletion(day).isComplete,
  );

  return nextIncompleteDay?.dateKey ?? firstIncompleteDay?.dateKey ?? calendarDays[0]?.dateKey;
}

function renderCalendar() {
  const monthsEl = document.querySelector("#calendar-months");
  if (!monthsEl) return;

  renderCalendarProgress();
  renderCalendarControls();
  monthsEl.classList.toggle("calendar-months--compact", calendarUiState.view === "compact");
  monthsEl.classList.toggle("calendar-months--detailed", calendarUiState.view === "detailed");

  const months = [...calendarDays.reduce((map, day) => {
    const key = `${day.year}-${day.month}`;
    if (!map.has(key)) {
      map.set(key, { year: day.year, month: day.month, days: [] });
    }
    map.get(key).days.push(day);
    return map;
  }, new Map()).values()];

  monthsEl.innerHTML = months.map((month) => renderCalendarMonth(month)).join("");
  renderTodayPanel();
  updateCalendarFab();
}

let calendarFabObserver = null;

function updateCalendarFab() {
  const fab = document.querySelector("[data-calendar-fab]");
  if (!fab) return;

  if (calendarFabObserver) {
    calendarFabObserver.disconnect();
    calendarFabObserver = null;
  }

  const targetDateKey = getCalendarJumpTargetDateKey();
  const dayEl = targetDateKey ? document.querySelector(`[data-calendar-day="${targetDateKey}"]`) : null;

  if (!dayEl || typeof IntersectionObserver === "undefined") {
    fab.classList.remove("is-visible");
    return;
  }

  const iconEl = fab.querySelector("[data-calendar-fab-icon]");

  calendarFabObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      const targetVisible = entry.isIntersecting;
      fab.classList.toggle("is-visible", !targetVisible);
      if (!targetVisible && iconEl) {
        iconEl.textContent = entry.boundingClientRect.top > 0 ? "↓" : "↑";
      }
    },
    { threshold: 0.35 },
  );

  calendarFabObserver.observe(dayEl);
}

function getTodayPanelTargetDay() {
  const todayKey = dateToKey(new Date());
  const today = getCalendarDayByDateKey(todayKey);
  if (today) return { day: today, isToday: true };

  const fallbackDateKey = getCalendarJumpTargetDateKey();
  const fallbackDay = fallbackDateKey ? getCalendarDayByDateKey(fallbackDateKey) : null;
  return { day: fallbackDay, isToday: false };
}

function renderTodayPanel() {
  const panelEl = document.querySelector("#today-panel");
  const titleEl = document.querySelector("#today-panel-title");
  const subtitleEl = document.querySelector("#today-panel-subtitle");
  const workoutsEl = document.querySelector("#today-workouts");
  if (!panelEl || !titleEl || !subtitleEl || !workoutsEl) return;

  const { day, isToday } = getTodayPanelTargetDay();
  if (!day) {
    titleEl.textContent = "Today’s workouts";
    subtitleEl.textContent = "No calendar workouts are available yet.";
    panelEl.classList.add("is-empty");
    workoutsEl.innerHTML = `
      <article class="today-session today-session--empty">
        <div class="today-session__body">
          <h3>No workouts found</h3>
          <p>Check the calendar once the training block has been added.</p>
        </div>
      </article>
    `;
    return;
  }

  const completion = getCalendarDayCompletion(day);
  const dateLabel = formatCalendarDate(day);
  const completeCopy = day.sessions.length
    ? `${completion.completed}/${completion.total} complete`
    : "No planned workouts";

  titleEl.textContent = isToday ? "Today’s workouts" : "Next workouts";
  subtitleEl.textContent = isToday
    ? `${dateLabel} · ${completeCopy}`
    : `Today is outside the plan, so showing ${dateLabel} · ${completeCopy}`;
  panelEl.dataset.todayDate = day.dateKey;
  panelEl.classList.toggle("is-empty", !day.sessions.length);
  panelEl.classList.toggle("is-complete", completion.isComplete);

  if (!day.sessions.length) {
    workoutsEl.innerHTML = `
      <article class="today-session today-session--empty">
        <div class="today-session__body">
          <h3>No planned workouts</h3>
          <p>Use this as a recovery or logistics day unless your coach adjusts the plan.</p>
        </div>
      </article>
    `;
    return;
  }

  workoutsEl.innerHTML = day.sessions.map((session) => renderTodaySession(session)).join("");
}

function renderTodaySession(session) {
  const completed = getCalendarSessionCompleted(session);
  const inputId = `today-${session.id}-complete`;
  const primaryCategory = calendarSessionPrimaryCategory(session);
  const compactCategory = getCalendarSessionCompactCategory(session);
  const compactDescriptor = getCalendarSessionCompactDescriptor(session);

  return `
    <article class="today-session calendar-session--${primaryCategory} calendar-session--compact-${compactCategory} ${completed ? "is-complete" : ""}">
      <label class="today-session__toggle" for="${inputId}">
        <input
          id="${inputId}"
          type="checkbox"
          data-calendar-session="${session.id}"
          data-calendar-date="${session.dateKey}"
          ${completed ? "checked" : ""}
        />
        <span>${completed ? "Done" : "Mark done"}</span>
      </label>
      <div class="today-session__body">
        <div class="today-session__meta">
          <span class="duration-pill">${escapeHtml(session.duration)}</span>
          ${session.categories.map((category) => `<span class="${tagClass(category)}">${category}</span>`).join("")}
          ${renderCalendarSessionMovedBadge(session)}
        </div>
        <h3>${escapeHtml(session.title)}</h3>
        <p>${escapeHtml(session.note)}</p>
        <div class="today-session__footer">
          <span>${escapeHtml(getCalendarSessionCompactLabel(session))} · ${escapeHtml(compactDescriptor)}</span>
          <button class="button button--secondary today-session__detail" type="button" data-calendar-session-open="${session.id}">
            Details
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderCalendarProgress() {
  const el = document.querySelector("#calendar-progress");
  if (!el) return;

  const sessions = getAllCalendarSessions();
  const completedSessions = sessions.filter((session) => getCalendarSessionCompleted(session)).length;
  const sessionPercent = sessions.length ? Math.round((completedSessions / sessions.length) * 100) : 0;
  const completedDays = calendarDays.filter((day) => getCalendarDayCompletion(day).isComplete).length;
  const dayPercent = Math.round((completedDays / calendarDays.length) * 100);
  const categoryTotals = [
    ["Swim", "swim"],
    ["Run", "run"],
    ["Bike", "bike"],
    ["Strength", "strength"],
    ["Cardio", "cardio"],
    ["Mobility", "mobility"],
  ].map(([label, category]) => {
    const categorySessions = sessions.filter((session) => session.categories.includes(category));
    const done = categorySessions.filter((session) => getCalendarSessionCompleted(session)).length;
    return {
      label,
      done,
      total: categorySessions.length,
      percent: categorySessions.length ? Math.round((done / categorySessions.length) * 100) : 0,
    };
  });

  el.innerHTML = `
    <article class="calendar-progress-card calendar-progress-card--featured">
      <p class="stat-card__label">Overall workouts</p>
      <p class="stat-card__value">${completedSessions}/${sessions.length}</p>
      <p class="stat-card__detail">${sessionPercent}% complete across the full calendar.</p>
      <div class="progress-bar"><span style="width:${sessionPercent}%"></span></div>
    </article>
    <article class="calendar-progress-card">
      <p class="stat-card__label">Complete days</p>
      <p class="stat-card__value">${completedDays}/${calendarDays.length}</p>
      <p class="stat-card__detail">A day counts when every listed workout is checked.</p>
      <div class="progress-bar"><span style="width:${dayPercent}%"></span></div>
    </article>
    <article class="calendar-progress-card calendar-progress-card--categories">
      <p class="stat-card__label">By category</p>
      <div class="calendar-category-summary">
        ${categoryTotals
          .map(
            (item) => `
              <div class="summary-row">
                <strong>${item.label}</strong>
                <div class="progress-bar"><span style="width:${item.percent}%"></span></div>
                <span>${item.done}/${item.total}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderCalendarMonth(month) {
  const leadingBlanks = Array.from({ length: month.days[0].weekday }, () =>
    `<div class="calendar-day calendar-day--blank" aria-hidden="true"></div>`,
  );
  const totalCells = leadingBlanks.length + month.days.length;
  const trailingBlanks = Array.from({ length: (7 - (totalCells % 7)) % 7 }, () =>
    `<div class="calendar-day calendar-day--blank" aria-hidden="true"></div>`,
  );
  const completedDays = month.days.filter((day) => getCalendarDayCompletion(day).isComplete).length;
  const totalSessions = month.days.reduce((sum, day) => sum + day.sessions.length, 0);
  const completedSessions = month.days.reduce(
    (sum, day) => sum + getCalendarDayCompletion(day).completed,
    0,
  );
  const visibleSessions = month.days.reduce((sum, day) => sum + getFilteredCalendarSessions(day).length, 0);
  const filteredMeta = hasActiveCalendarFilters() ? ` · ${visibleSessions} shown` : "";

  return `
    <article class="calendar-month calendar-month--${calendarUiState.view}">
      <header class="calendar-month__header">
        <div>
          <p class="eyebrow">${month.year}</p>
          <h3>${calendarMonthNames[month.month]}</h3>
        </div>
        <div class="calendar-month__meta">
          <strong>${completedSessions}/${totalSessions}</strong>
          <span>workouts · ${completedDays}/${month.days.length} days${filteredMeta}</span>
        </div>
      </header>
      <div class="calendar-weekdays" aria-hidden="true">
        ${calendarWeekdayNames.map((dayName) => `<span>${dayName}</span>`).join("")}
      </div>
      <div class="calendar-grid">
        ${[...leadingBlanks, ...month.days.map((day) => renderCalendarDay(day)), ...trailingBlanks].join("")}
      </div>
    </article>
  `;
}

function renderCalendarDay(day) {
  const completion = getCalendarDayCompletion(day);
  const visibleSessions = getFilteredCalendarSessions(day);
  const hiddenCount = day.sessions.length - visibleSessions.length;
  const todayKey = dateToKey(new Date());
  const classes = ["calendar-day"];
  if (completion.isComplete) classes.push("is-complete");
  if (day.dateKey === todayKey) classes.push("is-today");
  if (!visibleSessions.length && hasActiveCalendarFilters()) classes.push("is-filtered-empty");

  // Get extra workouts for this day
  const extra = loadExtraWorkouts();
  const extraForDay = Object.values(extra).filter((entry) => getActivityDateKey(entry.activity) === day.dateKey);
  const extraHtml = extraForDay
    .map((entry) => {
      const activity = entry.activity;
      const activityType = escapeHtml(activity.type ?? "Activity");
      const duration = activity.duration ? `${Math.round(activity.duration / 60)} min` : "—";
      return `
        <article class="calendar-session calendar-session--extra">
          <span class="calendar-session__extra-badge">Extra</span>
          <button class="calendar-session__open" type="button" title="Extra workout: ${activityType}">
            <span class="calendar-session__content">
              <strong>${escapeHtml(activity.name ?? "Extra activity")}</strong>
              <span class="calendar-session__compact-summary">
                <span class="calendar-session__discipline">${activityType}</span>
                <span class="calendar-session__descriptor">${duration}</span>
              </span>
            </span>
          </button>
        </article>
      `;
    })
    .join("");

  return `
    <section class="${classes.join(" ")}" data-calendar-day="${day.dateKey}">
      <div class="calendar-day__header">
        <span class="calendar-day__number">${day.dayOfMonth}</span>
        <span class="calendar-day__weekday">${calendarWeekdayNames[day.weekday]}</span>
        <span class="calendar-day__count">${completion.completed}/${completion.total}</span>
      </div>
      <div class="calendar-day__sessions">
        ${visibleSessions.map((session) => renderCalendarSession(session)).join("")}
        ${extraHtml}
        ${!visibleSessions.length && hasActiveCalendarFilters() ? `<span class="calendar-day__empty">No match</span>` : ""}
        ${hiddenCount > 0 && hasActiveCalendarFilters() ? `<span class="calendar-day__hidden">+${hiddenCount} hidden</span>` : ""}
      </div>
    </section>
  `;
}

function renderCalendarSession(session) {
  const completed = getCalendarSessionCompleted(session);
  const inputId = `${session.id}-complete`;
  const primaryCategory = calendarSessionPrimaryCategory(session);
  const compactCategory = getCalendarSessionCompactCategory(session);
  const compactLabel = getCalendarSessionCompactLabel(session);
  const compactDescriptor = getCalendarSessionCompactDescriptor(session);
  const isDraggable = isCalendarSessionDraggable(session);
  const dragClass = isDraggable ? "calendar-session--draggable" : "calendar-session--locked";
  
  // Check if this session was auto-matched
  const autoMatched = getAutoMatchedActivities();
  const isAutoChecked = completed && autoMatched[session.id];

  return `
    <article
      class="calendar-session calendar-session--${primaryCategory} calendar-session--compact-${compactCategory} ${completed ? "is-complete" : ""} ${dragClass}${isAutoChecked ? " calendar-session--auto-checked" : ""}"
      data-calendar-session-card="${session.id}"
      data-calendar-draggable="${String(isDraggable)}"
      draggable="${isDraggable ? "true" : "false"}"
    >
      <label class="calendar-session__toggle" for="${inputId}">
        <input
          id="${inputId}"
          type="checkbox"
          data-calendar-session="${session.id}"
          data-calendar-date="${session.dateKey}"
          ${completed ? "checked" : ""}
        />
        <span class="calendar-session__checkbox-label">Done</span>
      </label>
      <button
        class="calendar-session__open"
        type="button"
        data-calendar-session-open="${session.id}"
        aria-label="Open details for ${escapeHtml(session.title)}"
      >
        <span class="calendar-session__category-dots" aria-hidden="true">
          ${renderCalendarCategoryDots(session.categories)}
        </span>
        <span class="calendar-session__content">
          <strong>${escapeHtml(session.title)}</strong>
          <span class="calendar-session__compact-summary">
            <span class="calendar-session__discipline">${escapeHtml(compactLabel)}</span>
            <span class="calendar-session__descriptor">${escapeHtml(compactDescriptor)}</span>
          </span>
          <span class="calendar-session__meta">${escapeHtml(session.duration)}</span>
          ${renderCalendarSessionMovedBadge(session)}
          ${isAutoChecked ? renderAutoCheckBadge(autoMatched[session.id]) : ""}
          <span class="calendar-session__tags">
            ${session.categories
              .map((category) => `<span class="${tagClass(category)}">${category}</span>`)
              .join("")}
          </span>
          <span class="calendar-session__note">${escapeHtml(session.note)}</span>
        </span>
      </button>
    </article>
  `;
}

function renderCalendarCategoryDots(categories) {
  return categories
    .map((category) => `<span class="calendar-category-dot calendar-category-dot--${category}"></span>`)
    .join("");
}

function renderCalendarSessionDetail(sessionId) {
  const contentEl = document.querySelector("#calendar-detail-content");
  if (!contentEl) return;

  const context = getCalendarSessionContext(sessionId);
  if (!context) {
    contentEl.innerHTML = `
      <p class="eyebrow">Workout details</p>
      <h3 id="calendar-detail-title">Workout not found</h3>
      <p class="calendar-detail__note">This workout may have changed after the calendar was refreshed.</p>
    `;
    return;
  }

  const { day, session } = context;
  const completed = getCalendarSessionCompleted(session);
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const detailedWorkout = getDetailedWorkoutForDate(plannedDateKey);
  const detailInputId = `calendar-detail-${session.id}-complete`;
  const workoutBlocks = getWorkoutSpecificBlocks(detailedWorkout, session, day);
  const detailBlocks = getSessionDetailBlocks(session, workoutBlocks);
  const linkedActivity = getLinkedActivityForSession(session.id);
  const availableActivitiesForLink = !completed && !linkedActivity ? getAvailableActivitiesForSession(session) : [];
  const isStrengthSession = session.categories.includes("strength");
  const strengthQuickHistorySection = isStrengthSession ? renderStrengthQuickHistory(session, day) : "";

  contentEl.innerHTML = `
    <p class="eyebrow">${escapeHtml(formatCalendarDate(day))}</p>
    <h3 id="calendar-detail-title">${escapeHtml(session.title)}</h3>
    <div class="calendar-detail__meta">
      <span class="duration-pill">${escapeHtml(session.duration)}</span>
      ${session.categories.map((category) => `<span class="${tagClass(category)}">${category}</span>`).join("")}
      ${renderCalendarSessionMovedBadge(session)}
    </div>

    <label class="calendar-detail__complete" for="${detailInputId}">
      <input
        id="${detailInputId}"
        type="checkbox"
        data-calendar-session="${session.id}"
        data-calendar-date="${session.dateKey}"
        ${completed ? "checked" : ""}
      />
      <span>${completed ? "Completed" : "Mark this workout complete"}</span>
    </label>

    ${
      isStrengthSession
        ? `
          <section class="calendar-detail__section calendar-detail__workout-mode">
            <h4>Workout mode</h4>
            <p>Track this strength session one set at a time with exercise-specific logging.</p>
            <button
              class="button button--primary"
              type="button"
              data-strength-workout-start="${escapeHtml(session.id)}"
            >
              Start Workout
            </button>
          </section>
        `
        : ""
    }

    ${
      !completed && !linkedActivity
        ? `
          <div class="calendar-detail__complete-link">
            <p class="calendar-detail__complete-link-title">Or complete + link Strava</p>
            <div class="calendar-detail__complete-link-controls">
              <select data-calendar-complete-link-select="${escapeHtml(session.id)}">
                <option value="">Choose activity…</option>
                ${availableActivitiesForLink
                  .map((activity) => {
                    const activityId = escapeHtml(String(activity.id));
                    const activityName = escapeHtml(activity.name || normalizeActivityTypeDisplay(activity.type));
                    const activityDate = escapeHtml(formatMatchingDate(getActivityDateKey(activity)));
                    const activityDuration = activity.duration ? `${Math.round(activity.duration / 60)} min` : "";
                    return `<option value="${activityId}">${activityName}${activityDate ? ` · ${activityDate}` : ""}${activityDuration ? ` · ${activityDuration}` : ""}</option>`;
                  })
                  .join("")}
              </select>
              <button
                class="button button--primary button--small"
                type="button"
                data-calendar-complete-link="${escapeHtml(session.id)}"
                ${availableActivitiesForLink.length ? "" : "disabled"}
              >
                Complete + Link
              </button>
            </div>
          </div>
        `
        : ""
    }

    ${renderCalendarRescheduleControls(session)}
    ${strengthQuickHistorySection}
    <section class="calendar-detail__section">
      <h4>Workout details</h4>
      ${renderCalendarDetailBlocks(detailBlocks)}
    </section>

    ${(() => {
      if (!linkedActivity) return "";
      const duration = linkedActivity.duration ? `${Math.round(linkedActivity.duration / 60)} min` : null;
      const distance = linkedActivity.distance ? `${(linkedActivity.distance / 1000).toFixed(1)} km` : null;
      const elevation = linkedActivity.elevationGain ? `↑${Math.round(linkedActivity.elevationGain)} m` : null;
      const chips = [duration, distance, elevation].filter(Boolean)
        .map((v) => `<span class="activity-meta-chip">${escapeHtml(v)}</span>`).join(" ");
      return `
        <section class="calendar-detail__section">
          <h4>Strava activity</h4>
          <p><strong>${escapeHtml(linkedActivity.name || normalizeActivityTypeDisplay(linkedActivity.type))}</strong></p>
          <div>${chips}</div>
        </section>
      `;
    })()}
  `;
}

function openCalendarDetail(sessionId, trigger = null) {
  const dialog = document.querySelector("#calendar-detail-dialog");
  if (!dialog) return;

  lastCalendarDetailTrigger = trigger;
  dialog.dataset.calendarSessionId = sessionId;
  renderCalendarSessionDetail(sessionId);
  dialog.hidden = false;
  dialog.classList.add("is-visible");
  document.body.classList.add("has-calendar-dialog");
  dialog.querySelector(".calendar-dialog__close")?.focus();
}

function closeCalendarDetail() {
  const dialog = document.querySelector("#calendar-detail-dialog");
  if (!dialog || dialog.hidden) return;

  dialog.classList.remove("is-visible");
  dialog.hidden = true;
  delete dialog.dataset.calendarSessionId;
  document.body.classList.remove("has-calendar-dialog");
  lastCalendarDetailTrigger?.focus?.();
  lastCalendarDetailTrigger = null;
}

function renderPlanTab() {
  renderSummaryCards();
  renderWeekTargets();
  renderPhases();
  renderSwimPlan();
  renderRunRamp();
  renderHeartRateZones();
  renderLowerLegProtocol();
  renderStrengthTemplates();
  renderWeeklyVolume();
}

function renderSummaryCards() {
  const el = document.querySelector("#summary-cards");
  if (!el) return;
  el.innerHTML = summaryCards
    .map(
      (card) => `
        <article class="stat-card">
          <p class="stat-card__label">${escapeHtml(card.label)}</p>
          <p class="stat-card__value">${escapeHtml(card.value)}</p>
          <p class="stat-card__detail">${escapeHtml(card.detail)}</p>
        </article>
      `,
    )
    .join("");
}

function renderWeekTargets() {
  const el = document.querySelector("#week-targets");
  if (!el) return;
  el.innerHTML = weekTargets
    .map(
      (target) => `
        <div class="mini-metric">
          <strong>${escapeHtml(target.value)}</strong>
          <span>${escapeHtml(target.label)}</span>
        </div>
      `,
    )
    .join("");
}

function renderPhases() {
  const el = document.querySelector("#phases");
  if (!el) return;
  el.innerHTML = phases
    .map(
      (phase) => `
        <article class="phase-card">
          <p class="phase-card__date">${escapeHtml(phase.date)}</p>
          <h4>${escapeHtml(phase.title)}</h4>
          <p>${escapeHtml(phase.detail)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSwimPlan() {
  renderSwimMethodologyCards();
  renderSwimDrillProgression();
  renderSwimDrillLibrary();
  renderSwimReadinessChecklist();
  renderSwimCssLog();
  renderSwimPaceZones();
}

function renderSwimMethodologyCards() {
  const el = document.querySelector("#swim-methodology");
  if (!el) return;
  el.innerHTML = swimMethodologyCards
    .map(
      (card) => `
        <article class="swim-method-card">
          <h4>${escapeHtml(card.title)}</h4>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSwimDrillProgression() {
  const el = document.querySelector("#swim-drills");
  if (!el) return;
  el.innerHTML = swimDrillProgression
    .map(
      (phase) => `
        <article class="swim-drill-phase">
          <p class="swim-drill-phase__weeks">${escapeHtml(phase.phase)}</p>
          <h4>${escapeHtml(phase.title)}</h4>
          <p class="swim-drill-phase__focus">${escapeHtml(phase.focus)}</p>
          <ul>
            ${phase.drills.map((drill) => `<li>${escapeHtml(drill)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderSwimReadinessChecklist() {
  const el = document.querySelector("#swim-readiness");
  if (!el) return;
  el.innerHTML = swimReadinessChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderSwimDrillLibrary() {
  const el = document.querySelector("#swim-drill-library");
  if (!el) return;
  el.innerHTML = renderDrillItems(swimDrills);
}

function formatTestDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  const month = calendarMonthNames[date.getMonth()].slice(0, 3);
  return `${calendarWeekdayNames[date.getDay()]} ${month} ${date.getDate()}`;
}

function renderSwimCssLog() {
  const el = document.querySelector("#swim-css-log");
  if (!el) return;
  const latest = swimTests[swimTests.length - 1];
  const testRow = (row) => `
    <tr>
      <td><strong>${escapeHtml(row.label)}</strong></td>
      <td>${escapeHtml(row.t400)}</td>
      <td>${escapeHtml(row.t200)}</td>
      <td><strong>${escapeHtml(row.css)}</strong></td>
    </tr>
  `;

  el.innerHTML = `
    <p class="css-current">
      <span class="css-current__label">Current CSS</span>
      <span class="css-current__value">${escapeHtml(latest?.css ?? "—")}</span>
      <span class="css-current__unit">per 100 yd</span>
    </p>
    <div class="plan-table-wrap">
      <table class="plan-table">
        <thead>
          <tr><th>Test</th><th>400 yd</th><th>200 yd</th><th>CSS</th></tr>
        </thead>
        <tbody>
          ${swimTests
            .map(
              (test) => `
                <tr>
                  <td><strong>${escapeHtml(test.label)}</strong><br><span class="css-log__date">${escapeHtml(formatTestDate(test.date))}</span></td>
                  <td>${escapeHtml(test.t400)}</td>
                  <td>${escapeHtml(test.t200)}</td>
                  <td><strong>${escapeHtml(test.css)}</strong></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${latest?.note ? `<p class="plan-subhead__note">${escapeHtml(latest.note)}</p>` : ""}
    <h5 class="plan-subhead">Week ${swimTestTarget.week} retest target — ${escapeHtml(formatTestDate(swimTestTarget.date))}</h5>
    <div class="plan-table-wrap">
      <table class="plan-table">
        <thead>
          <tr><th>Outcome</th><th>400 yd</th><th>200 yd</th><th>CSS</th></tr>
        </thead>
        <tbody>
          ${swimTestTarget.rows.map(testRow).join("")}
        </tbody>
      </table>
    </div>
    <p class="plan-subhead__note">${escapeHtml(swimTestTarget.caveat)}</p>
  `;
}

function renderSwimPaceZones() {
  const el = document.querySelector("#swim-pace-zones");
  if (!el) return;
  el.innerHTML = `
    <div class="plan-table-wrap">
      <table class="plan-table">
        <thead>
          <tr><th>Zone</th><th>Pace / 100 yd</th><th>Feels like</th></tr>
        </thead>
        <tbody>
          ${swimPaceZones
            .map(
              (zone) => `
                <tr>
                  <td><strong>${escapeHtml(zone.zone)}</strong></td>
                  <td>${escapeHtml(zone.pace)}</td>
                  <td>${escapeHtml(zone.cue)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <h4 class="plan-subhead">Send-offs</h4>
    <p class="plan-subhead__note">
      These are still cut from the pre-test estimate of 1:55, which the Week 1 test came
      within 2 s of. That couple of seconds is left in on purpose while the new gear and
      drill work bed in — the send-offs get re-cut at the Week 8 retest, where the change
      should actually be worth making. The rest column is measured against your tested 1:53.
    </p>
    <div class="plan-table-wrap">
      <table class="plan-table">
        <thead>
          <tr><th>Set</th><th>Leaves on</th><th>Rest that buys you</th></tr>
        </thead>
        <tbody>
          ${swimSendOffs
            .map(
              (item) => `
                <tr>
                  <td><strong>${escapeHtml(item.set)}</strong></td>
                  <td>${escapeHtml(item.sendOff)}</td>
                  <td>${escapeHtml(item.rest)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHeartRateZones() {
  const el = document.querySelector("#hr-zones");
  if (!el) return;
  el.innerHTML = `
    <table class="plan-table">
      <thead>
        <tr><th>Zone</th><th>BPM</th><th>Used for</th></tr>
      </thead>
      <tbody>
        ${heartRateZones
          .map(
            (zone) => `
              <tr>
                <td><strong>${escapeHtml(zone.zone)}</strong></td>
                <td>${escapeHtml(zone.range)}</td>
                <td>${escapeHtml(zone.cue)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderRunRamp() {
  const el = document.querySelector("#run-ramp");
  if (!el) return;
  el.innerHTML = `
    <table class="plan-table">
      <thead>
        <tr><th>Week</th><th>Dates</th><th>Runs</th><th>Volume</th><th>Long run</th><th>Note</th></tr>
      </thead>
      <tbody>
        ${runRamp
          .map(
            (row) => `
              <tr>
                <td><strong>${escapeHtml(row.week)}</strong></td>
                <td>${escapeHtml(row.dates)}</td>
                <td>${escapeHtml(row.runs)}</td>
                <td>${escapeHtml(row.volume)}</td>
                <td>${escapeHtml(row.longRun)}</td>
                <td>${escapeHtml(row.note)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderLowerLegProtocol() {
  const el = document.querySelector("#lower-leg-protocol");
  if (!el) return;
  el.innerHTML = lowerLegProtocol.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("");
}

function renderStrengthTemplates() {
  const el = document.querySelector("#strength-templates");
  if (!el) return;
  el.innerHTML = strengthTemplates
    .map(
      (template) => `
        <article class="strength-template-card">
          <h4>${escapeHtml(template.title)}</h4>
          <p class="strength-template-card__focus">${escapeHtml(template.focus)}</p>
          <ol>
            ${template.exercises.map((exercise) => `<li>${escapeHtml(exercise)}</li>`).join("")}
          </ol>
        </article>
      `,
    )
    .join("");
}

function renderWeeklyVolume() {
  const el = document.querySelector("#weekly-volume");
  if (!el) return;
  const peak = Math.max(...weeklySwimYards.map((week) => week.yards));
  el.innerHTML = `
    <table class="plan-table">
      <thead>
        <tr><th>Week</th><th>Dates</th><th>Phase</th><th>Swims</th><th>Swim yards</th><th></th></tr>
      </thead>
      <tbody>
        ${weeklySwimYards
          .map((week) => {
            const label = calendarPhaseLabels[week.phase] ?? week.phase;
            const bar = Math.round((week.yards / peak) * 100);
            return `
              <tr>
                <td><strong>Week ${week.week}</strong></td>
                <td>${formatCalendarDateKeyShort(week.start)} – ${formatCalendarDateKeyShort(week.end)}</td>
                <td>${escapeHtml(label)}</td>
                <td>${week.sessions}</td>
                <td>${week.yards.toLocaleString()} yd</td>
                <td><div class="progress-bar"><span style="width:${bar}%"></span></div></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
    <p class="plan-footnote">Every week clears the 6,000 yd floor, including the New York and Florida travel weeks.</p>
  `;
}

function tagClass(category) {
  return `tag tag--${category}`;
}

function renderTrackingSummary() {
  const el = document.querySelector("#tracking-summary");
  if (!el) return;

  const sessions = getAllCalendarSessions();
  if (!sessions.length) {
    el.innerHTML = `<p class="plan-footnote">No sessions scheduled.</p>`;
    return;
  }

  const completedSessions = sessions.filter((session) => getCalendarSessionCompleted(session)).length;
  const overallPercent = Math.round((completedSessions / sessions.length) * 100);

  const categoryTotals = [
    ["Swim", "swim"],
    ["Run", "run"],
    ["Bike", "bike"],
    ["Strength", "strength"],
    ["Cardio", "cardio"],
    ["Mobility", "mobility"],
  ]
    .map(([label, category]) => {
      const inCategory = sessions.filter((session) => session.categories?.includes(category));
      const done = inCategory.filter((session) => getCalendarSessionCompleted(session)).length;
      return {
        label,
        done,
        total: inCategory.length,
        percent: inCategory.length ? Math.round((done / inCategory.length) * 100) : 0,
      };
    })
    .filter((item) => item.total > 0);

  el.innerHTML = `
    ${renderSummaryRow("Block", overallPercent, `${completedSessions}/${sessions.length} sessions`)}
    ${categoryTotals.map((item) => renderSummaryRow(item.label, item.percent, `${item.done}/${item.total}`)).join("")}
  `;
}

function renderSummaryRow(label, percent, value) {
  return `
    <div class="summary-row">
      <strong>${label}</strong>
      <div class="progress-bar"><span style="width:${percent}%"></span></div>
      <span>${value}</span>
    </div>
  `;
}

function updateTrackingFromForm(form, options = {}) {
  const id = form.dataset.trackingForm;
  const previousCompleted = getDayTracking(id).completed;
  const data = new FormData(form);
  const completed = data.get("completed") === "on";

  tracking[id] = { completed };
  saveTracking();
  renderTrackingSummary();

  if (options.syncCalendar && previousCompleted !== completed) {
    syncCalendarFromDetailedTracking(id, completed);
  }
}

function attachTrackingEvents() {
  document.querySelectorAll("[data-tracking-form]").forEach((form) => {
    form.addEventListener("input", (event) => {
      if (event.target?.name === "completed") return;
      updateTrackingFromForm(form);
    });

    form.addEventListener("change", () => {
      updateTrackingFromForm(form, { syncCalendar: true });
    });
  });
}

function getTabIdForHash(hash = window.location.hash) {
  const id = hash.replace(/^#/, "");
  if (!id) return "calendar";
  if (tabIds.includes(id)) return id;
  if (tabAliases[id]) return tabAliases[id];
  if (id.startsWith("workout-")) return "calendar";

  const target = document.getElementById(id);
  return target?.closest("[data-tab-panel]")?.dataset.tabPanel ?? "calendar";
}

function activateTab(tabId, options = {}) {
  const nextTabId = tabIds.includes(tabId) ? tabId : "calendar";
  const { focusPanel = false, scrollToHash = false, updateHash = false } = options;

  document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    const isActive = panel.dataset.tabPanel === nextTabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    const isActive = link.dataset.tabLink === nextTabId;
    link.classList.toggle("is-active", isActive);
    if (link.getAttribute("role") === "tab") {
      link.setAttribute("aria-selected", String(isActive));
      link.setAttribute("tabindex", isActive ? "0" : "-1");
    }
  });

  if (updateHash && window.location.hash !== `#${nextTabId}`) {
    window.history.pushState(null, "", `#${nextTabId}`);
  }

  const targetId = window.location.hash.replace(/^#/, "");
  const target = targetId ? document.getElementById(targetId) : null;

  if (scrollToHash && target) {
    window.requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  } else if (focusPanel) {
    document.querySelector(`[data-tab-panel="${nextTabId}"]`)?.focus?.({ preventScroll: true });
  }

  if (nextTabId === "matching") {
    renderMatchingTab();
  } else if (nextTabId === "strength-history") {
    renderStrengthHistoryTab();
  }
}

function attachTabEvents() {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const tabLink = event.target.closest("[data-tab-link]");
    if (!tabLink) return;

    event.preventDefault();
    activateTab(tabLink.dataset.tabLink, { focusPanel: true, updateHash: true });
    closeSiteNav();
  });

  window.addEventListener("hashchange", () => {
    activateTab(getTabIdForHash(), { scrollToHash: true });
  });
}

function setSiteNavOpen(isOpen) {
  const nav = document.querySelector("[data-site-nav]");
  const toggle = document.querySelector("[data-site-nav-toggle]");
  if (!nav || !toggle) return;

  nav.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
}

function closeSiteNav() {
  setSiteNavOpen(false);
}

function attachSiteNavEvents() {
  if (siteNavEventsAttached) return;

  const nav = document.querySelector("[data-site-nav]");
  const toggle = document.querySelector("[data-site-nav-toggle]");
  if (!nav || !toggle) return;

  siteNavEventsAttached = true;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    setSiteNavOpen(!isExpanded);
  });

  nav.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a")) closeSiteNav();
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (!nav.classList.contains("is-open") || nav.contains(event.target)) return;
    closeSiteNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSiteNav();
  });
}

function attachTodayPanelEvents() {
  if (todayPanelEventsAttached) return;

  const todayPanel = document.querySelector("#today-panel");
  if (!todayPanel) return;

  todayPanelEventsAttached = true;

  todayPanel.addEventListener("change", (event) => {
    if (!(event.target instanceof Element)) return;
    const checkbox = event.target.closest("[data-calendar-session]");
    if (!checkbox) return;

    updateCalendarSessionCompletion(checkbox);
  });

  todayPanel.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const openTrigger = event.target.closest("[data-calendar-session-open]");
    if (!openTrigger) return;

    activateTab("calendar", { updateHash: true });
    openCalendarDetail(openTrigger.dataset.calendarSessionOpen, openTrigger);
  });
}

function attachCalendarEvents() {
  if (calendarEventsAttached) return;

  const calendarSection = document.querySelector("#calendar-tracker");
  if (!calendarSection) return;

  calendarEventsAttached = true;

  calendarSection.addEventListener("dragstart", handleCalendarDragStart);
  calendarSection.addEventListener("dragover", handleCalendarDragOver);
  calendarSection.addEventListener("dragleave", handleCalendarDragLeave);
  calendarSection.addEventListener("drop", handleCalendarDrop);
  calendarSection.addEventListener("dragend", handleCalendarDragEnd);

  calendarSection.addEventListener("change", (event) => {
    if (!(event.target instanceof Element)) return;
    const checkbox = event.target.closest("[data-calendar-session]");
    if (!checkbox) return;

    updateCalendarSessionCompletion(checkbox);
  });

  calendarSection.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target;

    if (calendarSuppressNextClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const closeTrigger = target.closest("[data-calendar-dialog-close]");
    if (closeTrigger) {
      if (closeTrigger.tagName !== "A") event.preventDefault();
      closeCalendarDetail();
      return;
    }

    const openTrigger = target.closest("[data-calendar-session-open]");
    if (openTrigger) {
      openCalendarDetail(openTrigger.dataset.calendarSessionOpen, openTrigger);
      return;
    }

    const moveTrigger = target.closest("[data-calendar-move-session]");
    if (moveTrigger) {
      rescheduleCalendarSession(moveTrigger.dataset.calendarMoveSession, moveTrigger.dataset.calendarMoveDate);
      return;
    }

    const moveApplyTrigger = target.closest("[data-calendar-move-apply]");
    if (moveApplyTrigger) {
      const sessionId = moveApplyTrigger.dataset.calendarMoveApply;
      const input = sessionId ? calendarSection.querySelector(`[data-calendar-move-input="${sessionId}"]`) : null;
      rescheduleCalendarSession(sessionId, input?.value);
      return;
    }

    const resetDateTrigger = target.closest("[data-calendar-reset-date]");
    if (resetDateTrigger) {
      resetCalendarSessionDate(resetDateTrigger.dataset.calendarResetDate);
      return;
    }

    const completeAndLinkTrigger = target.closest("[data-calendar-complete-link]");
    if (completeAndLinkTrigger) {
      const sessionId = completeAndLinkTrigger.dataset.calendarCompleteLink;
      const dialog = document.querySelector("#calendar-detail-dialog");
      const select = sessionId
        ? dialog?.querySelector(`[data-calendar-complete-link-select="${CSS.escape(sessionId)}"]`)
        : null;
      const activityId = select?.value;
      if (!sessionId || !activityId) {
        showToast("Select a Strava activity first.");
        return;
      }

      applyManualActivityMatch(activityId, sessionId);
      if (dialog?.dataset.calendarSessionId === sessionId && !dialog.hidden) {
        renderCalendarSessionDetail(sessionId);
      }
      return;
    }

    const categoryFilter = target.closest("[data-calendar-category-filter]");
    if (categoryFilter) {
      setCalendarUiState({ categoryFilter: categoryFilter.dataset.calendarCategoryFilter });
      return;
    }

    const statusFilter = target.closest("[data-calendar-status-filter]");
    if (statusFilter) {
      setCalendarUiState({ statusFilter: statusFilter.dataset.calendarStatusFilter });
      return;
    }

    const viewToggle = target.closest("[data-calendar-view]");
    if (viewToggle) {
      setCalendarUiState({ view: viewToggle.dataset.calendarView });
      return;
    }

    if (target.closest("[data-calendar-jump-today]")) {
      jumpToCalendarTarget();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCalendarDetail();
  });
}

function updateCalendarSessionCompletion(checkbox) {
  const sessionId = checkbox.dataset.calendarSession;
  if (!sessionId) return;

  const context = getCalendarSessionContext(sessionId);
  const currentDateKey = context?.session.dateKey ?? checkbox.dataset.calendarDate;
  const plannedDateKey = context?.session.plannedDateKey ?? currentDateKey;
  if (!currentDateKey || !plannedDateKey) return;

  materializeCalendarDayTracking(currentDateKey);
  calendarTracking[sessionId] = { completed: checkbox.checked };
  saveCalendarTracking();
  syncDetailedTrackingFromCalendar(plannedDateKey);

  const dialog = document.querySelector("#calendar-detail-dialog");
  const openDetailSessionId = dialog?.dataset.calendarSessionId;

  renderCalendar();
  renderTrackingSummary();

  if (openDetailSessionId === sessionId && dialog && !dialog.hidden) {
    renderCalendarSessionDetail(sessionId);
  }

  showToast(checkbox.checked ? "Workout checked off." : "Workout marked incomplete.");
}

function jumpToCalendarTarget() {
  const targetDateKey = getCalendarJumpTargetDateKey();
  const dayEl = targetDateKey ? document.querySelector(`[data-calendar-day="${targetDateKey}"]`) : null;

  if (!dayEl) {
    showToast("No calendar day found to jump to.");
    return;
  }

  dayEl.scrollIntoView({ behavior: "smooth", block: "center" });
  dayEl.classList.add("is-jump-highlight");
  window.setTimeout(() => dayEl.classList.remove("is-jump-highlight"), 1500);
}

function resetTracking() {
  const confirmed = window.confirm("Reset all calendar tracking and workout moves saved in this browser?");
  if (!confirmed) return;
  tracking = {};
  calendarTracking = {};
  calendarReschedules = {};
  saveTracking();
  saveCalendarTracking();
  saveCalendarReschedules();
  calendarDays = buildCalendarDays();
  renderCalendar();
  attachCalendarEvents();
  renderTrackingSummary();
  showToast("All tracking reset.");
}

let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

const ActivityManager = {
  activities: [],

  async fetchSyncedActivities() {
    try {
      const res = await fetch("https://raw.githubusercontent.com/abidrahman/abid-workouts/main/data/activities.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Filter to the training block window using the app's canonical date constants
      const startKey = dateToKey(calendarStartDate);
      const endKey = dateToKey(calendarEndDate);
      const inBlock = (Array.isArray(data) ? data : []).filter((a) => {
        const dateKey = getActivityDateKey(a);
        return dateKey && dateKey >= startKey && dateKey <= endKey;
      });
      this.activities = inBlock;
      syncedActivities = inBlock;
      return inBlock;
    } catch (error) {
      console.warn("Could not load activities.json:", error);
      this.activities = [];
      syncedActivities = [];
      return [];
    }
  },

  async fetchAndRender() {
    await this.fetchSyncedActivities();
    this.renderActivityList(this.activities);
    renderActivityMatchQueue();
    if (isMatchingTabActive()) renderMatchingTab();
    if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
  },

  renderActivityList(activities) {
    const listEl = document.querySelector("#activity-list");
    if (!listEl) return;

    if (!activities || activities.length === 0) {
      listEl.innerHTML = '<p class="activity-sidebar__empty">No activities synced yet</p>';
      return;
    }

    listEl.innerHTML = activities
      .slice(0, 20)
      .map((activity) => this.renderActivityItem(activity))
      .join("");
  },

  renderActivityItem(activity) {
    const date = activity.startTime
      ? new Date(activity.startTime).toLocaleDateString()
      : "Unknown date";
    const duration = activity.duration ? `${Math.round(activity.duration / 60)} min` : "—";
    const activityType = normalizeActivityTypeDisplay(activity.type);
    const distance = activity.distance ? `${(activity.distance / 1000).toFixed(1)} km` : null;
    const elevation = activity.elevationGain ? `↑${Math.round(activity.elevationGain)} m` : null;
    const linkedSession = getLinkedSessionForActivity(String(activity.id));
    const matchMeta = linkedSession
      ? `<p class="activity-item__match">✓ Linked: ${escapeHtml(linkedSession.title)}</p>`
      : "";

    return `
      <div class="activity-item">
        <div class="activity-item__header">
          <span class="activity-item__type">${escapeHtml(activityType)}</span>
          <span class="activity-item__date">${date}</span>
        </div>
        ${activity.name ? `<p class="activity-item__name">${escapeHtml(activity.name)}</p>` : ""}
        <div class="activity-item__meta">
          <span class="activity-item__duration">⏱ ${duration}</span>
          ${distance ? `<span class="activity-item__distance">📍 ${escapeHtml(distance)}</span>` : ""}
          ${elevation ? `<span class="activity-item__elevation">⛰ ${escapeHtml(elevation)}</span>` : ""}
        </div>
        ${matchMeta}
      </div>
    `;
  },

  init() {
    const activitiesBtn = document.querySelector("#auth-activities-btn");
    const sidebarClose = document.querySelector("#activity-sidebar-close");
    const sidebar = document.querySelector("#activity-sidebar");

    if (activitiesBtn) {
      activitiesBtn.addEventListener("click", () => {
        if (sidebar) sidebar.classList.toggle("is-open");
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener("click", () => {
        if (sidebar) sidebar.classList.remove("is-open");
      });
    }

    if (sidebar) {
      sidebar.addEventListener("click", (e) => {
        if (e.target === sidebar) sidebar.classList.remove("is-open");
      });

      sidebar.addEventListener("click", (event) => {
        const linkButton = event.target.closest("[data-manual-match-link]");
        if (!linkButton) return;
        const activityId = linkButton.dataset.manualMatchLink;
        const select = [...sidebar.querySelectorAll("[data-manual-match-select]")].find(
          (item) => item.dataset.manualMatchSelect === activityId,
        );
        const sessionId = select?.value;
        if (!sessionId) {
          showToast("Select a workout first.");
          return;
        }
        applyManualActivityMatch(activityId, sessionId);
      });

      sidebar.addEventListener("click", (event) => {
        const extraButton = event.target.closest("[data-mark-extra]");
        if (!extraButton) return;
        const activityId = extraButton.dataset.markExtra;
        markActivityAsExtra(activityId);
      });

      sidebar.addEventListener("click", (event) => {
        const dismissButton = event.target.closest("[data-dismiss-activity]");
        if (!dismissButton) return;
        dismissActivity(dismissButton.dataset.dismissActivity);
        renderActivityMatchQueue();
      });
    }
  },
};

// Strength Workout Manager
const StrengthWorkoutManager = {
  currentWorkout: null,
  currentSessionId: null,
  currentDateKey: null,
  currentLogKey: null,
  selectedExerciseKey: "",
  pendingSetInput: { weight: "", reps: "" },
  pendingCustomExercise: "",
  workoutLogs: {},

  init() {
    this.loadLogsFromLocalStorage();
    this.attachModalEvents();
  },

  loadLogsFromLocalStorage() {
    const stored = localStorage.getItem("strengthLogs");
    try {
      const parsed = stored ? JSON.parse(stored) : {};
      this.workoutLogs = this.migrateStrengthLogs(parsed);
    } catch {
      this.workoutLogs = {};
    }
  },

  saveLogsToLocalStorage() {
    localStorage.setItem("strengthLogs", JSON.stringify(this.workoutLogs));
    api.saveStrengthLogs(SYNC_DOC_KEY, this.workoutLogs).catch(() => {});
  },

  migrateStrengthLogs(logs) {
    if (!logs || typeof logs !== "object") return {};

    const migrated = {};
    Object.entries(logs).forEach(([key, log]) => {
      if (!log || typeof log !== "object" || !log.exerciseLogs || typeof log.exerciseLogs !== "object") return;
      migrated[key] = {
        ...log,
        availableExercises: Array.isArray(log.availableExercises) ? log.availableExercises : [],
        exerciseNotes: log.exerciseNotes && typeof log.exerciseNotes === "object" ? log.exerciseNotes : {},
      };
    });
    return migrated;
  },

  getWorkoutDate(sessionId) {
    const context = getCalendarSessionContext(sessionId);
    return context ? context.day : null;
  },

  startWorkout(sessionId) {
    const context = getCalendarSessionContext(sessionId);
    if (!context) {
      console.error("Session not found:", sessionId);
      return;
    }

    const { day, session } = context;
    if (!session.categories.includes("strength")) {
      showToast("Workout mode is available for strength workouts.");
      return;
    }

    const availableExercises = getStrengthExerciseOptions(day, session);
    this.currentSessionId = sessionId;
    this.currentDateKey = day.dateKey;
    this.currentWorkout = {
      workoutId: sessionId,
      title: session.title,
      date: day.dateKey,
      dateDisplay: formatCalendarDate(day),
      availableExercises,
      exerciseNotes: {},
      exerciseLogs: {},
      timestamp: Date.now(),
    };
    this.selectedExerciseKey = availableExercises[0]?.key ?? "";
    this.pendingCustomExercise = "";
    this.setPendingSetFromLastSet();

    closeCalendarDetail();
    this.renderWorkoutModal();
    this.openWorkoutModal();
  },

  renderWorkoutModal() {
    const titleEl = document.querySelector("#strength-workout-title");
    const dateEl = document.querySelector("#strength-workout-date");
    const exerciseListEl = document.querySelector("#strength-exercise-list");
    if (!exerciseListEl || !this.currentWorkout) return;

    if (titleEl) titleEl.textContent = this.currentWorkout.title;
    if (dateEl) dateEl.textContent = this.currentWorkout.dateDisplay;

    const exercises = this.currentWorkout.availableExercises ?? [];
    if (!exercises.length) {
      exerciseListEl.innerHTML = "<p>No exercises found for this workout.</p>";
      return;
    }

    if (!this.selectedExerciseKey || !exercises.some((exercise) => exercise.key === this.selectedExerciseKey)) {
      this.selectedExerciseKey = exercises[0].key;
      this.setPendingSetFromLastSet();
    }

    const selectedExercise = exercises.find((exercise) => exercise.key === this.selectedExerciseKey);
    const selectedExerciseSets = this.currentWorkout.exerciseLogs[this.selectedExerciseKey] ?? [];
    const logSummary = exercises
      .map((exercise) => {
        const count = this.currentWorkout.exerciseLogs[exercise.key]?.length ?? 0;
        return `
          <li>
            <span>${escapeHtml(exercise.name)}</span>
            <strong>${count} set${count === 1 ? "" : "s"}</strong>
          </li>
        `;
      })
      .join("");

    exerciseListEl.innerHTML = `
      <section class="workout-mode-toolbar">
        <div class="workout-mode-toolbar__row">
          <div class="field">
            <label for="strength-exercise-select">Exercise</label>
            <select id="strength-exercise-select" data-strength-exercise-select>
              ${exercises
                .map(
                  (exercise) => `
                    <option value="${escapeHtml(exercise.key)}" ${exercise.key === this.selectedExerciseKey ? "selected" : ""}>
                      ${escapeHtml(exercise.name)}
                    </option>
                  `,
                )
                .join("")}
            </select>
          </div>
        </div>
        <div class="workout-mode-toolbar__row workout-mode-toolbar__row--custom">
          <div class="field">
            <label for="strength-custom-exercise">Add custom exercise</label>
            <input
              id="strength-custom-exercise"
              type="text"
              placeholder="e.g., Hamstring curl (machine 3)"
              value="${escapeHtml(this.pendingCustomExercise)}"
              data-strength-custom-exercise
            />
          </div>
          <button type="button" class="button button--ghost" data-strength-add-custom-exercise>
            Add
          </button>
        </div>
      </section>

      <section class="workout-mode-entry">
        <h3>${escapeHtml(selectedExercise?.name ?? "Exercise")}</h3>
        <div class="field">
          <label for="strength-exercise-note">Exercise note (variation/machine)</label>
          <textarea
            id="strength-exercise-note"
            placeholder="e.g., Hamstring curl machine #2, seat position 4"
            data-strength-exercise-note
          >${escapeHtml(this.currentWorkout.exerciseNotes?.[this.selectedExerciseKey] ?? "")}</textarea>
        </div>
        <div class="workout-mode-entry__inputs">
          <div class="field">
            <label for="strength-set-weight">Weight</label>
            <input
              id="strength-set-weight"
              type="text"
              placeholder="e.g., 185 lb"
              value="${escapeHtml(this.pendingSetInput.weight)}"
              data-strength-pending-field="weight"
            />
          </div>
          <div class="field">
            <label for="strength-set-reps">Reps</label>
            <input
              id="strength-set-reps"
              type="text"
              placeholder="e.g., 8"
              value="${escapeHtml(this.pendingSetInput.reps)}"
              data-strength-pending-field="reps"
            />
          </div>
          <button type="button" class="button button--primary" data-strength-log-set>
            Log Set
          </button>
        </div>
      </section>

      <section class="workout-mode-sets">
        <h3>Logged sets for ${escapeHtml(selectedExercise?.name ?? "exercise")}</h3>
        ${
          selectedExerciseSets.length
            ? `
              <div class="workout-mode-set-list">
                ${selectedExerciseSets
                  .map(
                    (set, setIndex) => `
                      <div class="workout-mode-set-row">
                        <strong>Set ${setIndex + 1}</strong>
                        <input
                          type="text"
                          value="${escapeHtml(set.weight)}"
                          placeholder="Weight"
                          data-strength-set-field="weight"
                          data-exercise-key="${escapeHtml(this.selectedExerciseKey)}"
                          data-set-index="${setIndex}"
                        />
                        <input
                          type="text"
                          value="${escapeHtml(set.reps)}"
                          placeholder="Reps"
                          data-strength-set-field="reps"
                          data-exercise-key="${escapeHtml(this.selectedExerciseKey)}"
                          data-set-index="${setIndex}"
                        />
                        <button
                          type="button"
                          class="set-delete-btn"
                          data-strength-delete-set
                          data-exercise-key="${escapeHtml(this.selectedExerciseKey)}"
                          data-set-index="${setIndex}"
                        >
                          Delete
                        </button>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            `
            : '<p class="small-note">No sets logged yet for this exercise.</p>'
        }
      </section>

      <section class="workout-mode-summary">
        <h3>Workout progress</h3>
        <ul>${logSummary}</ul>
      </section>
    `;

    exerciseListEl.querySelector("[data-strength-exercise-select]")?.addEventListener("change", (event) => {
      this.selectExercise(event.target.value);
    });

    exerciseListEl.querySelector("[data-strength-custom-exercise]")?.addEventListener("input", (event) => {
      this.pendingCustomExercise = event.target.value;
    });

    exerciseListEl.querySelector("[data-strength-add-custom-exercise]")?.addEventListener("click", () => {
      this.addCustomExercise(this.pendingCustomExercise);
    });

    exerciseListEl.querySelector("[data-strength-exercise-note]")?.addEventListener("change", (event) => {
      this.updateExerciseNote(this.selectedExerciseKey, event.target.value);
    });

    exerciseListEl.querySelectorAll("[data-strength-pending-field]").forEach((input) => {
      input.addEventListener("input", () => this.updatePendingField(input.dataset.strengthPendingField, input.value));
    });

    exerciseListEl.querySelector("[data-strength-log-set]")?.addEventListener("click", () => this.logSetForSelectedExercise());

    exerciseListEl.querySelectorAll("[data-strength-set-field]").forEach((input) => {
      input.addEventListener("change", () => {
        const setIndex = Number.parseInt(input.dataset.setIndex, 10);
        const exerciseKey = input.dataset.exerciseKey;
        const field = input.dataset.strengthSetField;
        this.updateLoggedSetField(exerciseKey, setIndex, field, input.value);
      });
    });

    exerciseListEl.querySelectorAll("[data-strength-delete-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const setIndex = Number.parseInt(btn.dataset.setIndex, 10);
        this.deleteSet(btn.dataset.exerciseKey, setIndex);
      });
    });
  },

  selectExercise(exerciseKey) {
    this.selectedExerciseKey = exerciseKey;
    this.setPendingSetFromLastSet();
    this.renderWorkoutModal();
  },

  updatePendingField(field, value) {
    if (!["weight", "reps"].includes(field)) return;
    this.pendingSetInput[field] = value;
  },

  addCustomExercise(name) {
    const normalized = normalizeExerciseName(name);
    if (!normalized) {
      showToast("Enter an exercise name first.");
      return;
    }

    const exerciseKey = toExerciseKey(normalized);
    const exists = this.currentWorkout.availableExercises.some((exercise) => exercise.key === exerciseKey);
    if (!exists) {
      this.currentWorkout.availableExercises.push({ key: exerciseKey, name: normalized, source: "custom" });
    }
    this.selectedExerciseKey = exerciseKey;
    this.pendingCustomExercise = "";
    this.setPendingSetFromLastSet();
    this.saveLogsToLocalStorage();
    this.renderWorkoutModal();
  },

  updateExerciseNote(exerciseKey, value) {
    if (!exerciseKey) return;
    if (!this.currentWorkout.exerciseNotes || typeof this.currentWorkout.exerciseNotes !== "object") {
      this.currentWorkout.exerciseNotes = {};
    }
    const trimmed = value.trim();
    if (trimmed) {
      this.currentWorkout.exerciseNotes[exerciseKey] = trimmed;
    } else {
      delete this.currentWorkout.exerciseNotes[exerciseKey];
    }
    this.saveLogsToLocalStorage();
    if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
  },

  setPendingSetFromLastSet() {
    const sets = this.currentWorkout?.exerciseLogs?.[this.selectedExerciseKey] ?? [];
    const lastSet = sets[sets.length - 1];
    const latestHistoricalSet = !lastSet ? this.getLatestSetForExercise(this.selectedExerciseKey) : null;
    this.pendingSetInput = {
      weight: lastSet?.weight ?? latestHistoricalSet?.weight ?? "",
      reps: lastSet?.reps ?? latestHistoricalSet?.reps ?? "",
    };
  },

  getLatestSetForExercise(exerciseKey) {
    if (!exerciseKey) return null;
    const sessions = Object.values(this.workoutLogs || {})
      .filter((session) => session?.exerciseLogs && session.exerciseLogs[exerciseKey]?.length)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (!sessions.length) return null;
    const sets = sessions[0].exerciseLogs[exerciseKey];
    return sets[sets.length - 1] ?? null;
  },

  ensureExerciseSetList(exerciseKey) {
    if (!this.currentWorkout.exerciseLogs[exerciseKey]) {
      this.currentWorkout.exerciseLogs[exerciseKey] = [];
    }
    return this.currentWorkout.exerciseLogs[exerciseKey];
  },

  logSetForSelectedExercise() {
    if (!this.currentWorkout || !this.selectedExerciseKey) {
      showToast("Select an exercise first.");
      return;
    }

    const weight = this.pendingSetInput.weight.trim();
    const reps = this.pendingSetInput.reps.trim();
    if (!weight || !reps) {
      showToast("Enter both weight and reps before logging a set.");
      return;
    }

    const sets = this.ensureExerciseSetList(this.selectedExerciseKey);
    sets.push({ weight, reps });
    this.setPendingSetFromLastSet();
    this.saveLogsToLocalStorage();
    this.renderWorkoutModal();
  },

  updateLoggedSetField(exerciseKey, setIndex, field, value) {
    if (!exerciseKey || !["weight", "reps"].includes(field)) return;
    const sets = this.ensureExerciseSetList(exerciseKey);
    if (!sets[setIndex]) return;
    sets[setIndex][field] = value.trim();
    this.saveLogsToLocalStorage();
  },

  deleteSet(exerciseKey, setIndex) {
    const sets = this.currentWorkout?.exerciseLogs?.[exerciseKey];
    if (!sets || !sets[setIndex]) return;

    sets.splice(setIndex, 1);
    if (!sets.length) delete this.currentWorkout.exerciseLogs[exerciseKey];
    this.setPendingSetFromLastSet();
    this.saveLogsToLocalStorage();
    this.renderWorkoutModal();
  },

  finishWorkout() {
    if (!this.currentWorkout) return;
    const totalSets = Object.values(this.currentWorkout.exerciseLogs).reduce(
      (count, sets) => count + sets.length,
      0,
    );
    if (!totalSets) {
      showToast("Log at least one set before finishing.");
      return;
    }

    const workout = this.currentWorkout;
    const completedAt = Date.now();
    const logKey = `${workout.date}-${workout.workoutId}-${completedAt}`;
    this.workoutLogs[logKey] = {
      ...JSON.parse(JSON.stringify(workout)),
      timestamp: completedAt,
      syncedToBackend: false,
      syncedAt: null,
    };

    this.saveLogsToLocalStorage();
    if (isStrengthHistoryTabActive()) renderStrengthHistoryTab();
    this.closeWorkoutModal();
    this.showSummaryModal(logKey);
  },

  showSummaryModal(logKey) {
    const log = this.workoutLogs[logKey];
    if (!log) return;

    this.currentLogKey = logKey;

    const summaryEl = document.querySelector("#strength-summary-content");
    const titleEl = document.querySelector("#strength-summary-title");
    const dateEl = document.querySelector("#strength-summary-date");
    const exercisesEl = document.querySelector("#strength-summary-exercises");

    if (titleEl) titleEl.textContent = log.title;
    if (dateEl) dateEl.textContent = log.dateDisplay;

    const exercisesHtml = Object.entries(log.exerciseLogs)
      .map(([key, sets]) => {
        const exerciseName = getExerciseNameFromOptions(log, key);
        const exerciseNote = log.exerciseNotes?.[key]
          ? `<p class="summary-exercise-note">${escapeHtml(log.exerciseNotes[key])}</p>`
          : "";
        const setsHtml = sets
          .map((set) => {
            const display = `${set.weight} × ${set.reps}`;
            return `<div class="summary-exercise-set">${escapeHtml(display)}</div>`;
          })
          .join("");

        return `
          <div class="summary-exercise">
            <h4 class="summary-exercise-title">${escapeHtml(exerciseName)}</h4>
            ${exerciseNote}
            ${setsHtml}
          </div>
        `;
      })
      .join("");

    if (exercisesEl) exercisesEl.innerHTML = exercisesHtml;

    this.openSummaryModal();
  },

  loadLog(logKey) {
    const log = this.workoutLogs[logKey];
    if (!log) return;

    this.currentLogKey = logKey;
    this.currentSessionId = log.workoutId;
    this.currentDateKey = log.date;
    this.currentWorkout = {
      ...log,
      exerciseNotes: log.exerciseNotes && typeof log.exerciseNotes === "object" ? log.exerciseNotes : {},
      timestamp: Date.now(),
    };
    this.selectedExerciseKey = Object.keys(log.exerciseLogs ?? {})[0] ?? log.availableExercises?.[0]?.key ?? "";
    this.pendingCustomExercise = "";
    this.setPendingSetFromLastSet();

    this.renderWorkoutModal();
    this.openWorkoutModal();
  },

  openWorkoutModal() {
    const modal = document.querySelector("#strength-workout-modal");
    if (modal) {
      modal.hidden = false;
      modal.classList.add("is-visible");
      document.body.classList.add("has-workout-modal");
    }
  },

  closeWorkoutModal() {
    const modal = document.querySelector("#strength-workout-modal");
    if (modal) {
      modal.classList.remove("is-visible");
      modal.hidden = true;
      document.body.classList.remove("has-workout-modal");
    }
  },

  openSummaryModal() {
    const modal = document.querySelector("#strength-summary-modal");
    if (modal) {
      modal.hidden = false;
      modal.classList.add("is-visible");
      document.body.classList.add("has-summary-modal");
    }
  },

  closeSummaryModal() {
    const modal = document.querySelector("#strength-summary-modal");
    if (modal) {
      modal.classList.remove("is-visible");
      modal.hidden = true;
      document.body.classList.remove("has-summary-modal");
    }
  },

  attachModalEvents() {
    const calendar = document.querySelector("#calendar-tracker");
    if (calendar) {
      calendar.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;

        const startBtn = event.target.closest("[data-strength-workout-start]");
        if (startBtn) {
          this.startWorkout(startBtn.dataset.strengthWorkoutStart);
          return;
        }
      });
    }

    // Finish button
    const finishBtn = document.querySelector("#strength-finish-btn");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => this.finishWorkout());
    }

    // Cancel button
    const cancelBtn = document.querySelector("#strength-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.closeWorkoutModal());
    }

    // Modal backdrop and close button
    document.querySelectorAll("[data-strength-modal-close]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-strength-modal-close]")) {
          this.closeWorkoutModal();
        }
      });
    });

    // Summary modal buttons
    const doneBtn = document.querySelector("#strength-summary-done-btn");
    if (doneBtn) {
      doneBtn.addEventListener("click", () => {
        this.closeSummaryModal();
        // Sync to backend (optional)
        this.syncToBackend();
      });
    }

    const editBtn = document.querySelector("#strength-summary-edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        this.closeSummaryModal();
        if (this.currentLogKey) {
          this.loadLog(this.currentLogKey);
        } else {
          this.openWorkoutModal();
        }
      });
    }

    document.querySelectorAll("[data-summary-modal-close]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-summary-modal-close]")) {
          this.closeSummaryModal();
        }
      });
    });
  },

  syncToBackend() {
    // Strength logs are synced to Firestore via saveLogsToLocalStorage() → app-api.js
  },

  getLatestLogForDate(dateKey) {
    const logsForDate = Object.values(this.workoutLogs).filter((log) => log.date === dateKey);
    if (!logsForDate.length) return null;
    return logsForDate.sort((a, b) => b.timestamp - a.timestamp)[0];
  },
};

function initAuth() {
  // Load activities from the static JSON (updated hourly by GitHub Actions)
  ActivityManager.fetchAndRender().then(() => {
    syncActivities().catch((error) => console.warn("Sync activities failed:", error));
  });
}

function init() {
  recoverCalendarFiltersIfEverythingHidden();
  renderCalendar();
  renderPlanTab();
  renderTrackingSummary();
  attachCalendarEvents();
  attachTodayPanelEvents();
  attachSiteNavEvents();
  attachTabEvents();
  activateTab(getTabIdForHash(), { scrollToHash: Boolean(window.location.hash) });

  document.querySelector("#reset-tracking").addEventListener("click", resetTracking);

  StrengthWorkoutManager.init();
  initMetrics();
  initAuth();
  
}

function initMetrics() {
  // Fetch metrics once per session if available
  const today = new Date();
  const calendarStart = dateToKey(calendarStartDate);
  const calendarEnd = dateToKey(calendarEndDate);
  
  // Try to fetch metrics for the calendar range
  fetchDailyMetrics({ start: calendarStart, end: calendarEnd })
    .then(() => {
      renderCalendar();
    })
    .catch((error) => {
      console.warn("Metrics fetch failed, using cached data", error);
    });
}

init();