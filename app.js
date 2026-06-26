const summaryCards = [
  {
    label: "Primary goal",
    value: "Mt. Baker",
    detail: "Guided summit target: Aug 1",
  },
  {
    label: "Key mountain metric",
    value: "1,000 ft/hr",
    detail: "Uphill pace with pack, built progressively",
  },
  {
    label: "Swim target",
    value: "1,600 yd",
    detail: "Lake Union supported swim target: Sat Aug 29",
  },
  {
    label: "Month 1 focus",
    value: "Rhythm → capacity",
    detail: "Detailed June build: swim technique, strength, vertical durability, and recovery",
  },
];

const phases = [
  {
    date: "Jun 1–14",
    title: "Base + technical consistency",
    detail:
      "Establish the weekly rhythm, build swim confidence, introduce controlled uphill work, and avoid load spikes.",
  },
  {
    date: "Jun 15–Jul 19",
    title: "Mountain capacity + swim endurance",
    detail:
      "Keep the current 4-week swim ramp intact while progressing pack work, longer hikes/stairs, and continuous pool confidence.",
  },
  {
    date: "Jul 20–Aug 23",
    title: "Sustained volume + race-specific skills",
    detail:
      "Hold M/W/F swim consistency at roughly 6,000 yd per week with sighting, no-wall turns, and controlled aerobic pacing.",
  },
  {
    date: "Aug 24–31",
    title: "Taper + execution",
    detail:
      "Reduce fatigue in race week, keep light feel-for-water sessions, and execute the Lake Union supported swim on Aug 29.",
  },
];

const weekTargets = [
  { value: "12–13", label: "June swim sessions" },
  { value: "17k–22k", label: "June swim yards incl. optional" },
  { value: "700→1,250", label: "nonstop swim progression yd" },
  { value: "6–9 hr", label: "June bike volume" },
  { value: "10–11", label: "short strength sessions" },
  { value: "8", label: "uphill / hike exposures" },
  { value: "0", label: "running miles" },
];

const swimMethodologyCards = [
  {
    title: "Technique before fitness",
    metric: "Drills every swim",
    detail:
      "Each pool session now has a defined drill block so body position, breathing, catch, and timing improve alongside aerobic capacity.",
  },
  {
    title: "One long swim weekly",
    metric: "Nonstop checkpoint",
    detail:
      "The long swim extends relaxed continuous distance most weeks, with consolidation weeks so it does not become a weekly max-effort test.",
  },
  {
    title: "Open-water transfer",
    metric: "Sighting + no-wall skills",
    detail:
      "Pool confidence is converted into Lake Union readiness with sighting practice, no-wall turns, calm starts, and gear/logistics checks.",
  },
  {
    title: "Shoulder-safe build",
    metric: "Pain ≤2/10",
    detail:
      "Pull buoy and catch drills are used deliberately, while paddles and hard sets stay limited to avoid shoulder overload for a newer swimmer.",
  },
];

const swimDrillProgression = [
  {
    phase: "Weeks 1–2",
    title: "Body position + breathing",
    focus: "Reduce drag, stop lifting the head to breathe, and make the exhale automatic.",
    drills: [
      "Side kick: 4 × 25 yd, one arm extended, relaxed face in water.",
      "Catch-up drill: 4 × 25 yd, patient lead arm and long body line.",
      "Kickboard flutter kick: 4 × 25 yd easy; awareness, not a hard kick set.",
      "Pull buoy freestyle: 4 × 50 yd easy, quiet head and long exhale.",
    ],
  },
  {
    phase: "Weeks 3–5",
    title: "Catch + propulsion",
    focus: "Learn to hold water earlier so each stroke moves you farther without muscling the pull.",
    drills: [
      "Front scull or dog-paddle scull: 4 × 25 yd, feel pressure on forearms.",
      "Fingertip drag: 4 × 25 yd, relaxed recovery and smooth rotation.",
      "Single-arm freestyle: 4 × 25 yd/side with easy breathing pattern.",
      "Closed-fist freestyle: 4 × 25 yd, then normal swim to feel the catch.",
    ],
  },
  {
    phase: "Weeks 6–8",
    title: "Continuous + open-water skills",
    focus: "Make interruptions like sighting, turning, chop, and starts feel normal before Lake Union.",
    drills: [
      "Sighting 6 × 50 yd: eyes just above water every 6–12 strokes.",
      "No-wall turns: turn 2–3 yd before the wall during continuous blocks.",
      "Calm-start repeats: 4 × 100 yd, first 25 yd deliberately too easy.",
      "Wetsuit/goggle/cap practice in open water when conditions and support allow.",
    ],
  },
];

const longSwimTargets = [
  { week: "Week 1", dates: "Jun 1–7", target: "700–900 yd", focus: "Relaxed baseline; no bottom-touching." },
  { week: "Week 2", dates: "Jun 8–14", target: "900–1,000 yd", focus: "Same calm breathing, slightly longer." },
  { week: "Week 3", dates: "Jun 15–21", target: "1,000–1,100 yd", focus: "Hold pace without rushing the catch." },
  { week: "Week 4", dates: "Jun 22–28", target: "800–1,000 yd", focus: "Consolidation week; improve form, not distance." },
  { week: "Week 5", dates: "Jun 29–Jul 5", target: "1,100–1,250 yd", focus: "Extend nonstop swim only if shoulder stays calm." },
  { week: "Week 6", dates: "Jul 6–12", target: "1,250–1,400 yd", focus: "Add light sighting practice after the main block." },
  { week: "Week 7", dates: "Jul 13–19", target: "1,400–1,600 yd", focus: "Pool race-distance rehearsal with controlled effort." },
  { week: "Week 8", dates: "Jul 20–26", target: "1,600–1,850 yd", focus: "Start the post-ramp block while holding technique and calm aerobic pacing." },
  { week: "Week 9", dates: "Jul 27–Aug 2", target: "1,700–1,900 yd", focus: "Maintain weekly swim load and reinforce sighting/no-wall transfer skills." },
  { week: "Week 10", dates: "Aug 3–9", target: "1,700–1,950 yd", focus: "Sustain volume with shoulder-safe form and even pacing under mild fatigue." },
  { week: "Week 11", dates: "Aug 10–16", target: "1,800–2,000 yd", focus: "Keep the long swim steady and controlled without turning it into a race effort." },
  { week: "Week 12", dates: "Aug 17–23", target: "1,800–2,100 yd", focus: "Final high-volume week before taper; lock in confidence and rhythm." },
  { week: "Week 13", dates: "Aug 24–31", target: "1,200–1,600 yd", focus: "Race-week taper and Lake Union execution on Sat Aug 29." },
];

const monthOneWeeklyGoals = [
  {
    week: "Week 1",
    dates: "Jun 1–7",
    theme: "Rhythm / baseline",
    targets: ["3 swims", "3 main lifts", "2 uphill exposures", "2–3 aerobic sessions", "0 running miles"],
    focus:
      "Establish the pattern without chasing fatigue: technique-first swimming, crisp strength, and conservative vertical work.",
  },
  {
    week: "Week 2",
    dates: "Jun 8–14",
    theme: "Repeatable consistency",
    targets: ["3 swims", "3 strength sessions", "2 bikes", "2 uphill/hike exposures", "900–1,000 yd nonstop swim"],
    focus:
      "Repeat the rhythm with slightly more confidence. Keep vertical load modest and only progress if shin/shoulder pain stays ≤2/10.",
  },
  {
    week: "Week 3",
    dates: "Jun 15–21",
    theme: "Capacity build",
    targets: ["3 swims", "2–3 strength sessions", "2 bikes/recovery rides", "2 uphill/hike sessions", "3–4 hr long hike"],
    focus:
      "Start building mountain capacity while preserving swim quality. The long hike is the key stressor; protect freshness around it.",
  },
  {
    week: "Week 4",
    dates: "Jun 22–28",
    theme: "Consolidate / absorb",
    targets: ["3 swims", "2 strength sessions", "1–2 easy bikes", "2 vertical exposures", "800–1,000 yd form-first nonstop swim"],
    focus:
      "Back off the ambition slightly so quality, pain scores, and fatigue trend in the right direction before the July build.",
  },
  {
    week: "Week 5 bridge",
    dates: "Jun 29–30",
    theme: "Fresh transition",
    targets: ["1 swim", "1 strength session", "1 aerobic/vertical choice"],
    focus:
      "Start the next build week deliberately and use Tuesday as a recovery-informed choice rather than a forced load spike.",
  },
];

const monthOneCalendarSessions = {
  "2026-06-08": [
    {
      id: "jun-w2-mon-swim-technique",
      title: "Swim technique endurance",
      duration: "1,400–1,650 yd",
      categories: ["swim"],
      note: "Side kick/catch-up refresher, pull buoy body-line work, then smooth aerobic repeats. Leave the pool feeling like form improved.",
    },
    {
      id: "jun-w2-mon-strength-rdl",
      title: "Strength A — RDL hamstring/glute",
      duration: "35–45 min",
      categories: ["strength"],
      note: "RDL first at RPE 6–7, then posterior chain, plank progression, calves, and tibialis. No grinding.",
      compactDescriptor: "RDL",
    },
  ],
  "2026-06-09": [
    {
      id: "jun-w2-tue-bike-zone2",
      title: "Bike Zone 2 aerobic base",
      duration: "50–70 min",
      categories: ["bike"],
      note: "Mostly conversational Zone 2. Optional 3 × 6 min steady blocks only if legs feel normal.",
    },
    {
      id: "jun-w2-tue-pull-core-primer",
      title: "Pull/core primer",
      duration: "10–15 min",
      categories: ["strength"],
      note: "Easy hangs, scapular pulls, dead bugs, or light pulldowns. This should support Thursday, not pre-fatigue it.",
      compactDescriptor: "pull/core",
    },
  ],
  "2026-06-10": [
    {
      id: "jun-w2-wed-swim-catch-pace",
      title: "Swim catch + pace control",
      duration: "1,500–1,750 yd",
      categories: ["swim"],
      note: "Sculling/fingertip-drag drills before controlled 100s. Make reps 1 and last rep feel similar.",
    },
    {
      id: "jun-w2-wed-easy-stairs",
      title: "Easy stairs / incline walk",
      duration: "30–40 min",
      categories: ["hike"],
      note: "No pack unless shin pain has been quiet. Quiet feet, steady cadence, and no vertical PR chasing.",
    },
  ],
  "2026-06-11": [
    {
      id: "jun-w2-thu-strength-pullup",
      title: "Strength B — weighted pull-up",
      duration: "40–50 min",
      categories: ["strength"],
      note: "Weighted pull-up or crisp bodyweight reps first, then row, curls, core, and lower-leg prehab.",
      compactDescriptor: "weighted pull-up",
    },
    {
      id: "jun-w2-thu-recovery-spin",
      title: "Optional recovery spin",
      duration: "20–35 min",
      categories: ["bike", "recovery"],
      note: "Blood flow only. Skip if legs are heavy or tomorrow's swim/lift needs freshness.",
    },
  ],
  "2026-06-12": [
    {
      id: "jun-w2-fri-long-swim",
      title: "Long continuous swim checkpoint",
      duration: "1,600–1,800 yd",
      categories: ["swim"],
      note: "Target 900–1,000 yd relaxed nonstop. Progress only if breathing, form, and shoulders stay calm.",
    },
    {
      id: "jun-w2-fri-strength-split-squat",
      title: "Strength C — Bulgarian split squat",
      duration: "25–35 min",
      categories: ["strength"],
      note: "Light/moderate split squat focus with calves, tibialis, and core. Keep enough legs for Saturday.",
      compactDescriptor: "split squat",
    },
  ],
  "2026-06-13": [
    {
      id: "jun-w2-sat-long-hike",
      title: "Long hike / uphill simulation",
      duration: "2–3 hr",
      categories: ["hike"],
      note: "Steady Baker durability. Pack bodyweight to 15 lb only if shins are calm; practice water/electrolytes and 30–45 g carbs/hr.",
    },
  ],
  "2026-06-14": [
    {
      id: "jun-w2-sun-recovery-bike-mobility",
      title: "Recovery bike, walk, or mobility",
      duration: "30–60 min",
      categories: ["recovery", "bike"],
      note: "Choose the option that leaves you fresher. Easy spin, walk, mobility, or full rest are all successful.",
    },
  ],
  "2026-06-15": [
    {
      id: "jun-w3-mon-swim-endurance",
      title: "Swim endurance + catch drills",
      duration: "1,600–1,900 yd",
      categories: ["swim"],
      note: "Move into catch/propulsion drills, then longer aerobic repeats. Smooth water feel beats hard effort.",
    },
    {
      id: "jun-w3-mon-strength-rdl",
      title: "Strength A — RDL hamstring/glute",
      duration: "35–45 min",
      categories: ["strength"],
      note: "RDL-led posterior chain work. Keep reps crisp so the midweek uphill and weekend hike remain high quality.",
      compactDescriptor: "RDL",
    },
  ],
  "2026-06-16": [
    {
      id: "jun-w3-tue-bike-aerobic-build",
      title: "Bike aerobic build",
      duration: "60–80 min",
      categories: ["bike"],
      note: "Zone 2 with optional steady blocks. Low impact aerobic volume, not a threshold workout.",
    },
  ],
  "2026-06-17": [
    {
      id: "jun-w3-wed-swim-form-speed",
      title: "Swim form + speed control",
      duration: "1,500–1,800 yd",
      categories: ["swim"],
      note: "Moved up from Thursday to keep the swim in place this week. Short relaxed form repeats after scull/single-arm/fingertip-drag drills. Fast-looking technique, not hard swimming.",
    },
    {
      id: "jun-w3-wed-uphill-intervals",
      title: "Controlled uphill intervals / stairs",
      duration: "45–60 min",
      categories: ["hike"],
      note: "Example: 4 × 8 min steady uphill with easy walking between. Add a light pack only if pain-free.",
    },
  ],
  "2026-06-18": [
    {
      id: "jun-w3-thu-recovery-spin-flush",
      title: "Recovery spin flush",
      duration: "20–30 min",
      categories: ["bike", "recovery"],
      note: "Add easy aerobic volume after strength so Thursday is a double-workout day without compromising Friday's swim rhythm. Keep this fully conversational.",
    },
    {
      id: "jun-w3-thu-strength-pullup",
      title: "Strength B — weighted pull-up",
      duration: "35–45 min",
      categories: ["strength"],
      note: "Weighted pull-up or bodyweight pull-up with rows, curls, core, and lower-leg basics. Stop before reps slow down.",
      compactDescriptor: "weighted pull-up",
    },
  ],
  "2026-06-19": [
    {
      id: "jun-w3-fri-swim-technique-reset",
      title: "Swim technique reset",
      duration: "1,400–1,700 yd",
      categories: ["swim"],
      note: "Start the M/W/F swim rhythm with a relaxed technique-focused session. Keep it aerobic and leave enough freshness for Saturday's long hike.",
    },
    {
      id: "jun-w3-fri-strength-split-squat-light",
      title: "Strength C — split squat light",
      duration: "25–35 min",
      categories: ["strength", "recovery"],
      note: "Low-volume split squat, calf/tibialis, and mobility. Keep this fresh enough that Saturday's hike still feels like the priority.",
      compactDescriptor: "split squat",
    },
    {
      id: "jun-w3-fri-optional-easy-spin",
      title: "Optional easy spin",
      duration: "20–40 min",
      categories: ["bike", "recovery"],
      note: "Only if it improves leg feel. Skip freely if fatigue is building.",
    },
  ],
  "2026-06-20": [
    {
      id: "jun-w3-sat-long-hike-pack",
      title: "Long hike with pack progression",
      duration: "3–4 hr",
      categories: ["hike"],
      note: "Build vertical gradually. Pack 10–20 lb only if shins are quiet; practice fueling and descent control.",
    },
  ],
  "2026-06-21": [
    {
      id: "jun-w3-sun-long-bike",
      title: "Long Zone 2 bike ride",
      duration: "60–90 min",
      categories: ["bike"],
      note: "Add a steady long aerobic ride on Sundays moving forward. Keep cadence smooth and effort mostly conversational after Saturday's hike.",
    },
    {
      id: "jun-w3-sun-long-swim",
      title: "Post-hike mobility reset",
      duration: "20–40 min",
      categories: ["recovery"],
      note: "Keep Sunday non-swim: light shoulder/thoracic mobility, calf/foot care, and easy walking only if it improves Monday readiness.",
    },
  ],
  "2026-06-22": [
    {
      id: "jun-w4-mon-swim-technique",
      title: "Swim technique consolidation",
      duration: "1,400–1,700 yd",
      categories: ["swim"],
      note: "Return to body position, breathing, and catch quality. Keep the whole session comfortably controlled.",
    },
    {
      id: "jun-w4-mon-strength-rdl-maintenance",
      title: "Strength A — RDL maintenance",
      duration: "30–40 min",
      categories: ["strength"],
      note: "Lower volume than build weeks: RDL, trunk, calves, tibialis. Leave the gym fresher than usual.",
      compactDescriptor: "RDL",
    },
  ],
  "2026-06-23": [
    {
      id: "jun-w4-tue-pull-core-primer",
      title: "Pull/core primer",
      duration: "15–20 min",
      categories: ["strength"],
      note: "Add a short upper-body and trunk support session before the bike: hangs, scapular pulls, dead bugs, pulldowns, and planks. Keep it crisp, not fatiguing.",
      compactDescriptor: "pull/core",
    },
    {
      id: "jun-w4-tue-easy-bike",
      title: "Easy Zone 2 bike",
      duration: "45–60 min",
      categories: ["bike", "recovery"],
      note: "Keep cadence smooth and HR controlled. This is aerobic maintenance inside a consolidation week.",
    },
  ],
  "2026-06-24": [
    {
      id: "jun-w4-wed-swim-form",
      title: "Swim form + relaxed repeats",
      duration: "1,400–1,650 yd",
      categories: ["swim"],
      note: "Drill/swim by 25s, then relaxed 100s. No proving fitness today.",
    },
    {
      id: "jun-w4-wed-controlled-stairs",
      title: "Controlled stairs / incline walk",
      duration: "30–40 min",
      categories: ["hike"],
      note: "Technique and shin check only. Keep vertical easy and stop before calf/shin burn ramps.",
    },
  ],
  "2026-06-25": [
    {
      id: "jun-w4-thu-strength-pullup-maintenance",
      title: "Strength B — pull-up maintenance",
      duration: "30–40 min",
      categories: ["strength"],
      note: "Crisp pull-up or pulldown work, rows, light core, and mobility. Reduce volume if sleep/fatigue is poor.",
      compactDescriptor: "weighted pull-up",
    },
    {
      id: "jun-w4-thu-mobility-reset",
      title: "Mobility reset",
      duration: "10–20 min",
      categories: ["recovery"],
      note: "Shoulders, thoracic spine, calves, hips, and feet. Make Friday/Saturday feel better.",
    },
  ],
  "2026-06-26": [
    {
      id: "jun-w4-fri-easy-spin-flush",
      title: "Easy spin flush",
      duration: "20–30 min",
      categories: ["bike", "recovery"],
      note: "Pair the long swim with a low-stress recovery spin to make Friday a double-workout day while keeping Saturday's hike controlled.",
    },
    {
      id: "jun-w4-fri-long-swim-consolidation",
      title: "Long swim consolidation checkpoint",
      duration: "1,400–1,700 yd",
      categories: ["swim"],
      note: "Target 800–1,000 yd nonstop with better form than Week 3. This is a consolidation checkpoint, not a distance PR.",
    },
  ],
  "2026-06-27": [
    {
      id: "jun-w4-sat-moderate-long-hike",
      title: "Moderate long hike / uphill simulation",
      duration: "2.5–3.5 hr",
      categories: ["hike"],
      note: "Keep this controlled so Week 4 actually absorbs. Light pack only if all pain signals are quiet.",
    },
  ],
  "2026-06-28": [
    {
      id: "jun-w4-sun-long-bike",
      title: "Long Zone 2 bike ride",
      duration: "60–90 min",
      categories: ["bike"],
      note: "Sunday long bike stays in the plan even during consolidation week. Ride steady and controlled so Monday's swim and strength still feel good.",
    },
    {
      id: "jun-w4-sun-full-recovery",
      title: "Full recovery, walk, or mobility",
      duration: "20–45 min optional",
      categories: ["recovery"],
      note: "Successful if fatigue drops. Easy walk or mobility only; full rest is valid.",
    },
  ],
  "2026-06-29": [
    {
      id: "jun-w5-mon-swim-endurance",
      title: "Swim endurance restart",
      duration: "1,700–2,000 yd",
      categories: ["swim"],
      note: "Begin the next build week with smooth catch work and relaxed aerobic volume toward the next long-swim progression.",
    },
    {
      id: "jun-w5-mon-strength-rdl",
      title: "Strength A — RDL hamstring/glute",
      duration: "35–45 min",
      categories: ["strength"],
      note: "Return to normal volume only if Week 4 lowered fatigue. RDL, posterior chain, core, lower-leg prehab.",
      compactDescriptor: "RDL",
    },
  ],
  "2026-06-30": [
    {
      id: "jun-w5-tue-core-maintenance",
      title: "Core + mobility maintenance",
      duration: "20–25 min",
      categories: ["strength", "recovery"],
      note: "Add trunk stability, hips, calves, and thoracic mobility so Tuesday becomes a double-workout day without turning it into a fatigue spike.",
      compactDescriptor: "core/mobility",
    },
    {
      id: "jun-w5-tue-aerobic-choice",
      title: "Aerobic choice: bike or easy uphill",
      duration: "45–75 min",
      categories: ["bike", "hike"],
      note: "Choose based on recovery: bike if legs/shins need low impact, easy incline/stairs if everything is calm.",
    },
  ],
};

