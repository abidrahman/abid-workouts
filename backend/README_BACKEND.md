# Abid Workouts Backend - Setup & Integration Guide

## Overview

This backend provides Firebase Cloud Functions for:
1. **OAuth2 Authentication** with COROS fitness tracker
2. **Activities API** - Fetch user's recorded activities
3. **Metrics API** - Fetch aggregated training metrics

## Architecture

```
backend/
├── functions/
│   ├── index.js           (Entry point, exports all functions)
│   ├── auth.js            (OAuth2 flow: authorize, callback, token exchange)
│   ├── activities.js      (GET /activities endpoint)
│   └── metrics.js         (GET /metrics endpoint)
├── utils/
│   └── tokenManager.js    (Token encryption, storage, retrieval)
├── tests/                 (Unit tests)
├── .env.example          (Environment variables template)
├── firebase.json         (Firebase config)
└── package.json          (Dependencies)
```

## Prerequisites

1. **Firebase Project** - Create free at https://console.firebase.google.com
2. **COROS Developer Account** - Register at https://developer.coros.com
3. **Node.js 20+** - Required for Cloud Functions
4. **Firebase CLI** - Install with `npm install -g firebase-tools`

## Step 1: Firebase Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name: `abid-workouts`
4. Disable Google Analytics (optional)
5. Create project

### 1.2 Enable Required Services

In Firebase Console, go to **Build** section and enable:
- ☑️ **Firestore Database** - For token storage
  - Start in "Test mode" for development
  - Location: `us-central1`
- ☑️ **Cloud Functions** - Already available
- ☑️ **Authentication** (optional) - For user management

### 1.3 Get Service Account Key

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate New Private Key"
3. Save as `backend/.env` (store securely!)

Extract these values:
```
FIREBASE_PROJECT_ID=<project_id>
FIREBASE_PRIVATE_KEY=<private_key>
FIREBASE_CLIENT_EMAIL=<client_email>
```

## Step 2: COROS Developer Registration

### 2.1 Create Developer Account

