import axios from 'axios';
import cors from 'cors';
import { getFirestore } from 'firebase-admin/firestore';
import { getValidAccessToken } from './auth.js';
import { config } from 'dotenv';

config();

const db = getFirestore();
const corsHandler = cors({ origin: true });

/**
 * GET /activities
 * Fetch user's activities from COROS API
 * 
 * Query parameters:
 * - userId: Firebase user ID (required) - TODO: Replace with authenticated user from Firebase Auth
 * - days: Number of days to fetch (default: 7)
 * - limit: Max results (default: 50)
 */
export default function activitiesHandler(req, res) {
  corsHandler(req, res, async () => {
    try {
      // Validate request method
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { userId, days = 7, limit = 50 } = req.query;

      // Validate userId parameter
      // TODO: In production, extract userId from Firebase Auth token in Authorization header
      if (!userId) {
        return res.status(400).json({ 
          error: 'Missing userId parameter',
          hint: 'Pass userId as query parameter or implement Firebase Auth token verification'
        });
      }

      // Validate parameters
      const daysNum = Math.min(parseInt(days) || 7, 90); // Cap at 90 days
      const limitNum = Math.min(parseInt(limit) || 50, 500); // Cap at 500

      // Get valid access token
      const accessToken = await getValidAccessToken(userId);

      // Fetch activities from COROS API
      const activities = await fetchActivitiesFromCOROS(accessToken, daysNum, limitNum);

      // TODO: Store activities in Firestore for caching and offline access
      // const cacheKey = `activities_${daysNum}d`;
      // await db.collection('users').doc(userId).set(
      //   { [cacheKey]: activities, updated_at: new Date() },
      //   { merge: true }
      // );

      return res.status(200).json({
        success: true,
        count: activities.length,
        days: daysNum,
        data: activities
      });
    } catch (error) {
      console.error('Activities endpoint error:', error);

      // Handle specific error cases
      if (error.message.includes('No COROS token')) {
        return res.status(401).json({ 
          error: 'User not authenticated',
          hint: 'Please complete OAuth flow first'
        });
      }

      return res.status(500).json({ 
        error: 'Failed to fetch activities', 
        message: error.message 
      });
    }
  });
}

/**
 * Fetch activities from COROS API
 * 
 * TODO: Confirm actual COROS API endpoint and response format
 * This is based on common REST API patterns
 */
async function fetchActivitiesFromCOROS(accessToken, daysNum, limit) {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysNum);

    // COROS API endpoint (adjust based on actual API documentation)
    const endpoint = `${process.env.COROS_API_BASE_URL}/v1/activities`;

    const response = await axios.get(endpoint, {
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        limit: limit
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Transform COROS response to standardized format
    // TODO: Adjust field mapping based on actual COROS API response
    const activities = response.data.data?.map(activity => ({
      id: activity.activity_id || activity.id,
      name: activity.activity_name || activity.name,
      type: activity.activity_type || activity.type,
      startTime: activity.start_time || activity.startTime,
      endTime: activity.end_time || activity.endTime,
      duration: activity.duration_seconds || activity.duration,
      distance: activity.distance_m || activity.distance,
      calories: activity.calories || 0,
      avgHR: activity.avg_heart_rate || activity.avgHeartRate,
      maxHR: activity.max_heart_rate || activity.maxHeartRate,
      elevation: activity.elevation_gain || activity.elevation,
      pace: activity.avg_pace || activity.pace,
      rawData: activity // Keep raw data for debugging
    })) || [];

    return activities;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Token may be invalid or expired');
    }
    console.error('COROS API error:', error.response?.data || error.message);
    throw new Error(`COROS API error: ${error.message}`);
  }
}

/**
 * Parse COROS activity type to standard format
 * TODO: Expand based on actual COROS activity types
 */
function parseActivityType(corosType) {
  const typeMap = {
    'running': 'run',
    'trail_running': 'trail_run',
    'hiking': 'hike',
    'cycling': 'bike',
    'swimming': 'swim',
    'climbing': 'climb',
    'indoor_running': 'treadmill'
  };
  return typeMap[corosType?.toLowerCase()] || corosType;
}