const swimReadinessChecklist = [
  "Complete a calm 1,400–1,600 yd continuous pool swim before Lake Union week.",
  "Finish 1,800–2,200 yd total pool sessions without shoulder pain above 2/10 during or after.",
  "Practice sighting every 6–12 strokes without losing breathing rhythm or dropping the hips dramatically.",
  "Test goggles, cap, wetsuit if used, anti-chafe, and cold-water response before the target swim.",
  "Use a support person/escort, clear route, weather/current check, and abort plan for the open-water attempt.",
];


const workouts = [
  {
    id: "mon-jun-1",
    day: "Monday",
    date: "Jun 1",
    title: "Swim technique + Strength A",
    duration: "90–115 min",
    categories: ["swim", "strength"],
    purpose:
      "Start the block with skill-focused swim volume and a hamstring/glute-focused RDL strength session. Keep the swim technical and leave 1–2 reps in reserve on strength work.",
    blocks: [
      {
        title: "Swim — body position + breathing, 1,300–1,500 yd",
        items: [
          "Pre-swim shoulder prep: 5 min band external rotations, band pull-aparts, arm circles, and easy lat/pec mobility.",
          "Warm-up: 200 yd easy swim + 4 × 25 yd kickboard flutter kick easy, 20 sec rest.",
          "Drill set: 4 × 25 yd side kick, switching sides by length + 4 × 25 yd catch-up drill, 20 sec rest.",
          "Tool set: 4 × 50 yd pull buoy freestyle, long body, quiet head, and continuous underwater exhale, 20 sec rest.",
          "Main: 4 × 150 yd easy/moderate at smooth breathing, 30 sec rest.",
          "Technique check: count strokes on the first and last 25 yd of the main set; aim for smooth, not forceful.",
          "Form guardrail from Day 1: if mechanics degrade late in the session, extend rest or stop the set early rather than practicing sloppy reps.",
          "Cool-down: 100–200 yd easy; 100 yd is acceptable when fatigue or form breakdown appears. No need for flip turns.",
        ],
      },
      {
        title: "Strength A — RDL hamstring/glute focus, 35–45 min",
        items: [
          "Romanian deadlift: 3 × 6–8 at RPE 6–7, hamstrings/glutes loaded, neutral spine, no grinding.",
          "Hamstring curl or hip thrust: 2–3 × 10–12 controlled.",
          "Front plank: 3 sets; progress beyond 75 sec by adding load or a harder variation before chasing very long holds.",
          "Standing calf raise: 2–3 × 10–15 with full range.",
          "Tibialis raises: 2–3 × 12–20 controlled; stop if shin symptoms spike.",
        ],
      },
      {
        title: "Day 1 note",
        items: [
          "Swim was completed but felt very hard near the end; form degraded and cooldown stopped at 100 yd.",
          "Likely contributor: low swim frequency over the prior 2 weeks. Treat Week 1 swim progression as technique-gated, not yardage-at-all-costs.",
          "Plank was too easy at 3 × 75 sec, so log set durations and progress via load, long-lever plank, or harder anti-extension work.",
        ],
      },
      {
        title: "Track",
        items: [
          "Longest relaxed continuous swim segment.",
          "Stroke count per 25 yd and whether exhale stayed calm.",
          "Which drill felt most awkward: side kick, catch-up, kickboard, or pull buoy.",
          "Shoulder response during and after swimming.",
          "RDL load/reps/RPE, plank seconds, calf/tibialis work, and shin response after lower-leg accessories.",
        ],
      },
    ],
  },
  {
    id: "tue-jun-2",
    day: "Tuesday",
    date: "Jun 2",
    title: "Bike Zone 2 + short pull/core",
    duration: "60–75 min",
    categories: ["bike", "strength"],
    purpose:
      "Use the bike as low-impact aerobic work while running is paused. Add low-fatigue pull/core volume to build toward the weighted pull-up focus day.",
    blocks: [
      {
        title: "Bike — aerobic base, 45–60 min",
        items: [
          "Keep most of the ride around 130–150 bpm.",
          "Include 5 min very easy warm-up and 5 min easy cool-down.",
          "Optional: 3 × 5 min steady at upper Zone 2, separated by 3 min easy.",
        ],
      },
      {
        title: "Accessory — pull/core primer, 10–15 min",
        items: [
          "Pull-up primer: bodyweight pull-ups, assisted pull-ups, or lat pulldown 2–3 × 6–10 easy/moderate.",
          "Scapular pull-ups or dead hangs: 3 × 5–8 reps or 15–25 sec; keep shoulders packed.",
          "Hollow hold or dead bug: 3 × 20–30 sec.",
        ],
      },
      {
        title: "Track",
        items: [
          "Average HR and perceived effort.",
          "Any lower-leg symptoms after cycling.",
        ],
      },
    ],
  },
  {
    id: "wed-jun-3",
    day: "Wednesday",
    date: "Jun 3",
    title: "Swim pace control + easy stairs",
    duration: "75–100 min",
    categories: ["swim", "hike"],
    purpose:
      "Build comfort with repeatable swim pacing, then add an easy uphill stimulus without pack weight.",
    blocks: [
      {
        title: "Swim — pace control + catch mechanics, 1,400–1,650 yd",
        items: [
          "Pre-swim shoulder prep: 5 min band work and arm circles before getting in.",
          "Warm-up: 300 yd easy as 100 swim / 50 kick repeated twice.",
          "Drill set: 4 × 25 yd front scull or dog-paddle scull + 4 × 25 yd fingertip drag, 20 sec rest.",
          "Main: 8 × 100 yd at controlled pace, 20–30 sec rest. Aim smoother than hard.",
          "Skill finish: 4 × 50 yd easy with 1–2 small sightings per length; eyes just above water, breathe after sighting.",
          "Cool-down: 100–150 yd easy.",
        ],
      },
      {
        title: "Stairmaster — easy uphill, 25–35 min",
        items: [
          "No pack this week unless legs feel excellent.",
          "Keep it conversational; do not chase a PR.",
          "Focus on quiet feet, steady cadence, and no calf/shin burn spike.",
        ],
      },
      {
        title: "Track",
        items: [
          "Best smooth 100 yd repeat pace.",
          "Whether reps 1 and 8 felt similar or effort drifted upward.",
          "Sighting quality: small peek vs. lifting the whole head.",
          "Stairmaster time, floors/vertical if available, and shin pain later that day.",
        ],
      },
    ],
  },
  {
    id: "thu-jun-4",
    day: "Thursday",
    date: "Jun 4",
    title: "Strength B + optional easy bike",
    duration: "55–90 min",
    categories: ["strength", "bike"],
    purpose:
      "Make weighted pull-ups the main back/biceps lift while keeping leg fatigue modest before the weekend mountain-specific session.",
    blocks: [
      {
        title: "Strength B — weighted pull-up back/biceps focus, 40–50 min",
        items: [
          "Weighted pull-up: 4 × 3–6 at RPE 6–8. If added load breaks form, use bodyweight reps and log BW as the load.",
          "Chest-supported row or cable row: 3 × 8–10, full scapular control.",
          "Biceps curl variation: 2–3 × 8–12 controlled.",
          "Hanging knee raise or captain's chair: 3 × 8–12.",
          "Tibialis raises or calf raises: 2 × 12–20 as lower-leg prehab.",
        ],
      },
      {
        title: "Optional bike — recovery spin, 20–40 min",
        items: [
          "Only do this if legs feel good after lifting.",
          "Keep HR mostly below 135–140 bpm.",
          "The goal is blood flow, not fitness testing.",
        ],
      },
      {
        title: "Track",
        items: [
          "Weighted pull-up added load/bodyweight, reps, and RPE for each set.",
          "Grip/biceps fatigue, shoulder response, and lower-leg accessory response.",
        ],
      },
    ],
  },
  {
    id: "fri-jun-5",
    day: "Friday",
    date: "Jun 5",
    title: "Continuous swim + Strength C light",
    duration: "80–105 min",
    categories: ["swim", "strength"],
    purpose:
      "Practice relaxed continuous swimming and use a quad/leg-focused Bulgarian split squat lift light enough to preserve the weekend hike.",
    blocks: [
      {
        title: "Swim — long continuous checkpoint, 1,500–1,700 yd",
        items: [
          "Pre-swim shoulder prep: 5 min band external rotations, scapular control, and relaxed arm swings.",
          "Warm-up: 200 yd easy + 4 × 50 yd drill/swim by 25, 20 sec rest.",
          "Drill choices for the 50s: alternate 25 catch-up / 25 swim and 25 side kick / 25 swim.",
          "Main continuous checkpoint: 700–900 yd relaxed nonstop at RPE 4–6. Touch the wall as needed, but avoid bottom-touching or long rests.",
          "After main: 4 × 100 yd easy/moderate, 20–30 sec rest; use pull buoy on 2 repeats only if it improves shoulder comfort.",
          "Progression rule: increase next week's nonstop target only if breathing stayed calm, form stayed intact late, and shoulder pain remained ≤2/10.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength C — Bulgarian split squat quad/leg focus, 25–35 min",
        items: [
          "Bulgarian split squat: 3 × 6–8/side at RPE 6–7, smooth depth and knee tracking.",
          "Step-up or leg press: 2 × 8–10/side easy/moderate if legs feel good.",
          "Standing or seated calf raise: 2–3 × 10–15 controlled.",
          "Tibialis raises: 2–3 × 12–20 controlled.",
          "Hanging knee raise or captain's chair: 3 × 8–12. No dips today.",
        ],
      },
      {
        title: "Track",
        items: [
          "Longest continuous swim distance without bottom-touching.",
          "Continuous swim RPE, breathing calmness, and whether pace faded.",
          "Shoulder comfort during the continuous block.",
          "Bulgarian split squat load/reps/RPE and next-day quad/knee/shin response.",
        ],
      },
    ],
  },
  {
    id: "sat-jun-6",
    day: "Saturday",
    date: "Jun 6",
    title: "Long hike or uphill simulation",
    duration: "90–150 min",
    categories: ["hike"],
    purpose:
      "Begin Baker-specific durability. Keep Week 1 conservative: this is a baseline session, not a sufferfest.",
    blocks: [
      {
        title: "Option A — outdoor hike",
        items: [
          "90–150 min total on steady uphill terrain if available.",
          "Pack: bodyweight only to 10–15 lb max.",
          "Hike at a pace where breathing is controlled and sustainable.",
          "Descend carefully; avoid pounding, overstriding, or racing downhill.",
        ],
      },
      {
        title: "Option B — gym simulation",
        items: [
          "Stairmaster or incline treadmill: 60–90 min total, broken into 2–3 blocks if needed.",
          "Example: 3 × 25 min uphill with 5 min easy walking between.",
          "Optional light pack only if shin pain stays ≤1/10 during warm-up.",
        ],
      },
      {
        title: "Fueling practice",
        items: [
          "Bring water and electrolytes.",
          "For sessions over 90 min, test 30–45 g carbs/hour.",
          "Note what sits well for future Baker training hikes.",
        ],
      },
      {
        title: "Track",
        items: [
          "Duration, estimated vertical gain, pack weight, calories/carbs, and shin pain after descent.",
        ],
      },
    ],
  },
  {
    id: "sun-jun-7",
    day: "Sunday",
    date: "Jun 7",
    title: "Recovery swim or easy bike",
    duration: "30–60 min",
    categories: ["recovery", "swim", "bike"],
    purpose:
      "Absorb the week. Choose the option that makes you feel better afterward, not the one that adds the most fatigue.",
    blocks: [
      {
        title: "Option A — recovery technique swim, 800–1,100 yd",
        items: [
          "Easy continuous or broken swimming only; no pace target.",
          "Include 6 × 25 yd very relaxed breathing-control drills such as bubble-bubble-breathe or 3-3-3 breathing.",
          "Optional: 4 × 50 yd pull buoy easy or 4 × 25 yd side kick with fins if available.",
          "Stop if shoulder mechanics feel off.",
        ],
      },
      {
        title: "Option B — easy bike, 45–60 min",
        items: [
          "Keep HR mostly below 135–140 bpm.",
          "High cadence, low resistance, no intervals.",
        ],
      },
      {
        title: "Optional reset",
        items: [
          "10–20 min walk and light mobility.",
          "Review notes and decide what needs adjustment for Week 2.",
        ],
      },
      {
        title: "Track",
        items: [
          "Whether the recovery swim improved feel for the water.",
          "Morning fatigue, shin pain, shoulder pain, and whether recovery improved after the session.",
        ],
      },
    ],
  },
];


const remainingJuneWorkouts = [
  {
    id: "mon-jun-8",
    day: "Monday",
    date: "Jun 8",
    title: "Swim technique endurance + Strength A",
    duration: "90–115 min",
    categories: ["swim", "strength"],
    purpose:
      "Start Week 2 by repeating the Week 1 rhythm with slightly more confident swim volume and crisp RDL work. Technique quality still gates progression.",
    blocks: [
      {
        title: "Swim — technique endurance, 1,400–1,650 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands, scapular circles, arm swings, and easy lat/pec mobility.",
          "Warm-up: 200 yd easy swim + 4 × 25 yd kickboard flutter kick easy, 20 sec rest.",
          "Drill set: 4 × 25 yd side kick + 4 × 25 yd catch-up drill, 20 sec rest. Keep head low and exhale continuous.",
          "Tool set: 4 × 50 yd pull buoy freestyle, long line, relaxed neck, 20 sec rest.",
          "Main: 4–5 × 150 yd easy/moderate at RPE 4–6, 25–35 sec rest. Add the 5th rep only if form is still quiet.",
          "Cool-down: 100–200 yd easy. Stop at 100 yd if mechanics fade instead of practicing sloppy strokes.",
        ],
      },
      {
        title: "Strength A — RDL hamstring/glute focus, 35–45 min",
        items: [
          "Romanian deadlift: 3 × 6–8 at RPE 6–7. Add load only if all Week 1 reps were clean and back position stayed neutral.",
          "Hamstring curl or hip thrust: 2–3 × 10–12 controlled.",
          "Front plank: 3 sets; progress with load, long-lever position, or harder bracing before extending past ~90 sec.",
          "Standing calf raise: 2–3 × 10–15 with full range and a pause at the top.",
          "Tibialis raises: 2–3 × 12–20 controlled; stop if shin symptoms spike.",
        ],
      },
      {
        title: "Track",
        items: [
          "Total yards completed and longest smooth continuous segment.",
          "Whether breathing stayed calm through the last 150 yd repeat.",
          "RDL load/reps/RPE, plank variation/seconds, calf/tibialis response, and shoulder/shin pain later in the day.",
        ],
      },
    ],
  },
  {
    id: "tue-jun-9",
    day: "Tuesday",
    date: "Jun 9",
    title: "Bike Zone 2 + pull/core primer",
    duration: "60–85 min",
    categories: ["bike", "strength"],
    purpose:
      "Accumulate low-impact aerobic volume without adding run stress, then add a short pull/core primer that supports Thursday instead of creating soreness.",
    blocks: [
      {
        title: "Bike — Zone 2 aerobic base, 50–70 min",
        items: [
          "Warm up 8–10 min very easy, then settle into conversational Zone 2.",
          "Main option: steady Zone 2 throughout, or 3 × 6 min upper Zone 2 with 3 min very easy between if legs feel normal.",
          "Keep cadence smooth and resistance moderate; avoid threshold surges or standing climbs.",
          "Cool down 5–8 min easy until breathing is relaxed.",
        ],
      },
      {
        title: "Accessory — pull/core primer, 10–15 min",
        items: [
          "Dead hang or active hang: 3 × 15–25 sec with shoulders packed.",
          "Scapular pull-ups or easy lat pulldown: 2–3 × 6–10, RPE 5–6.",
          "Dead bug or hollow hold: 3 × 20–35 sec with low back controlled.",
          "Optional band external rotations: 2 × 12–15/side for shoulder balance.",
        ],
      },
      {
        title: "Track",
        items: [
          "Bike duration, average HR, and whether the steady blocks stayed conversational.",
          "Grip/shoulder response from hangs or pulldowns.",
          "Lower-leg symptoms after cycling and next-morning fatigue.",
        ],
      },
    ],
  },
  {
    id: "wed-jun-10",
    day: "Wednesday",
    date: "Jun 10",
    title: "Swim catch + pace control + easy stairs",
    duration: "80–105 min",
    categories: ["swim", "hike"],
    purpose:
      "Improve the catch and pacing repeatability, then touch uphill mechanics without making this the week's key vertical stressor.",
    blocks: [
      {
        title: "Swim — catch + pace control, 1,500–1,750 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and relaxed mobility.",
          "Warm-up: 300 yd easy as 100 swim / 50 kick repeated twice.",
          "Drill set: 4 × 25 yd front scull or dog-paddle scull + 4 × 25 yd fingertip drag, 20 sec rest.",
          "Main: 6–8 × 100 yd controlled with 20–30 sec rest. Reps 1 and last should feel similar.",
          "Skill finish: 4 × 50 yd easy with 1–2 tiny sightings per length; breathe immediately after sighting.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Stairs / incline walk — easy uphill, 30–40 min",
        items: [
          "No pack unless shin pain has been quiet for several days.",
          "Keep effort conversational; use quiet feet and steady cadence.",
          "Stop early if calf/shin burn ramps or gait changes.",
        ],
      },
      {
        title: "Track",
        items: [
          "Most repeatable 100 yd pace and whether effort drifted upward.",
          "Sighting quality: tiny peek vs. lifting the whole head.",
          "Stair time, floors/vertical if available, and shin response later that day.",
        ],
      },
    ],
  },
  {
    id: "thu-jun-11",
    day: "Thursday",
    date: "Jun 11",
    title: "Strength B + optional recovery spin",
    duration: "50–85 min",
    categories: ["strength", "bike", "recovery"],
    purpose:
      "Make weighted pull-ups the primary strength stimulus while keeping the optional bike truly restorative before Friday/Saturday.",
    blocks: [
      {
        title: "Strength B — weighted pull-up back/biceps focus, 40–50 min",
        items: [
          "Weighted pull-up: 4 × 3–6 at RPE 6–8. Use bodyweight or band assistance if added load changes form.",
          "Chest-supported row or cable row: 3 × 8–10 with full scapular control.",
          "Biceps curl variation: 2–3 × 8–12 controlled; stop before elbow/forearm irritation.",
          "Hanging knee raise or captain's chair: 3 × 8–12 without swinging.",
          "Tibialis raises or calf raises: 2 × 12–20 as lower-leg prehab.",
        ],
      },
      {
        title: "Optional bike — recovery spin, 20–35 min",
        items: [
          "Skip if legs are heavy, sleep was poor, or Friday needs freshness.",
          "Keep HR mostly below 135–140 bpm with high cadence and low resistance.",
          "Finish feeling looser, not trained.",
        ],
      },
      {
        title: "Track",
        items: [
          "Pull-up load/bodyweight, reps, RPE, and whether chin-over-bar stayed consistent.",
          "Shoulder, elbow, and grip response after the session.",
          "If you spin, note whether it improved or worsened leg feel.",
        ],
      },
    ],
  },
  {
    id: "fri-jun-12",
    day: "Friday",
    date: "Jun 12",
    title: "Long continuous swim + Strength C",
    duration: "85–110 min",
    categories: ["swim", "strength"],
    purpose:
      "Extend the relaxed nonstop swim target only if form stays intact, then complete a light/moderate split-squat session that does not compromise Saturday.",
    blocks: [
      {
        title: "Swim — long continuous checkpoint, 1,600–1,800 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands, scapular control, arm swings.",
          "Warm-up: 200 yd easy + 4 × 50 yd drill/swim by 25, 20 sec rest.",
          "Drill choices: catch-up, side kick, or fingertip drag — choose the one that improves body line fastest.",
          "Main continuous checkpoint: 900–1,000 yd relaxed nonstop at RPE 4–6. Touch the wall, but avoid bottom-touching or long rests.",
          "After main: 3–4 × 100 yd easy/moderate, 20–30 sec rest. Use pull buoy only if it improves alignment and shoulder comfort.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength C — Bulgarian split squat, 25–35 min",
        items: [
          "Bulgarian split squat: 3 × 6–8/side at RPE 6–7, smooth depth, knee tracking, and no grind.",
          "Step-up or leg press: 2 × 8–10/side easy/moderate only if legs feel springy.",
          "Standing or seated calf raise: 2–3 × 10–15 controlled.",
          "Tibialis raises: 2–3 × 12–20 controlled.",
          "Hanging knee raise or captain's chair: 3 × 8–12.",
        ],
      },
      {
        title: "Track",
        items: [
          "Longest continuous swim distance, RPE, and whether breathing stayed calm late.",
          "Shoulder comfort during and after the nonstop block.",
          "Split squat load/reps/RPE and next-day quad/knee/shin response.",
        ],
      },
    ],
  },
  {
    id: "sat-jun-13",
    day: "Saturday",
    date: "Jun 13",
    title: "Long hike / uphill simulation",
    duration: "2–3 hr",
    categories: ["hike"],
    purpose:
      "Build Baker durability with controlled time on feet, early fueling practice, and conservative pack progression.",
    blocks: [
      {
        title: "Option A — outdoor hike, 2–3 hr",
        items: [
          "Choose steady uphill terrain rather than technical downhill or speed goals.",
          "Pack: bodyweight to 15 lb only if shins have been quiet; otherwise keep it unweighted.",
          "Target effort: sustainable, nasal/conversational most of the time.",
          "Descend carefully with short steps; do not race downhill.",
        ],
      },
      {
        title: "Option B — gym uphill simulation, 90–120 min",
        items: [
          "Stairmaster or incline treadmill in 2–4 blocks, such as 3 × 30 min with 5 min easy between.",
          "Light pack only if warm-up is pain-free and gait is normal.",
          "Keep cadence steady; avoid chasing floors or a vertical PR.",
        ],
      },
      {
        title: "Fueling practice",
        items: [
          "Bring water and electrolytes.",
          "For sessions over 90 min, practice 30–45 g carbs/hour.",
          "Note what food and drink sits well for longer July hikes.",
        ],
      },
      {
        title: "Track",
        items: [
          "Duration, estimated vertical gain, pack weight, carbs/hour, fluids, and shin pain after descent.",
        ],
      },
    ],
  },
  {
    id: "sun-jun-14",
    day: "Sunday",
    date: "Jun 14",
    title: "Recovery bike, walk, or mobility",
    duration: "30–60 min",
    categories: ["recovery", "bike"],
    purpose:
      "Absorb Week 2. The right choice is the one that leaves Monday better, not the one that adds volume.",
    blocks: [
      {
        title: "Option A — recovery spin, 30–60 min",
        items: [
          "High cadence, low resistance, HR mostly below 135–140 bpm.",
          "No intervals, no hills, and no chasing average speed.",
        ],
      },
      {
        title: "Option B — walk + mobility, 20–45 min",
        items: [
          "Easy walk, then calves, feet, hips, thoracic spine, and shoulders.",
          "If fatigue is high, choose full rest and light mobility only.",
        ],
      },
      {
        title: "Track",
        items: [
          "Morning fatigue, shin/shoulder pain, and whether the recovery choice improved how you felt.",
        ],
      },
    ],
  },
  {
    id: "mon-jun-15",
    day: "Monday",
    date: "Jun 15",
    title: "Swim endurance + Strength A",
    duration: "95–120 min",
    categories: ["swim", "strength"],
    purpose:
      "Begin the capacity-build phase with catch-focused swim volume and RDL strength that supports, rather than competes with, the weekend hike.",
    blocks: [
      {
        title: "Swim — endurance + catch drills, 1,600–1,900 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and mobility.",
          "Warm-up: 300 yd easy as 200 swim + 4 × 25 kick or drill.",
          "Drill set: 4 × 25 yd front scull + 4 × 25 yd fingertip drag + 4 × 25 yd single-arm freestyle by side, 20 sec rest.",
          "Main: 3 × 300 yd easy/moderate with 45 sec rest, or 6 × 150 yd if form is better in shorter repeats.",
          "Finish: 4 × 50 yd relaxed negative-split feel — second 25 smooth, not hard.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength A — RDL posterior chain, 35–45 min",
        items: [
          "Romanian deadlift: 3 × 6–8 at RPE 6–7. Keep bar path close and reps identical.",
          "Hamstring curl or hip thrust: 2–3 × 8–12.",
          "Loaded plank or long-lever plank: 3 sets, stop before bracing quality fades.",
          "Calf raise: 2–3 × 10–15.",
          "Tibialis raises: 2–3 × 12–20.",
        ],
      },
      {
        title: "Track",
        items: [
          "Total swim yards and which catch drill made freestyle feel better.",
          "Average feel across the 300s or 150s — did pace/effort drift?",
          "RDL load/reps/RPE, trunk variation, lower-leg accessory response, and shoulder pain after swimming.",
        ],
      },
    ],
  },
  {
    id: "tue-jun-16",
    day: "Tuesday",
    date: "Jun 16",
    title: "Bike aerobic build",
    duration: "60–80 min",
    categories: ["bike"],
    purpose:
      "Build aerobic volume with low impact while preserving lower legs for Wednesday vertical and Saturday's longer hike.",
    blocks: [
      {
        title: "Bike — aerobic build, 60–80 min",
        items: [
          "Warm up 10 min easy.",
          "Main: 40–55 min Zone 2. Optional: include 4 × 6 min steady upper Zone 2 with 3 min easy between if legs feel normal.",
          "Keep cadence smooth and avoid high-torque grinding.",
          "Cool down 5–10 min easy.",
        ],
      },
      {
        title: "Optional reset",
        items: [
          "5–10 min calves, hips, thoracic spine, and shoulders after the ride.",
          "If shin/calf tightness appears, add gentle foot/ankle mobility rather than more load.",
        ],
      },
      {
        title: "Track",
        items: [
          "Bike duration, average HR, RPE, and whether the steady blocks stayed aerobic.",
          "Leg freshness afterward and next-morning shin/calf status.",
        ],
      },
    ],
  },
  {
    id: "wed-jun-17",
    day: "Wednesday",
    date: "Jun 17",
    title: "Controlled uphill intervals / stairs",
    duration: "45–60 min",
    categories: ["hike"],
    purpose:
      "Introduce structured vertical work while keeping the effort controlled and pain-gated.",
    blocks: [
      {
        title: "Uphill intervals — controlled vertical, 45–60 min",
        items: [
          "Warm up 8–10 min easy walk or very easy stairs.",
          "Main: 4 × 8 min steady uphill at RPE 5–6 with 3–4 min easy walking between.",
          "Use bodyweight or a very light pack only if shins are quiet during warm-up.",
          "Cool down 8–10 min easy walking and calf/foot mobility.",
        ],
      },
      {
        title: "Technique focus",
        items: [
          "Quiet feet, short steps, tall posture, and steady breathing.",
          "Downhill or stair descent should be careful and controlled; no bounding.",
        ],
      },
      {
        title: "Track",
        items: [
          "Total time, interval count, floors/vertical if available, pack weight, and RPE.",
          "Shin/calf response during, later that day, and the next morning.",
        ],
      },
    ],
  },
  {
    id: "thu-jun-18",
    day: "Thursday",
    date: "Jun 18",
    title: "Swim form/speed control + Strength B",
    duration: "85–110 min",
    categories: ["swim", "strength"],
    purpose:
      "Use shorter swim repeats to sharpen form without high fatigue, then complete crisp pull-up-focused strength.",
    blocks: [
      {
        title: "Swim — form + speed control, 1,500–1,800 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and mobility.",
          "Warm-up: 300 yd easy.",
          "Drill set: 4 × 25 yd scull + 4 × 25 yd single-arm freestyle + 4 × 25 yd fingertip drag, 20 sec rest.",
          "Main: 12 × 50 yd smooth with 15–25 sec rest. Every 4th 50 can be a relaxed faster-looking rep, not a hard sprint.",
          "Aerobic finish: 4 × 100 yd easy/moderate, 20–30 sec rest.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength B — weighted pull-up, 35–45 min",
        items: [
          "Weighted pull-up or bodyweight pull-up: 4 × 3–6 at RPE 6–8; stop before reps slow dramatically.",
          "Chest-supported row or cable row: 3 × 8–10.",
          "Biceps curl variation: 2 × 8–12.",
          "Hanging knee raise or dead bug: 3 × 8–12 or 20–35 sec.",
          "Tibialis raises: 2 × 12–20 if lower legs feel calm.",
        ],
      },
      {
        title: "Track",
        items: [
          "Which swim drill improved the catch or body line most.",
          "Whether the 50s stayed relaxed and technically clean.",
          "Pull-up load/reps/RPE and shoulder/elbow response after combining swim + pulling.",
        ],
      },
    ],
  },
  {
    id: "fri-jun-19",
    day: "Friday",
    date: "Jun 19",
    title: "Strength C light + optional easy spin",
    duration: "30–75 min",
    categories: ["strength", "bike", "recovery"],
    purpose:
      "Keep the split-squat pattern alive with deliberately low volume, then use an optional spin only if it improves leg feel before the long hike.",
    blocks: [
      {
        title: "Strength C — split squat light, 25–35 min",
        items: [
          "Bulgarian split squat: 2–3 × 6–8/side at RPE 5–6. Leave plenty in reserve.",
          "Step-up, sled, or leg press: 1–2 × 8–10 easy only if legs feel fresh.",
          "Calf raise: 2 × 10–15 controlled.",
          "Tibialis raises: 2 × 12–20 controlled.",
          "Mobility: calves, quads, hip flexors, and feet for 5–8 min.",
        ],
      },
      {
        title: "Optional bike — easy spin, 20–40 min",
        items: [
          "Only do this if it improves leg feel.",
          "High cadence, low resistance, HR below 135–140 bpm.",
          "Skip freely if fatigue is building or Saturday logistics need attention.",
        ],
      },
      {
        title: "Track",
        items: [
          "Split squat load/reps/RPE and whether legs felt fresher or duller afterward.",
          "If spinning, note duration, HR, and effect on soreness.",
        ],
      },
    ],
  },
  {
    id: "sat-jun-20",
    day: "Saturday",
    date: "Jun 20",
    title: "Long hike with pack progression",
    duration: "3–4 hr",
    categories: ["hike"],
    purpose:
      "Make the long hike the key Week 3 stressor: longer time on feet, controlled vertical, fueling practice, and careful descent mechanics.",
    blocks: [
      {
        title: "Long hike — outdoor preferred, 3–4 hr",
        items: [
          "Pick terrain with sustained climbing and manageable descent rather than technical scrambling.",
          "Pack: 10–20 lb only if shins have stayed quiet; otherwise stay lighter and extend duration conservatively.",
          "Keep effort mostly RPE 4–6. You should be able to talk in short sentences.",
          "Practice poles/boots/pack fit if relevant to the Baker gear list.",
          "Descend with short, controlled steps and avoid pounding.",
        ],
      },
      {
        title: "Fueling + hydration rehearsal",
        items: [
          "Target 30–45 g carbs/hour and steady fluids/electrolytes.",
          "Eat early before you feel depleted.",
          "Note food tolerance, pack access, and any stomach issues.",
        ],
      },
      {
        title: "Track",
        items: [
          "Duration, vertical gain, pack weight, footwear, carbs/hour, fluids, RPE, and shin/knee response after descent.",
        ],
      },
    ],
  },
  {
    id: "sun-jun-21",
    day: "Sunday",
    date: "Jun 21",
    title: "Long continuous swim checkpoint",
    duration: "1,700–2,000 yd",
    categories: ["swim", "recovery"],
    purpose:
      "Use swimming as a technique-first checkpoint after the long hike. The nonstop target is optional if fatigue or shoulders are not ready.",
    blocks: [
      {
        title: "Swim — long continuous checkpoint, 1,700–2,000 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and gentle mobility.",
          "Warm-up: 300 yd easy with a few 25 yd drill lengths mixed in.",
          "Drill primer: 4 × 25 yd scull or catch-up + 4 × 25 yd easy swim, 20 sec rest.",
          "Main continuous checkpoint: 1,000–1,100 yd relaxed nonstop only if shoulders and post-hike fatigue are calm.",
          "If fatigue is high: replace the nonstop block with 5–6 × 150 yd easy with 30 sec rest.",
          "Cool-down: 100–200 yd easy or kick/pull buoy if it improves comfort.",
        ],
      },
      {
        title: "Recovery focus",
        items: [
          "Keep the entire session RPE 4–6; no proving fitness today.",
          "Prioritize food, hydration, and sleep after the session.",
        ],
      },
      {
        title: "Track",
        items: [
          "Longest nonstop swim, shoulder response, post-hike fatigue, and whether the swim improved recovery.",
        ],
      },
    ],
  },
  {
    id: "mon-jun-22",
    day: "Monday",
    date: "Jun 22",
    title: "Swim technique consolidation + Strength A maintenance",
    duration: "80–105 min",
    categories: ["swim", "strength"],
    purpose:
      "Start the consolidation week by improving swim form and reducing strength volume so the body absorbs the Week 3 hike.",
    blocks: [
      {
        title: "Swim — technique consolidation, 1,400–1,700 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and relaxed mobility.",
          "Warm-up: 250–300 yd easy.",
          "Drill set: 4 × 25 yd side kick + 4 × 25 yd catch-up + 4 × 25 yd scull or fingertip drag, 20 sec rest.",
          "Main: 6 × 100 yd easy/moderate with 20–30 sec rest, aiming for smoother strokes rather than faster splits.",
          "Finish: 4 × 50 yd easy with calm exhale and low head position.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength A — RDL maintenance, 30–40 min",
        items: [
          "Romanian deadlift: 2–3 × 6–8 at RPE 5–6. This is not a load PR week.",
          "Hamstring curl or hip thrust: 2 × 10–12 controlled.",
          "Front plank or dead bug: 2–3 controlled sets.",
          "Calf raise: 2 × 10–15.",
          "Tibialis raises: 2 × 12–20, pain-gated.",
        ],
      },
      {
        title: "Track",
        items: [
          "Whether swim form improved as the session progressed.",
          "RDL maintenance load/reps/RPE and whether legs felt better or heavier after lifting.",
          "Shoulder/shin pain and overall fatigue trend after Week 3.",
        ],
      },
    ],
  },
  {
    id: "tue-jun-23",
    day: "Tuesday",
    date: "Jun 23",
    title: "Easy Zone 2 bike",
    duration: "45–60 min",
    categories: ["bike", "recovery"],
    purpose:
      "Maintain aerobic rhythm inside a consolidation week while actively reducing fatigue.",
    blocks: [
      {
        title: "Bike — easy Zone 2, 45–60 min",
        items: [
          "Warm up 8–10 min easy.",
          "Ride steady and conversational; no intervals today.",
          "Keep cadence comfortable and avoid high resistance.",
          "Cool down 5–8 min easy.",
        ],
      },
      {
        title: "Optional mobility",
        items: [
          "5–12 min calves, hips, feet, and thoracic spine.",
          "If legs feel unusually flat, cut the ride to 30–40 min or take full rest.",
        ],
      },
      {
        title: "Track",
        items: [
          "Bike duration, HR/RPE, and whether fatigue decreased afterward.",
        ],
      },
    ],
  },
  {
    id: "wed-jun-24",
    day: "Wednesday",
    date: "Jun 24",
    title: "Swim form + controlled stairs",
    duration: "75–100 min",
    categories: ["swim", "hike"],
    purpose:
      "Keep swim frequency and vertical touchpoints while maintaining the lower-load consolidation theme.",
    blocks: [
      {
        title: "Swim — form + relaxed repeats, 1,400–1,650 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and mobility.",
          "Warm-up: 250–300 yd easy.",
          "Drill/swim set: 8 × 50 yd as 25 drill / 25 swim, alternating catch-up, side kick, scull, and fingertip drag.",
          "Main: 5–6 × 100 yd relaxed, 20–30 sec rest. Hold form; do not prove fitness.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Stairs / incline walk — controlled, 30–40 min",
        items: [
          "Technique and shin check only — this should feel easier than Week 3.",
          "Bodyweight preferred; use a light pack only if every pain signal is quiet.",
          "Stop before calf or shin burn ramps.",
        ],
      },
      {
        title: "Track",
        items: [
          "Best-feeling drill, relaxed 100 yd pace/RPE, stair duration, and shin response.",
        ],
      },
    ],
  },
  {
    id: "thu-jun-25",
    day: "Thursday",
    date: "Jun 25",
    title: "Strength B maintenance + mobility reset",
    duration: "40–60 min",
    categories: ["strength", "recovery"],
    purpose:
      "Maintain pull-up strength and trunk control with reduced volume, then use mobility to support Friday/Saturday quality.",
    blocks: [
      {
        title: "Strength B — pull-up maintenance, 30–40 min",
        items: [
          "Weighted pull-up, bodyweight pull-up, or pulldown: 3 × 3–6 at RPE 5–7.",
          "Chest-supported row or cable row: 2 × 8–10 controlled.",
          "Biceps curl or band row: 1–2 × 10–12 easy/moderate.",
          "Dead bug, hollow hold, or hanging knee raise: 2–3 controlled sets.",
          "Skip extra volume if sleep/fatigue is poor.",
        ],
      },
      {
        title: "Mobility reset — 10–20 min",
        items: [
          "Shoulders: band external rotations, wall slides, thoracic rotations.",
          "Lower body: calves, feet, hip flexors, glutes, and ankles.",
          "Finish feeling more mobile, not stretched aggressively.",
        ],
      },
      {
        title: "Track",
        items: [
          "Pull-up/pulldown load, reps, RPE, shoulder/elbow response, and whether mobility improved readiness.",
        ],
      },
    ],
  },
  {
    id: "fri-jun-26",
    day: "Friday",
    date: "Jun 26",
    title: "Long swim consolidation checkpoint",
    duration: "1,400–1,700 yd",
    categories: ["swim"],
    purpose:
      "Consolidate swim progress by completing a smoother nonstop block rather than chasing a new distance high.",
    blocks: [
      {
        title: "Swim — consolidation checkpoint, 1,400–1,700 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and mobility.",
          "Warm-up: 250–300 yd easy.",
          "Drill primer: 4 × 50 yd as 25 drill / 25 swim, 20 sec rest.",
          "Main continuous checkpoint: 800–1,000 yd relaxed nonstop with better form than Week 3.",
          "If form degrades, switch to 4–5 × 150 yd easy with 30 sec rest and call that a successful consolidation.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Consolidation rule",
        items: [
          "This is not a distance PR. The win is calm breathing, quiet head position, and shoulder pain ≤2/10.",
        ],
      },
      {
        title: "Track",
        items: [
          "Longest nonstop swim, RPE, breathing calmness, form quality late, and shoulder response afterward.",
        ],
      },
    ],
  },
  {
    id: "sat-jun-27",
    day: "Saturday",
    date: "Jun 27",
    title: "Moderate long hike / uphill simulation",
    duration: "2.5–3.5 hr",
    categories: ["hike"],
    purpose:
      "Keep mountain durability moving while deliberately absorbing the previous build week.",
    blocks: [
      {
        title: "Moderate hike — controlled durability, 2.5–3.5 hr",
        items: [
          "Choose steady terrain and keep effort mostly RPE 4–5.",
          "Pack should be light to moderate only if all pain signals are quiet.",
          "Keep downhill controlled and avoid extending the session just because you feel good early.",
        ],
      },
      {
        title: "Fueling practice",
        items: [
          "Continue testing 30–45 g carbs/hour for sessions over 90 min.",
          "Practice hydration/electrolyte timing and easy-to-access snacks.",
        ],
      },
      {
        title: "Track",
        items: [
          "Duration, vertical gain, pack weight, fueling, RPE, and shin/knee response after descent.",
        ],
      },
    ],
  },
  {
    id: "sun-jun-28",
    day: "Sunday",
    date: "Jun 28",
    title: "Full recovery, walk, or mobility",
    duration: "20–45 min optional",
    categories: ["recovery"],
    purpose:
      "Finish the consolidation week by reducing fatigue before the next build starts.",
    blocks: [
      {
        title: "Recovery options",
        items: [
          "Option A: full rest if fatigue, sleep debt, or soreness is high.",
          "Option B: 20–45 min easy walk with no pack.",
          "Option C: 10–25 min mobility focused on calves, hips, feet, thoracic spine, and shoulders.",
        ],
      },
      {
        title: "Readiness check",
        items: [
          "Review swim, shin, shoulder, fatigue, and hike notes from Weeks 2–4.",
          "If two or more red flags are trending up, keep Jun 29–30 easier than written.",
        ],
      },
      {
        title: "Track",
        items: [
          "Morning fatigue, shin/shoulder pain, soreness, and whether recovery improved by evening.",
        ],
      },
    ],
  },
  {
    id: "mon-jun-29",
    day: "Monday",
    date: "Jun 29",
    title: "Swim endurance restart + Strength A",
    duration: "95–120 min",
    categories: ["swim", "strength"],
    purpose:
      "Restart the build after consolidation with smooth swim volume and normal RDL strength only if fatigue has dropped.",
    blocks: [
      {
        title: "Swim — endurance restart, 1,700–2,000 yd",
        items: [
          "Pre-swim shoulder prep: 5 min bands and mobility.",
          "Warm-up: 300 yd easy.",
          "Drill set: 4 × 25 yd scull + 4 × 25 yd fingertip drag + 4 × 25 yd catch-up, 20 sec rest.",
          "Main: 2 × 400 yd easy/moderate with 60 sec rest, then 4 × 100 yd smooth with 20–30 sec rest.",
          "If 400s degrade, switch to 6–8 × 150 yd relaxed and keep technique intact.",
          "Cool-down: 100–200 yd easy.",
        ],
      },
      {
        title: "Strength A — RDL return to normal volume, 35–45 min",
        items: [
          "Romanian deadlift: 3 × 6–8 at RPE 6–7 only if Week 4 lowered fatigue; otherwise keep 2 sets at RPE 5–6.",
          "Hamstring curl or hip thrust: 2–3 × 8–12.",
          "Front plank, dead bug, or anti-extension variation: 3 controlled sets.",
          "Calf raise: 2–3 × 10–15.",
          "Tibialis raises: 2–3 × 12–20.",
        ],
      },
      {
        title: "Track",
        items: [
          "Total yards, longest smooth repeat, shoulder response, RDL load/reps/RPE, and whether normal volume felt appropriate.",
        ],
      },
    ],
  },
  {
    id: "tue-jun-30",
    day: "Tuesday",
    date: "Jun 30",
    title: "Aerobic choice: bike or easy uphill",
    duration: "45–75 min",
    categories: ["bike", "hike"],
    purpose:
      "Choose the aerobic modality that best supports recovery and readiness: bike for low impact, easy uphill if lower legs are calm.",
    blocks: [
      {
        title: "Option A — bike aerobic choice, 45–75 min",
        items: [
          "Zone 2 throughout with 8–10 min easy warm-up and 5–8 min cool-down.",
          "Optional: 3 × 6 min steady upper Zone 2 only if legs feel normal.",
          "Choose this option if shins/calves need lower impact.",
        ],
      },
      {
        title: "Option B — easy uphill / stairs, 35–55 min",
        items: [
          "Bodyweight or very light pack only if shins are quiet.",
          "Keep effort conversational and stop before calf/shin burn ramps.",
          "Use quiet feet, short steps, and careful descent.",
        ],
      },
      {
        title: "Track",
        items: [
          "Chosen modality, duration, HR/RPE, pack weight if any, and shin/calf response later that day.",
        ],
      },
    ],
  },
];

