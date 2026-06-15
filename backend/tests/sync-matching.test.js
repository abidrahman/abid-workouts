/**
 * Tests for Phase 3: Activity Auto-Matching Logic
 * 
 * Run with: node backend/tests/sync-matching.test.js
 */

import {
  matchActivityToWorkout,
  syncActivitiesAgainstPlan,
  normalizeActivityType,
  parseDurationString,
  durationMatches,
} from '../functions/sync.js';

const tests = [];
const results = { passed: 0, failed: 0 };

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function runTests() {
  console.log('Running Phase 3 sync matching tests...\n');
  
  for (const { name, fn } of tests) {
    try {
      fn();
      console.log(`✓ ${name}`);
      results.passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  ${error.message}\n`);
      results.failed++;
    }
  }
  
  console.log(`\n${results.passed} passed, ${results.failed} failed`);
  process.exit(results.failed > 0 ? 1 : 0);
}

// ============ TESTS ============

test('normalizeActivityType: Swim types', () => {
  assertEqual(normalizeActivityType('Swim'), 'swim', 'Swim');
  assertEqual(normalizeActivityType('Pool Swim'), 'swim', 'Pool Swim');
  assertEqual(normalizeActivityType('Open Water Swim'), 'swim', 'Open Water Swim');
});

test('normalizeActivityType: Bike types', () => {
  assertEqual(normalizeActivityType('Bike'), 'bike', 'Bike');
  assertEqual(normalizeActivityType('Cycling'), 'bike', 'Cycling');
  assertEqual(normalizeActivityType('Road Cycling'), 'bike', 'Road Cycling');
});

test('normalizeActivityType: Hike/Run types', () => {
  assertEqual(normalizeActivityType('Run'), 'hike', 'Run');
  assertEqual(normalizeActivityType('Hiking'), 'hike', 'Hiking');
  assertEqual(normalizeActivityType('Trail Running'), 'hike', 'Trail Running');
});

test('normalizeActivityType: Unknown type', () => {
  assertEqual(normalizeActivityType('Unknown'), null, 'Unknown type returns null');
});

test('parseDurationString: Standard duration', () => {
  const result = parseDurationString('90–115 min');
  assertEqual(result.min, 90, 'min value');
  assertEqual(result.max, 115, 'max value');
  assertEqual(result.unit, 'min', 'unit');
});

test('parseDurationString: Distance duration', () => {
  const result = parseDurationString('1,400–1,700 yd');
  assertEqual(result.min, 1400, 'min value with comma');
  assertEqual(result.max, 1700, 'max value with comma');
  assertEqual(result.unit, 'yd', 'unit');
});

test('parseDurationString: Invalid duration', () => {
  const result = parseDurationString('invalid');
  assertEqual(result, null, 'invalid string returns null');
});

test('durationMatches: High confidence match', () => {
  const confidence = durationMatches(100, '90–115 min');
  assertEqual(confidence, 'high', '100 min within 90-115 min range');
});

test('durationMatches: Medium confidence match', () => {
  const confidence = durationMatches(130, '90–115 min');
  assertEqual(confidence, 'medium', '130 min outside range but within 50%');
});

test('durationMatches: Low confidence match', () => {
  const confidence = durationMatches(30, '90–115 min');
  assertEqual(confidence, 'low', '30 min too short');
});

test('matchActivityToWorkout: Perfect match', () => {
  const activity = {
    id: 'a1',
    date: '2026-06-01',
    type: 'Swim',
    duration: 3600, // 60 min
  };
  
  const workout = {
    id: 'w1',
    title: 'Swim session',
    duration: '55–65 min',
    categories: ['swim'],
  };
  
  const result = matchActivityToWorkout(activity, { '2026-06-01': [workout] });
  
  assertEqual(result.matchedWorkoutId, 'w1', 'Should match to workout');
  assertEqual(result.confidence, 'high', 'Should have high confidence');
});

test('matchActivityToWorkout: No match on different date', () => {
  const activity = {
    id: 'a1',
    date: '2026-06-01',
    type: 'Swim',
    duration: 3600,
  };
  
  const workout = {
    id: 'w1',
    title: 'Swim session',
    duration: '55–65 min',
    categories: ['swim'],
  };
  
  const result = matchActivityToWorkout(activity, { '2026-06-02': [workout] });
  
  assertEqual(result.matchedWorkoutId, null, 'Should not match');
  assertEqual(result.confidence, 'none', 'Should have no confidence');
});

test('matchActivityToWorkout: Type mismatch', () => {
  const activity = {
    id: 'a1',
    date: '2026-06-01',
    type: 'Bike',
    duration: 3600,
  };
  
  const workout = {
    id: 'w1',
    title: 'Swim session',
    duration: '55–65 min',
    categories: ['swim'],
  };
  
  const result = matchActivityToWorkout(activity, { '2026-06-01': [workout] });
  
  assertEqual(result.matchedWorkoutId, null, 'Should not match');
  assertEqual(result.confidence, 'none', 'Should have no confidence');
});

test('matchActivityToWorkout: Multiple candidates', () => {
  const activity = {
    id: 'a1',
    date: '2026-06-01',
    type: 'Swim',
    duration: 3600,
  };
  
  const workouts = [
    { id: 'w1', title: 'Swim 1', duration: '55–65 min', categories: ['swim'] },
    { id: 'w2', title: 'Swim 2', duration: '50–70 min', categories: ['swim'] },
  ];
  
  const result = matchActivityToWorkout(activity, { '2026-06-01': workouts });
  
  assertEqual(result.confidence, 'conflict', 'Should indicate conflict');
  assert(result.candidates.length > 0, 'Should list candidates');
});

test('syncActivitiesAgainstPlan: Auto-check activity', () => {
  const activities = [
    {
      id: 'a1',
      date: '2026-06-01',
      type: 'Swim',
      duration: 3600,
    },
  ];
  
  const workoutPlan = {
    '2026-06-01': [
      { id: 'w1', title: 'Swim', duration: '55–65 min', categories: ['swim'] },
    ],
  };
  
  const result = syncActivitiesAgainstPlan(activities, workoutPlan);
  
  assertEqual(result.autoChecked.length, 1, 'Should auto-check one activity');
  assertEqual(result.autoChecked[0].matchedWorkoutId, 'w1', 'Should match to w1');
});

test('syncActivitiesAgainstPlan: Skip already checked', () => {
  const activities = [
    {
      id: 'a1',
      date: '2026-06-01',
      type: 'Swim',
      duration: 3600,
    },
  ];
  
  const workoutPlan = {
    '2026-06-01': [
      { id: 'w1', title: 'Swim', duration: '55–65 min', categories: ['swim'] },
    ],
  };
  
  const currentTracking = {
    'w1': { completed: true },
  };
  
  const result = syncActivitiesAgainstPlan(activities, workoutPlan, currentTracking);
  
  assertEqual(result.skipped.length, 1, 'Should skip already-checked workout');
  assertEqual(result.autoChecked.length, 0, 'Should not auto-check');
});

test('syncActivitiesAgainstPlan: Unmatched activity', () => {
  const activities = [
    {
      id: 'a1',
      date: '2026-06-01',
      type: 'Swim',
      duration: 3600,
    },
  ];
  
  const result = syncActivitiesAgainstPlan(activities, {});
  
  assertEqual(result.unmatched.length, 1, 'Should have unmatched activity');
  assertEqual(result.autoChecked.length, 0, 'Should not auto-check');
});

// Run all tests
runTests();
