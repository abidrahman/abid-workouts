/**
 * plan.js — Fall 2026 training block (Sep 21 → Dec 31, 2026)
 *
 * Block intent
 * ------------
 * This is a *base* block, not a race build. It sets up two 70.3s in 2027
 * (Victoria, late May; Tri-Cities, late Sep) whose formal prep starts in January.
 * Four priorities, in order:
 *
 *   1. Swim — break the plateau. The limiter is aerobic capacity and training
 *      density, not raw speed. Sep 2026 data: 50s at 0:45–0:50 (1:30–1:40/100yd)
 *      but 1,750 yd continuous at 2:11/100yd with HR drifting 121 → 155. A ~35s/100
 *      spread between sprint and continuous pace is far too wide. Fix = fixed
 *      send-offs instead of "rest until ready", real threshold volume, and a 4th
 *      weekly session. Volume goes 6,200 -> 9,500 yd/wk.
 *   2. Run — rebuild from ~5 km/wk to a 5-mile race (Dec 5) without waking up the
 *      shins. MRIs were clean; CECS + shin splint history is the constraint.
 *      Volume/frequency spikes are the primary trigger, hard surfaces secondary.
 *      Single run per week until the custom orthotics arrive (~Oct 5–11).
 *   3. Strength — legs, lower leg, hips, flexibility. No back squat, no conventional
 *      deadlift. Barbell RDL and Smith-machine Bulgarian split squats are the anchors.
 *   4. Bike — hold 2–3x/wk, migrate indoors (Keiser M3i, which has power) as winter
 *      arrives. No smart trainer until the January 70.3 block.
 *
 * Standing constraint: Mt. Rainier summit attempt is on the table for early summer
 * 2027, so stair/pack work stays alive year-round even though it isn't a focus here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Block constants
// ─────────────────────────────────────────────────────────────────────────────

export const blockMeta = {
  name: "Fall 2026 Base",
  startDateKey: "2026-09-21",
  endDateKey: "2026-12-31",
  raceDateKey: "2026-12-05",
  raceName: "Redmond Reindeer Romp 5 mile",
};

/**
 * Swim pace anchors, per 100 yd in a 25 yd pool.
 *
 * CSS (Critical Swim Speed) is the single most useful number in this block. It is
 * measured in Week 1 with a 400 yd + 200 yd time trial:
 *
 *     CSS pace per 100 yd = (400 − 200) / (T400 − T200) ... expressed as time per 100
 *     i.e. CSS seconds per 100 = (T400 − T200) / 2
 *
 * Until that test is done, everything below assumes CSS ≈ 1:55/100 yd, which is the
 * best estimate from the Aug–Sep COROS data. Re-anchor after the Week 1 and Week 8
 * tests — every send-off in this plan is derived from CSS.
 */
export const swimPaceZones = [
  { zone: "Easy / recovery", pace: "2:10–2:20", cue: "Conversational. Used for warm-up, cool-down, and the technique swim." },
  { zone: "Aerobic (Z2)", pace: "2:00–2:10", cue: "The pace a long continuous swim should feel like. Nose-breathing calm." },
  { zone: "CSS / threshold", pace: "1:52–1:58", cue: "The engine of this block. Comfortably hard, repeatable for 20–40 min of work." },
  { zone: "Fast (VO2)", pace: "1:38–1:48", cue: "50s and short 100s. Hard but still with clean catch and a long stroke." },
  { zone: "Sprint", pace: "1:30–1:35", cue: "25s and the last 50 of a set. Rare — this is already a strength." },
];

/**
 * Send-offs assume CSS ≈ 1:55/100 yd. Recalculate after each CSS test:
 * threshold 100s go on CSS + 20s, aerobic 100s on CSS + 35s.
 */
export const swimSendOffs = [
  { set: "100 aerobic", sendOff: "2:30", rest: "~25 s" },
  { set: "100 threshold (CSS)", sendOff: "2:15", rest: "~18 s" },
  { set: "100 fast", sendOff: "2:30", rest: "~40 s" },
  { set: "50 aerobic", sendOff: "1:15", rest: "~13 s" },
  { set: "50 threshold (CSS)", sendOff: "1:05", rest: "~8 s" },
  { set: "50 fast", sendOff: "1:15", rest: "~25 s" },
  { set: "200 threshold (CSS)", sendOff: "4:25", rest: "~20 s" },
];

