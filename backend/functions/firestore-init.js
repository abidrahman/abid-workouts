import { db } from './firebase-admin-init.js';

/**
 * Firestore Collection Schema
 * 
 * This module defines the structure and initialization of Firestore collections
 * for storing user data, workout tracking, activity matches, etc.
 */

/**
 * Initialize Firestore collections with default structure
 * Call this once during backend setup
 */
export async function initializeFirestoreCollections() {
  console.log('Initializing Firestore collections...');
  
  // Collections are created automatically when you first write to them
  // This function just documents the schema structure
  
  const schemaInfo = {
    'users/{userId}': {
      description: 'User profiles and authentication tokens',
      fields: {
        id: 'string (user ID)',
        stravaAccessToken: 'string (encrypted)',
        stravaRefreshToken: 'string (encrypted)',
        lastSyncTime: 'timestamp (last activity sync)',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      }
    },
    'users/{userId}/workoutTracking/{date}': {
      description: 'Workout completion tracking by date',
      example: 'users/user123/workoutTracking/2026-06-15',
      fields: {
        date: 'string (YYYY-MM-DD)',
        sessions: {
          '{sessionId}': {
            checked: 'boolean',
            checkedAt: 'timestamp',
            checkedBy: 'string (auto|manual|sync)',
            autoMatched: 'boolean (true if auto-checked from Strava)'
          }
        },
        updatedAt: 'timestamp'
      }
    },
    'users/{userId}/activityMatches/{activityId}': {
      description: 'Manual links between Strava activities and planned workouts',
      fields: {
        activityId: 'string (Strava activity ID)',
        workoutId: 'string (planned session ID)',
        activity: 'object (full activity data from Strava)',
        linkedAt: 'timestamp',
        linkedBy: 'string (user|auto)',
        manual: 'boolean (user manually linked)',
        updatedAt: 'timestamp'
      }
    },
    'users/{userId}/extraWorkouts/{activityId}': {
      description: 'Unplanned/extra activities marked by user',
      fields: {
        activityId: 'string (Strava activity ID)',
        activity: 'object (full activity data)',
        markedAsExtraAt: 'timestamp',
        device: 'string (desktop|mobile|api)',
        updatedAt: 'timestamp'
      }
    },
    'users/{userId}/strengthLogs/{logId}': {
      description: 'Exercise/strength workout logs (future use)',
      fields: {
        id: 'string (log ID)',
        date: 'string (YYYY-MM-DD)',
        sessionId: 'string (planned session ID)',
        exercise: 'string (exercise name)',
        sets: [
          {
            setNumber: 'number',
            reps: 'number',
            weight: 'number (in lbs)',
            rpe: 'number (1-10 perceived exertion)',
            duration: 'number (seconds, for time-based exercises)',
            notes: 'string'
          }
        ],
        totalDuration: 'number (seconds)',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      }
    }
  };
  
  console.log('Schema structure:', JSON.stringify(schemaInfo, null, 2));
  console.log('Collections will be auto-created on first write');
  
  return schemaInfo;
}

/**
 * Create or update a user document
 */
export async function createUser(userId, userData) {
  const userRef = db.collection('users').doc(userId);
  const now = new Date();
  
  const userDoc = {
    id: userId,
    stravaAccessToken: userData.stravaAccessToken || null,
    stravaRefreshToken: userData.stravaRefreshToken || null,
    createdAt: now,
    updatedAt: now,
    ...userData
  };
  
  await userRef.set(userDoc, { merge: true });
  console.log(`Created/updated user: ${userId}`);
  return userDoc;
}

/**
 * Save workout tracking state (which workouts checked off)
 */
export async function saveWorkoutTracking(userId, dateKey, sessionId, isChecked, autoMatched = false) {
  const trackingRef = db.collection('users').doc(userId)
    .collection('workoutTracking').doc(dateKey);
  
  const now = new Date();
  const sessionData = {
    checked: isChecked,
    checkedAt: now,
    checkedBy: autoMatched ? 'auto' : 'manual',
    autoMatched: autoMatched
  };
  
  await trackingRef.update({
    [`sessions.${sessionId}`]: sessionData,
    updatedAt: now
  }).catch(async (error) => {
    // Document doesn't exist yet, create it
    if (error.code === 'not-found') {
      await trackingRef.set({
        date: dateKey,
        sessions: {
          [sessionId]: sessionData
        },
        updatedAt: now
      });
    } else {
      throw error;
    }
  });
  
  console.log(`Saved tracking: ${userId}/${dateKey}/${sessionId} = ${isChecked}`);
}

/**
 * Save a manual activity match
 */
export async function saveActivityMatch(userId, activityId, workoutId, activity) {
  const matchRef = db.collection('users').doc(userId)
    .collection('activityMatches').doc(activityId);
  
  const now = new Date();
  
  await matchRef.set({
    activityId,
    workoutId,
    activity,
    linkedAt: now,
    linkedBy: 'user',
    manual: true,
    updatedAt: now
  });
  
  console.log(`Saved activity match: ${activityId} -> ${workoutId}`);
}

/**
 * Mark activity as extra/unplanned
 */
export async function saveExtraWorkout(userId, activityId, activity) {
  const extraRef = db.collection('users').doc(userId)
    .collection('extraWorkouts').doc(activityId);
  
  const now = new Date();
  
  await extraRef.set({
    activityId,
    activity,
    markedAsExtraAt: now,
    device: 'api',
    updatedAt: now
  });
  
  console.log(`Saved extra workout: ${activityId}`);
}

/**
 * Save a strength exercise log
 */
export async function saveStrengthLog(userId, dateKey, logId, logData) {
  const logRef = db.collection('users').doc(userId)
    .collection('strengthLogs').doc(logId);
  
  const now = new Date();
  
  await logRef.set({
    id: logId,
    date: dateKey,
    ...logData,
    createdAt: now,
    updatedAt: now
  });
  
  console.log(`Saved strength log: ${userId}/${dateKey}/${logId}`);
}

/**
 * Get all workout tracking for a user on a specific date
 */
export async function getWorkoutTrackingForDate(userId, dateKey) {
  const trackingRef = db.collection('users').doc(userId)
    .collection('workoutTracking').doc(dateKey);
  
  const doc = await trackingRef.get();
  
  if (!doc.exists) {
    return { date: dateKey, sessions: {} };
  }
  
  return doc.data();
}

/**
 * Get all activity matches for a user
 */
export async function getActivityMatches(userId) {
  const matchesSnapshot = await db.collection('users').doc(userId)
    .collection('activityMatches').get();
  
  const matches = {};
  matchesSnapshot.forEach(doc => {
    matches[doc.id] = doc.data();
  });
  
  return matches;
}

/**
 * Get all extra workouts for a user
 */
export async function getExtraWorkouts(userId) {
  const extrasSnapshot = await db.collection('users').doc(userId)
    .collection('extraWorkouts').get();
  
  const extras = {};
  extrasSnapshot.forEach(doc => {
    extras[doc.id] = doc.data();
  });
  
  return extras;
}

/**
 * Delete an activity match
 */
export async function deleteActivityMatch(userId, activityId) {
  await db.collection('users').doc(userId)
    .collection('activityMatches').doc(activityId).delete();
  
  console.log(`Deleted activity match: ${activityId}`);
}

/**
 * Delete an extra workout
 */
export async function deleteExtraWorkout(userId, activityId) {
  await db.collection('users').doc(userId)
    .collection('extraWorkouts').doc(activityId).delete();
  
  console.log(`Deleted extra workout: ${activityId}`);
}

export { db };
