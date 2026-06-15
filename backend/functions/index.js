import functions from 'firebase-functions';
import { db } from './firebase-admin-init.js';

// Import cloud functions
import authFunction from './auth.js';
import activitiesFunction from './activities.js';
import metricsFunction from './metrics.js';
import syncActivitiesFunction from './sync-activities.js';
import {
  handleSyncTracking,
  handleLoadTracking,
  handleSyncActivityMatch,
  handleLoadActivityMatches,
  handleRemoveActivityMatch,
  handleSyncExtraWorkout,
  handleLoadExtraWorkouts,
  handleRemoveExtraWorkout,
  handleLoadAllUserData
} from './data-sync.js';

// Export existing cloud functions
export const auth = functions.https.onRequest(authFunction);
export const activities = functions.https.onRequest(activitiesFunction);
export const metrics = functions.https.onRequest(metricsFunction);
export const syncActivities = functions.https.onRequest(syncActivitiesFunction);

// Export data sync endpoints
export const syncTracking = functions.https.onRequest(handleSyncTracking);
export const loadTracking = functions.https.onRequest(handleLoadTracking);
export const syncActivityMatch = functions.https.onRequest(handleSyncActivityMatch);
export const loadActivityMatches = functions.https.onRequest(handleLoadActivityMatches);
export const removeActivityMatch = functions.https.onRequest(handleRemoveActivityMatch);
export const syncExtraWorkout = functions.https.onRequest(handleSyncExtraWorkout);
export const loadExtraWorkouts = functions.https.onRequest(handleLoadExtraWorkouts);
export const removeExtraWorkout = functions.https.onRequest(handleRemoveExtraWorkout);
export const loadAllUserData = functions.https.onRequest(handleLoadAllUserData);

// Helper function to get Firestore database instance
export { db };