workouts.push(...remainingJuneWorkouts);

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
const calendarStartDate = new Date(2026, 5, 1);
const calendarEndDate = new Date(2026, 7, 31);

const weekOneCalendarSessions = {
  "2026-06-01": [
    {
      title: "Swim body position + breathing",
      duration: "1,300–1,500 yd",
      categories: ["swim"],
      note: "Kickboard, side kick, catch-up, and pull buoy before smooth 150s.",
    },
    {
      title: "Strength A — RDL hamstring/glute",
      duration: "35–45 min",
      categories: ["strength"],
      note: "RDL first, then posterior chain, plank progression, calves, and tibialis.",
      compactDescriptor: "RDL",
    },
  ],
  "2026-06-02": [
    {
      title: "Bike Zone 2 aerobic base",
      duration: "45–60 min",
      categories: ["bike"],
      note: "Mostly 130–150 bpm, smooth and low impact.",
    },
    {
      title: "Short pull/core accessory",
      duration: "10–15 min",
      categories: ["strength"],
      note: "Pull-up primer, scapular control, and trunk work.",
      compactDescriptor: "pull/core",
    },
  ],
  "2026-06-03": [
    {
      title: "Swim pace + catch control",
      duration: "1,400–1,650 yd",
      categories: ["swim"],
      note: "Sculling, fingertip drag, controlled 100s, and small sighting practice.",
    },
    {
      title: "Easy stairs / uphill",
      duration: "25–35 min",
      categories: ["hike"],
      note: "No pack unless legs feel excellent.",
    },
  ],
  "2026-06-04": [
    {
      title: "Strength B — weighted pull-up",
      duration: "40–50 min",
      categories: ["strength"],
      note: "Weighted pull-up first, then rows, curls, core, and lower-leg prehab.",
      compactDescriptor: "weighted pull-up",
    },
    {
      title: "Optional recovery spin",
      duration: "20–40 min",
      categories: ["bike", "recovery"],
      note: "Blood flow only if legs feel good.",
    },
  ],
  "2026-06-05": [
    {
      title: "Long continuous swim checkpoint",
      duration: "1,500–1,700 yd",
      categories: ["swim"],
      note: "700–900 yd relaxed nonstop; progress only if breathing, form, and shoulders stay calm.",
    },
    {
      title: "Strength C — Bulgarian split squat",
      duration: "25–35 min",
      categories: ["strength"],
      note: "Bulgarian split squat first, then legs, calves, tibialis, and core.",
      compactDescriptor: "split squat",
    },
  ],
  "2026-06-06": [
    {
      title: "Long hike or uphill simulation",
      duration: "90–150 min",
      categories: ["hike"],
      note: "Baseline Baker durability; conservative effort.",
    },
  ],
  "2026-06-07": [
    {
      title: "Recovery technique swim or easy bike",
      duration: "30–60 min",
      categories: ["recovery", "swim", "bike"],
      note: "Easy breathing drills or low-resistance spin; choose what leaves you fresher.",
    },
  ],
};

