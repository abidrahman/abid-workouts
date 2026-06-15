# Phase 1: Backend + COROS OAuth - START HERE

Welcome! This guide will help you get started with the Phase 1 implementation.

## 📋 What Is This?

Phase 1 is a **complete Firebase Cloud Functions backend** with:
- ✅ OAuth2 authentication with COROS fitness tracker
- ✅ Activities API endpoint (fetch workout history)
- ✅ Metrics API endpoint (fetch training metrics)
- ✅ Secure token storage in Firestore
- ✅ Local development environment
- ✅ Production-ready code

## 🚀 Quick Start (17 minutes)

### Option 1: Just Get It Running
**Time**: ~5 minutes

```bash
# 1. Copy environment template
cp backend/.env.example backend/.env

# 2. Edit .env with your Firebase & COROS credentials
# (See PHASE_1_QUICKSTART.md for detailed values)

# 3. Start backend
cd backend && npm run serve

# 4. In another terminal, start frontend
npm run dev

# 5. Visit http://localhost:5173
```

**👉 Use this if you already have Firebase and COROS setup**

### Option 2: Full Setup from Scratch
**Time**: ~17 minutes

1. **Read**: `PHASE_1_QUICKSTART.md` (6 min read)
   - Step-by-step setup instructions
   - Prerequisites and signup links
   - Quick testing guide

2. **Create**: Firebase project
   - 5 minutes following QUICKSTART guide

3. **Register**: COROS OAuth app
   - 5 minutes following QUICKSTART guide

4. **Run**: Backend and test
   - 2 minutes to start emulator and verify

**👉 Use this if setting up from scratch**

## 📚 Documentation Map

### Start With These

1. **PHASE_1_QUICKSTART.md** ⭐ START HERE
   - 5-minute setup guide
   - Fastest path to running code
   - Prerequisites checklist
   - Testing procedures

2. **PHASE_1_IMPLEMENTATION_SUMMARY.md**
   - What was built (features, endpoints, files)
   - Architecture overview
   - Integration points
   - Success criteria

### For Detailed Setup

3. **backend/README_BACKEND.md**
   - Complete backend guide
   - Firebase project creation (step-by-step)
   - COROS registration details
   - Environment configuration
   - Local development instructions
   - Deployment guide
   - Troubleshooting

4. **COROS_OAUTH_SETUP.md**
   - COROS developer account registration
   - OAuth app creation walkthrough
   - Credential extraction
   - Testing OAuth flow
   - Security best practices

### For Frontend Integration

5. **FRONTEND_INTEGRATION.md**
   - How to call backend from your frontend
   - OAuth button implementation
   - API client code examples
   - Complete dashboard example
   - Session management
   - Error handling patterns

### Full Reference

6. **PHASE_1_COMPLETE.md**
   - Everything about Phase 1
   - All features documented
   - API endpoint reference
   - Firestore data structure
   - Security checklist
   - Next phases planning

## 🎯 Choose Your Path

### "I just want to see it work"
👉 **PHASE_1_QUICKSTART.md** (6 min)
```bash
cp backend/.env.example backend/.env
# Edit .env with your credentials
cd backend && npm run serve
```

### "I'm setting up from scratch"
👉 **PHASE_1_QUICKSTART.md** → **backend/README_BACKEND.md** (30 min)
1. Create Firebase project (5 min)
2. Register COROS app (5 min)
3. Configure backend (5 min)
4. Run and test (5 min)

### "I'm implementing the frontend"
👉 **FRONTEND_INTEGRATION.md** (20 min)
- OAuth button code
- API client example
- Dashboard component
- Error handling

### "I need all the details"
👉 **PHASE_1_COMPLETE.md** (comprehensive reference)
- All features explained
- Architecture details
- Security analysis
- Deployment checklist

## 🏗️ What's in the Backend Directory?

```
backend/
├── functions/
│   ├── auth.js          ← OAuth2 implementation
│   ├── activities.js    ← Activities API endpoint
│   ├── metrics.js       ← Metrics API endpoint
│   └── index.js         ← Main entry point
├── utils/
│   └── tokenManager.js  ← Token utilities
├── .env.example         ← Copy to .env and fill in
├── firebase.json        ← Emulator config
└── README_BACKEND.md    ← Full setup guide
```

