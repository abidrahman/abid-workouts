import axios from 'axios';
import cors from 'cors';
import { getFirestore } from 'firebase-admin/firestore';
import { getValidAccessToken } from './auth.js';
import { config } from 'dotenv';

config();

const db = getFirestore();
const corsHandler = cors({ origin: true });

/**
 * GET /metrics
 * Fetch user's training metrics from COROS API
 * 
 * Query parameters:
 * - userId: Firebase user ID (required) - TODO: Replace with authenticated user from Firebase Auth
 * - metric_type: 'daily' or 'summary' (default: 'summary')
 * - days: Number of days to analyze (default: 7)
 */
export default function metricsHandler(req, res) {
  corsHandler(req, res, async () => {
    try {
      // Validate request method
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { userId, metric_type = 'summary', days = 7 } = req.query;

      // Validate userId parameter
      // TODO: In production, extract userId from Firebase Auth token in Authorization header
      if (!userId) {
        return res.status(400).json({ 
          error: 'Missing userId parameter',
          hint: 'Pass userId as query parameter or implement Firebase Auth token verification'
        });
      }

      // Validate metric type
      if (!['daily', 'summary'].includes(metric_type)) {
        return res.status(400).json({ 
          error: 'Invalid metric_type. Must be "daily" or "summary"'
        });
      }

      const daysNum = Math.min(parseInt(days) || 7, 90); // Cap at 90 days

      // Get valid access token
      const accessToken = await getValidAccessToken(userId);

      // Fetch metrics from COROS API
      let metrics;
      if (metric_type === 'daily') {
        metrics = await fetchDailyMetrics(accessToken, daysNum);
      } else {
        metrics = await fetchSummaryMetrics(accessToken, daysNum);
      }

      // TODO: Cache metrics in Firestore
      // const cacheKey = `metrics_${metric_type}_${daysNum}d`;
      // await db.collection('users').doc(userId).set(
      //   { [cacheKey]: metrics, updated_at: new Date() },
      //   { merge: true }
      // );

      return res.status(200).json({
        success: true,
        metric_type: metric_type,
        days: daysNum,
        data: metrics
      });
    } catch (error) {
      console.error('Metrics endpoint error:', error);

      // Handle specific error cases
      if (error.message.includes('No COROS token')) {
        return res.status(401).json({ 
          error: 'User not authenticated',
          hint: 'Please complete OAuth flow first'
        });
      }

      return res.status(500).json({ 
        error: 'Failed to fetch metrics', 
        message: error.message 
      });
    }
  });
}

/**
 * Fetch daily metrics from COROS API
 * 
 * TODO: Confirm actual COROS API endpoint and response format
 * Expected to include: steps, heart rate, sleep, calories, etc.
 */
async function fetchDailyMetrics(accessToken, daysNum) {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysNum);

    // COROS API endpoint for daily metrics
    const endpoint = `${process.env.COROS_API_BASE_URL}/v1/daily-metrics`;

    const response = await axios.get(endpoint, {
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Transform response to standardized format
    // TODO: Adjust field mapping based on actual COROS API response
    const dailyMetrics = response.data.data?.map(day => ({
      date: day.date,
      steps: day.steps || 0,
      distance: day.distance_m || 0,
      calories: day.calories || 0,
      avgHeartRate: day.avg_heart_rate || null,
      restingHeartRate: day.resting_heart_rate || null,
      sleep: {
        duration: day.sleep_duration_minutes || 0,
        quality: day.sleep_quality || null,
        deepSleep: day.deep_sleep_minutes || 0,
        remSleep: day.rem_sleep_minutes || 0
      },
      activity: {
        activitiesCount: day.activities_count || 0,
        totalDuration: day.total_activity_duration_minutes || 0
      },
      rawData: day
    })) || [];

    return dailyMetrics;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Token may be invalid or expired');
    }
    console.error('COROS API error:', error.response?.data || error.message);
    throw new Error(`COROS API error: ${error.message}`);
  }
}

/**
 * Fetch summary metrics from COROS API
 * 
 * Returns aggregated metrics for the specified period
 */
async function fetchSummaryMetrics(accessToken, daysNum) {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysNum);

    // COROS API endpoint for summary metrics
    const endpoint = `${process.env.COROS_API_BASE_URL}/v1/metrics-summary`;

    const response = await axios.get(endpoint, {
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Transform response to standardized format
    // TODO: Adjust field mapping based on actual COROS API response
    const summary = {
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: daysNum
      },
      totals: {
        activitiesCount: response.data.activities_count || 0,
        totalDistance: response.data.total_distance_m || 0,
        totalCalories: response.data.total_calories || 0,
        totalDuration: response.data.total_activity_duration_minutes || 0,
        totalSteps: response.data.total_steps || 0
      },
      averages: {
        avgHeartRate: response.data.avg_heart_rate || null,
        avgRestingHeartRate: response.data.avg_resting_heart_rate || null,
        avgDailyCalories: response.data.avg_daily_calories || 0,
        avgDailySteps: response.data.avg_daily_steps || 0,
        avgDailyDistance: response.data.avg_daily_distance_m || 0
      },
      sleep: {
        totalSleep: response.data.total_sleep_minutes || 0,
        avgSleepPerNight: response.data.avg_sleep_minutes || 0,
        avgDeepSleep: response.data.avg_deep_sleep_minutes || 0,
        totalDeepSleep: response.data.total_deep_sleep_minutes || 0
      },
      activityBreakdown: parseActivityBreakdown(response.data.activities_by_type || {}),
      rawData: response.data
    };

    return summary;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Token may be invalid or expired');
    }
    console.error('COROS API error:', error.response?.data || error.message);
    throw new Error(`COROS API error: ${error.message}`);
  }
}

/**
 * Parse activity breakdown by type
 * TODO: Expand based on actual COROS activity types
 */
function parseActivityBreakdown(activitiesByType) {
  const typeMap = {
    'running': 'run',
    'trail_running': 'trail_run',
    'hiking': 'hike',
    'cycling': 'bike',
    'swimming': 'swim',
    'climbing': 'climb'
  };

  const breakdown = {};
  for (const [corosType, count] of Object.entries(activitiesByType)) {
    const standardType = typeMap[corosType] || corosType;
    breakdown[standardType] = count;
  }

  return breakdown;
}
