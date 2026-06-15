# Phase 1: Quick Start Guide

Get your backend up and running in 5 minutes.

## Prerequisites

- Node.js 20+ (`node --version`)
- Firebase CLI (`npm install -g firebase-tools`)
- COROS developer account (free at https://developer.coros.com)

## 1. Create Firebase Project (5 min)

1. Go to https://console.firebase.google.com
2. Create new project: `abid-workouts`
3. Skip Google Analytics
4. Wait for creation to complete

### Enable Services
1. Go to **Build** → **Firestore Database**
   - **Create Database**
   - Start in "Test mode"
   - Location: `us-central1`
   - **Create**

2. Go to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Save the JSON file

## 2. Register COROS OAuth App (5 min)

1. Go to https://developer.coros.com
2. Create developer account (if needed)
3. Go to **My Applications** → **Create New Application**
4. Fill in:
   - **App Name**: `Abid Workouts`
   - **Redirect URI (dev)**: `http://localhost:5173/auth/callback`
5. Select scopes: `activity:read`, `metrics:read`
6. Create application
7. Copy **Client ID** and **Client Secret**

## 3. Configure Backend (5 min)

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your editor
```

**Required `.env` values** (from steps 1-2):
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key-from-json
FIREBASE_CLIENT_EMAIL=your-service-account@...

COROS_CLIENT_ID=your_client_id
COROS_CLIENT_SECRET=your_client_secret
COROS_REDIRECT_URI=http://localhost:5173/auth/callback
```

## 4. Start Local Backend (2 min)

```bash
cd backend
npm run serve
```

You should see:
```
✓ Emulator started at http://localhost:5001
✓ Firestore emulator running at http://localhost:8080
```

## 5. Test in Another Terminal (2 min)

```bash
# In project root
npm run dev
```

Visit: http://localhost:5173

### Test OAuth Flow
1. Click any COROS-related button (once you add one)
2. Should redirect to COROS login
3. Sign in with your COROS account
4. Authorize app
5. Should redirect back to your site

### Test API

```bash
# In another terminal, test API (replace user123 with your user ID)
curl "http://localhost:5001/abid-workouts/us-central1/activities?userId=user123&days=7"

# Should return:
# {
#   "success": true,
#   "count": X,
#   "data": [...]
# }
```

## 6. Integrate Frontend (Optional)

See **FRONTEND_INTEGRATION.md** for code examples to add to your frontend.

## 7. Deploy to Production (When Ready)

```bash
cd backend
firebase deploy --only functions
```

Functions will be at:
```
https://us-central1-abid-workouts.cloudfunctions.net/auth
https://us-central1-abid-workouts.cloudfunctions.net/activities
https://us-central1-abid-workouts.cloudfunctions.net/metrics
```

Update COROS OAuth app redirect URI to production domain.

## Troubleshooting

### "Cannot find .env"
```bash
cp backend/.env.example backend/.env
# Edit the file with your credentials
```

### "firebase: command not found"
```bash
npm install -g firebase-tools
firebase --version
```

### "Emulator failed to start"
- Port 5001 already in use?
  ```bash
  lsof -i :5001  # Check what's using it
  kill -9 <PID>  # Kill the process
  ```

### "Invalid COROS credentials"
- Check Client ID and Secret are correct
- Verify they're copied completely (no extra spaces)
- Verify redirect URIs match in COROS app settings

### "Firestore permission denied"
- Make sure Firestore is in **Test mode** (for development)
- Check emulator is running on port 8080

## Next Steps

1. ✅ Backend setup complete
2. ➜ Read **PHASE_1_COMPLETE.md** for full documentation
3. ➜ Read **COROS_OAUTH_SETUP.md** for detailed OAuth guide
4. ➜ Read **FRONTEND_INTEGRATION.md** for frontend code examples
5. ➜ Add OAuth button to frontend
6. ➜ Implement dashboard with activities and metrics
7. ➜ Deploy to production

## Files Created

### Backend
```
backend/
├── functions/
│   ├── index.js           Main entry point
│   ├── auth.js            OAuth2 flow
│   ├── activities.js      Activities API
│   └── metrics.js         Metrics API
├── utils/
│   └── tokenManager.js    Token utilities
├── .env.example           Template (copy to .env)
├── firebase.json          Emulator config
├── package.json           Dependencies
└── README_BACKEND.md      Full setup guide
```

### Documentation
```
PHASE_1_QUICKSTART.md       ← You are here
PHASE_1_COMPLETE.md         Complete documentation
COROS_OAUTH_SETUP.md        OAuth registration guide
FRONTEND_INTEGRATION.md     Frontend code examples
```

## Key Commands

```bash
# Development
cd backend && npm run serve        # Start emulator
npm run dev                         # Start frontend
firebase emulators:stop             # Stop emulator

# Deployment
firebase deploy --only functions   # Deploy to Firebase
firebase functions:log              # View logs

# Testing
cd backend && npm test              # Run tests
```

## Architecture

```
Frontend                Backend                COROS API
(Localhost:5173)    (Localhost:5001)      (COROS Servers)
     ↓                    ↓                     ↓
 Login Button ──→ OAuth Flow ──────────→ COROS Login
                    ↓
               Token Exchange
                    ↓
          Store in Firestore
                    ↓
         Activate / Metrics Endpoints
                    ↓
              COROS API Calls
                    ↓
              Return Data
                    ↓
 Dashboard ←──────────────────────────────────┘
```

## What You Get

- ✅ OAuth2 authentication with COROS
- ✅ Secure token storage in Firestore
- ✅ Activities API endpoint
- ✅ Metrics API endpoint
- ✅ Local development environment
- ✅ CSRF protection
- ✅ Automatic token refresh
- ✅ Error handling
- ✅ Production-ready code

## Estimated Time

- Firebase setup: 5 minutes
- COROS registration: 5 minutes
- Backend configuration: 5 minutes
- Starting local dev: 2 minutes
- **Total: 17 minutes**

---

**Need help?** See the detailed guides:
- Backend: `backend/README_BACKEND.md`
- OAuth: `COROS_OAUTH_SETUP.md`
- Frontend: `FRONTEND_INTEGRATION.md`

**Version**: 1.0  
**Date**: June 2024  
**Status**: Ready for development
