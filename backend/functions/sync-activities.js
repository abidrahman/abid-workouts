import cors from 'cors';
import { 
  matchActivityToWorkout,
  syncActivitiesAgainstPlan 
} from './sync.js';

const corsHandler = cors({ origin: true });

/**
 * POST /sync-activities
 * Match COROS activities against planned workouts
 * 
 * Request body:
 * {
 *   activities: Array<Activity>,
 *   workoutPlanByDate: Object<date, Workout[]>,
 *   currentTracking: Object<workoutId, TrackingInfo>
 * }
 * 
 * Response:
 * {
 *   autoChecked: Array<Match>,
 *   conflicts: Array<Match>,
 *   unmatched: Array<Match>,
 *   skipped: Array<Match>
 * }
 */
export default function syncActivitiesHandler(req, res) {
  corsHandler(req, res, async () => {
    try {
      // Validate request method
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const {
        activities = [],
        workoutPlanByDate = {},
        currentTracking = {}
      } = req.body;

      // Validate input
      if (!Array.isArray(activities)) {
        return res.status(400).json({ 
          error: 'Invalid request',
          message: 'activities must be an array'
        });
      }

      if (typeof workoutPlanByDate !== 'object' || workoutPlanByDate === null) {
        return res.status(400).json({ 
          error: 'Invalid request',
          message: 'workoutPlanByDate must be an object'
        });
      }

      // Perform sync
      const result = syncActivitiesAgainstPlan(
        activities,
        workoutPlanByDate,
        currentTracking
      );

      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Sync activities endpoint error:', error);
      return res.status(500).json({ 
        error: 'Failed to sync activities', 
        message: error.message 
      });
    }
  });
}
