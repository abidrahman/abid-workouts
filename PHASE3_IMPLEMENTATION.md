# Phase 3: Activity Auto-Matching & Workout Auto-Checking

## Overview

Phase 3 implements automatic matching of COROS activities to planned workouts. When the app syncs with COROS, it attempts to match activities (like a pool swim or bike ride) to planned workouts based on:

- **Date matching**: Activity date must match planned workout date
- **Type matching**: Activity type (swim, bike, hike) must match workout categories
- **Duration heuristics**: Activity duration should be within ±30% of planned duration

## Components

### Backend Functions

#### `backend/functions/sync.js`
Core matching logic that includes:
- `normalizeActivityType(corosType)` - Maps COROS activity types to workout categories
- `matchActivityToWorkout(activity, workoutPlanByDate)` - Matches a single activity to plan
- `syncActivitiesAgainstPlan(activities, workoutPlanByDate, currentTracking)` - Syncs batch of activities
- `evaluateMatch(activity, workout)` - Evaluates match confidence
- `durationMatches(activityDurationMinutes, plannedDurationStr)` - Checks duration compatibility

#### `backend/functions/sync-activities.js`
Firebase Cloud Function handler for `/sync-activities` endpoint:
- POST endpoint that accepts activities, workout plan, and current tracking
- Returns auto-checked, conflicts, unmatched, and skipped activities

### Frontend Integration

#### App Initialization
```javascript
// Automatically called on app load
syncActivities()
  .then(() => renderCalendar())
  .catch(err => console.warn("Sync failed:", err))
```

#### Data Storage
- `corosActivities` - Array of COROS activity objects (from API)
- `AUTO_MATCHED_STORAGE_KEY` - localStorage key for auto-matched results
- `autoMatched` - Object tracking auto-checked activities

#### Rendering
- `renderAutoCheckBadge(autoMatchInfo)` - Shows auto-check badge on calendar
- `calendar-session--auto-checked` - CSS class for auto-checked sessions
- `.calendar-session__auto-check-badge` - Styling for badge

## Activity Data Structure

```javascript
{
  id: "activity_123",           // Unique COROS activity ID
  date: "2026-06-12",           // Activity date (YYYY-MM-DD)
  type: "Swim",                 // COROS activity type
  duration: 3900,               // Duration in seconds
  distance: 1500,               // Distance in meters
  calories: 350,                // Calories burned
  notes: "pool swim"            // User notes
}
```

## Matching Results

```javascript
{
  activity: { ... },                    // Original activity
  matchedWorkoutId: "mon-jun-1",        // Matched workout ID
  confidence: "high" | "medium" | "conflict" | "none",
  candidates: ["mon-jun-1", "tue-jun-2"],  // Multiple matches
  reason: "Match explanation"
}
```

## Sync Results

```javascript
{
  autoChecked: [
    { activity: {...}, matchedWorkoutId: "mon-jun-1", confidence: "high" }
  ],
  conflicts: [
    { activity: {...}, candidates: ["mon-jun-1", "tue-jun-2"], confidence: "conflict" }
  ],
  unmatched: [
    { activity: {...}, matchedWorkoutId: null, confidence: "none", reason: "..." }
  ],
  skipped: [
    { activity: {...}, reason: "Already manually checked" }
  ]
}
```

## Activity Type Mapping

| COROS Type | Mapped Category |
|----------|-----------------|
| Swim, Pool Swim, Open Water Swim | swim |
| Bike, Cycling, Road Cycling, Indoor Cycling | bike |
| Run, Trail Running, Hiking, Treadmill | hike |
| Strength, Weight Training, Gym | strength |
| Walking, Yoga, Stretching | recovery |

## Duration Matching Rules

1. **High confidence**: Activity duration within ±30% of planned range
2. **Medium confidence**: Activity duration within ±50% of planned range
3. **Low confidence**: Activity duration outside acceptable range

## Conflict Resolution

When an activity matches multiple workouts on the same date, the system returns a "conflict" result with all candidates. Future UI will allow users to select which workout to mark as complete.

## Testing

To test the matching logic:

```javascript
// Example activity
const testActivity = {
  id: "test_001",
  date: "2026-06-01",
  type: "Swim",
  duration: 3600,  // 60 minutes
  distance: 1500,
  calories: 350
};

// Example planned workout
const testWorkout = {
  id: "mon-jun-1",
  title: "Swim technique + Strength A",
  duration: "90–115 min",
  categories: ["swim", "strength"]
};

// Match
const result = matchActivityToWorkout(
  testActivity,
  { "2026-06-01": [testWorkout] }
);
// → { matchedWorkoutId: "mon-jun-1", confidence: "medium" }
```

## Future Enhancements

1. **Conflict Resolution UI**
   - Dialog showing multiple matches
   - User selection of correct match
   - Skip option for unmatched activities

2. **Activity Details Panel**
   - Show matched activity data (duration, distance, HR)
   - Display match confidence score
   - Edit or override match

3. **Sync History**
   - Track when activities were synced
   - Show synced activities in detail view
   - Timeline of auto-matches

4. **Advanced Matching**
   - Heart rate zone analysis
   - Elevation gain matching for hikes
   - Pace-based matching for runs
   - Multi-sport activity parsing

## Known Limitations

1. Only matches activities from the same date as planned workouts
2. Type mapping is conservative (avoids false positives)
3. Duration tolerance is fixed at ±30%
4. No support for multi-sport activities yet
5. Doesn't account for time zones in activity dates
