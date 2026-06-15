import cors from 'cors';
import { getFirestore } from 'firebase-admin/firestore';
import {
  saveWorkoutTracking,
  saveActivityMatch,
  saveExtraWorkout,
  getWorkoutTrackingForDate,
  getActivityMatches,
  getExtraWorkouts,
  deleteActivityMatch,
  deleteExtraWorkout
} from './firestore-init.js';

const corsHandler = cors({ origin: true });
const db = getFirestore();

/**
 * POST /api/sync-tracking
 * Sync workout tracking state (which workouts are checked off)
 * 
 * Request body:
 * {
 *   userId: string,
 *   dateKey: string (YYYY-MM-DD),
 *   sessionId: string,
 *   checked: boolean,
 *   autoMatched?: boolean
 * }
 */
export async function handleSyncTracking(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, dateKey, sessionId, checked, autoMatched } = req.body;
      
      if (!userId || !dateKey || !sessionId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      await saveWorkoutTracking(userId, dateKey, sessionId, checked, autoMatched);
      
      res.json({
        success: true,
        message: `Updated tracking for ${sessionId} on ${dateKey}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing tracking:', error);
      res.status(500).json({ error: 'Failed to sync tracking', details: error.message });
    }
  });
}

/**
 * GET /api/load-tracking
 * Load all workout tracking for a specific date
 * 
 * Query parameters:
 * - userId: string (required)
 * - dateKey: string (YYYY-MM-DD) (required)
 */
export async function handleLoadTracking(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, dateKey } = req.query;
      
      if (!userId || !dateKey) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const tracking = await getWorkoutTrackingForDate(userId, dateKey);
      
      res.json({
        success: true,
        data: tracking,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading tracking:', error);
      res.status(500).json({ error: 'Failed to load tracking', details: error.message });
    }
  });
}

/**
 * POST /api/sync-activity-match
 * Save a manual activity-to-workout match
 * 
 * Request body:
 * {
 *   userId: string,
 *   activityId: string,
 *   workoutId: string,
 *   activity: object (full activity data)
 * }
 */
export async function handleSyncActivityMatch(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, activityId, workoutId, activity } = req.body;
      
      if (!userId || !activityId || !workoutId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      await saveActivityMatch(userId, activityId, workoutId, activity);
      
      res.json({
        success: true,
        message: `Linked activity ${activityId} to workout ${workoutId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing activity match:', error);
      res.status(500).json({ error: 'Failed to sync activity match', details: error.message });
    }
  });
}

/**
 * GET /api/load-activity-matches
 * Load all activity matches for a user
 * 
 * Query parameters:
 * - userId: string (required)
 */
export async function handleLoadActivityMatches(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }
      
      const matches = await getActivityMatches(userId);
      
      res.json({
        success: true,
        data: matches,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading activity matches:', error);
      res.status(500).json({ error: 'Failed to load activity matches', details: error.message });
    }
  });
}

/**
 * DELETE /api/remove-activity-match
 * Delete an activity match (unlink activity from workout)
 * 
 * Query parameters:
 * - userId: string (required)
 * - activityId: string (required)
 */
export async function handleRemoveActivityMatch(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, activityId } = req.query;
      
      if (!userId || !activityId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      await deleteActivityMatch(userId, activityId);
      
      res.json({
        success: true,
        message: `Removed activity match for ${activityId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing activity match:', error);
      res.status(500).json({ error: 'Failed to remove activity match', details: error.message });
    }
  });
}

/**
 * POST /api/sync-extra-workout
 * Mark an activity as extra/unplanned
 * 
 * Request body:
 * {
 *   userId: string,
 *   activityId: string,
 *   activity: object (full activity data)
 * }
 */
export async function handleSyncExtraWorkout(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, activityId, activity } = req.body;
      
      if (!userId || !activityId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      await saveExtraWorkout(userId, activityId, activity);
      
      res.json({
        success: true,
        message: `Marked activity ${activityId} as extra`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing extra workout:', error);
      res.status(500).json({ error: 'Failed to sync extra workout', details: error.message });
    }
  });
}

/**
 * GET /api/load-extra-workouts
 * Load all extra workouts for a user
 * 
 * Query parameters:
 * - userId: string (required)
 */
export async function handleLoadExtraWorkouts(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }
      
      const extras = await getExtraWorkouts(userId);
      
      res.json({
        success: true,
        data: extras,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading extra workouts:', error);
      res.status(500).json({ error: 'Failed to load extra workouts', details: error.message });
    }
  });
}

/**
 * DELETE /api/remove-extra-workout
 * Delete an extra workout (unmark as extra)
 * 
 * Query parameters:
 * - userId: string (required)
 * - activityId: string (required)
 */
export async function handleRemoveExtraWorkout(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId, activityId } = req.query;
      
      if (!userId || !activityId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      await deleteExtraWorkout(userId, activityId);
      
      res.json({
        success: true,
        message: `Removed extra workout for ${activityId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing extra workout:', error);
      res.status(500).json({ error: 'Failed to remove extra workout', details: error.message });
    }
  });
}

/**
 * GET /api/load-all-user-data
 * Load all user data (complete sync)
 * Useful when user opens app or switches devices
 * 
 * Query parameters:
 * - userId: string (required)
 */
export async function handleLoadAllUserData(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }
      
      // Load all user data from Firestore
      const matches = await getActivityMatches(userId);
      const extras = await getExtraWorkouts(userId);
      
      // For tracking, we'd need to load multiple dates
      // For now, just return matches and extras
      
      res.json({
        success: true,
        data: {
          activityMatches: matches,
          extraWorkouts: extras,
          lastSync: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      res.status(500).json({ error: 'Failed to load user data', details: error.message });
    }
  });
}

export {
  saveWorkoutTracking,
  saveActivityMatch,
  saveExtraWorkout,
  getWorkoutTrackingForDate,
  getActivityMatches,
  getExtraWorkouts
};