const calendarPhaseTemplates = {
  base: {
    0: [
      {
        title: "Recovery technique swim or easy bike",
        duration: "35–60 min",
        categories: ["recovery", "swim", "bike"],
        note: "Easy breathing drills or low-impact spin; absorb the week.",
      },
    ],
    1: [
      {
        title: "Swim technique endurance",
        duration: "1,300–1,600 yd",
        categories: ["swim"],
        note: "Side kick, catch-up, pull buoy, and smooth aerobic repeats.",
      },
      {
        title: "Strength A — RDL hamstring/glute",
        duration: "35–45 min",
        categories: ["strength"],
        note: "RDL first, posterior-chain accessory, core, calves, and tibialis; no grinding.",
        compactDescriptor: "RDL",
      },
    ],
    2: [
      {
        title: "Bike Zone 2",
        duration: "50–70 min",
        categories: ["bike"],
        note: "Low-impact aerobic volume.",
      },
      {
        title: "Pull/core primer",
        duration: "10–15 min",
        categories: ["strength"],
        note: "Dead bugs, hangs, scapular pulls, or easy pull-up practice.",
        compactDescriptor: "pull/core",
      },
    ],
    3: [
      {
        title: "Swim pace + catch control",
        duration: "1,400–1,700 yd",
        categories: ["swim"],
        note: "Sculling or fingertip drag before repeatable controlled 100s.",
      },
      {
        title: "Easy stairs / incline walk",
        duration: "30–40 min",
        categories: ["hike"],
        note: "No weighted intensity spike.",
      },
    ],
    4: [
      {
        title: "Strength B — weighted pull-up",
        duration: "40–50 min",
        categories: ["strength"],
        note: "Weighted pull-up first, then rows, curls, core, and lower-leg prehab.",
        compactDescriptor: "weighted pull-up",
      },
      {
        title: "Optional easy spin",
        duration: "20–35 min",
        categories: ["bike", "recovery"],
        note: "Only if it improves recovery.",
      },
    ],
    5: [
      {
        title: "Long continuous swim checkpoint",
        duration: "1,500–1,800 yd",
        categories: ["swim"],
        note: "Weekly nonstop target: 900–1,000 yd in Week 2; no max-effort test.",
      },
      {
        title: "Strength C — Bulgarian split squat",
        duration: "25–35 min",
        categories: ["strength"],
        note: "Bulgarian split squat first, then leg accessory, calves, tibialis, and core.",
        compactDescriptor: "split squat",
      },
    ],
    6: [
      {
        title: "Long hike / uphill simulation",
        duration: "2–3 hr",
        categories: ["hike"],
        note: "Practice steady pacing and descent control.",
      },
    ],
  },
  build: {
    0: [
      {
        title: "Recovery mobility + easy spin",
        duration: "35–60 min",
        categories: ["recovery", "bike"],
        note: "Keep Sunday non-swim: use easy mobility, breath-led shoulder work, and optional low-resistance spin to absorb the week.",
      },
    ],
    1: [
      {
        title: "Swim endurance + drill progression",
        duration: "1,600–2,000 yd",
        categories: ["swim"],
        note: "Catch drills plus longer aerobic set toward race distance.",
      },
      {
        title: "Strength A — RDL hamstring/glute",
        duration: "35–45 min",
        categories: ["strength"],
        note: "RDL-led posterior chain strength without soreness chase.",
        compactDescriptor: "RDL",
      },
    ],
    2: [
      {
        title: "Bike aerobic build",
        duration: "60–80 min",
        categories: ["bike"],
        note: "Zone 2 with a few steady controlled blocks.",
      },
    ],
    3: [
      {
        title: "Swim technique + pace control",
        duration: "1,500–1,850 yd",
        categories: ["swim"],
        note: "Warm-up 300 easy, then 8 × 50 as 25 drill/25 swim, then 6 × 100 steady with controlled breathing and consistent stroke count, finish with 4 × 50 sighting/no-wall skills.",
      },
      {
        title: "Uphill intervals / stairs",
        duration: "45–60 min",
        categories: ["hike"],
        note: "Controlled vertical; add light pack only if pain-free.",
      },
      {
        title: "Core + carries",
        duration: "15–20 min",
        categories: ["strength"],
        note: "Farmer carry, plank, anti-rotation.",
      },
    ],
    4: [
      {
        title: "Strength B — weighted pull-up",
        duration: "35–45 min",
        categories: ["strength"],
        note: "Weighted pull-ups or bodyweight pull-ups with rows, curls, and core; keep reps crisp.",
        compactDescriptor: "weighted pull-up",
      },
    ],
    5: [
      {
        title: "Long continuous swim checkpoint",
        duration: "1,700–2,100 yd",
        categories: ["swim"],
        note: "Warm-up 300 easy, drill primer 4 × 50, then continuous target of 1,100–1,300 yd at calm effort; finish with 100–200 easy and stop if shoulders exceed 2/10.",
      },
      {
        title: "Optional easy spin flush",
        duration: "20–35 min",
        categories: ["bike", "recovery"],
        note: "Optional post-swim blood flow only. Skip if Saturday hike quality would improve with full rest.",
      },
    ],
    6: [
      {
        title: "Long hike with pack progression",
        duration: "3–5 hr",
        categories: ["hike"],
        note: "Build vertical gradually; practice fueling.",
      },
    ],
  },
  specific: {
    0: [
      {
        title: "Recovery spin + mobility",
        duration: "30–50 min",
        categories: ["recovery", "bike"],
        note: "Keep Sunday non-swim: easy spin, shoulder mobility, calf/foot reset, and no load chasing.",
      },
    ],
    1: [
      {
        title: "Pool race-distance rehearsal",
        duration: "1,800–2,200 yd",
        categories: ["swim"],
        note: "Include continuous 1,400–1,600 yd plus no-wall/sighting practice.",
      },
      {
        title: "Strength maintenance",
        duration: "25–35 min",
        categories: ["strength"],
        note: "Low volume; rotate RDL, weighted pull-up, or Bulgarian split squat as the first lift and keep quality high.",
        compactDescriptor: "main lift",
      },
    ],
    2: [
      {
        title: "Mountain uphill intervals",
        duration: "60–75 min",
        categories: ["hike"],
        note: "Sustain steady vertical without shin flare.",
      },
    ],
    3: [
      {
        title: "Open-water skills or pool sighting",
        duration: "1,700–1,900 yd (35–60 min)",
        categories: ["swim"],
        note: "Practice sighting, calm starts, and no-wall turns inside ~1,700–1,900 yd of controlled aerobic swimming.",
      },
      {
        title: "Easy mobility",
        duration: "10–20 min",
        categories: ["recovery"],
        note: "Shoulders, calves, hips, and thoracic spine.",
      },
    ],
    4: [
      {
        title: "Bike Zone 2 + pull/core strength",
        duration: "60–80 min",
        categories: ["bike", "strength"],
        note: "Aerobic maintenance plus pull-up, trunk, and lower-leg basics.",
        compactDescriptor: "pull/core",
      },
    ],
    5: [
      {
        title: "Recovery technique swim",
        duration: "1,200–1,600 yd",
        categories: ["swim", "recovery"],
        note: "Friday swim stays low stress: 300 easy, 6 × 50 drill/swim, 4–6 × 100 smooth aerobic, 100 easy. End feeling better than when you started.",
      },
    ],
    6: [
      {
        title: "Baker simulation hike",
        duration: "4–6 hr",
        categories: ["hike"],
        note: "Long steady climb, pack system, fueling rehearsal.",
      },
    ],
  },
  taper: {
    0: [
      {
        title: "Recovery and mobility",
        duration: "20–40 min",
        categories: ["recovery"],
        note: "Reduce fatigue; protect sleep.",
      },
    ],
    1: [
      {
        title: "Easy technique swim",
        duration: "1,000–1,400 yd",
        categories: ["swim", "recovery"],
        note: "Stay sharp with easy drills; do not accumulate fatigue.",
      },
    ],
    2: [
      {
        title: "Light aerobic maintenance",
        duration: "30–45 min",
        categories: ["bike", "recovery"],
        note: "Easy spin or walk only.",
      },
    ],
    3: [
      {
        title: "Short swim tune-up",
        duration: "1,000–1,500 yd",
        categories: ["swim"],
        note: "A few relaxed pickups and sighting cues; no fatigue.",
      },
    ],
    4: [
      {
        title: "Strength maintenance micro-dose",
        duration: "20–30 min",
        categories: ["strength"],
        note: "Light full-body patterning.",
      },
    ],
    5: [
      {
        title: "Rest / logistics",
        duration: "As needed",
        categories: ["recovery"],
        note: "Gear, hydration, sleep, and food prep.",
      },
    ],
    6: [
      {
        title: "Short shakeout",
        duration: "20–40 min",
        categories: ["recovery", "hike"],
        note: "Easy legs; keep confidence high.",
      },
    ],
  },
  recovery: {
    0: [
      {
        title: "Full rest / travel recovery",
        duration: "As needed",
        categories: ["recovery"],
        note: "Sleep, food, feet, and easy walking only.",
      },
    ],
    1: [
      {
        title: "Easy swim reset",
        duration: "20–40 min",
        categories: ["swim", "recovery"],
        note: "Only if shoulders and energy feel good; technique only.",
      },
    ],
    2: [
      {
        title: "Mobility + easy walk",
        duration: "20–45 min",
        categories: ["recovery"],
        note: "Restore range of motion and tissue quality.",
      },
    ],
    3: [
      {
        title: "Easy technique swim reset",
        duration: "1,000–1,400 yd",
        categories: ["swim", "recovery"],
        note: "Wednesday swim focus: relaxed breathing, short drill block, and smooth aerobic repeats. Keep shoulder load minimal after Baker week.",
      },
    ],
    4: [
      {
        title: "Light pull/core rebuild",
        duration: "20–30 min",
        categories: ["strength", "recovery"],
        note: "Gentle rows, carries, and trunk work.",
      },
    ],
    5: [
      {
        title: "Optional easy swim",
        duration: "20–40 min",
        categories: ["swim", "recovery"],
        note: "Keep this fully recovery-focused: 200 easy warm-up, 4 × 50 drill/swim by 25, 4 × 100 smooth aerobic with full control, and 100 easy cool-down. Stop early if shoulders or energy feel flat.",
      },
    ],
    6: [
      {
        title: "Easy hike / long walk",
        duration: "45–90 min",
        categories: ["hike", "recovery"],
        note: "Low stakes movement; no pack pressure.",
      },
    ],
  },
  maintenance: {
    0: [
      {
        title: "Recovery mobility or easy walk",
        duration: "25–45 min",
        categories: ["recovery"],
        note: "Keep Sunday non-swim: mobility, walk, and tissue care so Monday starts fresh.",
      },
    ],
    1: [
      {
        title: "Swim endurance maintenance",
        duration: "1,400–1,800 yd",
        categories: ["swim"],
        note: "Comfortable continuous or broken volume with a short drill primer.",
      },
      {
        title: "Strength A — RDL + lower leg",
        duration: "35–45 min",
        categories: ["strength"],
        note: "Rebuild with RDLs, core, calves, and tibialis after the peak events.",
        compactDescriptor: "RDL",
      },
    ],
    2: [
      {
        title: "Bike aerobic maintenance",
        duration: "50–75 min",
        categories: ["bike"],
        note: "Steady Zone 2 base work.",
      },
    ],
    3: [
      {
        title: "Swim skills + aerobic control",
        duration: "1,400–1,700 yd",
        categories: ["swim"],
        note: "Warm-up 300 easy, 8 × 50 drill/swim by 25, main set 5 × 150 relaxed with even pacing, then 4 × 50 sighting/no-wall turn practice.",
      },
      {
        title: "Uphill hike / stairs",
        duration: "45–75 min",
        categories: ["hike"],
        note: "Maintain vertical economy without overreaching.",
      },
      {
        title: "Core + carries",
        duration: "10–20 min",
        categories: ["strength"],
        note: "Short trunk and grip work.",
      },
    ],
    4: [
      {
        title: "Strength B — weighted pull-up + core",
        duration: "35–45 min",
        categories: ["strength"],
        note: "Weighted pull-up or bodyweight pull-up focus with rows, curls, core, and lower-leg prehab.",
        compactDescriptor: "weighted pull-up",
      },
      {
        title: "Optional easy spin",
        duration: "20–35 min",
        categories: ["bike", "recovery"],
        note: "Only if it helps recovery.",
      },
    ],
    5: [
      {
        title: "Long aerobic swim maintenance",
        duration: "1,500–1,900 yd",
        categories: ["swim", "recovery"],
        note: "Friday long swim: 300 warm-up, 1,000–1,400 continuous relaxed, optional 4 × 50 form resets, and 100–200 cool-down.",
      },
    ],
    6: [
      {
        title: "Long hike / adventure day",
        duration: "2–4 hr",
        categories: ["hike"],
        note: "Maintain mountain durability and enjoyment.",
      },
    ],
  },
};

