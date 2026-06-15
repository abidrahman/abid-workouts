# Phase 2: Quick Reference Guide

## What's New

### UI Components Added

#### 1. Auth Status Panel (Top of Page)
- Shows "Not connected to COROS" or "Connected as [user]"
- Displays last sync time when connected
- Three buttons:
  - **Connect COROS** - Opens OAuth flow (hidden when connected)
  - **Sync Now** - Fetches latest activities (visible when connected)
  - **Activities** - Opens activity sidebar (visible when connected)

#### 2. Activity Sidebar (Right Side)
- Toggleable panel showing last 20 synced activities
- Each activity shows:
  - Activity type (Run, Bike, Swim, etc.)
  - Date
  - Duration (minutes)
  - Distance (km)
- Smooth slide-in/out animation
- Closes on close button or outside click

#### 3. Toast Notifications (Bottom Right)
- Success messages (e.g., "Synced 5 activities")
- Error messages with retry hints
- Auto-dismiss after 2.6 seconds
- Stack multiple notifications

## How It Works

### User Flow

1. **Initial Load**
   - App checks auth status via `/api/auth/status`
   - Shows "Not connected" if no active session
   - Shows "Connected as" if session exists

2. **Connecting COROS**
   - User clicks "Connect COROS" button
   - App calls `/api/auth/authorize`
   - Backend returns OAuth URL
   - User redirected to COROS OAuth provider
   - After approval, user returns and auth status updates

3. **Syncing Activities**
   - User clicks "Sync Now" button
   - Sync button shows loading spinner
   - App calls `/api/sync` endpoint
   - Toast shows sync count
   - Activity list updates with new items

4. **Viewing Activities**
   - User clicks "Activities" button
   - Sidebar slides open showing activities
   - Each activity is a clickable card
   - Click close button or outside to dismiss

## File Changes

### index.html
```html
<!-- New sections added at start of <body> -->
<div class="auth-status-panel" id="auth-status-panel">
  <!-- Auth controls and status display -->
</div>

<div class="activity-sidebar" id="activity-sidebar">
  <!-- Activity list container -->
</div>

<div class="toast-container" id="toast-container">
  <!-- Toast notifications appear here -->
</div>
```

### app.js
```javascript
// New object: AuthManager
const AuthManager = {
  currentStatus: null,
  async getAuthStatus() { ... }
  async startOAuthFlow() { ... }
  async syncActivities() { ... }
  async logout() { ... }
  renderStatus() { ... }
  init() { ... }
}

// New object: ActivityManager
const ActivityManager = {
  activities: [],
  async fetchSyncedActivities() { ... }
  async fetchAndRender() { ... }
  renderActivityList(activities) { ... }
  renderActivityItem(activity) { ... }
  init() { ... }
}

// New function: initAuth()
function initAuth() { ... }

// Modified: init() now calls initAuth()
function init() {
  // ... existing code ...
  initAuth(); // <-- Added
}
```

### styles.css
```css
/* New CSS sections: */
.auth-status-panel { ... }
.auth-status-panel__content { ... }
.auth-status-panel__text { ... }
.button--small { ... }
.button--small.is-loading { ... }
@keyframes spin { ... }

.activity-sidebar { ... }
.activity-sidebar.is-open { ... }
.activity-sidebar__header { ... }
.activity-sidebar__list { ... }

.activity-item { ... }
.activity-item__header { ... }
.activity-item__meta { ... }

.toast-container { ... }
.toast { ... }
@keyframes toastSlide { ... }

/* Responsive adjustments */
@media (max-width: 768px) { ... }
```

## API Endpoints Required

### Authentication

#### GET /api/auth/status
Returns current auth status
```json
{
  "connected": true,
  "user": "user@example.com",
  "lastSync": "2024-06-12T10:30:00Z"
}
```

#### POST /api/auth/authorize
Initiates OAuth flow
```json
{
  "authUrl": "https://coros-oauth-provider.com/authorize?..."
}
```

#### POST /api/auth/logout
Clears session (no response body needed)

### Activities

#### POST /api/sync
Syncs activities from COROS
```json
{
  "count": 5
}
```

#### GET /api/activities
Returns synced activities
```json
{
  "activities": [
    {
      "id": "activity_123",
      "type": "Run",
      "startTime": "2024-06-10T08:00:00Z",
      "duration": 3600,
      "distance": 10000
    }
  ]
}
```

## Key Features

### Security
- ✓ Tokens never stored in frontend localStorage
- ✓ All auth data via secure backend
- ✓ Credentials included in fetch calls
- ✓ HTML escaped to prevent XSS

### Accessibility
- ✓ ARIA live regions for notifications
- ✓ Proper button labels
- ✓ Keyboard navigation support
- ✓ Semantic HTML structure

### Performance
- ✓ No external libraries (vanilla JS)
- ✓ Efficient DOM updates
- ✓ Minimal CSS parsing
- ✓ Responsive without JS libraries

### Mobile-Friendly
- ✓ Activity sidebar responsive (full-width on mobile)
- ✓ Auth buttons responsive layout
- ✓ Toast adjusts to viewport
- ✓ Touch-friendly button sizes

## Debugging Tips

### Check Auth Status in Console
```javascript
AuthManager.currentStatus
// { connected: true, user: "...", lastSync: "..." }
```

### Manually Trigger Sync
```javascript
AuthManager.syncActivities()
```

### View Activities
```javascript
ActivityManager.activities
// Array of activity objects
```

### Check Button States
```javascript
document.querySelector("#auth-connect-btn").hidden // should be false if not connected
document.querySelector("#auth-sync-btn").hidden // should be false if connected
```

## Common Issues

### "Unable to start COROS connection"
- Check if `/api/auth/authorize` endpoint is working
- Verify backend is returning `authUrl` field
- Check browser console for network errors

### Activities not showing after sync
- Verify `/api/activities` endpoint is accessible
- Check if activities have required fields (type, startTime)
- Look for console errors about fetch failures

### Toast not appearing
- Confirm `#toast-container` element exists in HTML
- Check if CSS for `.toast` is loading
- Verify `showToast()` function is being called

### Sidebar not opening
- Check if `#activity-sidebar` exists in HTML
- Verify CSS has `.activity-sidebar.is-open` rule
- Look for console errors in Activity Manager init

## Testing

### Manual Testing Checklist
- [ ] Page loads without errors
- [ ] Auth panel appears at top
- [ ] "Connect COROS" visible when not connected
- [ ] OAuth flow redirects correctly
- [ ] After auth, status shows username
- [ ] "Sync Now" button works
- [ ] Activities appear in sidebar
- [ ] Sidebar toggle works smoothly
- [ ] Toast notifications appear
- [ ] All buttons are keyboard accessible
- [ ] Mobile layout works correctly

### Browser Console Checks
```javascript
// Should not error
AuthManager.getAuthStatus()

// Should return true when connected
AuthManager.currentStatus?.connected

// Should have correct element
document.querySelector("#auth-status-panel")
```