1. Visit [COROS Developer Portal](https://developer.coros.com)
2. Sign up for a developer account
3. Verify email

### 2.2 Register OAuth Application

1. In Developer Portal, go to **My Applications**
2. Click **Create New Application**
3. Fill in:
   - **App Name**: `Abid Workouts`
   - **App Type**: `Mobile/Web App`
   - **Redirect URI** (development): `http://localhost:5173/auth/callback`
   - **Redirect URI** (production): `https://your-domain.com/auth/callback`
   - **Scopes**: `activity:read`, `metrics:read`
4. Accept terms and create

### 2.3 Get OAuth Credentials

Copy these from your application settings:
```
COROS_CLIENT_ID=<client_id>
COROS_CLIENT_SECRET=<client_secret>
```

**⚠️ IMPORTANT**: Never commit `client_secret` to version control!

## Step 3: Environment Configuration

### 3.1 Create `.env` File

Copy from `.env.example`:
```bash
cp .env.example .env
```

### 3.2 Fill in Required Variables

```env
# Firebase
FIREBASE_PROJECT_ID=abid-workouts-xxxxx
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@abid-workouts-xxxxx.iam.gserviceaccount.com

# COROS OAuth
COROS_CLIENT_ID=your_client_id_here
COROS_CLIENT_SECRET=your_client_secret_here
COROS_REDIRECT_URI=http://localhost:5173/auth/callback

# API Endpoints (confirm with COROS API docs)
COROS_AUTH_URL=https://developer.coros.com/oauth2/authorize
COROS_TOKEN_URL=https://developer.coros.com/oauth2/token
COROS_API_BASE_URL=https://api.developer.coros.com/api
```

## Step 4: Local Development

### 4.1 Install Dependencies

```bash
cd backend
npm install
```

### 4.2 Start Firebase Emulator

```bash
npm run serve
```

This starts:
- **Cloud Functions**: `http://localhost:5001/abid-workouts/us-central1/`
- **Firestore Emulator**: `http://localhost:8080`

### 4.3 Test OAuth Flow (Manual)

1. **Start Authorization**:
   ```
   http://localhost:5173/auth/callback?action=authorize
   ```
   → Redirects to COROS login

2. **COROS Redirects Back**:
   ```
   http://localhost:5173/auth/callback?code=AUTH_CODE&state=STATE
   ```
   → Function exchanges code for access token
   → Token stored in Firestore

### 4.4 Test API Endpoints

**Activities**:
```bash
curl "http://localhost:5001/abid-workouts/us-central1/activities?userId=user123&days=7"
```

**Metrics**:
```bash
curl "http://localhost:5001/abid-workouts/us-central1/metrics?userId=user123&days=7&metric_type=summary"
```

## Frontend Integration

### OAuth Flow

**1. Start OAuth in Frontend**
```javascript
// In your app.js
function startOAuthFlow() {
  const backendUrl = process.env.NODE_ENV === 'production'
    ? 'https://us-central1-abid-workouts.cloudfunctions.net/auth'
    : 'http://localhost:5001/abid-workouts/us-central1/auth';

  window.location.href = `${backendUrl}?action=authorize`;
}
```

**2. Handle OAuth Callback**
```javascript
// In auth/callback page
async function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (code) {
    // Backend automatically handles token exchange
    // Redirect to dashboard after auth completes
    window.location.href = '/dashboard';
  }
}
```

### Calling API Endpoints

```javascript
// Fetch activities
async function getActivities(userId, days = 7) {
  const response = await fetch(
    `/activities?userId=${userId}&days=${days}`
  );
  const { data } = await response.json();
  return data;
}

// Fetch metrics
async function getMetrics(userId, days = 7, type = 'summary') {
  const response = await fetch(
    `/metrics?userId=${userId}&days=${days}&metric_type=${type}`
  );
  const { data } = await response.json();
  return data;
}
```

## Firestore Data Structure

```
users/
├── {userId}/
│   └── oauth/
│       └── coros/
│           ├── access_token: "..."
│           ├── refresh_token: "..."
│           ├── expires_at: Timestamp
│           └── created_at: Timestamp
│
└── activities_cache/
    └── {userId}/
        └── {activity_id}: {...}

oauth_states/
└── {state_token}/
    ├── created_at: Timestamp
    ├── expires_at: Timestamp
    └── used: boolean
```

## Authentication & Authorization

### Current Implementation

⚠️ **SECURITY NOTE**: Current implementation passes `userId` as query parameter. This is **NOT SECURE** for production.

### Production Implementation (TODO)

For production, implement proper authentication:

**Option 1: Firebase Auth (Recommended)**
```javascript
// Use Firebase ID token in Authorization header
const idToken = await firebase.auth().currentUser.getIdToken();
const response = await fetch('/activities', {
  headers: { 'Authorization': `Bearer ${idToken}` }
});

// In backend:
import { getAuth } from 'firebase-admin/auth';
const decodedToken = await getAuth().verifyIdToken(token);
const userId = decodedToken.uid;
```

**Option 2: Session Cookies**
```javascript
// Store session cookie after OAuth
document.cookie = `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict`;
```

## Error Handling

### Common Errors

**401 Unauthorized**
```json
{
  "error": "User not authenticated",
  "hint": "Please complete OAuth flow first"
}
```
→ User needs to authorize COROS access

**403 Invalid State Token**
```json
{
  "error": "Invalid state token"
}
```
→ CSRF protection triggered, restart OAuth flow

**500 Token Exchange Failed**
```json
{
  "error": "Token exchange failed",
  "message": "Failed to exchange code for token"
}
```
→ Check COROS credentials and API endpoints

## Deployment

### 4.1 Deploy to Firebase

```bash
# Login to Firebase
firebase login

# Deploy functions
firebase deploy --only functions
```

Functions will be available at:
```
https://us-central1-abid-workouts.cloudfunctions.net/auth
https://us-central1-abid-workouts.cloudfunctions.net/activities
https://us-central1-abid-workouts.cloudfunctions.net/metrics
```

### 4.2 Update Environment Variables

In Firebase Console → Cloud Functions → Runtime environment variables:
- Set all `.env` variables
- Verify `COROS_REDIRECT_URI` matches your domain

### 4.3 Update COROS Settings

In COROS Developer Portal:
- Update Redirect URI to production domain:
  ```
  https://yourdomain.com/auth/callback
  ```

## Security Checklist

- ✅ OAuth state token validation (CSRF protection)
- ✅ Token expiration handling with refresh
- ✅ Tokens stored in Firestore (not frontend)
- ✅ HTTPS only in production
- ✅ CORS configured
- ⚠️ TODO: Implement user authentication (not just userId parameter)
- ⚠️ TODO: Encrypt tokens at rest
- ⚠️ TODO: Implement rate limiting
- ⚠️ TODO: Add request logging and monitoring

## COROS API Documentation

⚠️ **NOTE**: This implementation assumes COROS API structure. Confirm actual endpoints:

1. Visit [COROS Developer Docs](https://developer.coros.com/api-docs)
2. Verify these endpoints exist:
   - `GET /api/v1/activities`
   - `GET /api/v1/daily-metrics`
   - `GET /api/v1/metrics-summary`
3. Check response field names and update field mappings in:
   - `functions/activities.js` (lines 85-100)
   - `functions/metrics.js` (lines 95-110, 155-175)

## Troubleshooting

### Functions Not Starting

```bash
# Check for syntax errors
npm run serve

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Token Refresh Failing

1. Verify `COROS_CLIENT_SECRET` is correct
2. Check token expiration in Firestore
3. Ensure `refresh_token` exists in database

### CORS Errors

Check that frontend domain is allowed. Update in `functions/*.js`:
```javascript
const corsHandler = cors({ 
  origin: ['http://localhost:5173', 'https://yourdomain.com']
});
```

### COROS API Errors

1. Verify scopes: `activity:read metrics:read`
2. Check token is valid and not expired
3. Confirm API endpoint URLs match COROS documentation
4. Check response format matches expectations

## Next Steps

1. ✅ Backend setup complete
2. ➜ Implement authentication in frontend (`Phase 1b`)
3. ➜ Add activity visualization (`Phase 2`)
4. ➜ Implement training plan logic (`Phase 3`)
5. ➜ Add progress tracking dashboard (`Phase 4`)

## Support

For issues:
1. Check Firebase Console → Cloud Functions → Logs
2. Review this guide's Troubleshooting section
3. Check COROS API documentation
4. Enable local emulator debugging: `firebase emulators:start`

---

**Created**: June 2024  
**Last Updated**: June 2024
