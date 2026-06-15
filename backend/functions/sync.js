/**
 * Activity-to-Workout Matching Logic for Phase 3
 *
 * Matches COROS activities to planned workouts using:
 * - Date matching (activity date = planned date)
 * - Type matching (swim→swim, bike→bike, etc.)
 * - Heuristic duration validation (±30% tolerance)
 */

/**
 * Maps COROS activity types to workout category types
 */
function normalizeActivityType(corosType) {
  const typeMap = {
    // Swimming
    'Swim': 'swim',
    'Pool Swim': 'swim',
    'Open Water Swim': 'swim',
    
    // Cycling
    'Bike': 'bike',
    'Cycling': 'bike',
    'Indoor Cycling': 'bike',
    'Road Cycling': 'bike',
    'Mountain Biking': 'bike',
    
    // Running/Hiking
    'Run': 'hike',
    'Trail Running': 'hike',
    'Hiking': 'hike',
    'Treadmill': 'hike',
    
    // Strength
    'Strength': 'strength',
    'Strength Training': 'strength',
    'Weight Training': 'strength',
    'Gym': 'strength',
    
    // Recovery
    'Walking': 'recovery',
    'Yoga': 'recovery',
    'Stretching': 'recovery',
    'Mobility': 'recovery',
  };
  
  return typeMap[corosType] || null;
}

/**
 * Converts duration from seconds to minutes
 */
function secondsToMinutes(seconds) {
  return Math.round(seconds / 60);
}

/**
 * Extracts planned duration from a workout duration string
 * Examples: "90–115 min", "45–75 min", "1,400–1,700 yd"
 * Returns: { min: number, max: number, unit: string } or null
 */
function parseDurationString(durationStr) {
  if (!durationStr) return null;
  
  // Extract numbers and unit from string
  const match = durationStr.match(/(\d+)[,\s]*–[,\s]*(\d+)\s*(min|hr|yd|m)/);
  if (!match) return null;
  
  const [, minStr, maxStr, unit] = match;
  return {
    min: parseInt(minStr, 10),
    max: parseInt(maxStr, 10),
    unit: unit.toLowerCase(),
  };
}

/**
 * Checks if activity duration falls within planned duration window
 * Allows ±30% tolerance for actual vs planned time
 */