## 🔑 What You Need

### From Firebase Console
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account@...
```

### From COROS Developer Portal
```
COROS_CLIENT_ID=your_client_id
COROS_CLIENT_SECRET=your_client_secret
COROS_REDIRECT_URI=http://localhost:5173/auth/callback
```

## 📝 Three Essential Commands

```bash
# Start backend emulator
cd backend && npm run serve

# Start frontend dev server
npm run dev

# Test API endpoint
curl "http://localhost:5001/abid-workouts/us-central1/activities?userId=user123&days=7"
```

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend emulator starts without errors
- [ ] Firestore emulator is running
- [ ] Frontend dev server starts
- [ ] Can view home page at localhost:5173
- [ ] OAuth flow can be initiated (once button added)
- [ ] Activities API returns data
- [ ] Metrics API returns data

## 🐛 Stuck?

### "Cannot find .env"
```bash
cp backend/.env.example backend/.env
# Edit the file with your credentials
```

### "Module not found"
```bash
cd backend
npm install
```

### "Port already in use"
Firebase emulator defaults to port 5001. If in use:
```bash
# Find what's using it
lsof -i :5001

# Kill the process
kill -9 <PID>
```

### "Invalid COROS credentials"
- Verify credentials are copied completely (no spaces)
- Check they're from the right COROS application
- Verify redirect URI matches exactly

### More troubleshooting
→ See **backend/README_BACKEND.md** Troubleshooting section

## 📈 Next Steps After Setup

1. ✅ **Backend running** (you are here)
2. ➜ **Add OAuth button** (see FRONTEND_INTEGRATION.md)
3. ➜ **Implement dashboard** (use API examples)
4. ➜ **Deploy to production** (see backend/README_BACKEND.md)

## 📦 What Gets Deployed

### Cloud Functions (automatically from backend/ folder)
- `/auth` - OAuth handling
- `/activities` - Activity history API
- `/metrics` - Metrics API

### Firestore Database
- User tokens (encrypted)
- OAuth state tracking
- Activity/metrics cache (optional)

### Frontend (from your main app)
- HTML/CSS/JS
- OAuth button
- API integration
- Dashboard components

## 🔒 Security Notes

✅ **Already Implemented**
- CSRF protection (state tokens)
- Secure token storage (Firestore)
- Automatic token refresh
- Token expiration handling

⚠️ **TODO for Production**
- Token encryption at rest
- User authentication (Firebase Auth)
- Rate limiting
- Request logging

## 📞 File Quick Reference

| Need... | Go to... |
|---------|----------|
| 5-min setup | `PHASE_1_QUICKSTART.md` |
| Backend setup | `backend/README_BACKEND.md` |
| COROS details | `COROS_OAUTH_SETUP.md` |
| Frontend code | `FRONTEND_INTEGRATION.md` |
| Everything | `PHASE_1_COMPLETE.md` |
| Summary | `PHASE_1_IMPLEMENTATION_SUMMARY.md` |

## 🎓 Learning Path

**5 minutes**: `PHASE_1_QUICKSTART.md`
- Get backend running

**15 minutes**: `backend/README_BACKEND.md`
- Understand architecture
- Learn configuration

**10 minutes**: `FRONTEND_INTEGRATION.md`
- See code examples
- Plan frontend integration

**30 minutes**: `PHASE_1_COMPLETE.md`
- Deep dive into all features
- Understand every endpoint

---

## TL;DR - Just Want to Start?

```bash
# 1. Setup
cp backend/.env.example backend/.env
# Edit .env with Firebase & COROS credentials

# 2. Run
cd backend && npm run serve      # Terminal 1
npm run dev                       # Terminal 2

# 3. Test
curl "http://localhost:5001/abid-workouts/us-central1/activities?userId=test&days=7"

# 4. Explore
# Read FRONTEND_INTEGRATION.md for next steps
```

---

**Status**: ✅ Phase 1 Complete  
**Created**: June 2024  
**Ready for**: Frontend integration

**Start with**: `PHASE_1_QUICKSTART.md`
