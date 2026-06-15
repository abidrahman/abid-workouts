# Frontend Integration Guide

This guide shows how to integrate the backend OAuth and API endpoints into your frontend.

## 1. OAuth Authentication Flow

### Step 1: Start Authorization

Create a button that initiates OAuth:

```html
<!-- in index.html -->
<button id="login-btn" class="btn">Login with COROS</button>
```

```javascript
// in app.js
const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', () => {
  const backendUrl = process.env.NODE_ENV === 'production'
    ? 'https://us-central1-abid-workouts.cloudfunctions.net/auth'
    : 'http://localhost:5001/abid-workouts/us-central1/auth';

  // Start OAuth flow
  window.location.href = `${backendUrl}?action=authorize`;
});
```

### Step 2: Handle OAuth Callback

Add a callback route handler:

```html
<!-- auth/callback.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Authenticating...</title>
</head>
<body>
  <div id="auth-status">
    <p>Authenticating with COROS...</p>
    <div class="spinner"></div>
  </div>

  <script>
    // Check if we received auth code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    async function handleCallback() {
      try {
        if (error) {
          throw new Error(`COROS Auth Error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Backend automatically handles token exchange when we have code + state
        // Store user session info (you'll need to implement proper session management)
        // TODO: Replace with proper Firebase Auth or session management
        const userId = 'user-' + Date.now(); // Placeholder
        localStorage.setItem('userId', userId);

        // Redirect to dashboard after successful auth
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);
      } catch (err) {
        document.getElementById('auth-status').innerHTML = `
          <div class="error">
            <p>❌ Authentication Failed</p>
            <p>${err.message}</p>
            <a href="/">Back to Home</a>
          </div>
        `;
      }
    }

    handleCallback();
  </script>
</body>
</html>
```

## 2. API Integration

### Initialize API Helper

Create an API client:

```javascript
// api/client.js

const API_BASE = {
  development: 'http://localhost:5001/abid-workouts/us-central1',
  production: 'https://us-central1-abid-workouts.cloudfunctions.net'
};

const baseUrl = API_BASE[process.env.NODE_ENV || 'development'];

/**
 * Make authenticated API request
 * TODO: Update to use Firebase Auth token instead of userId parameter
 */
async function apiRequest(endpoint, options = {}) {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('userId', userId);

  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'API request failed');
  }

  return response.json();
}

export async function getActivities(days = 7, limit = 50) {
  return apiRequest(`/activities?days=${days}&limit=${limit}`);
}

export async function getMetrics(days = 7, metricType = 'summary') {
  return apiRequest(`/metrics?days=${days}&metric_type=${metricType}`);
}

export async function getDailyMetrics(days = 7) {
  return getMetrics(days, 'daily');
}

export async function getSummaryMetrics(days = 7) {
  return getMetrics(days, 'summary');
}
```

### Using the API Client

```javascript
// dashboard.js

import { 
  getActivities, 
  getSummaryMetrics, 
  getDailyMetrics 
} from './api/client.js';