export const heartRateZones = [
  { zone: "Run — easy", range: "140–152 bpm", cue: "Every easy run lives here. If it drifts above, walk it back." },
  { zone: "Run — steady / tempo", range: "158–168 bpm", cue: "Thursday quality only, and never for long early in the block." },
  { zone: "Bike — Z2 endurance", range: "130–145 bpm", cue: "Matches the Sep 17 outdoor ride (136 bpm avg). The default bike pace." },
  { zone: "Bike — threshold", range: "155–165 bpm", cue: "Spin-bike intervals. Pair with watts once the Week 2 FTP test is done." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Narrative / overview content
// ─────────────────────────────────────────────────────────────────────────────

export const summaryCards = [
  {
    label: "Block focus",
    value: "Swim engine",
    detail: "Break the plateau: 6,200 → 9,500 yd/wk on fixed send-offs, not open rest",
  },
  {
    label: "Race",
    value: "5 mile",
    detail: "Redmond Reindeer Romp · Sat Dec 5 · ramped from ~5 km/wk without waking the shins",
  },
  {
    label: "Lower-leg rule",
    value: "1 run/wk",
    detail: "Until the custom orthotics arrive (~Oct 5–11), then +1 run every other week",
  },
  {
    label: "Next block",
    value: "70.3 prep",
    detail: "Formal Victoria build starts January — this block builds the base it stands on",
  },
];

export const phases = [
  {
    date: "Sep 21 – Oct 11",
    title: "Reset + measure",
    detail:
      "Establish the 4-swim week and the send-off habit. Test CSS and FTP so the rest of the block has real numbers. Running stays at one run per week until the orthotics land — this is the non-negotiable part.",
  },
  {
    date: "Oct 12 – Nov 8",
    title: "Build I — swim volume, run ramp",
    detail:
      "Orthotics in: running goes to two, then three sessions a week at roughly +10%/wk. Swim threshold volume climbs. The New York week is absorbed as a run-led travel block with swims front-loaded in Seattle before the flight and back-loaded after the return.",
  },
  {
    date: "Nov 9 – Dec 6",
    title: "Build II — peak swim, race specificity",
    detail:
      "Highest swim volume of the block and the retest of CSS. Running adds short 5-mile-pace work, peaks with a 10 km long run, then takes a short run-only taper into the Dec 5 race. Swimming does not taper.",
  },
  {
    date: "Dec 7 – Dec 20",
    title: "Travel maintenance",
    detail:
      "Florida and North Carolina. Swims are front-loaded in Seattle Mon–Wed to protect the 6,000 yd streak, then the trip is run- and bodyweight-led until the North Carolina gym restores a normal week.",
  },
  {
    date: "Dec 21 – Dec 31",
    title: "Winter base → January on-ramp",
    detail:
      "Edmonton with full gym access. Rebuild the rhythm, close the block with a final CSS test, and hand a clean aerobic base to the Victoria 70.3 build.",
  },
];

export const weekTargets = [
  { value: "15", label: "weeks, Sep 21 → Dec 31" },
  { value: "4", label: "swims per week (was 3)" },
  { value: "6,200→9,500", label: "weekly swim yards" },
  { value: "5→18", label: "weekly run km ramp" },
  { value: "2", label: "strength sessions per week" },
  { value: "2–3", label: "bikes per week" },
  { value: "0", label: "weeks under the 6,000 yd swim streak" },
];

export const swimMethodologyCards = [
  {
    title: "Send-offs, not open rest",
    metric: "Fixed pace clock",
    detail:
      "The Sep data shows ~45 s rest on 50s and ~70 s on 100s — a work:rest ratio near 1:1. That trains speed you already have and never stresses the aerobic system. Every main set in this block leaves on the clock, and the send-off is the workout.",
  },
  {
    title: "CSS is the anchor",
    metric: "400 + 200 TT",
    detail:
      "Critical Swim Speed replaces guesswork. Tested Week 1, retested Week 8 and Week 15. Threshold 100s go on CSS+20 s, aerobic 100s on CSS+35 s. If CSS drops 6 s/100 across the block, the plateau is broken.",
  },
  {
    title: "Close the sprint-to-distance gap",
    metric: "35 s/100 → under 20",
    detail:
      "50s at 1:30–1:40/100 next to a continuous pace of 2:11/100 is a pure endurance gap. Long continuous swims progress 1,000 → 2,400 yd, and HR drift on them is the metric that matters — not the pace.",
  },
  {
    title: "Bilateral breathing, built gradually",
    metric: "Breathe 3 by Week 8",
    detail:
      "Right-side-every-2 costs you rotation symmetry and open-water navigation. Bilateral is introduced in warm-ups and easy 50s first, never forced inside hard sets, and becomes the default for easy swimming by the second half of the block.",
  },
  {
    title: "Shoulder-safe progression",
    metric: "Paddles from Week 5",
    detail:
      "Three months of consistent swimming is still a young training age for the shoulder. Fins and snorkel come first; small paddles enter in Week 5 and stay capped at ~400 yd per session. Any shoulder pain above 2/10 means paddles come out for a week.",
  },
  {
    title: "Breaststroke as a real skill",
    metric: "200 yd every Wednesday",
    detail:
      "Useful as active recovery, as an open-water reset when a 70.3 swim gets chaotic, and as a break from freestyle-only shoulder loading. Built deliberately rather than dabbled in.",
  },
];

/**
 * The drill library. Workout notes name a drill; this is where the drill is
 * explained, so the prescription stays short and the teaching lives in one place.
 *
 * Gear rule that drives the `gear` field: a center-mount snorkel sits on the
 * centreline of your face, so it only works when you are flat and face-down.
 * Rotate past roughly 45–60° and the tube goes sideways and floods. Any drill
 * that puts you on your side is therefore fins-only.
 */
export const swimDrills = [
  {
    name: "Front kick",
    aliases: ["flutter kick on front", "front flutter kick", "kick on front"],
    gear: "Snorkel + fins",
    what: "Kick on your front, arms extended in front or flat at your sides, face down, eyes straight at the bottom.",
    feel: "Hips high and the kick coming from the hip, not the knee — small, fast, ankles loose. Your head is the rudder: lift it and the hips sink.",
    mistake: "Bending at the knee like pedalling a bike, and kicking big and slow because it feels more powerful. It isn't.",
    why: "This is the drill the snorkel exists for. With breathing removed you can actually feel where your hips are sitting.",
  },
  {
    name: "Side kick",
    aliases: ["side kick", "side-kick"],
    gear: "Fins only — no snorkel",
    what: "Kick on one side, lead arm extended, top arm resting along your hip, body rotated a full 90°, head in line with your spine.",
    feel: "Balance. You should be able to hold it without sculling to stay up. Press the lead armpit lightly down and stack the top hip directly over the bottom one.",
    mistake: "Rolling only 45° and calling it a side. Also craning your neck to look forward — keep the head in line and breathe by rolling slightly.",
    why: "At a true 90° a center-mount snorkel is lying sideways and will flood, which is why this one is fins-only.",
  },
  {
    name: "6-1-6",
    aliases: ["6-1-6 left", "6-1-6 right", "six-one-six", "6 1 6"],
    gear: "Fins only — no snorkel",
    what: "From the side-kick position: six kicks on your left side, one full stroke, six kicks on your right, repeat.",
    feel: "The hips drive the rotation and the arm just goes along with it. The single stroke should land you cleanly stacked on the other side, not halfway.",
    mistake: "Yanking yourself over with the arm, cutting the six kicks short, and quietly only rotating well to the strong side.",
    why: "Your rotation and your breathing share the same movement. This is the drill that fixes the left side — expect it to feel clumsy, that's the information.",
  },
  {
    name: "Catch-up",
    aliases: ["catch-up", "catch up"],
    gear: "Snorkel + fins",
    what: "Full freestyle, but the lead arm stays extended out front until the recovering hand touches it, then they swap.",
    feel: "A long, patient front end — one arm is always extended. This is front-quadrant timing.",
    mistake: "Letting the lead arm drop early, and crossing the centreline as the hand comes in to touch.",
    why: "Forces extension and stops the stroke from turning into a windmill where both arms are pulling at once.",
  },
  {
    name: "Fingertip drag",
    aliases: ["fingertip drag", "finger drag", "fingertip-drag"],
    gear: "Fins; snorkel optional",
    what: "Normal freestyle, but your fingertips drag along the surface through the entire recovery.",
    feel: "A high elbow and a heavy, relaxed hand. It should feel unhurried — the recovery is the rest part of the stroke.",
    mistake: "Swinging the arm wide around the side instead of leading with the elbow.",
    why: "You cannot drag your fingertips without a high elbow, so the drill enforces the shape rather than asking you to remember it.",
  },
  {
    name: "Single-arm freestyle",
    aliases: ["single-arm", "single arm", "one-arm", "single-arm freestyle"],
    gear: "Snorkel + fins",
    what: "One arm does all the work. The other stays extended in front (harder, better balance) or rests at your side (more rotation).",
    feel: "Exactly where in the pull you lose pressure. With only one arm there is nowhere to hide a weak catch.",
    mistake: "Rushing the front of the stroke, and forgetting to rotate because only one side is moving.",
    why: "The snorkel matters here — breathing during single-arm is awkward enough that it wrecks the drill.",
  },
  {
    name: "Front scull",
    aliases: ["front scull", "sculling", "scull"],
    gear: "Snorkel + pull buoy or fins",
    what: "Face down, forearms vertical, hands sweeping in and out in front of your head in small continuous figure-eights.",
    feel: "Pressure pushing back toward your feet, not down toward the bottom. This is what 'grip on the water' actually means.",
    mistake: "Pressing down, which lifts your chest, drops your legs and stalls you.",
    why: "The catch is the hardest thing in freestyle to feel. Sculling slows it down enough to notice.",
  },
  {
    name: "Closed-fist",
    aliases: ["closed-fist", "closed fist", "fist drill"],
    gear: "None",
    what: "Swim with your fists closed, then open the hands for the following length.",
    feel: "With no hand you are forced onto the forearm. The lesson is the contrast when the hand comes back.",
    mistake: "Going easy. Swim it at normal effort or there is no contrast to feel.",
    why: "Teaches the forearm to do its share instead of the hand doing everything.",
  },
  {
    name: "Breathe-3",
    aliases: ["breathe-3", "breathe 3", "bilateral breathing", "breathing every 3"],
    gear: "None",
    what: "Breathe every third stroke, which alternates the side you breathe to.",
    feel: "Even. If one side feels like a different stroke, that is the asymmetry you are here to remove.",
    mistake: "Forcing it inside a hard set. Keep it to warm-up, cool-down and easy swimming until it is automatic.",
    why: "You currently breathe right every two strokes. This is the single habit that unlocks the balanced stroke.",
  },
  {
    name: "3/5/3 breathing",
    aliases: ["3/5/3", "3-5-3", "breathing ladder"],
    gear: "None",
    what: "Three strokes between breaths, then five, then back to three, through the warm-up.",
    feel: "A long, steady exhale. The five teaches you that you are rarely short of air — you are short of exhale.",
    mistake: "Holding your breath and then gasping. Breathe out the whole time your face is down.",
  },
  {
    name: "Breaststroke timing",
    aliases: ["breaststroke timing", "breaststroke"],
    gear: "None — no snorkel",
    what: "Pull, breathe, kick, glide — deliberately one thing at a time, with a pause on the glide.",
    feel: "The glide. Breaststroke is the one stroke where doing less, later, is faster.",
    mistake: "Rushing into the next pull before the glide has happened, so you fight your own kick.",
    why: "Your second stroke should be honest, not a novelty — and the breath is part of the timing, so no snorkel.",
  },
  {
    name: "Stroke-count ladder",
    aliases: ["stroke-count ladder", "stroke count ladder", "stroke count"],
    gear: "None",
    what: "Hold a fixed number of strokes per 25, then take one stroke off each round.",
    feel: "Distance per stroke. Getting faster without adding strokes is the whole game.",
    mistake: "Gliding to hit the number. You want a better catch, not a longer pause.",
  },
  {
    name: "Sighting",
    aliases: ["sighting", "sight"],
    gear: "None — no snorkel",
    what: "Lift the eyes just above the surface every six to eight strokes, then straight back down into the breath.",
    feel: "Quick alligator eyes. The head barely moves and the rhythm does not break.",
    mistake: "Lifting the whole head, which sinks the hips and costs more than the look is worth.",
    why: "Free speed in open water next year, and cheap to build now.",
  },
  {
    name: "Paddles + pull buoy",
    aliases: ["paddles", "small paddles", "pull with paddles"],
    gear: "Small paddles + pull buoy",
    what: "Pull sets only, capped at roughly 400 yd per session, small paddles only.",
    feel: "The catch holding pressure for longer. If you feel it in the front of the shoulder, stop.",
    mistake: "Big paddles, or using them to swim faster rather than to hold a better catch.",
    why: "Three months of swimming is a young training age for a shoulder. Paddles are the first thing to drop if anything hurts above 2/10.",
  },
];

export const swimDrillProgression = [
  {
    phase: "Weeks 1–3",
    title: "Body position + the send-off habit",
    focus:
      "Get the new gear working and stop the sessions from being rest-dominated. Snorkel removes breathing as a variable so body and head position can actually be felt.",
    drills: [
      "Snorkel + fins, 6 × 50: flutter kick on front, eyes down, hips high.",
      "6-1-6 with fins, 4 × 50 per side: six kicks on the side, one stroke, six on the other.",
      "Catch-up, 4 × 50: patient lead arm, long body line, no crossover.",
      "Fingertip drag, 4 × 50: relaxed recovery, high elbow, unhurried rotation.",
      "Breathe-3 on easy 50s only — warm-up and cool-down, never inside a hard set.",
    ],
  },
  {
    phase: "Weeks 4–7",
    title: "Catch + symmetry",
    focus:
      "Build an earlier, higher-elbow catch and start balancing the stroke. Paddles arrive in Week 5 and stay capped.",
    drills: [
      "Front scull, 3 × 50 with snorkel: forearm vertical, pressure back not down.",
      "Single-arm freestyle, 4 × 50 per side: the weak (left-breathing) side gets the extra 50.",
      "Closed-fist, 4 × 50, then 50 normal — the contrast teaches the forearm to grip water.",
      "3/5/3 breathing pattern through warm-ups: three strokes, five strokes, three.",
      "Small paddles + pull buoy, max 400 yd: hold the catch, stop if the shoulder complains.",
      "Breaststroke timing, 4 × 50: pull, breathe, kick, glide — one thing at a time.",
    ],
  },
  {
    phase: "Weeks 8–15",
    title: "Hold form under fatigue",
    focus:
      "Technique that survives a hard set is the only technique that counts. Stroke count and SWOLF become the feedback loop since there is no coach on deck.",
    drills: [
      "Stroke-count ladder, 4 × 50: hold a fixed count per length, then drop it by one.",
      "Descending 100s at a fixed stroke count — get faster without adding strokes.",
      "Breathe-3 as the default for all easy swimming and the first 25 of each threshold 100.",
      "Sighting, 6 × 50: eyes just above the water every 6–8 strokes, ahead of open water next year.",
      "Breaststroke 200 continuous — an honest second stroke, not a novelty.",
      "Self-check every Monday: log the 100 that felt best and its stroke count.",
    ],
  },
];

export const swimReadinessChecklist = [
  "Fins, center-mount snorkel, and small paddles bought and in the bag by Week 2.",
  "Know your CSS number and carry the send-off table on your phone.",
  "Every main set leaves on the clock — if you are resting until you feel ready, the set is wrong.",
  "Stroke count per 25 yd logged on the best 100 of each Monday session.",
  "Breathe-3 feels automatic on easy swimming by Week 8.",
  "Breaststroke 200 continuous, relaxed, by Week 12.",
  "Shoulder pain stays ≤ 2/10 — paddles are the first thing to drop if it does not.",
];

export const runRamp = [
  { week: "Week 1", dates: "Sep 21–27", runs: "1", volume: "5 km", longRun: "5 km", note: "Pre-orthotic holding pattern. Track or soft trail only." },
  { week: "Week 2", dates: "Sep 28–Oct 4", runs: "1", volume: "6 km", longRun: "6 km", note: "Add 4 × 20 s strides on grass. Still one run." },
  { week: "Week 3", dates: "Oct 5–11", runs: "2", volume: "9 km", longRun: "5 km", note: "Second run only if the orthotics have arrived. If not, repeat Week 2." },
  { week: "Week 4", dates: "Oct 12–18", runs: "2", volume: "11 km", longRun: "6 km", note: "First week in orthotics — expect new calf soreness, that is normal." },
  { week: "Week 5", dates: "Oct 19–25", runs: "3", volume: "13 km", longRun: "5 km", note: "Third run added as three short runs, not one long one." },
  { week: "Week 6", dates: "Oct 26–Nov 1", runs: "3", volume: "14 km", longRun: "6 km", note: "New York. Low other load makes this a good run week." },
  { week: "Week 7", dates: "Nov 2–8", runs: "3", volume: "12 km", longRun: "5 km", note: "Down week. Flying home plus four swims in four days — running gives way." },
  { week: "Week 8", dates: "Nov 9–15", runs: "3", volume: "16 km", longRun: "8 km", note: "Long run reaches race distance for the first time." },
  { week: "Week 9", dates: "Nov 16–22", runs: "3", volume: "18 km", longRun: "10 km", note: "Peak run week. 10 km long run, comfortably over race distance." },
  { week: "Week 10", dates: "Nov 23–29", runs: "3", volume: "15 km", longRun: "7 km", note: "Edmonton down week. Ice and cold — indoor track is fine here." },
  { week: "Week 11", dates: "Nov 30–Dec 6", runs: "2 + race", volume: "16 km", longRun: "8 km race", note: "Run-only taper. Swim, bike, and strength continue exactly as normal." },
  { week: "Week 12", dates: "Dec 7–13", runs: "3", volume: "15 km", longRun: "6 km", note: "Florida. Easy running in warm weather, no quality work." },
  { week: "Week 13", dates: "Dec 14–20", runs: "3", volume: "17 km", longRun: "8 km", note: "North Carolina gym week. Normal structure returns." },
  { week: "Week 14", dates: "Dec 21–27", runs: "3", volume: "17 km", longRun: "8 km", note: "Edmonton. Holiday gym hours — check before planning." },
  { week: "Week 15", dates: "Dec 28–31", runs: "2", volume: "13 km", longRun: "8 km", note: "Close the block. Carry a run base into January, do not rebuild it." },
];

export const lowerLegProtocol = [
  "Soleus is the shin-splint muscle: bent-knee calf raises matter more than straight-leg ones. Both are in every strength session.",
  "Tibialis raises, 3 × 20, directly load the anterior compartment — the CECS one. Never skip these.",
  "Knee-to-wall ankle dorsiflexion test each Monday; target 10–12 cm. Losing range is an early warning.",
  "Run cadence 175–180 spm. Higher cadence cuts tibial bone load at the same pace and is the cheapest injury insurance you have.",
  "Surface priority: track > soft trail > gravel path > pavement. Pavement is the 25% trigger, so treat it as the exception.",
  "Never raise weekly run volume and the long run in the same week.",
  "Two-day rule: tightness that is still there 48 h after a run means the next run is cut, not pushed.",
  "Do not stretch aggressively into compartment pain — for CECS that makes it worse, not better.",
];

export const strengthTemplates = [
  {
    key: "A",
    title: "Strength A — RDL + posterior chain",
    focus: "Hamstrings, glutes, soleus, anti-rotation core.",
    exercises: [
      "Barbell Romanian deadlift — 4 × 6–8, 3 s eccentric",
      "Smith Bulgarian split squat — 3 × 8 per leg",
      "Hamstring curl — 3 × 12",
      "Standing calf raise (straight leg) — 4 × 12, 3 s down",
      "Tibialis raise — 3 × 20",
      "Pallof press — 3 × 12 per side",
      "Dead bug — 3 × 10 per side",
    ],
  },
  {
    key: "B",
    title: "Strength B — Bulgarian split squat + hips and core",
    focus: "Single-leg strength, hip abductors, soleus, upper-body pull for the swim.",
    exercises: [
      "Smith Bulgarian split squat — 4 × 8 per leg, heavier than Strength A",
      "Box step-up (18 in) — 3 × 10 per leg",
      "Seated calf raise (bent knee / soleus) — 4 × 15",
      "Copenhagen plank — 3 × 20–30 s per side",
      "Banded lateral walk — 3 × 15 per side",
      "Side plank with hip abduction — 3 × 10 per side",
      "Weighted pull-up or lat pulldown — 3 × 8",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Session builders
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n) => n.toLocaleString("en-US");

function swim(yards, title, note, opts = {}) {
  const minutes = opts.minutes ?? `${Math.round(yards / 45)}–${Math.round(yards / 34)} min`;
  return {
    title,
    duration: `${fmt(yards)} yd · ${minutes}`,
    categories: ["swim"],
    note: typeof note === "function" ? note(yards) : note,
    yards,
    ...opts.extra,
  };
}

function run(duration, title, note, extra = {}) {
  return { title, duration, categories: ["run"], note, ...extra };
}

function bike(duration, title, note, extra = {}) {
  return { title, duration, categories: ["bike"], note, ...extra };
}

function strength(key, note, duration = "45–55 min") {
  const template = strengthTemplates.find((item) => item.key === key);
  return {
    title: template.title,
    duration,
    categories: ["strength"],
    note,
    compactDescriptor: key === "A" ? "RDL" : "split squat",
  };
}

function mobility(duration, note, title = "Mobility + lower-leg prehab") {
  return { title, duration, categories: ["recovery"], note };
}

/** Travel strength: no barbell, no machines — bands and bodyweight only. */
function circuit(duration, note, title = "Bands + bodyweight circuit") {
  return { title, duration, categories: ["strength"], note, compactDescriptor: "circuit" };
}

function hike(duration, title, note, extra = {}) {
  return { title, duration, categories: ["hike"], note, ...extra };
}

// Reusable notes that repeat across the block.
const MOBILITY_CORE =
  "Ankle dorsiflexion (knee-to-wall), calf and soleus stretch, hip flexors, thoracic rotation, and 3 × 20 tibialis raises. Ten minutes of this beats an hour once a month.";
const TECH_SWIM_NOTE = (yards) =>
  `About ${fmt(yards)} yd total, all easy. No clock, no main set. Snorkel and fins for the first half — catch-up, fingertip drag and front scull, rotating through them — then easy 50s holding the feel. This session exists to raise frequency and keep the stroke fresh — leave the pool fresher than you arrived.`;

// ─────────────────────────────────────────────────────────────────────────────
// The 15-week plan
// ─────────────────────────────────────────────────────────────────────────────

export const planWeeks = [
  // ══ WEEK 1 ════════════════════════════════════════════════════════════════
  {
    week: 1,
    start: "2026-09-21",
    phase: "reset",
    theme: "Measure everything",
    focus:
      "Two tests and a gear reset. Nothing here should feel hard except the 400 and 200 time trials — the point is to end the week with real numbers to train off.",
    days: {
      "2026-09-21": [
        swim(
          1500,
          "Swim — CSS test (400 + 200 TT)",
          "Warm-up 400 (200 free, 4 × 50 drill). Build 4 × 50. Main: 400 yd all-out for time, 5 min full rest, then 200 yd all-out for time. Cool-down 300 easy. CSS seconds per 100 yd = (T400 − T200) ÷ 2. Write both times down — every send-off in this block comes from this number.",
        ),
        strength("A", "First session back. Leave two reps in reserve on everything — this is a re-entry week, not a test."),
      ],
      "2026-09-22": [
        run("30–35 min", "Easy run — 5 km", "Track or soft trail, nothing paved. 140–152 bpm, cadence 175–180. This is the only run this week; resist adding another."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-09-23": [
        swim(
          1600,
          "Swim — technique reset with new gear",
          "Warm-up 300. Drill 600 as 12 × 50 with fins — each drill twice: catch-up / 6-1-6 left / 6-1-6 right / fingertip drag / side kick / single-arm. Snorkel for the face-down drills only; take it off for 6-1-6 and side kick, because on your side it floods. Main 10 × 50 on 1:15 aerobic, every 4th one breathing to the left. Cool-down 200. Getting the snorkel to feel normal is the whole job today.",
        ),
        bike("45 min", "Spin bike — Z2 aerobic", "Keiser M3i, 130–145 bpm, cadence 85–95. Note your average watts — you will want the comparison after next week's FTP test."),
      ],
      "2026-09-24": [
        run("25 min", "Optional shakeout walk or easy spin", "Only if the legs feel good after Tuesday. Walking counts. Nothing that loads the shins.", { categories: ["recovery"] }),
        mobility("20 min", "Longer mobility session: hips, ankles, calves, and thoracic spine. Add 3 × 45 s soleus wall sits."),
      ],
      "2026-09-25": [
        swim(
          2100,
          "Swim — long aerobic base",
          "Warm-up 300. Main: 1,000 continuous at genuine easy-aerobic (2:05–2:10/100). Then 6 × 100 on 2:30. Cool-down 200. Watch HR on the 1,000 — if it climbs more than ~15 bpm from start to finish, you went out too hard. That drift number is the benchmark we beat all block.",
        ),
      ],
      "2026-09-26": [
        hike("2–3 hr", "Weekend aerobic — long ride or hike", "Your pick: 2–2.5 hr endurance ride or a 2–3 hr hike. Keep it genuinely aerobic; this is volume, not a workout.", { categories: ["hike", "bike"] }),
        swim(1000, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-09-27": [
        mobility("25 min", "Full mobility session plus foot intrinsics: short-foot holds, towel scrunches, and heel/toe walks. Ten minutes of this on Sundays is what keeps the anterior compartment quiet."),
        bike("40–60 min", "Easy spin (optional)", "Recovery spin only if you want the extra aerobic time. Zone 1–2, no intensity.", { categories: ["bike", "recovery"] }),
      ],
    },
  },

  // ══ WEEK 2 ════════════════════════════════════════════════════════════════
  {
    week: 2,
    start: "2026-09-28",
    phase: "reset",
    theme: "Learn the send-off",
    focus:
      "First real threshold set on the clock, and an FTP test so the bike has numbers too. Running still holds at one session — the orthotics are the gate.",
    days: {
      "2026-09-28": [
        swim(
          2200,
          "Swim — threshold 10 × 100",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: catch-up / 6-1-6 / fingertip drag / side kick. Fins throughout; snorkel off for 6-1-6 and side kick. Main: 10 × 100 at CSS on 2:15 (about 18 s rest). Then 4 × 50 breaststroke easy. Cool-down 200. If you cannot hold the last three, the send-off is too tight — add 5 s, do not slow the swimming down.",
        ),
        strength("A", "Second time through. Add load to the RDL if last week's felt easy, but keep the 3 s eccentric honest."),
      ],
      "2026-09-29": [
        run("35–40 min", "Easy run — 6 km + strides", "Track or soft trail. Finish with 4 × 20 s strides on grass, full recovery between. Strides build tendon stiffness without adding volume — they are the safest speed you can do right now."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-09-30": [
        swim(
          1900,
          "Swim — speed + bilateral breathing",
          "Warm-up 300. Drill 400 focused on breathing: 3/5/3 pattern, 6-1-6 both sides. Main 16 × 50 on 1:10, odd ones aerobic and even ones fast. Then 4 × 50 breaststroke working the pull-breathe-kick-glide timing. Cool-down 200.",
        ),
        bike("50 min", "Spin bike — 20 min FTP test", "Keiser M3i. 15 min warm-up with 3 × 1 min builds, then 20 min all-out at an even effort, then 10 min easy. FTP ≈ 95% of your 20 min average watts. Record it — every bike interval after this is a percentage of it."),
      ],
      "2026-10-01": [
        strength("B", "First Strength B. Bulgarian split squats on the Smith machine — find a load where rep 8 is hard but clean. Copenhagen planks will humble you; start on the short lever (knee on bench)."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-10-02": [
        swim(
          2200,
          "Swim — long aerobic 1,200",
          "Warm-up 300. Main: 1,200 continuous aerobic, then 4 × 100 at CSS on 2:20. Cool-down 300. Breathe to the left for the first 50 of every 200 inside the continuous swim — build the habit while the effort is low.",
        ),
      ],
      "2026-10-03": [
        hike("40 min", "Stairmaster + 10 lb pack", "Steady climb, 40 min, 10 lb in the pack. This is Rainier maintenance, not a workout — keep HR under 150 and let the legs do slow steady work."),
        swim(900, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-10-04": [
        bike("60 min", "Endurance ride — Z2", "Outdoors while the weather allows. 130–145 bpm, steady. Now that you have an FTP number, note the ride's average watts for reference."),
        mobility("20 min", "Mobility plus foot intrinsics. Check knee-to-wall and log the number."),
      ],
    },
  },

  // ══ WEEK 3 ════════════════════════════════════════════════════════════════
  {
    week: 3,
    start: "2026-10-05",
    phase: "reset",
    theme: "Second run — if the orthotics are in",
    focus:
      "The first structural change to the run week. Gate it honestly: no orthotics means you repeat Week 2's single run. Swim moves to 200s to make the threshold set longer.",
    days: {
      "2026-10-05": [
        swim(
          2100,
          "Swim — threshold 5 × 200",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: single-arm / front kick / catch-up / 6-1-6. Fins throughout; snorkel off for 6-1-6. Main: 5 × 200 at CSS on 4:25 (about 20 s rest). Cool-down 300. Longer reps at the same pace — this is where the sprint-to-distance gap actually closes.",
        ),
        strength("A", "Progress the RDL. Log the weight; you want to see this number move across the block."),
      ],
      "2026-10-06": [
        run("28–32 min", "Easy run — 4 km", "ORTHOTIC GATE: if they have not arrived, skip this and run only on Thursday. If they have, this is your first run in them — keep it short deliberately. New orthotics change how your foot loads, and calf soreness in the first two weeks is expected."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-10-07": [
        swim(
          2200,
          "Swim — speed 20 × 50",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: 6-1-6 / 3/5/3 breathing / single-arm / breathe-3. Fins throughout; snorkel off for 6-1-6, 3/5/3 breathing and breathe-3. Main: 20 × 50 on 1:10, alternating aerobic and fast. Then 4 × 50 breaststroke. Cool-down 300. The fast ones should be 1:38–1:48/100 pace, not sprints.",
        ),
        bike("50 min", "Spin bike — sweet spot 3 × 8 min", "3 × 8 min at 88–93% FTP with 4 min easy between. Cadence 85–95. First structured bike session of the block."),
      ],
      "2026-10-08": [
        run("32–36 min", "Easy run — 5 km", "Track or soft trail, easy throughout. This is the week's long run even though it is short — that is the point."),
        strength("B", "Bulgarian split squats slightly heavier. If the shins are talking after two runs this week, drop the step-ups and add a third set of soleus raises instead."),
      ],
      "2026-10-09": [
        swim(
          2400,
          "Swim — long aerobic 1,400",
          "Warm-up 300. Main: 1,400 continuous, then 4 × 100 at CSS on 2:20. Cool-down 300. Compare the HR drift on the 1,400 to Week 1's 1,000 — the target is a flatter curve, not a faster swim.",
        ),
      ],
      "2026-10-10": [
        hike("2.5–3.5 hr", "Weekend aerobic — long ride or hike", "Last of the good fall weather. If it is a hike, take the pack with 10–15 lb. If it is a ride, keep it endurance-paced.", { categories: ["hike", "bike"] }),
        swim(1100, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-10-11": [
        mobility("25 min", "Full mobility plus foot intrinsics and knee-to-wall check. End of the reset phase — take stock: CSS number, FTP number, shins quiet?"),
      ],
    },
  },

  // ══ WEEK 4 ════════════════════════════════════════════════════════════════
  {
    week: 4,
    start: "2026-10-12",
    phase: "build1",
    theme: "Build I opens",
    focus:
      "Swim threshold volume steps up to 12 × 100. Running holds at two sessions while the feet adapt to the orthotics — volume rises, frequency does not.",
    days: {
      "2026-10-12": [
        swim(
          2300,
          "Swim — threshold 12 × 100",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: front scull / single-arm / closed-fist / catch-up. Snorkel and fins throughout. Main: 12 × 100 at CSS on 2:15. Cool-down 300. Log the stroke count on the 100 that felt best — that number is your technique feedback loop for the rest of the block.",
        ),
        strength("A", "Full session, progressing loads. Keep the tibialis raises at 3 × 20 — they matter more now that running is climbing."),
      ],
      "2026-10-13": [
        run("30–35 min", "Easy run — 5 km", "Second week in the orthotics. Calves will be working differently; that is adaptation, not injury. Track or soft trail."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-10-14": [
        swim(
          1900,
          "Swim — speed 4 × (4 × 50)",
          "Warm-up 300. Drill 400 with front scull and single-arm, extra 50 on the left-breathing side. Main: 4 rounds of 4 × 50 on 1:05, descending 1 to 4 within each round, 45 s between rounds. Then 4 × 50 breaststroke. Cool-down 200.",
        ),
        bike("55 min", "Spin bike — sweet spot 3 × 10 min", "3 × 10 min at 88–93% FTP, 4 min easy between. Hold cadence above 85."),
      ],
      "2026-10-15": [
        run("38–42 min", "Easy run — 6 km", "Long run of the week. Flat, soft surface, conversational the whole way. Do not let a good day turn this into 8 km."),
        strength("B", "Progress the split squat. Copenhagen planks should be getting easier — extend the lever (foot on bench) when 30 s feels controlled."),
      ],
      "2026-10-16": [
        swim(
          2800,
          "Swim — long aerobic 1,600",
          "Warm-up 300. Main: 1,600 continuous, then 6 × 100 at CSS on 2:20. Cool-down 300. First time over 1,500 continuous in a 25 yd pool — settle in and let it be boring.",
        ),
      ],
      "2026-10-17": [
        hike("45 min", "Stairmaster + 15 lb pack", "Steady 45 min at 15 lb. Rainier maintenance continues biweekly through the block."),
        swim(1200, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-10-18": [
        bike("75–90 min", "Endurance ride — Z2", "Outdoors if the weather cooperates, spin bike if not. Steady 130–145 bpm."),
        mobility("20 min", "Mobility plus foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 5 ════════════════════════════════════════════════════════════════
  {
    week: 5,
    start: "2026-10-19",
    phase: "build1",
    theme: "Third run, paddles in",
    focus:
      "Two changes at once, both small: a third run added as three short runs rather than one long one, and small paddles introduced with a hard yardage cap.",
    days: {
      "2026-10-19": [
        swim(
          2300,
          "Swim — threshold 4 × 300",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: 6-1-6 / breaststroke timing / front scull / single-arm. Fins throughout; snorkel off for 6-1-6 and breaststroke timing. Main: 4 × 300 at CSS on 6:45. Cool-down 300. The longest threshold reps yet. Pace the first 100 of each 300 deliberately slow — going out hard is what has been capping these.",
        ),
        strength("A", "Standard Strength A."),
      ],
      "2026-10-20": [
        run("25–28 min", "Easy run — 4 km", "Short and easy. Three runs this week, all short — frequency is the adaptation we want, not distance."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-10-21": [
        swim(
          2300,
          "Swim — speed 24 × 50 + first paddles",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: closed-fist / catch-up / 6-1-6 / breaststroke timing. Fins throughout; snorkel off for 6-1-6 and breaststroke timing. PADDLES: 400 pull with small paddles and buoy, easy, holding the catch — stop immediately if the shoulder complains. Main: 24 × 50 on 1:05, alternating aerobic and fast. Then 4 × 50 breaststroke. Cool-down 200.",
        ),
        bike("55 min", "Spin bike — threshold 4 × 8 min", "4 × 8 min at 95–100% FTP, 3 min easy between. 155–165 bpm."),
      ],
      "2026-10-22": [
        run("28–30 min", "Easy run — 4 km + strides", "Second short run. Finish with 6 × 20 s strides on grass."),
        strength("B", "Standard Strength B."),
      ],
      "2026-10-23": [
        swim(
          3000,
          "Swim — long aerobic 1,800",
          "Warm-up 300. Main: 1,800 continuous, then 6 × 100 at CSS on 2:20. Cool-down 300. Biggest swim week so far — roughly {{WEEK_YARDS}} yd. If the shoulders are tired, drop the 6 × 100 rather than the continuous swim.",
        ),
      ],
      "2026-10-24": [
        hike("2.5–3.5 hr", "Weekend aerobic — long ride or hike", "Pack 15 lb if hiking.", { categories: ["hike", "bike"] }),
        swim(1200, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-10-25": [
        run("35–38 min", "Easy run — 5 km", "Third run of the week, easy. Longest of the three but still short."),
        mobility("20 min", "Mobility plus foot intrinsics. Pack for New York — running shoes, bands, goggles."),
      ],
    },
  },

  // ══ WEEK 6 ════════════════════════════════════════════════════════════════
  {
    week: 6,
    start: "2026-10-26",
    phase: "build1",
    theme: "New York — swims front-loaded",
    focus:
      "Two big Seattle swims Monday and Tuesday carry the whole week's yardage before the evening flight, then New York becomes a run-led block. The 6,000 yd streak survives on two sessions.",
    travel: "Seattle Mon–Tue · New York from Tue Oct 27 (lands 11 pm) through the following Tue",
    days: {
      "2026-10-26": [
        swim(
          3200,
          "Swim — big front-load #1",
          "Warm-up 500. Drill 400 as 8 × 50, each drill twice: front scull / single-arm / closed-fist / catch-up. Snorkel and fins throughout. Main: 3 rounds of 6 × 100 at CSS on 2:15, 1 min between rounds (1,800 total). Cool-down 500. Long session, but you have five days out of the water coming — bank it.",
        ),
        strength("A", "Full session before travel."),
      ],
      "2026-10-27": [
        swim(
          3200,
          "Swim — big front-load #2",
          "Warm-up 400. Drill 400. Main: 1,600 continuous aerobic, then 8 × 50 on 1:05. Cool-down 400. Morning session — flight is this evening. Two 3,000+ swims back to back keeps the weekly streak intact at {{WEEK_YARDS}} yd.",
        ),
        run("25 min", "Shakeout walk or easy spin", "Flight tonight. You already have a 3,000 yd swim today — walk, stretch, or spin easy rather than adding a run. Run volume this week is capped at 14 km and it is all in New York.", { categories: ["recovery"] }),
      ],
      "2026-10-28": [
        run("30 min", "Easy run — 4 km", "First New York morning after a late landing. Keep it short and easy — this is travel recovery, not training."),
        mobility("15 min", "Travel mobility: hips, calves, thoracic spine. Long flights make the ankles stiff."),
      ],
      "2026-10-29": [
        run("30–32 min", "Easy run — 4 km", "New York running is the best part of this trip. Central Park reservoir loop is 2.5 km of soft cinder — ideal surface for your shins."),
        circuit(
          "45 min",
          "Gym-optional: 3 rounds of banded RDL 15, split squat 10/leg, banded lateral walk 15/side, Copenhagen plank 20 s/side, calf raise 20, tibialis raise 20, dead bug 10/side.",
        ),
      ],
      "2026-10-30": [
        mobility("25 min", "Full mobility day. If the hotel has a gym, add an easy 30 min spin. Otherwise walk the city — it counts."),
      ],
      "2026-10-31": [
        run("42–48 min", "Long run — 6 km", "Longest run of the week. Central Park bridle path or the reservoir — stay on the soft surfaces, avoid the paved loop."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-11-01": [
        mobility("20 min", "Easy 30–40 min walk plus mobility and foot intrinsics. Deliberately not a run — three runs and 14 km is the cap this week, and you already hit it.", "Walk + mobility"),
      ],
    },
  },

  // ══ WEEK 7 ════════════════════════════════════════════════════════════════
  {
    week: 7,
    start: "2026-11-02",
    phase: "build1",
    theme: "Back-loaded return",
    focus:
      "New York Monday and Tuesday, then four swims in the four days after the flight home. Running takes a planned down week to absorb the travel and the swim cluster. No paddles this week — six days out of the water first.",
    travel: "New York Mon–Tue (flight home Tue Nov 3, 4 pm) · Seattle Wed onward",
    days: {
      "2026-11-02": [
        run("30–32 min", "Easy run — 4 km", "Last full New York morning."),
        circuit("40 min", "Same circuit as last Thursday, 3 rounds. Travel strength is about frequency, not load."),
      ],
      "2026-11-03": [
        mobility("20 min", "Travel day — mobility only, no run. Calf raises in the terminal, ankle circles on the plane. This is a planned down week: 3 runs and 12 km total.", "Travel mobility"),
      ],
      "2026-11-04": [
        swim(
          1800,
          "Swim — easy re-entry",
          "Warm-up 300. Drill 500 as 10 × 50, each drill twice: 6-1-6 / breaststroke timing / front scull / single-arm / closed-fist — rebuild the feel before asking for pace. Fins throughout; snorkel off for 6-1-6 and breaststroke timing. Main 8 × 100 on 2:30 aerobic. Cool-down 200. NO PADDLES this week; six days out of the water means the shoulders get eased back in.",
        ),
        bike("40 min", "Easy spin", "Zone 2, legs turning over after travel."),
      ],
      "2026-11-05": [
        swim(
          1800,
          "Swim — technique + light speed",
          "Warm-up 300. Drill 500 as 10 × 50, each drill twice: catch-up / 6-1-6 / 3/5/3 breathing / single-arm / breathe-3. Fins throughout; snorkel off for 6-1-6, 3/5/3 breathing and breathe-3. Main 12 × 50 on 1:15 aerobic, every third one fast. Then 4 × 50 breaststroke. Cool-down 200.",
        ),
        strength("A", "First proper lift in a week. Back the loads off about 10% — you have been doing bands."),
      ],
      "2026-11-06": [
        swim(
          1800,
          "Swim — threshold returns",
          "Warm-up 400. Drill 300 as 6 × 50, each drill twice: catch-up / 6-1-6 / breaststroke timing. Fins throughout; snorkel off for 6-1-6 and breaststroke timing. Main: 8 × 100 at CSS on 2:15. Cool-down 300. Third swim in three days — if the shoulders are heavy, cut to 6 × 100.",
        ),
        run("22–25 min", "Easy run — 3 km", "Down-week running. Deliberately short."),
      ],
      "2026-11-07": [
        swim(
          2400,
          "Swim — long aerobic 1,400",
          "Warm-up 300. Main: 1,400 continuous, then 4 × 100 at CSS on 2:20. Cool-down 300. Fourth swim in four days brings the week to about {{WEEK_YARDS}} yd — streak protected on the back half.",
        ),
        bike("75 min", "Endurance ride", "Z2, indoors or out depending on weather. Winter is arriving; start getting comfortable on the spin bike."),
      ],
      "2026-11-08": [
        run("34–38 min", "Long run — 5 km", "Easy long run to close a down week. Soft surface. Next week the long run steps up to race distance."),
        mobility("20 min", "Mobility plus foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 8 ════════════════════════════════════════════════════════════════
  {
    week: 8,
    start: "2026-11-09",
    phase: "build2",
    theme: "Retest + race distance",
    focus:
      "Halfway point. Retest CSS to see whether the send-off work has moved the number, and take the long run to 8 km — race distance — for the first time.",
    days: {
      "2026-11-09": [
        swim(
          1600,
          "Swim — CSS RETEST (400 + 200 TT)",
          "Same protocol as Week 1: warm-up 400, build 4 × 50, then 400 all-out, 5 min rest, 200 all-out. Cool-down 400. Recalculate CSS and reset every send-off in the second half of the block. Seven weeks of threshold work should show up here — 4–6 s/100 faster is a good outcome.",
        ),
        strength("A", "Standard Strength A."),
      ],
      "2026-11-10": [
        run("22–25 min", "Easy run — 3 km", "Easy. The long run is Sunday and it is the big one this week."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-11-11": [
        swim(
          2300,
          "Swim — speed 6 × (4 × 50)",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: stroke-count ladder / front scull / 6-1-6 / closed-fist. Fins throughout; snorkel off for 6-1-6. Paddles 400 pull. Main: 6 rounds of 4 × 50 on 1:00, 45 s between rounds. Then 4 × 50 breaststroke. Cool-down 200. Tighter send-off than Week 5 — this is where density shows up.",
        ),
        bike("60 min", "Spin bike — threshold 5 × 8 min", "5 × 8 min at 95–100% FTP, 3 min easy. Recheck the effort against your Week 2 FTP — if it feels easy, retest the FTP next week."),
      ],
      "2026-11-12": [
        run("32–35 min", "Quality run — 6 × 1 min (≈5 km)", "Warm-up 10 min easy. Then 6 × 1 min at 5k effort with 2 min easy jog between. Cool-down 10 min. Short reps on a track or soft trail — first real intensity of the block, and it stays short on purpose."),
        strength("B", "Standard Strength B."),
      ],
      "2026-11-13": [
        swim(
          3000,
          "Swim — long aerobic 1,800",
          "Warm-up 300. Main: 1,800 continuous at the NEW aerobic pace from Monday's retest, then 6 × 100 at the new CSS on the new send-off. Cool-down 300.",
        ),
      ],
      "2026-11-14": [
        hike("45–50 min", "Stairmaster + 20 lb pack", "Biweekly Rainier maintenance, now at 20 lb."),
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-11-15": [
        run("50–55 min", "Long run — 8 km", "Race distance for the first time. Easy pace throughout, soft surface, cadence 175–180. If the shins are tight the next morning and still tight 48 hours later, next week's long run gets cut."),
        mobility("20 min", "Thorough post-long-run mobility plus foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 9 ════════════════════════════════════════════════════════════════
  {
    week: 9,
    start: "2026-11-16",
    phase: "build2",
    theme: "Peak week",
    focus:
      "The biggest week of the block on both swim and run. Everything after this either consolidates or tapers. Do not add anything.",
    days: {
      "2026-11-16": [
        swim(
          2300,
          "Swim — threshold 6 × 200",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: sighting / breaststroke timing / stroke-count ladder / front scull. Fins throughout; snorkel off for sighting and breaststroke timing. Main: 6 × 200 at the new CSS on 4:25 (adjust to the retest). Cool-down 300. 1,200 yd of threshold — the biggest threshold block of the block.",
        ),
        strength("A", "Standard Strength A. This is a big week; if you are flat, cut a set rather than skipping."),
      ],
      "2026-11-17": [
        run("22–25 min", "Easy run — 3 km", "Easy. Save it for Sunday."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-11-18": [
        swim(
          2600,
          "Swim — speed 30 × 50",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: 6-1-6 / closed-fist / sighting / breaststroke timing. Fins throughout; snorkel off for 6-1-6, sighting and breaststroke timing. Paddles 400. Main: 30 × 50 on 1:05, alternating aerobic and fast. Then 4 × 50 breaststroke. Cool-down 200. Long 50s set — the goal is that number 30 looks like number 1.",
        ),
        bike("60 min", "Spin bike — sweet spot 4 × 12 min", "4 × 12 min at 88–93% FTP, 4 min easy. Long sweet-spot blocks are the most useful 70.3 preparation you can do indoors."),
      ],
      "2026-11-19": [
        run("35 min", "Quality run — 4 × 3 min (≈5 km)", "Warm-up 10 min. Then 4 × 3 min at 5-mile race effort (roughly 4:55–5:10/km) with 2 min easy between. Cool-down 10 min. First taste of race pace."),
        strength("B", "Standard Strength B."),
      ],
      "2026-11-20": [
        swim(
          3200,
          "Swim — long aerobic 2,000",
          "Warm-up 300. Main: 2,000 continuous, then 6 × 100 at CSS. Cool-down 300. Two thousand yards without stopping. Compare the HR drift to the Week 1 1,000 — this is the headline number for whether the plateau broke.",
        ),
      ],
      "2026-11-21": [
        hike("2.5–3 hr", "Weekend aerobic — ride or hike", "Keep it aerobic. Big week, so err easy.", { categories: ["hike", "bike"] }),
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-11-22": [
        run("62–68 min", "Long run — 10 km", "Peak long run, comfortably over race distance. Easy pace, soft surface. This is the run that makes Dec 5 feel short — and the last long one before the race."),
        mobility("25 min", "Full mobility. Pack for Edmonton."),
      ],
    },
  },

  // ══ WEEK 10 ═══════════════════════════════════════════════════════════════
  {
    week: 10,
    start: "2026-11-23",
    phase: "build2",
    theme: "Edmonton — absorb",
    focus:
      "Same gym, so nothing structural changes. This is a deliberate down week after the peak: volume drops about 20% on the run while the swim holds. Edmonton in late November means ice — the indoor track is the right call, and this is the one week treadmill running is worth tolerating.",
    travel: "Edmonton Nov 25 – Dec 1 · full gym access",
    days: {
      "2026-11-23": [
        swim(
          2400,
          "Swim — threshold 3 × 400",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: stroke-count ladder / front scull / 6-1-6 / closed-fist. Fins throughout; snorkel off for 6-1-6. Main: 3 × 400 at CSS on 8:45. Cool-down 400. Longest threshold reps of the block — essentially a rehearsal for the 70.3 swim distance, broken.",
        ),
        strength("A", "Standard Strength A."),
      ],
      "2026-11-24": [
        run("28–30 min", "Easy run — 4 km", "Last Seattle run before the flight. Soft surface."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-11-25": [
        swim(
          2100,
          "Swim — speed (Edmonton)",
          "Travel day. Warm-up 300. Drill 400 as 8 × 50, each drill twice: sighting / breaststroke timing / stroke-count ladder / front scull. Fins throughout; snorkel off for sighting and breaststroke timing. Main: 20 × 50 on 1:05 alternating. 4 × 50 breaststroke. Cool-down 200. Fit it around the flight — same gym, so no adaptation needed.",
        ),
        mobility("15 min", "Travel mobility."),
      ],
      "2026-11-26": [
        run("28–30 min", "Easy run — 4 km", "Indoor track or treadmill. Edmonton in late November is icy and dark — this is the week to accept the treadmill rather than risk a fall."),
        strength("B", "Standard Strength B."),
      ],
      "2026-11-27": [
        swim(
          3000,
          "Swim — long aerobic 1,800",
          "Warm-up 300. Main: 1,800 continuous, then 6 × 100 at CSS. Cool-down 300.",
        ),
        bike("50 min", "Spin bike — Z2", "Easy aerobic hour on the spin bike."),
      ],
      "2026-11-28": [
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
        hike("40 min", "Stairmaster + 20 lb pack", "Biweekly Rainier maintenance."),
      ],
      "2026-11-29": [
        run("45–50 min", "Long run — 7 km", "Down-week long run, shorter than last week on purpose. Indoor track if the footing is bad."),
        mobility("20 min", "Mobility plus foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 11 ═══════════════════════════════════════════════════════════════
  {
    week: 11,
    start: "2026-11-30",
    phase: "build2",
    theme: "Race week — run-only taper",
    focus:
      "The legs get fresh; nothing else changes. Swimming, biking, and strength carry on as normal because the race is 40 minutes long and is not the point of the block. Running drops in volume but keeps a little intensity so the legs stay sharp.",
    travel: "Edmonton Mon–Tue (home Dec 1) · RACE Sat Dec 5",
    days: {
      "2026-11-30": [
        swim(
          2000,
          "Swim — threshold 10 × 100 (Edmonton)",
          "Warm-up 400. Drill 300 as 6 × 50, each drill twice: 6-1-6 / closed-fist / sighting. Fins throughout; snorkel off for 6-1-6 and sighting. Main: 10 × 100 at CSS on 2:10 — the tightest send-off yet. Cool-down 300.",
        ),
        strength("A", "Last full Strength A before the race. Normal loads — a 5 mile race does not need a strength taper."),
      ],
      "2026-12-01": [
        run("25 min", "Easy run — 4 km", "Travel day back to Seattle. Easy shakeout, whenever it fits."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-12-02": [
        swim(
          2000,
          "Swim — speed",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: breaststroke timing / stroke-count ladder / front scull / 6-1-6. Fins throughout; snorkel off for breaststroke timing and 6-1-6. Main: 16 × 50 on 1:05 alternating. 4 × 50 breaststroke. Cool-down 300.",
        ),
        bike("45 min", "Spin bike — easy Z2", "Keep it aerobic this week; no threshold work with a race on Saturday."),
      ],
      "2026-12-03": [
        run("28 min", "Race primer — 4 × 90 s (≈4 km)", "Warm-up 10 min. Then 4 × 90 s at 5-mile race pace with 90 s easy between. Cool-down 8 min. Short, sharp, and well short of fatiguing — this wakes the legs up rather than tiring them."),
        swim(1600, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-12-04": [
        swim(
          1700,
          "Swim — easy aerobic",
          "Warm-up 300. Main 1,000 easy continuous. 4 × 50 breaststroke. Cool-down 200. Genuinely easy — you race tomorrow.",
        ),
        mobility("20 min", "Mobility and foot intrinsics. Lay out race kit; run in the orthotics you have trained in, not new ones."),
      ],
      "2026-12-05": [
        run("55–65 min", "RACE — Redmond Reindeer Romp 5 mile (8 km)", "Warm-up 1.5 km easy with 3 strides. Race: go out at 5:10/km for the first mile and let it come down — the classic error here is a first mile 20 s too fast. Target roughly 40–42 min if the shins are quiet; if they are not, run it as a steady effort and enjoy the morning. Cool-down 1 km.", { rescheduleLocked: true }),
      ],
      "2026-12-06": [
        swim(1200, "Recovery swim", "About 1,200 yd total, very easy. Flush the legs, loosen the shoulders, no pace work at all."),
        mobility("25 min", "Thorough post-race mobility. Calves and shins will be the sorest — be gentle, and do not stretch into compartment pain."),
      ],
    },
  },

  // ══ WEEK 12 ═══════════════════════════════════════════════════════════════
  {
    week: 12,
    start: "2026-12-07",
    phase: "travel",
    theme: "Florida — front-load, then travel light",
    focus:
      "Three Seattle swims Monday through Wednesday morning protect the 6,000 yd streak before the 4:30 pm flight. Orlando and Miami are run- and bodyweight-led with a wedding in the middle, so mornings are the only reliable window.",
    travel: "Seattle Mon–Wed (flight Wed Dec 9, 4:30 pm) · Orlando Dec 10–11 (wedding) · Miami Dec 12–13",
    days: {
      "2026-12-07": [
        swim(
          2400,
          "Swim — threshold 8 × 150",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: closed-fist / sighting / breaststroke timing / stroke-count ladder. Fins throughout; snorkel off for sighting and breaststroke timing. Main: 8 × 150 at CSS on 3:20. Cool-down 400. Post-race, so the legs are tired but the shoulders are fine — swimming is the perfect recovery training.",
        ),
        bike("45 min", "Easy spin", "Flush the legs after Saturday. No strength this week's start — let the race settle."),
      ],
      "2026-12-08": [
        swim(
          2000,
          "Swim — speed + breaststroke",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: front scull / 6-1-6 / closed-fist / sighting. Fins throughout; snorkel off for 6-1-6 and sighting. Main: 20 × 50 on 1:05 alternating. Then 200 breaststroke continuous — the Week 12 checkpoint. Cool-down 300.",
        ),
        run("28 min", "Easy run — 4 km", "First run back after the race. Easy, short, soft surface."),
      ],
      "2026-12-09": [
        swim(
          2400,
          "Swim — long aerobic 1,400",
          "Warm-up 300. Main: 1,400 continuous, then 4 × 100 at CSS. Cool-down 300. Morning session — flight is at 4:30 pm. Three swims brings the week to about 6,800 yd, so the streak holds through the trip.",
        ),
        mobility("15 min", "Pre-flight mobility."),
      ],
      "2026-12-10": [
        run("35 min", "Easy run — 5 km", "Orlando, wedding day one. Get it done early — Florida in December is pleasant at 7 am and the day will get away from you. Easy pace."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-12-11": [
        mobility("20 min", "Orlando, wedding day two. Mobility and a walk rather than a run — you ran yesterday and the week's third run is Sunday in Miami. Three runs, 15 km, is the cap for a travel week.", "Walk + mobility"),
      ],
      "2026-12-12": [
        circuit(
          "35–40 min",
          "Miami. 3 rounds of split squat 10/leg, banded RDL 15, calf raise 20, tibialis raise 20, Copenhagen plank 20 s/side, dead bug 10/side, plank 45 s. If the hotel gym has weights, swap in RDLs.",
          "Hotel gym / bodyweight circuit",
        ),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-12-13": [
        run("40 min", "Easy run — 6 km", "Miami. Beach path or boardwalk, easy. If the hotel has a pool worth swimming in, an easy 800–1,000 yd afterwards is a bonus, not a requirement."),
        mobility("15 min", "Mobility and foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 13 ═══════════════════════════════════════════════════════════════
  {
    week: 13,
    start: "2026-12-14",
    phase: "travel",
    theme: "North Carolina — normal week restored",
    focus:
      "Full gym access with a pool, so the standard four-swim structure comes straight back. Treat this as a regular training week that happens to be somewhere else.",
    travel: "North Carolina Dec 14–17 (gym + pool) · home Dec 18–20",
    days: {
      "2026-12-14": [
        swim(
          2000,
          "Swim — threshold 5 × 200",
          "Warm-up 400. Drill 300 as 6 × 50, each drill twice: breaststroke timing / stroke-count ladder / front scull. Fins throughout; snorkel off for breaststroke timing. Main: 5 × 200 at CSS on 4:25. Cool-down 300. Back in a pool after four days off — ease into the first 200.",
        ),
        strength("A", "First full lift since race week. Back the loads off slightly and rebuild."),
      ],
      "2026-12-15": [
        run("35 min", "Easy run — 5 km", "North Carolina. Explore — trails if there are any nearby."),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-12-16": [
        swim(
          2200,
          "Swim — speed 20 × 50",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: 6-1-6 / closed-fist / sighting / breaststroke timing. Fins throughout; snorkel off for 6-1-6, sighting and breaststroke timing. Main: 20 × 50 on 1:05 alternating. 4 × 50 breaststroke. Cool-down 300.",
        ),
        bike("45 min", "Spin bike — sweet spot 3 × 10 min", "3 × 10 min at 88–93% FTP, 4 min easy between."),
      ],
      "2026-12-17": [
        run("30 min", "Easy run — 4 km", "Travel day home. Morning run before the flight."),
        mobility("15 min", "Travel mobility."),
      ],
      "2026-12-18": [
        swim(
          2600,
          "Swim — long aerobic 1,600",
          "Warm-up 300. Main: 1,600 continuous, then 4 × 100 at CSS. Cool-down 300. Home pool.",
        ),
        strength("B", "Standard Strength B."),
      ],
      "2026-12-19": [
        hike("2–3 hr", "Weekend aerobic — ride, hike, or stairs", "Winter options: spin bike endurance, a shorter hike, or 45 min on the stairmaster with 20 lb.", { categories: ["hike", "bike"] }),
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-12-20": [
        run("50–55 min", "Long run — 8 km", "Back to race distance, easy. The run base is worth keeping through the holidays rather than rebuilding in January."),
        mobility("20 min", "Mobility plus foot intrinsics. Pack for Edmonton."),
      ],
    },
  },

  // ══ WEEK 14 ═══════════════════════════════════════════════════════════════
  {
    week: 14,
    start: "2026-12-21",
    phase: "winterbase",
    theme: "Edmonton — holidays, kept honest",
    focus:
      "Two Seattle days, then Edmonton through New Year. Gym holiday hours are the real risk here, not motivation — check them on arrival and move sessions rather than dropping them. Christmas Day is a genuine rest day.",
    travel: "Seattle Mon–Tue · Edmonton Dec 23 – Dec 31 · full gym access",
    days: {
      "2026-12-21": [
        swim(
          2300,
          "Swim — threshold 4 × 300",
          "Warm-up 400. Drill 400 as 8 × 50, each drill twice: stroke-count ladder / front scull / 6-1-6 / closed-fist. Fins throughout; snorkel off for 6-1-6. Main: 4 × 300 at CSS on 6:30 — tighter than Week 5's version of this set. Cool-down 300.",
        ),
        strength("A", "Standard Strength A."),
      ],
      "2026-12-22": [
        run("35 min", "Easy run — 5 km", "Last Seattle run of the year. Soft surface."),
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-12-23": [
        run("30 min", "Easy run — 4 km", "Travel day to Edmonton. Indoor track or treadmill given the conditions. CHECK THE GYM'S HOLIDAY HOURS TODAY and shuffle this week's swims to fit them."),
        mobility("15 min", "Travel mobility."),
      ],
      "2026-12-24": [
        swim(
          2400,
          "Swim — speed",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: sighting / breaststroke timing / stroke-count ladder / front scull. Fins throughout; snorkel off for sighting and breaststroke timing. Main: 24 × 50 on 1:05 alternating. 4 × 50 breaststroke. Cool-down 300. Christmas Eve — likely reduced pool hours, so go early.",
        ),
        mobility("15 min", MOBILITY_CORE),
      ],
      "2026-12-25": [
        mobility("20–30 min", "Christmas Day. Rest, stretch, walk if you feel like it. Nothing structured — this is the one fully off day in the block and taking it properly is part of the plan.", "Rest day — walk and stretch"),
      ],
      "2026-12-26": [
        swim(
          2800,
          "Swim — long aerobic 1,800",
          "Warm-up 300. Main: 1,800 continuous, then 4 × 100 at CSS. Cool-down 300.",
        ),
        strength("B", "Standard Strength B."),
      ],
      "2026-12-27": [
        run("50–55 min", "Long run — 8 km", "Indoor track if the footing is bad, outside if it is clear and you are dressed for it."),
        mobility("20 min", "Mobility plus foot intrinsics."),
      ],
    },
  },

  // ══ WEEK 15 ═══════════════════════════════════════════════════════════════
  {
    week: 15,
    start: "2026-12-28",
    phase: "winterbase",
    theme: "Close the block",
    focus:
      "A short four-day week to finish. Retest CSS on Monday so you start the Victoria build in January knowing exactly what fifteen weeks bought you, then close out easy.",
    travel: "Edmonton · full gym access",
    days: {
      "2026-12-28": [
        swim(
          1600,
          "Swim — FINAL CSS TEST (400 + 200 TT)",
          "Same protocol as Weeks 1 and 8. Warm-up 400, build 4 × 50, 400 all-out, 5 min rest, 200 all-out, cool-down 400. This is the block's headline number. Compare all three tests side by side — Week 1, Week 8, and today.",
        ),
        strength("A", "Last Strength A of the year. Log the RDL and split squat loads next to the Week 1 numbers."),
      ],
      "2026-12-29": [
        run("35–40 min", "Easy run — 5 km", "Easy. Indoor track if needed."),
        swim(1400, "Technique swim (short)", TECH_SWIM_NOTE),
      ],
      "2026-12-30": [
        swim(
          2000,
          "Swim — speed",
          "Warm-up 300. Drill 400 as 8 × 50, each drill twice: 6-1-6 / closed-fist / sighting / breaststroke timing. Fins throughout; snorkel off for 6-1-6, sighting and breaststroke timing. Main: 20 × 50 on 1:05 alternating. Then 200 breaststroke continuous. Cool-down 300.",
        ),
        bike("40 min", "Spin bike — easy aerobic (optional)", "Optional. Skip it without guilt if the legs feel the long run coming tomorrow."),
      ],
      "2026-12-31": [
        run("55–62 min", "Long run — 8 km", "Last run of the block, and the last run of the year. Easy effort, soft surface, orthotics in. Fifteen weeks ago 5 km was your entire week."),
        swim(
          2600,
          "Swim — long aerobic 2,000",
          "Warm-up 300. Main: 2,000 continuous at the new aerobic pace. Cool-down 300. Fifteen weeks ago a 1,000 was the long swim. Finish the year with double it.",
        ),
        mobility("25 min", "Final mobility session of the block. Then sit down and plan the January Victoria 70.3 build — including whether Rainier and Victoria can actually coexist."),
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Derived structures
// ─────────────────────────────────────────────────────────────────────────────

// A few notes reference their own week's swim total. Resolve that from the
// sessions themselves so the prose can never drift from the prescriptions.
planWeeks.forEach((weekEntry) => {
  const sessions = Object.values(weekEntry.days).flat();
  const weekYards = sessions.reduce((total, session) => total + (session.yards ?? 0), 0);
  sessions.forEach((session) => {
    if (session.note?.includes("{{WEEK_YARDS}}")) {
      session.note = session.note.replaceAll("{{WEEK_YARDS}}", fmt(weekYards));
    }
  });
});

/** Flattened { "YYYY-MM-DD": [session, ...] } map used by the calendar. */
export const plannedSessionsByDate = (() => {
  const map = {};
  planWeeks.forEach((weekEntry) => {
    Object.entries(weekEntry.days).forEach(([dateKey, sessions]) => {
      map[dateKey] = sessions.map((session, index) => ({
        ...session,
        id: session.id ?? `w${weekEntry.week}-${dateKey}-${index + 1}`,
        week: weekEntry.week,
      }));
    });
  });
  return map;
})();

/** Phase key lookup by date, driven by the week definitions themselves. */
export const phaseKeyByDate = (() => {
  const map = {};
  planWeeks.forEach((weekEntry) => {
    Object.keys(weekEntry.days).forEach((dateKey) => {
      map[dateKey] = weekEntry.phase;
    });
  });
  return map;
})();

export const calendarPhaseLabels = {
  reset: "Reset + measure",
  build1: "Build I — swim volume, run ramp",
  build2: "Build II — peak swim, race specificity",
  travel: "Travel maintenance",
  winterbase: "Winter base → January on-ramp",
};

/** Weekly swim yardage, computed from the sessions so it can never drift from the plan. */
export const weeklySwimYards = planWeeks.map((weekEntry) => {
  const yards = Object.values(weekEntry.days)
    .flat()
    .reduce((total, session) => total + (session.yards ?? 0), 0);
  const dates = Object.keys(weekEntry.days).sort();
  return {
    week: weekEntry.week,
    start: dates[0],
    end: dates[dates.length - 1],
    theme: weekEntry.theme,
    phase: weekEntry.phase,
    yards,
    sessions: Object.values(weekEntry.days).flat().filter((session) => session.yards).length,
  };
});

export const weekByDateKey = (() => {
  const map = {};
  planWeeks.forEach((weekEntry) => {
    Object.keys(weekEntry.days).forEach((dateKey) => {
      map[dateKey] = weekEntry;
    });
  });
  return map;
})();