const calendarSpecialDays = {
  "2026-07-20": [
    {
      title: "Post-ramp endurance swim anchor",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300 easy, drill primer 6 × 50 (25 drill/25 swim), main 3 × 500 steady aerobic (30 sec rest), then 4 × 50 sighting/no-wall and 100 easy.",
    },
  ],
  "2026-07-22": [
    {
      title: "Midweek skills + threshold-control swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 8 × 50, main 10 × 100 at controlled effort with even splits, then 4 × 50 sighting cadence and 100–200 easy.",
    },
  ],
  "2026-07-24": [
    {
      title: "Long aerobic swim checkpoint",
      duration: "1,900–2,100 yd",
      categories: ["swim", "recovery"],
      note: "Warm-up 300, then continuous 1,400–1,700 yd relaxed with form discipline, finish with 4 × 50 form resets and 100 easy.",
    },
  ],
  "2026-07-27": [
    {
      title: "Sustained-volume Monday swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 6 × 50, main 4 × 300 steady + 4 × 100 pull buoy body-line focus, then 100–200 cool-down.",
    },
  ],
  "2026-07-29": [
    {
      title: "Sighting + pace-control swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, 8 × 50 drill/swim, main 5 × 200 negative-split focus with calm breathing, then 6 × 50 sighting every 6–8 strokes.",
    },
  ],
  "2026-07-31": [
    {
      title: "Friday long aerobic swim",
      duration: "1,900–2,100 yd",
      categories: ["swim", "recovery"],
      note: "Warm-up 300, continuous 1,500 yd target at easy/moderate effort, then 4 × 50 technical resets and 100–200 easy.",
    },
  ],
  "2026-08-03": [
    {
      title: "Monday endurance swim anchor",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 6 × 50, main 3 × 500 steady + 2 × 200 relaxed with excellent form, then 100 easy.",
    },
  ],
  "2026-08-05": [
    {
      title: "Wednesday skills + pacing swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 8 × 50, main 12 × 100 controlled aerobic/threshold crossover, then 4 × 50 sighting/no-wall and 100 easy.",
    },
  ],
  "2026-08-07": [
    {
      title: "Friday long continuous swim",
      duration: "1,900–2,100 yd",
      categories: ["swim", "recovery"],
      note: "Warm-up 300, continuous 1,500–1,700 yd at calm effort, then 4 × 50 technique finishers and 100 easy.",
    },
  ],
  "2026-08-10": [
    {
      title: "Monday aerobic efficiency swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 6 × 50, main 4 × 400 steady with controlled stroke count, then 100–200 easy.",
    },
  ],
  "2026-08-12": [
    {
      title: "Wednesday race-skill rehearsal swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, 8 × 50 drill/swim, main 6 × 200 with sighting inserts, then 4 × 50 no-wall turns and 100 easy.",
    },
  ],
  "2026-08-14": [
    {
      title: "Friday long aerobic swim",
      duration: "1,900–2,100 yd",
      categories: ["swim", "recovery"],
      note: "Warm-up 300, continuous 1,500–1,700 yd relaxed, then 4 × 50 form resets and 100–200 cool-down.",
    },
  ],
  "2026-08-17": [
    {
      title: "Final high-volume Monday swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, drills 6 × 50, main 3 × 500 + 3 × 100 smooth build, then 100–200 easy.",
    },
  ],
  "2026-08-19": [
    {
      title: "Wednesday quality-control swim",
      duration: "1,900–2,100 yd",
      categories: ["swim"],
      note: "Warm-up 300, 8 × 50 drill/swim, main 10 × 100 controlled, then 4 × 50 sighting rhythm and 100 easy.",
    },
  ],
  "2026-08-21": [
    {
      title: "Final full-load long swim",
      duration: "1,900–2,100 yd",
      categories: ["swim", "recovery"],
      note: "Warm-up 300, continuous 1,500–1,700 yd comfortable with stable form, then short cool-down. Finish feeling controlled, not depleted.",
    },
  ],
  "2026-08-24": [
    {
      title: "Race-week Monday tune-up swim",
      duration: "1,400–1,700 yd",
      categories: ["swim", "recovery"],
      note: "Keep this lighter: 300 warm-up, 6 × 50 drills, 6 × 100 smooth aerobic, 4 × 50 sighting cues, then easy cool-down.",
    },
  ],
  "2026-08-26": [
    {
      title: "Race-week confidence swim",
      duration: "1,100–1,400 yd",
      categories: ["swim", "recovery"],
      note: "Short and smooth: 300 warm-up, 4 × 50 drills, 4 × 100 controlled, a few 25 yd pickups, then easy cool-down.",
    },
  ],
  "2026-08-28": [
    {
      title: "Full rest + Lake Union logistics",
      duration: "As needed",
      categories: ["recovery"],
      note: "No swim on Friday race eve. Confirm support, route, weather, fueling, and gear.",
    },
  ],
  "2026-08-29": [
    {
      title: "Lake Union supported swim",
      duration: "1,600 yd target",
      categories: ["swim"],
      note: "Execute calmly with support plan. Keep early pacing conservative and abort if conditions or shoulder status require.",
    },
  ],
  "2026-08-30": [
    {
      title: "Post-race recovery",
      duration: "20–40 min optional walk/mobility",
      categories: ["recovery"],
      note: "Prioritize sleep, hydration, nutrition, and easy mobility only.",
    },
  ],
};