async function loadDashboard() {
  try {
    // Show loading state
    document.getElementById('content').innerHTML = '<p>Loading...</p>';

    // Fetch data from backend
    const [activitiesResponse, metricsResponse] = await Promise.all([
      getActivities(7),
      getSummaryMetrics(7)
    ]);

    const activities = activitiesResponse.data;
    const metrics = metricsResponse.data;

    // Render dashboard
    renderDashboard(activities, metrics);
  } catch (err) {
    console.error('Failed to load dashboard:', err);
    document.getElementById('content').innerHTML = `
      <div class="error">
        <p>❌ Failed to load data: ${err.message}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}

function renderDashboard(activities, metrics) {
  const html = `
    <h1>Your Training Dashboard</h1>

    <section class="metrics-summary">
      <h2>Last 7 Days Summary</h2>
      <div class="stat-grid">
        <div class="stat">
          <label>Total Activities</label>
          <value>${metrics.totals.activitiesCount}</value>
        </div>
        <div class="stat">
          <label>Total Distance</label>
          <value>${(metrics.totals.totalDistance / 1000).toFixed(1)} km</value>
        </div>
        <div class="stat">
          <label>Total Duration</label>
          <value>${(metrics.totals.totalDuration / 60).toFixed(1)} hrs</value>
        </div>
        <div class="stat">
          <label>Avg Daily Steps</label>
          <value>${metrics.averages.avgDailySteps.toLocaleString()}</value>
        </div>
      </div>
    </section>

    <section class="recent-activities">
      <h2>Recent Activities</h2>
      <div class="activities-list">
        ${activities.slice(0, 10).map(activity => `
          <div class="activity-item">
            <div class="activity-icon">${getActivityEmoji(activity.type)}</div>
            <div class="activity-info">
              <h3>${activity.name}</h3>
              <p class="activity-date">${new Date(activity.startTime).toLocaleDateString()}</p>
            </div>
            <div class="activity-stats">
              <span>${activity.distance ? (activity.distance / 1000).toFixed(1) : '-'} km</span>
              <span>${formatDuration(activity.duration)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  document.getElementById('content').innerHTML = html;
}

function getActivityEmoji(type) {
  const emojis = {
    'run': '🏃',
    'trail_run': '🏃🌲',
    'hike': '🥾',
    'bike': '🚴',
    'swim': '🏊',
    'climb': '🧗'
  };
  return emojis[type] || '⚡';
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Load dashboard when page loads
document.addEventListener('DOMContentLoaded', loadDashboard);
```

## 3. Error Handling

Handle different error scenarios:

```javascript
async function apiCall(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.message.includes('not authenticated')) {
      // Redirect to login
      window.location.href = '/';
    } else if (err.message.includes('401')) {
      // Token invalid, restart auth flow
      localStorage.removeItem('userId');
      window.location.href = '/';
    } else if (err.message.includes('500')) {
      // Server error
      console.error('Server error:', err);
      showNotification('Server error. Please try again later.');
    } else {
      // Other error
      console.error('Error:', err);
      showNotification(err.message);
    }
  }
}
```

## 4. Session Management (TODO)

Current implementation uses simple localStorage. For production, implement proper session management:

```javascript
// TODO: Replace with Firebase Auth
async function initializeAuth() {
  // Option 1: Firebase Auth
  // const idToken = await firebase.auth().currentUser.getIdToken();
  // localStorage.setItem('idToken', idToken);

  // Option 2: Backend Session Cookies
  // Cookies are automatically included in CORS requests with credentials: 'include'
}
```

## 5. Refresh Token Handling

The backend automatically handles token refresh, but you can manually trigger it:

```javascript
// Periodically refresh tokens before they expire
setInterval(async () => {
  try {
    await apiRequest('/auth?action=refresh');
  } catch (err) {
    console.log('Token refresh failed, user may need to re-authenticate');
  }
}, 1000 * 60 * 55); // Every 55 minutes
```

## Testing the Integration

1. Start backend emulator:
   ```bash
   cd backend
   npm run serve
   ```

2. Start frontend dev server:
   ```bash
   npm run dev
   ```

3. Click "Login with COROS"

4. Follow OAuth flow

5. Confirm redirect to dashboard

6. Verify activities/metrics load from API

## Common Issues

### 401 Unauthorized
- User hasn't completed OAuth flow
- Token may have expired
- Solution: Clear localStorage and restart OAuth flow

### CORS Errors
- Frontend domain not whitelisted in backend
- Solution: Update CORS configuration in `functions/*.js`

### API Returns Empty Data
- COROS API endpoints may be different
- Token scopes might be insufficient
- Solution: Check COROS API docs and update endpoints

## Next Steps

1. ✅ Frontend OAuth integration
2. ➜ Add Firebase Auth for proper session management
3. ➜ Implement activity visualization
4. ➜ Add metrics charts
5. ➜ Implement caching for offline access

---

**Quick Start Command**:
```bash
# Terminal 1: Backend
cd backend && npm run serve

# Terminal 2: Frontend
npm run dev

# Visit http://localhost:5173 and click "Login with COROS"
```