function durationMatches(activityDurationMinutes, plannedDurationStr) {
  if (!plannedDurationStr) {
    // If no planned duration, we can't validate
    return 'medium';
  }
  
  const parsed = parseDurationString(plannedDurationStr);
  if (!parsed || parsed.unit !== 'min') {
    // If we can't parse duration or it's not in minutes, skip validation
    return 'medium';
  }
  
  const { min, max } = parsed;
  const tolerance = (max - min) * 0.3; // ±30% of range
  const acceptMin = min - tolerance;
  const acceptMax = max + tolerance;
  
  if (activityDurationMinutes >= acceptMin && activityDurationMinutes <= acceptMax) {
    return 'high';
  }
  
  // Check if it's at least close (within 50%)
  if (activityDurationMinutes >= min * 0.5 && activityDurationMinutes <= max * 1.5) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Matches a COROS activity to a planned workout
 *
 * @param {Object} activity - COROS activity object
 * @param {Object} workoutPlan - Planned workout object
 * @returns {Object} Match result with confidence level
 */
function evaluateMatch(activity, workout) {
  // Normalize types
  const activityType = normalizeActivityType(activity.type);
  if (!activityType) {
    return { confidence: null, reason: 'Unknown activity type' };
  }
  
  // Check if workout has this type
  const workoutCategories = workout.categories || [];
  const typeMatches = workoutCategories.includes(activityType);
  
  if (!typeMatches) {
    return {
      confidence: null,
      reason: `Type mismatch: ${activityType} not in ${workoutCategories.join(", ")}`,
    };
  }
  
  // Check duration match
  const activityMinutes = secondsToMinutes(activity.duration);
  const durationConfidence = durationMatches(activityMinutes, workout.duration);
  
  if (durationConfidence === 'low') {
    return { 
      confidence: 'medium',
      reason: `Duration mismatch: ${activityMinutes}min vs planned ${workout.duration}`,
    };
  }
  
  const confidence = durationConfidence === 'high' ? 'high' : 'medium';
  return { confidence, reason: 'Match' };
}

/**
 * Matches a COROS activity to the best matching workout(s) in the plan
 *
 * @param {Object} activity - COROS activity with id, date, type, duration, etc.
 * @param {Object} workoutPlanByDate - Map of date strings to workout arrays
 * @returns {Object} Match result containing matched workout(s) and confidence
 */
function matchActivityToWorkout(activity, workoutPlanByDate) {
  if (!activity || !activity.date || !activity.type || activity.duration === undefined) {
    return {
      activity,
      matchedWorkoutId: null,
      confidence: 'none',
      candidates: [],
      reason: 'Invalid activity data',
    };
  }
  
  // Get workouts for this date
  const workoutsForDate = workoutPlanByDate[activity.date] || [];
  
  if (workoutsForDate.length === 0) {
    return {
      activity,
      matchedWorkoutId: null,
      confidence: 'none',
      candidates: [],
      reason: `No planned workouts for ${activity.date}`,
    };
  }
  
  // Evaluate all workouts for this date
  const matches = [];
  for (const workout of workoutsForDate) {
    const evaluation = evaluateMatch(activity, workout);
    if (evaluation.confidence) {
      matches.push({
        workoutId: workout.id,
        title: workout.title,
        confidence: evaluation.confidence,
        reason: evaluation.reason,
      });
    }
  }
  
  if (matches.length === 0) {
    return {
      activity,
      matchedWorkoutId: null,
      confidence: 'none',
      candidates: [],
      reason: `No matching workout types for ${activity.type} on ${activity.date}`,
    };
  }
  
  // Sort by confidence (high > medium)
  matches.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence] - order[b.confidence];
  });
  
  const bestMatch = matches[0];
  
  // Return results
  if (matches.length === 1) {
    return {
      activity,
      matchedWorkoutId: bestMatch.workoutId,
      confidence: bestMatch.confidence,
      candidates: [],
      reason: bestMatch.reason,
    };
  }
  
  // Multiple matches - return as conflict
  const allCandidates = matches.map(m => m.workoutId);
  return {
    activity,
    matchedWorkoutId: null,
    confidence: 'conflict',
    candidates: allCandidates,
    reason: `Multiple possible matches: ${allCandidates.join(", ")}`,
  };
}

/**
 * Syncs a batch of COROS activities against a workout plan
 * Returns matches and conflicts
 *
 * @param {Array} activities - Array of COROS activity objects
 * @param {Object} workoutPlanByDate - Map of date strings to workout arrays
 * @param {Object} currentTracking - Current workout completion tracking
 * @returns {Object} Sync result with auto-checked, conflicts, unmatched
 */
function syncActivitiesAgainstPlan(activities, workoutPlanByDate, currentTracking = {}) {
  const results = {
    autoChecked: [],      // Activities that auto-checked a workout
    conflicts: [],        // Activities with multiple matches
    unmatched: [],        // Activities with no match
    skipped: [],          // Activities that matched but workout already completed
  };
  
  for (const activity of activities) {
    const match = matchActivityToWorkout(activity, workoutPlanByDate);
    
    if (match.confidence === 'none') {
      results.unmatched.push(match);
    } else if (match.confidence === 'conflict') {
      results.conflicts.push(match);
    } else if (match.matchedWorkoutId) {
      // Check if already checked manually
      const tracking = currentTracking[match.matchedWorkoutId];
      const alreadyCompleted = typeof tracking?.completed === 'boolean' ? tracking.completed : false;
      
      if (alreadyCompleted) {
        results.skipped.push({
          ...match,
          reason: 'Already manually checked',
        });
      } else {
        results.autoChecked.push(match);
      }
    }
  }
  
  return results;
}

export { 
  matchActivityToWorkout,
  syncActivitiesAgainstPlan,
  normalizeActivityType,
  parseDurationString,
  durationMatches,
  evaluateMatch,
};