const weekOneTrackingIdsByDate = {
  "2026-06-01": "mon-jun-1",
  "2026-06-02": "tue-jun-2",
  "2026-06-03": "wed-jun-3",
  "2026-06-04": "thu-jun-4",
  "2026-06-05": "fri-jun-5",
  "2026-06-06": "sat-jun-6",
  "2026-06-07": "sun-jun-7",
  "2026-06-08": "mon-jun-8",
  "2026-06-09": "tue-jun-9",
  "2026-06-10": "wed-jun-10",
  "2026-06-11": "thu-jun-11",
  "2026-06-12": "fri-jun-12",
  "2026-06-13": "sat-jun-13",
  "2026-06-14": "sun-jun-14",
  "2026-06-15": "mon-jun-15",
  "2026-06-16": "tue-jun-16",
  "2026-06-17": "wed-jun-17",
  "2026-06-18": "thu-jun-18",
  "2026-06-19": "fri-jun-19",
  "2026-06-20": "sat-jun-20",
  "2026-06-21": "sun-jun-21",
  "2026-06-22": "mon-jun-22",
  "2026-06-23": "tue-jun-23",
  "2026-06-24": "wed-jun-24",
  "2026-06-25": "thu-jun-25",
  "2026-06-26": "fri-jun-26",
  "2026-06-27": "sat-jun-27",
  "2026-06-28": "sun-jun-28",
  "2026-06-29": "mon-jun-29",
  "2026-06-30": "tue-jun-30",
};
const weekOneDatesByTrackingId = Object.fromEntries(
  Object.entries(weekOneTrackingIdsByDate).map(([dateKey, trackingId]) => [trackingId, dateKey]),
);

const STORAGE_KEY = "baker-lake-union-week-1-tracking-v1";
const CALENDAR_STORAGE_KEY = "baker-lake-union-calendar-tracking-v1";
const CALENDAR_UI_STORAGE_KEY = "baker-lake-union-calendar-ui-v1";
const CALENDAR_RESCHEDULE_STORAGE_KEY = "baker-lake-union-calendar-reschedule-v1";
const CALENDAR_RESCHEDULE_WINDOW_DAYS = 3;
const calendarMoveOffsets = [-3, -2, -1, 1, 2, 3];
const calendarCategoryFilters = ["all", "swim", "bike", "strength", "hike", "recovery"];
const calendarStatusFilters = ["all", "incomplete", "complete"];
const calendarViewModes = ["compact", "detailed"];
const calendarFilterLabels = {
  all: "all workout types",
  swim: "swim",
  bike: "bike",
  strength: "strength",
  hike: "hike",
  recovery: "recovery",
};
const calendarCategoryDisplayLabels = {
  swim: "Swim",
  bike: "Bike",
  strength: "Strength",
  hike: "Hike",
  recovery: "Recovery",
  default: "Workout",
};
const calendarPhaseLabels = {
  base: "Base + technical consistency",
  build: "Mountain capacity + swim endurance",
  specific: "Specificity + open-water transition",
  taper: "Taper + execution",
  recovery: "Post-peak recovery",
  maintenance: "Maintenance",
};
const calendarMilestones = {
  swim: { dateKey: "2026-08-29", label: "Lake Union" },
  bike: { dateKey: "2026-08-01", label: "Mt. Baker" },
  strength: { dateKey: "2026-08-01", label: "Mt. Baker" },
  hike: { dateKey: "2026-08-01", label: "Mt. Baker" },
  recovery: { dateKey: "2026-08-01", label: "Mt. Baker" },
  default: { dateKey: "2026-08-01", label: "Mt. Baker" },
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
  const text = String(activityType ?? "").toLowerCase();
  if (/(swim|pool|open water)/.test(text)) return "swim";
  if (/(ride|bike|cycling)/.test(text)) return "bike";
  if (/(hike|walk|run|trail|treadmill)/.test(text)) return "hike";
  if (/(strength|weight|gym|workout)/.test(text)) return "strength";
  if (/(recovery|mobility|yoga)/.test(text)) return "recovery";
  return null;
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

  // Allow cross-category matching: strength ↔ hike (for stairmaster/vertical training)
  const isStrengthActivity = activityCategory === "strength";
  const isHikeSession = session.categories.includes("hike");
  const crossCategoryMatch = isStrengthActivity && isHikeSession;

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
}

let skippedReviewSessions = new Set();
let matchingTabEventsAttached = false;

function isMatchingTabActive() {
  return !!document.querySelector('[data-tab-panel="matching"].is-active');
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

const tabIds = ["calendar", "matching"];
const tabAliases = {
  dashboard: "calendar",
  overview: "calendar",
  "today-panel": "calendar",
  "today-workouts": "calendar",
  "calendar-tracker": "calendar",
  phases: "calendar",
  "phase-timeline": "calendar",
  "match-activities": "matching",
  "tracking-summary": "calendar",
};

// ── Firebase / cross-device sync ──────────────────────────────────────────────
import * as api from './app-api.js';

// Stable per-user ID — survives page reloads, shared across devices via Firestore
const APP_USER_ID_KEY = 'abid-workouts-user-id';
let _userId = localStorage.getItem(APP_USER_ID_KEY);
if (!_userId) {
  _userId = 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  localStorage.setItem(APP_USER_ID_KEY, _userId);
}
api.initializeAPI(_userId);

// On first load pull cloud data and merge it in (runs asynchronously, won't block render)
async function hydrateFromFirestore() {
  try {
    const { activityMatches, extraWorkouts } = await api.loadAllUserData();
    const calendarReschedulesCloud = await api.loadCalendarReschedules();
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const calendarTrackingCloud = await api.loadCalendarTracking(todayDateKey);
    
    let changed = false;
    
    // Merge cloud activity matches into localStorage (cloud wins for new keys)
    if (activityMatches && Object.keys(activityMatches).length) {
      const local = loadManualActivityMatches();
      const merged = { ...local, ...activityMatches };
      window.localStorage.setItem(MANUAL_MATCH_STORAGE_KEY, JSON.stringify(merged));
      changed = true;
    }
    
    // Merge cloud extra workouts into localStorage
    if (extraWorkouts && Object.keys(extraWorkouts).length) {
      const local = loadExtraWorkouts();
      const merged = { ...local, ...extraWorkouts };
      window.localStorage.setItem(EXTRA_WORKOUTS_STORAGE_KEY, JSON.stringify(merged));
      changed = true;
    }
    
    // Merge cloud calendar reschedules (cloud wins if cloud has newer data)
    if (calendarReschedulesCloud && Object.keys(calendarReschedulesCloud).length) {
      const local = loadCalendarReschedules();
      const merged = { ...local, ...calendarReschedulesCloud };
      window.localStorage.setItem(CALENDAR_RESCHEDULE_STORAGE_KEY, JSON.stringify(merged));
      calendarReschedules = merged;
      changed = true;
    }
    
    // Merge cloud calendar tracking for today
    if (calendarTrackingCloud && Object.keys(calendarTrackingCloud).length > 1) {
      // Only sync if cloud has more than just the date field
      const local = loadCalendarTracking();
      const merged = { ...local, ...calendarTrackingCloud };
      window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(merged));
      calendarTracking = merged;
      changed = true;
    }
    
    // Re-render so Firestore data shows up without a page reload
    if (changed) {
      renderCalendar();
      renderActivityMatchQueue();
      if (isMatchingTabActive()) renderMatchingTab();
    }
  } catch (e) {
    console.warn('[Sync] Could not hydrate from Firestore:', e);
  }
}
hydrateFromFirestore();

