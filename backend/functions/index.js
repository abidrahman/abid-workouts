import admin from 'firebase-admin';
import functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Import cloud functions
import authFunction from './auth.js';
import activitiesFunction from './activities.js';
import metricsFunction from './metrics.js';
import syncActivitiesFunction from './sync-activities.js';

// Export cloud functions
export const auth = functions.https.onRequest(authFunction);
export const activities = functions.https.onRequest(activitiesFunction);
export const metrics = functions.https.onRequest(metricsFunction);
export const syncActivities = functions.https.onRequest(syncActivitiesFunction);

// Helper function to get Firestore database instance
export { db };
