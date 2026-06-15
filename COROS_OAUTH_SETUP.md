# COROS OAuth App Registration Guide

This guide walks through registering your OAuth application with COROS developer account.

## Prerequisites

- COROS developer account (sign up at https://developer.coros.com)
- Email verified
- Access to COROS Developer Portal

## Step-by-Step Registration

### 1. Log into COROS Developer Portal

1. Go to https://developer.coros.com/
2. Sign in with your developer account credentials

### 2. Navigate to Applications Section

1. In the dashboard, look for **Applications** or **My Applications** menu
2. Click to view your applications list

### 3. Create New Application

1. Click **+ Create New Application** or **Add Application**
2. Fill in the application form:

#### Application Form Fields

| Field | Value | Notes |
|-------|-------|-------|
| **App Name** | `Abid Workouts` | User-friendly name for your app |
| **Description** | `Personal training plan and progress tracker for Mt. Baker and Lake Union preparation` | Optional but recommended |
| **App Type** | `Web Application` or `Mobile App` | Select based on your platform |
| **Logo** | (optional) | Upload app icon |
| **Category** | `Fitness` or `Sports` | Choose appropriate category |

### 4. Configure OAuth Settings

#### Redirect URIs

Add both development and production URLs:

**Development** (for local testing):
```
http://localhost:5173/auth/callback
```

**Production** (update with your actual domain):
```
https://yourdomain.com/auth/callback
```

⚠️ **Important**: COROS may require HTTPS for production URIs

#### OAuth Scopes

Request the minimum necessary scopes:

- ☑️ `activity:read` - Access to user activities
- ☑️ `metrics:read` - Access to daily metrics and summaries
- ☐ `profile:read` - User profile info (if needed)
- ☐ `heart_rate:read` - Heart rate data (if needed)

**Selected scopes in backend config**:
```env
# In COROS_AUTH_URL request
scope=activity:read metrics:read
```

### 5. Generate OAuth Credentials

After creating the application:

1. Navigate to your application details
2. Look for **Security** or **Credentials** section
3. Find or generate:
   - **Client ID** (public key)
   - **Client Secret** (keep secret!)

4. Copy these values

### 6. Update Backend Configuration

Save credentials to `.env`:

```env
COROS_CLIENT_ID=your_client_id_here
COROS_CLIENT_SECRET=your_client_secret_here
COROS_REDIRECT_URI=http://localhost:5173/auth/callback
```

**NEVER commit `.env` to version control!**

## OAuth Flow Details

### 1. User Initiates Login
```
Frontend → "Login with COROS" button
```

### 2. Authorization Request
```
Frontend → Backend: /auth?action=authorize
↓
Backend → COROS: GET /oauth2/authorize
  - client_id
  - redirect_uri
  - response_type=code
  - scope=activity:read metrics:read
  - state=<csrf_token>
↓
COROS → User: Shows login & permission screen
```

### 3. COROS Redirects Back
```
COROS → Frontend: /auth/callback?code=AUTH_CODE&state=STATE
```

### 4. Backend Exchanges Code for Token
```
Backend → COROS: POST /oauth2/token
  - code
  - client_id
  - client_secret
  - grant_type=authorization_code
↓
COROS → Backend: Returns access token + refresh token
```

### 5. Backend Stores Token
```
Backend → Firestore: Save tokens in users/{userId}/oauth/coros
↓
Backend → Frontend: Redirect to /dashboard
```

## API Endpoints Reference

### Authorization Endpoint
```
GET https://developer.coros.com/oauth2/authorize
Parameters:
  - client_id (required)
  - redirect_uri (required)
  - response_type=code (required)
  - scope (required)
  - state (required for CSRF protection)
```

### Token Endpoint
```
POST https://developer.coros.com/oauth2/token
Body (form-encoded):
  - code (required)
  - client_id (required)
  - client_secret (required)
  - grant_type=authorization_code (required)
  - redirect_uri (required)

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "activity:read metrics:read"
}
```

### Refresh Token Endpoint
```
POST https://developer.coros.com/oauth2/token
Body (form-encoded):
  - grant_type=refresh_token (required)
  - refresh_token (required)
  - client_id (required)
  - client_secret (required)

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Testing Your OAuth Setup

### 1. Local Testing

```bash
# Start backend emulator
cd backend
npm run serve

# Start frontend dev server
npm run dev
```

### 2. Manual OAuth Flow Test

1. Visit `http://localhost:5173`
2. Click "Login with COROS"
3. You should be redirected to COROS login
4. Sign in with your COROS account
5. Review requested scopes
6. Click "Authorize" or "Allow Access"
7. Redirected back to `http://localhost:5173/auth/callback`
8. Should redirect to dashboard with activities/metrics loaded

### 3. Verify Token Storage

Check Firebase Firestore:
```
Collection: users
Document: {userId}
Sub-collection: oauth
Document: coros
Fields:
  - access_token
  - refresh_token
  - expires_at
  - created_at
```

## Troubleshooting

### "Invalid Redirect URI"
- Check redirect_uri matches exactly (including protocol and trailing slash)
- COROS is case-sensitive
- Both dev and production URIs must be registered

### "Invalid Client ID" or "Invalid Secret"
- Verify credentials copied correctly
- No extra spaces or line breaks
- Check you're using the right app credentials (if you have multiple apps)

### "Insufficient Scope"
- Requested scopes must be authorized in app settings
- Add required scopes in COROS Developer Portal
- Re-generate credentials if you change scopes

### "State Token Mismatch"
- Backend validates state token is not used twice
- State expires after 10 minutes
- Restart OAuth flow if it takes too long

### COROS Returns Empty User Data
- Some COROS accounts may not have activities
- Try with an account that has recorded activities
- Check scopes are correct

## Production Deployment

### 1. Update COROS App Settings

1. Log into COROS Developer Portal
2. Edit your application
3. Change Redirect URI to production domain:
   ```
   https://yourdomain.com/auth/callback
   ```
4. Update any URLs that reference localhost

### 2. Update Backend .env

```env
# Production values
COROS_REDIRECT_URI=https://yourdomain.com/auth/callback
API_BASE_URL=https://us-central1-abid-workouts.cloudfunctions.net
```

### 3. Deploy to Firebase

```bash
firebase deploy --only functions
```

### 4. Verify Production OAuth

1. Visit `https://yourdomain.com`
2. Click "Login with COROS"
3. Complete OAuth flow
4. Verify data loads on dashboard

## Security Best Practices

- ✅ **Store client_secret securely** - Use Firebase environment variables, never commit to git
- ✅ **Use HTTPS in production** - COROS requires HTTPS redirect URIs
- ✅ **Validate state token** - Backend implements CSRF protection
- ✅ **Use refresh tokens** - Automatically handled by backend
- ✅ **Set appropriate scopes** - Only request minimum necessary permissions
- ✅ **Implement token expiration** - Backend checks expiry and refreshes
- ⚠️ **TODO: Encrypt tokens at rest** - Currently stored plaintext in Firestore
- ⚠️ **TODO: Use Firebase Auth** - Replace userId parameter with proper authentication

## COROS API Documentation

Confirm COROS API endpoints with official documentation:

- **Official Docs**: https://developer.coros.com/api-docs
- **Endpoints to verify**:
  - `GET /api/v1/activities` - List user activities
  - `GET /api/v1/daily-metrics` - Daily metrics
  - `GET /api/v1/metrics-summary` - Summary metrics
  - Response format and field names

⚠️ **If endpoints differ**, update mapping in:
- `backend/functions/activities.js`
- `backend/functions/metrics.js`

## Support & Troubleshooting

For COROS-specific issues:
1. Visit COROS Developer Docs: https://developer.coros.com/api-docs
2. Check Developer Console logs
3. Contact COROS support: support@developer.coros.com (if available)

For integration issues:
1. Check Firebase Console → Cloud Functions → Logs
2. Review backend setup in `backend/README_BACKEND.md`
3. Verify `.env` configuration
4. Check browser console for frontend errors

---

**Next Steps**:
1. ✅ Complete this OAuth registration
2. ➜ Set up Firebase project (see `backend/README_BACKEND.md`)
3. ➜ Deploy backend functions
4. ➜ Test OAuth flow
5. ➜ Integrate with frontend

**Checklist**:
- [ ] COROS developer account created
- [ ] Application registered
- [ ] OAuth scopes configured
- [ ] Client ID and Secret copied
- [ ] .env file updated
- [ ] Redirect URIs added (dev + prod)
- [ ] Backend configured
- [ ] OAuth flow tested
- [ ] Token storage verified