// ─────────────────────────────────────────────────────────────────────────────

let activeFilter = "all";
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
  // Background cloud sync — dateKey is today's date
  const dateKey = new Date().toISOString().slice(0, 10);
  api.saveTracking(dateKey, tracking).catch(() => {});
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
  const dateKey = new Date().toISOString().slice(0, 10);
  api.saveCalendarTracking(dateKey, calendarTracking).catch(() => {});
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
  const defaults = {
    categoryFilter: "all",
    statusFilter: "all",
    view: "compact",
  };

  try {
    const raw = window.localStorage.getItem(CALENDAR_UI_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      categoryFilter: calendarCategoryFilters.includes(saved.categoryFilter)
        ? saved.categoryFilter
        : defaults.categoryFilter,
      statusFilter: calendarStatusFilters.includes(saved.statusFilter)
        ? saved.statusFilter
        : defaults.statusFilter,
      view: calendarViewModes.includes(saved.view) ? saved.view : defaults.view,
    };
  } catch (error) {
    console.warn("Could not load calendar UI state", error);
    return defaults;
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
  if (dateKey <= "2026-06-14") return "base";
  if (dateKey <= "2026-07-05") return "build";
  if (dateKey <= "2026-08-23") return "specific";
  if (dateKey <= "2026-08-30") return "taper";
  if (dateKey <= "2026-08-31") return "recovery";
  return "maintenance";
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

function getPlannedCalendarSessionsForDate(date, dateKey, phaseKey) {
  return (
    weekOneCalendarSessions[dateKey] ??
    monthOneCalendarSessions[dateKey] ??
    calendarSpecialDays[dateKey] ??
    calendarPhaseTemplates[phaseKey]?.[date.getDay()] ??
    []
  );
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
  return String(value)
    .replaceAll(/Mt\.?\s*Baker\s*\+\s*Lake\s+Union/gi, "Summer 2026")
    .replaceAll(/Baker\s*\+\s*Lake\s+Union/gi, "Summer 2026")
    .replaceAll(/Mt\.?\s*Baker/gi, "Summer 2026 peak event")
    .replaceAll(/Lake\s+Union/gi, "Summer 2026 swim event");
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
  const trainingCategory = session.categories.find((category) => category !== "recovery");
  return trainingCategory ?? calendarSessionPrimaryCategory(session);
}

function getCalendarSessionCompactLabel(session) {
  const trainingCategories = session.categories.filter((category) => category !== "recovery");
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

  if (compactCategory === "recovery") {
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
  return trackingId ? workouts.find((workout) => workout.id === trackingId) : null;
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

  if (category === "hike") {
    if (/baker|summit/.test(text)) return "Execution focus: steady pacing, fueling, hydration, foot care, and communication.";
    return "Mountain cue: build vertical durability gradually and protect the downhill/shin response.";
  }

  if (category === "strength") {
    return "Strength cue: crisp reps, no grinding, and leave enough in reserve for the next endurance session.";
  }

  if (category === "bike") {
    return "Bike cue: keep this low-impact aerobic unless the plan explicitly says otherwise.";
  }

  if (category === "recovery") {
    return "Recovery cue: finish feeling better than when you started; optional means optional.";
  }

  return "Use this session to support the larger Summer 2026 progression.";
}

function getBlockCategoryKeywords(category) {
  return {
    swim: ["swim", "pool", "sighting", "catch", "breathing", "continuous"],
    bike: ["bike", "spin", "cycling"],
    strength: ["strength", "accessory", "core", "pull", "pull-up", "rdl", "romanian", "squat", "split", "hinge", "deadlift", "calf", "tibialis", "durability"],
    hike: ["hike", "stair", "uphill", "incline", "simulation", "pack", "vertical", "fueling"],
    recovery: ["recovery", "mobility", "rest", "reset", "easy"],
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
  const blockText = `${block.title} ${block.items.join(" ")}`.toLowerCase();
  const sessionWords = getSignificantWords(`${session.title} ${session.note}`);
  const categoryTitleMatch = session.categories.some((category) =>
    getBlockCategoryKeywords(category).some((keyword) => blockTitle.includes(keyword)),
  );
  const wordMatchCount = sessionWords.filter((word) => blockText.includes(word)).length;

  return categoryTitleMatch || wordMatchCount >= 2;
}

function trackItemMatchesCalendarSession(item, session) {
  const text = item.toLowerCase();
  const categoryKeywords = session.categories.flatMap((category) => getBlockCategoryKeywords(category));
  const trackingKeywords = {
    swim: ["stroke", "breath", "shoulder", "sighting", "swim", "pace"],
    bike: ["hr", "heart", "cycling", "lower-leg", "effort"],
    strength: ["load", "rpe", "rdl", "pull", "pull-up", "split", "squat", "plank", "calf", "tibialis", "shin", "soreness"],
    hike: ["stair", "vertical", "floors", "pack", "descent", "shin", "fuel"],
    recovery: ["fatigue", "recovery", "improved", "morning"],
  };
  const extraKeywords = session.categories.flatMap((category) => trackingKeywords[category] ?? []);

  return [...categoryKeywords, ...extraKeywords].some((keyword) => text.includes(keyword));
}

function getWorkoutSpecificBlocks(detailedWorkout, session, day) {
  if (!detailedWorkout) return [];

  const nonTrackBlocks = detailedWorkout.blocks.filter((block) => !/^track$/i.test(block.title.trim()));
  const trackBlock = detailedWorkout.blocks.find((block) => /^track$/i.test(block.title.trim()));

  if (day.sessions.length <= 1) return detailedWorkout.blocks;

  const matchedBlocks = nonTrackBlocks.filter((block) => blockMatchesCalendarSession(block, session));
  const matchedTrackItems = trackBlock?.items.filter((item) => trackItemMatchesCalendarSession(item, session)) ?? [];

  if (matchedTrackItems.length) {
    matchedBlocks.push({ title: "Track for this workout", items: matchedTrackItems });
  }

  return matchedBlocks;
}

function parseSwimYardRange(duration) {
  const match = String(duration ?? "").match(/(\d{1,3}(?:,\d{3})?)\s*[–-]\s*(\d{1,3}(?:,\d{3})?)\s*yd/i);
  if (!match) return null;
  const low = Number(match[1].replace(/,/g, ""));
  const high = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0 || high <= 0) return null;
  return { low: Math.min(low, high), high: Math.max(low, high) };
}

function getSwimProgressionWeek(session) {
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const startKey = dateToKey(calendarStartDate);
  return Math.max(1, Math.floor(getDaysBetweenDateKeys(startKey, plannedDateKey) / 7) + 1);
}

function getSwimFallbackBlocks(session) {
  const plannedDateKey = session.plannedDateKey ?? session.dateKey;
  const weekday = parseCalendarDateKey(plannedDateKey).getDay();
  const range = parseSwimYardRange(session.duration) ?? { low: 1400, high: 1700 };
  const weekNumber = getSwimProgressionWeek(session);
  const enduranceSetDistance = 150 + Math.min(150, Math.floor(weekNumber / 2) * 25);
  const enduranceReps = Math.max(4, Math.round((range.low * 0.55) / enduranceSetDistance));
  const skillsReps = 8 + (weekNumber % 4) * 2;
  const longContinuous = Math.max(700, Math.round(range.low * 0.72 / 50) * 50);
  const descriptor = String(session.title ?? "")
    .replace(/^swim\s*(?:[—:-]\s*)?/i, "")
    .trim();
  const swimFocus = descriptor || "technique session";
  const title = `Swim — ${swimFocus}, ${session.duration}`;

  if (weekday === 1) {
    return [
      {
        title,
        items: [
          "Pre-swim shoulder prep: 5 min bands and relaxed mobility.",
          `Warm-up: 300 yd easy with 4 × 25 yd drill/swim by 25.`,
          "Drill set: 4 × 25 yd side kick + 4 × 25 yd catch-up + 4 × 25 yd fingertip drag, 20 sec rest.",
          `Main endurance set: ${enduranceReps} × ${enduranceSetDistance} yd at controlled aerobic effort with 25–35 sec rest.`,
          `Progression cue (week ${weekNumber}): hold ${range.low}–${range.high} yd total while keeping stroke count and breathing stable across the last two repeats.`,
          "Cool-down: 100–200 yd easy.",
        ],
      },
    ];
  }

  if (weekday === 3) {
    return [
      {
        title,
        items: [
          "Pre-swim shoulder prep: 5 min bands plus thoracic and lat mobility.",
          "Warm-up: 250–300 yd easy with calm bilateral breathing.",
          "Drill block: 8 × 25 yd alternating catch-up, single-arm, scull, and fingertip drag (15–20 sec rest).",
          `Main skills set: ${skillsReps} × 100 yd smooth with every odd rep including 1–2 sighting looks and every even rep focused on no-wall turn rhythm.`,
          `Progression cue (week ${weekNumber}): keep the session in the ${range.low}–${range.high} yd range while quality of drills stays higher than speed.`,
          "Cool-down: 100–200 yd easy.",
        ],
      },
    ];
  }

  if (weekday === 5) {
    return [
      {
        title,
        items: [
          "Pre-swim shoulder prep: 5 min bands and relaxed mobility.",
          "Warm-up: 300 yd easy, then 4 × 50 yd drill/swim by 25.",
          "Primer: 4 × 100 yd smooth aerobic with 20–25 sec rest to settle rhythm.",
          `Long check-in: ${longContinuous} yd continuous at calm effort (or split as 2 × ${Math.round(longContinuous / 2 / 50) * 50} yd with 30 sec rest if form drops).`,
          `Progression cue (week ${weekNumber}): finish inside ${range.low}–${range.high} yd total with stable form in the final 300 yd.`,
          "Cool-down: 100–200 yd easy.",
        ],
      },
    ];
  }

  return [
    {
      title,
      items: [
        "Pre-swim shoulder prep: 5 min bands and relaxed mobility.",
        "Warm-up: 250–300 yd easy.",
        "Drill set: 4 × 25 yd side kick + 4 × 25 yd catch-up + 4 × 25 yd scull or fingertip drag, 20 sec rest.",
        "Main: 6 × 100 yd easy/moderate with 20–30 sec rest, aiming for smoother strokes rather than faster splits.",
        "Finish: 4 × 50 yd easy with calm exhale and low head position.",
        "Cool-down: 100–200 yd easy.",
      ],
    },
  ];
}

function renderCalendarDetailBlocks(blocks) {
  if (!blocks.length) {
    return `
      <p class="calendar-detail__note">
        No separate detailed workout block matched this calendar item, so use the plan note above as the source of truth.
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
              <ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </article>
          `,
        )
        .join("")}
    </div>
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
    ["Bike", "bike"],
    ["Strength", "strength"],
    ["Hike", "hike"],
    ["Recovery", "recovery"],
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
  const phaseLabel = calendarPhaseLabels[day.phaseKey] ?? "Training block";
  const sessionContext = getCalendarSessionMilestoneContext(session);
  const coachingCue = getCalendarSessionCoachingCue(session);
  const workoutBlocks = getWorkoutSpecificBlocks(detailedWorkout, session, day);
  const isSwimSession = session.categories.includes("swim");
  const fallbackSwimBlocks = !workoutBlocks.length && isSwimSession ? getSwimFallbackBlocks(session) : [];
  const detailBlocks = workoutBlocks.length ? workoutBlocks : fallbackSwimBlocks;
  const workoutSpecificIntro = workoutBlocks.length
    ? detailedWorkout?.purpose
    : isSwimSession
      ? "Use the structured swim plan below as the source of truth for this session."
      : detailedWorkout?.purpose;
  const isStrengthSession = session.categories.includes("strength");
  const linkedActivity = getLinkedActivityForSession(session.id);
  const availableActivitiesForLink = !completed && !linkedActivity ? getAvailableActivitiesForSession(session) : [];

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

    ${isStrengthSession ? `
      <button 
        class="button button--primary calendar-detail__link" 
        type="button" 
        data-strength-workout-start="${session.id}"
      >
        Start Strength Workout
      </button>
    ` : ""}

    <section class="calendar-detail__context" aria-label="Workout context">
      <p>${escapeHtml(sessionContext)}</p>
      <p>${escapeHtml(coachingCue)}</p>
      <span>${escapeHtml(phaseLabel)}</span>
    </section>

    <section class="calendar-detail__section">
      <h4>Plan note</h4>
      <p>${escapeHtml(session.note)}</p>
    </section>

    ${renderCalendarRescheduleControls(session)}

    ${
      detailedWorkout
        ? `
          <section class="calendar-detail__section">
            <h4>Workout details</h4>
            <p>${escapeHtml(workoutSpecificIntro)}</p>
            ${renderCalendarDetailBlocks(detailBlocks)}
          </section>
        `
        : `
          <section class="calendar-detail__section">
            ${
              isSwimSession
                ? `
                  <h4>Workout details</h4>
                  <p>Use the structured swim plan below as the source of truth for this session.</p>
                  ${renderCalendarDetailBlocks(detailBlocks)}
                `
                : `
                  <h4>Tracking tip</h4>
                  <p>Use the checkbox here or in the calendar grid to keep this session synced with your monthly progress.</p>
                `
            }
          </section>
        `
    }

    ${
      isStrengthSession
        ? (() => {
            const latestLog = StrengthWorkoutManager.getLatestLogForDate(day.dateKey);
            if (latestLog && Object.keys(latestLog.exerciseLogs).length > 0) {
              return `
                <section class="calendar-detail__section">
                  <h4>Latest strength info</h4>
                  ${Object.entries(latestLog.exerciseLogs)
                    .map(([key, sets]) => {
                      const exerciseName = key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                      const latestSet = sets[sets.length - 1];
                      let display = `${latestSet.weight} × ${latestSet.reps}`;
                      if (latestSet.rpe) display += ` @ RPE ${latestSet.rpe}`;
                      return `<p style="margin: 0.4rem 0;">${escapeHtml(exerciseName)}: ${escapeHtml(display)}</p>`;
                    })
                    .join("")}
                </section>
              `;
            }
            return `
              <section class="calendar-detail__section">
                <h4>Latest strength info</h4>
                <p>No logged strength data yet. Start a workout to log your exercises.</p>
              </section>
            `;
          })()
        : ""
    }

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

function renderSummaryCards() {
  const el = document.querySelector("#summary-cards");
  el.innerHTML = summaryCards
    .map(
      (card) => `
        <article class="stat-card">
          <p class="stat-card__label">${card.label}</p>
          <p class="stat-card__value">${card.value}</p>
          <p class="stat-card__detail">${card.detail}</p>
        </article>
      `,
    )
    .join("");
}

function renderWeekTargets() {
  const el = document.querySelector("#week-targets");
  el.innerHTML = weekTargets
    .map(
      (target) => `
        <div class="mini-metric">
          <strong>${target.value}</strong>
          <span>${target.label}</span>
        </div>
      `,
    )
    .join("");
}

function renderMonthOneGoals() {
  const el = document.querySelector("#month-one-goals");
  if (!el) return;

  el.innerHTML = monthOneWeeklyGoals
    .map(
      (goal) => `
        <article class="month-one-goal-card">
          <p class="month-one-goal-card__date">${escapeHtml(goal.dates)}</p>
          <h4>${escapeHtml(goal.week)} · ${escapeHtml(goal.theme)}</h4>
          <ul class="month-one-goal-card__targets">
            ${goal.targets.map((target) => `<li>${escapeHtml(target)}</li>`).join("")}
          </ul>
          <p>${escapeHtml(goal.focus)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSwimPlan() {
  renderSwimMethodologyCards();
  renderSwimDrillProgression();
  renderSwimReadinessChecklist();
  renderLongSwimTargets();
}

function renderSwimMethodologyCards() {
  const el = document.querySelector("#swim-methodology-cards");
  if (!el) return;

  el.innerHTML = swimMethodologyCards
    .map(
      (card) => `
        <article class="swim-method-card">
          <p class="swim-method-card__metric">${escapeHtml(card.metric)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSwimDrillProgression() {
  const el = document.querySelector("#swim-drill-progression");
  if (!el) return;

  el.innerHTML = swimDrillProgression
    .map(
      (phase) => `
        <article class="drill-card">
          <p class="phase-card__date">${escapeHtml(phase.phase)}</p>
          <h3>${escapeHtml(phase.title)}</h3>
          <p>${escapeHtml(phase.focus)}</p>
          <ul>
            ${phase.drills.map((drill) => `<li>${escapeHtml(drill)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderSwimReadinessChecklist() {
  const el = document.querySelector("#swim-readiness-checklist");
  if (!el) return;

  el.innerHTML = swimReadinessChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderLongSwimTargets() {
  const el = document.querySelector("#long-swim-targets");
  if (!el) return;

  el.innerHTML = `
    <div class="long-swim-row long-swim-row--header" aria-hidden="true">
      <span>Week</span>
      <span>Dates</span>
      <span>Nonstop target</span>
      <span>Focus</span>
    </div>
    ${longSwimTargets
      .map(
        (row) => `
          <div class="long-swim-row">
            <strong>${escapeHtml(row.week)}</strong>
            <span>${escapeHtml(row.dates)}</span>
            <span class="long-swim-row__target">${escapeHtml(row.target)}</span>
            <span>${escapeHtml(row.focus)}</span>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderPhases() {
  const el = document.querySelector("#phase-timeline");
  el.innerHTML = phases
    .map(
      (phase) => `
        <article class="phase-card">
          <p class="phase-card__date">${phase.date}</p>
          <h3>${phase.title}</h3>
          <p>${phase.detail}</p>
        </article>
      `,
    )
    .join("");
}

function tagClass(category) {
  return `tag tag--${category}`;
}

function renderWorkouts() {
  const el = document.querySelector("#workout-grid");
  const visibleWorkouts = workouts.filter(
    (workout) => activeFilter === "all" || workout.categories.includes(activeFilter),
  );

  if (!visibleWorkouts.length) {
    el.innerHTML = `<p>No workouts match this filter.</p>`;
    return;
  }

  el.innerHTML = visibleWorkouts
    .map((workout) => {
      const dayTracking = getDayTracking(workout.id);
      return `
        <article class="workout-card" id="workout-${workout.id}" data-workout-id="${workout.id}">
          <header class="workout-card__header">
            <div class="workout-card__topline">
              <p class="day-label">${workout.day} · ${workout.date}</p>
              <span class="duration-pill">${workout.duration}</span>
            </div>
            <h3>${workout.title}</h3>
          </header>
          <div class="workout-card__body">
            <div class="tags">
              ${workout.categories
                .map((category) => `<span class="${tagClass(category)}">${category}</span>`)
                .join("")}
            </div>
            <p class="workout-purpose">${workout.purpose}</p>
            ${workout.blocks
              .filter((block) => block.title !== "Track")
              .map(
                (block) => `
                  <section class="workout-block">
                    <h4>${block.title}</h4>
                    <ul>
                      ${block.items.map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                  </section>
                `,
              )
              .join("")}
            ${renderTrackingForm(workout, dayTracking)}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTrackingForm(workout, dayTracking) {
  return `
    <form class="tracking-form" data-tracking-form="${workout.id}">
      <label class="complete-toggle">
        <input type="checkbox" name="completed" ${dayTracking.completed ? "checked" : ""} />
        Completed / adjusted intentionally
      </label>
    </form>
  `;
}

function renderTrackingSummary() {
  const completed = workouts.filter((workout) => getDayTracking(workout.id).completed).length;
  const completionPercent = Math.round((completed / workouts.length) * 100);

  const categoryTotals = [
    ["Swim", "swim"],
    ["Bike", "bike"],
    ["Strength", "strength"],
    ["Hike/Stairs", "hike"],
  ].map(([label, category]) => {
    const total = workouts.filter((workout) => workout.categories.includes(category)).length;
    const done = workouts.filter(
      (workout) => workout.categories.includes(category) && getDayTracking(workout.id).completed,
    ).length;
    return { label, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });

  const el = document.querySelector("#tracking-summary");
  el.innerHTML = `
    ${renderSummaryRow("June", completionPercent, `${completed}/${workouts.length} days`)}
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

function attachFilterEvents() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document
        .querySelectorAll(".filter-button")
        .forEach((item) => item.classList.toggle("is-active", item === button));
      renderWorkouts();
      attachTrackingEvents();
    });
  });
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

function createCheckinText() {
  const lines = [
    "June check-in: June 1–30",
    "",
    ...workouts.map((workout) => {
      const day = getDayTracking(workout.id);
      return [
        `${workout.day} ${workout.date} — ${workout.title}`,
        `Completed/adjusted: ${day.completed ? "yes" : "no"}`,
      ].join("\n");
    }),
  ];

  return lines.join("\n\n");
}

async function copyCheckin() {
  const text = createCheckinText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("June check-in copied to clipboard.");
  } catch (error) {
    console.warn("Clipboard unavailable", error);
    window.prompt("Copy your weekly check-in:", text);
  }
}

function getWorkoutDateKey(workout) {
  return weekOneDatesByTrackingId[workout.id] ?? "";
}

function resetTracking() {
  const confirmed = window.confirm("Reset all calendar, workout moves, and June workout tracking saved in this browser?");
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
  workoutLogs: {},

  init() {
    this.loadLogsFromLocalStorage();
    this.attachModalEvents();
  },

  loadLogsFromLocalStorage() {
    const stored = localStorage.getItem("strengthLogs");
    this.workoutLogs = stored ? JSON.parse(stored) : {};
  },

  saveLogsToLocalStorage() {
    localStorage.setItem("strengthLogs", JSON.stringify(this.workoutLogs));
    const dateKey = this.currentDateKey || new Date().toISOString().slice(0, 10);
    api.saveStrengthLogs(dateKey, this.workoutLogs).catch(() => {});
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
    this.currentSessionId = sessionId;
    this.currentDateKey = day.dateKey;
    this.currentWorkout = {
      workoutId: sessionId,
      title: session.title,
      date: day.dateKey,
      dateDisplay: formatCalendarDate(day),
      exerciseLogs: {},
      timestamp: Date.now(),
    };

    this.renderWorkoutModal();
    this.openWorkoutModal();
  },

  renderWorkoutModal() {
    const modal = document.querySelector("#strength-workout-modal");
    const titleEl = document.querySelector("#strength-workout-title");
    const dateEl = document.querySelector("#strength-workout-date");
    const exerciseListEl = document.querySelector("#strength-exercise-list");

    if (titleEl) titleEl.textContent = this.currentWorkout.title;
    if (dateEl) dateEl.textContent = this.currentWorkout.dateDisplay;

    const sessionId = this.currentSessionId;
    const context = getCalendarSessionContext(sessionId);
    if (!context || !context.session.categories.includes("strength")) {
      exerciseListEl.innerHTML = "<p>No exercises found for this workout.</p>";
      return;
    }

    const detailedWorkout = getDetailedWorkoutForDate(context.day.dateKey);
    if (!detailedWorkout) {
      exerciseListEl.innerHTML = "<p>No detailed workout found.</p>";
      return;
    }

    const exercises = this.extractExercisesFromWorkout(detailedWorkout, context.session);
    exerciseListEl.innerHTML = exercises
      .map((exercise, idx) => this.renderExerciseForm(exercise, idx))
      .join("");

    // Attach event listeners for add-set buttons
    exerciseListEl.querySelectorAll(".add-set-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const exerciseKey = btn.dataset.exerciseKey;
        this.addSet(exerciseKey);
      });
    });

    // Attach event listeners for delete buttons
    exerciseListEl.querySelectorAll(".set-delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const exerciseKey = btn.dataset.exerciseKey;
        const setIndex = parseInt(btn.dataset.setIndex);
        this.deleteSet(exerciseKey, setIndex);
      });
    });

    // Attach input listeners for auto-save
    exerciseListEl.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("change", () => this.autoSaveForm());
      input.addEventListener("blur", () => this.autoSaveForm());
    });
  },

  extractExercisesFromWorkout(workout, session) {
    const relevantBlocks = workout.blocks.filter((block) => {
      const blockTitle = block.title.toLowerCase();
      const blockText = `${block.title} ${block.items.join(" ")}`.toLowerCase();
      const categoryKeywords = session.categories.flatMap((cat) => getBlockCategoryKeywords(cat));
      return categoryKeywords.some((keyword) => blockTitle.includes(keyword) || blockText.includes(keyword));
    });

    const exercises = [];
    relevantBlocks.forEach((block) => {
      block.items.forEach((item) => {
        const match = item.match(/^([^:]+):/);
        if (match) {
          const exerciseName = match[1].trim();
          const exerciseKey = exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          if (!exercises.find((e) => e.key === exerciseKey)) {
            exercises.push({
              key: exerciseKey,
              name: exerciseName,
              description: item,
            });
          }
        }
      });
    });

    return exercises.length > 0
      ? exercises
      : [
          {
            key: "exercise-1",
            name: "Exercise 1",
            description: session.title,
          },
          {
            key: "exercise-2",
            name: "Exercise 2",
            description: "Additional exercise",
          },
        ];
  },

  renderExerciseForm(exercise, idx) {
    const sets = this.currentWorkout.exerciseLogs[exercise.key] || [{ weight: "", reps: "", rpe: "", notes: "" }];
    const exerciseKey = exercise.key;

    return `
      <div class="exercise-form">
        <h3 class="exercise-form-title">${escapeHtml(exercise.name)}</h3>
        <p style="color: var(--muted); font-size: 0.9rem; margin: 0 0 0.8rem;">${escapeHtml(exercise.description)}</p>
        
        <div class="exercise-sets">
          ${sets
            .map(
              (set, setIdx) => `
                <div style="border-bottom: 1px solid rgba(220, 230, 223, 0.5); padding-bottom: 0.8rem; margin-bottom: 0.8rem;">
                  <div class="exercise-set-row">
                    <div class="set-inputs">
                      <label>Weight/Load</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 185 lb or BW" 
                        value="${escapeHtml(set.weight)}"
                        data-exercise-key="${exerciseKey}"
                        data-set-index="${setIdx}"
                        data-field="weight"
                        class="weight-input"
                      />
                    </div>
                    <div class="set-inputs">
                      <label>Reps/Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 6 or 90 sec" 
                        value="${escapeHtml(set.reps)}"
                        data-exercise-key="${exerciseKey}"
                        data-set-index="${setIdx}"
                        data-field="reps"
                        class="reps-input"
                      />
                    </div>
                    <div class="set-inputs">
                      <label>RPE (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="7" 
                        value="${set.rpe}"
                        data-exercise-key="${exerciseKey}"
                        data-set-index="${setIdx}"
                        data-field="rpe"
                        class="rpe-input"
                      />
                    </div>
                    ${setIdx > 0 ? `
                      <button 
                        type="button" 
                        class="set-delete-btn" 
                        data-exercise-key="${exerciseKey}"
                        data-set-index="${setIdx}"
                      >
                        Delete
                      </button>
                    ` : '<div></div>'}
                  </div>
                  <div class="exercise-notes" style="margin-top: 0.5rem;">
                    <label style="display: block; font-size: 0.75rem; margin-bottom: 0.3rem;">Notes (Set ${setIdx + 1})</label>
                    <textarea 
                      placeholder="How did this set feel?"
                      data-exercise-key="${exerciseKey}"
                      data-set-index="${setIdx}"
                      data-field="notes"
                      class="notes-input"
                      style="min-height: 50px;"
                    >${escapeHtml(set.notes || "")}</textarea>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>

        <button 
          type="button" 
          class="add-set-btn" 
          data-exercise-key="${exerciseKey}"
        >
          + Add Set
        </button>
      </div>
    `;
  },

  autoSaveForm() {
    const exerciseListEl = document.querySelector("#strength-exercise-list");
    if (!exerciseListEl) return;

    const inputs = exerciseListEl.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      const exerciseKey = input.dataset.exerciseKey;
      const setIndex = parseInt(input.dataset.setIndex) || 0;
      const field = input.dataset.field;

      if (!this.currentWorkout.exerciseLogs[exerciseKey]) {
        this.currentWorkout.exerciseLogs[exerciseKey] = [];
      }

      if (!this.currentWorkout.exerciseLogs[exerciseKey][setIndex]) {
        this.currentWorkout.exerciseLogs[exerciseKey][setIndex] = { weight: "", reps: "", rpe: "", notes: "" };
      }

      this.currentWorkout.exerciseLogs[exerciseKey][setIndex][field] = input.value;
    });

    this.saveLogsToLocalStorage();
  },

  addSet(exerciseKey) {
    if (!this.currentWorkout.exerciseLogs[exerciseKey]) {
      this.currentWorkout.exerciseLogs[exerciseKey] = [];
    }
    this.currentWorkout.exerciseLogs[exerciseKey].push({ weight: "", reps: "", rpe: "", notes: "" });
    this.renderWorkoutModal();
  },

  deleteSet(exerciseKey, setIndex) {
    if (this.currentWorkout.exerciseLogs[exerciseKey]) {
      this.currentWorkout.exerciseLogs[exerciseKey].splice(setIndex, 1);
      this.renderWorkoutModal();
    }
  },

  finishWorkout() {
    this.autoSaveForm();

    const workout = this.currentWorkout;
    const logKey = `${workout.date}-${workout.workoutId}`;
    this.workoutLogs[logKey] = {
      ...workout,
      timestamp: Date.now(),
      syncedToBackend: false,
      syncedAt: null,
    };

    this.saveLogsToLocalStorage();
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
        const exerciseName = key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const setsHtml = sets
          .map((set) => {
            let display = `${set.weight} × ${set.reps}`;
            if (set.rpe) display += ` @ RPE ${set.rpe}`;
            if (set.notes) display += ` - ${set.notes}`;
            return `<div class="summary-exercise-set">${escapeHtml(display)}</div>`;
          })
          .join("");

        return `
          <div class="summary-exercise">
            <h4 class="summary-exercise-title">${escapeHtml(exerciseName)}</h4>
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
      timestamp: Date.now(),
    };

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
  renderCalendar();
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