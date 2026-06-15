/**
 * app-api.js
 * 
 * Frontend API abstraction layer for syncing with Firebase backend
 * Provides offline-first strategy with localStorage cache fallback
 */

// Configuration
const API_BASE_URL = typeof FIREBASE_API_URL !== 'undefined' 
  ? FIREBASE_API_URL 
  : 'http://localhost:5001/abid-workouts/us-central1';

const SYNC_QUEUE_KEY = 'sync-queue';
const LAST_SYNC_KEY = 'last-sync-time';
const SYNC_STATUS_KEY = 'sync-status';

let currentUserId = null;
let syncInterval = null;
let isSyncing = false;

/**
 * Initialize the API layer
 * Call this when user logs in
 */
export function initializeAPI(userId) {
  currentUserId = userId;
  console.log(`[API] Initialized for user: ${userId}`);
  
  // Start background sync every 30 seconds
  startBackgroundSync();
  
  return {
    isInitialized: true,
    userId: userId
  };
}

/**
 * Get current sync status
 */
export function getSyncStatus() {
  try {
    const status = localStorage.getItem(SYNC_STATUS_KEY);
    return status ? JSON.parse(status) : { status: 'idle', lastSync: null };
  } catch {
    return { status: 'idle', lastSync: null };
  }
}

/**
 * Set sync status in localStorage
 */
function setSyncStatus(status) {
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
    status,
    lastSync: new Date().toISOString()
  }));
}

/**
 * Check if user is online
 */
export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Start background sync (runs every 30 seconds if online)
 */
export function startBackgroundSync() {
  if (syncInterval) return; // Already running
  
  syncInterval = setInterval(async () => {
    if (isOnline() && !isSyncing) {
      await syncQueuedChanges();
    }
  }, 30000); // 30 seconds
  
  console.log('[API] Background sync started (30s interval)');
}

/**
 * Stop background sync
 */
export function stopBackgroundSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('[API] Background sync stopped');
  }
}

/**
 * Manually trigger a sync
 */
export async function syncNow() {
  if (!isOnline()) {
    console.warn('[API] Cannot sync: offline');
    return { success: false, reason: 'offline' };
  }
  
  return syncQueuedChanges();
}

/**
 * Add a change to the sync queue
 */
function queueChange(operation) {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push({
      ...operation,
      queuedAt: new Date().toISOString()
    });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    setSyncStatus('pending');
  } catch (error) {
    console.error('[API] Failed to queue change:', error);
  }
}

/**
 * Sync all queued changes to Firebase
 */
async function syncQueuedChanges() {
  if (!currentUserId || isSyncing) return;
  
  isSyncing = true;
  setSyncStatus('syncing');
  
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    
    if (queue.length === 0) {
      setSyncStatus('synced');
      return { success: true, synced: 0 };
    }
    
    let synced = 0;
    const failed = [];
    
    for (const operation of queue) {
      try {
        const result = await executeSyncOperation(operation);
        if (result.success) {
          synced++;
        } else {
          failed.push(operation);
        }
      } catch (error) {
        console.error('[API] Sync operation failed:', operation, error);
        failed.push(operation);
      }
    }
    
    // Keep only failed operations in queue
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failed));
    
    console.log(`[API] Synced ${synced}/${queue.length} operations`);
    
    setSyncStatus(failed.length > 0 ? 'partial' : 'synced');
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    
    return { success: true, synced, failed: failed.length };
  } catch (error) {
    console.error('[API] Sync failed:', error);
    setSyncStatus('error');
    return { success: false, error: error.message };
  } finally {
    isSyncing = false;
  }
}

/**
 * Execute a single sync operation
 */
async function executeSyncOperation(operation) {
  const { type, data } = operation;
  
  switch (type) {
    case 'sync-tracking':
      return apiCall('POST', '/syncTracking', { userId: currentUserId, ...data });
    
    case 'sync-activity-match':
      return apiCall('POST', '/syncActivityMatch', { userId: currentUserId, ...data });
    
    case 'sync-extra-workout':
      return apiCall('POST', '/syncExtraWorkout', { userId: currentUserId, ...data });
    
    case 'sync-calendar-tracking':
      return apiCall('POST', '/syncCalendarTracking', { userId: currentUserId, ...data });
    
    case 'sync-calendar-reschedules':
      return apiCall('POST', '/syncCalendarReschedules', { userId: currentUserId, ...data });
    
    case 'sync-strength-logs':
      return apiCall('POST', '/syncStrengthLogs', { userId: currentUserId, ...data });
    
    default:
      console.warn('[API] Unknown operation type:', type);
      return { success: false };
  }
}

/**
 * Generic API call helper
 */
async function apiCall(method, endpoint, data = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    return { success: result.success, data: result.data };
  } catch (error) {
    console.error('[API] Call failed:', method, endpoint, error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// PUBLIC API: Workout Tracking
// ============================================================

/**
 * Save workout completion state
 */
export async function saveTracking(dateKey, sessionId, isChecked, autoMatched = false) {
  const operation = {
    type: 'sync-tracking',
    data: { dateKey, sessionId, checked: isChecked, autoMatched }
  };
  
  // Queue for sync
  queueChange(operation);
  
  // If online, try to sync immediately
  if (isOnline()) {
    return apiCall('POST', '/syncTracking', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load tracking for a specific date
 */
export async function loadTracking(dateKey) {
  try {
    // Try to load from backend
    if (isOnline()) {
      const response = await apiCall('GET', `/loadTracking?userId=${currentUserId}&dateKey=${dateKey}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    // Fallback to localStorage
    const cached = localStorage.getItem(`tracking-${dateKey}`);
    return cached ? JSON.parse(cached) : { date: dateKey, sessions: {} };
  } catch (error) {
    console.error('[API] Failed to load tracking:', error);
    return { date: dateKey, sessions: {} };
  }
}

// ============================================================
// PUBLIC API: Activity Matches
// ============================================================

/**
 * Save an activity-to-workout match
 */
export async function saveActivityMatch(activityId, workoutId, activity) {
  const operation = {
    type: 'sync-activity-match',
    data: { activityId, workoutId, activity }
  };
  
  // Queue for sync
  queueChange(operation);
  
  // If online, try to sync immediately
  if (isOnline()) {
    return apiCall('POST', '/syncActivityMatch', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load all activity matches for user
 */
export async function loadActivityMatches() {
  try {
    // Try to load from backend
    if (isOnline()) {
      const response = await apiCall('GET', `/loadActivityMatches?userId=${currentUserId}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    // Fallback to localStorage
    const cached = localStorage.getItem('manual-matches');
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('[API] Failed to load activity matches:', error);
    return {};
  }
}

/**
 * Remove an activity match
 */
export async function removeActivityMatch(activityId) {
  try {
    if (isOnline()) {
      return apiCall('DELETE', `/removeActivityMatch?userId=${currentUserId}&activityId=${activityId}`);
    }
    return { success: true, queued: true };
  } catch (error) {
    console.error('[API] Failed to remove activity match:', error);
    return { success: false };
  }
}

// ============================================================
// PUBLIC API: Extra Workouts
// ============================================================

/**
 * Mark an activity as extra/unplanned
 */
export async function saveExtraWorkout(activityId, activity) {
  const operation = {
    type: 'sync-extra-workout',
    data: { activityId, activity }
  };
  
  // Queue for sync
  queueChange(operation);
  
  // If online, try to sync immediately
  if (isOnline()) {
    return apiCall('POST', '/syncExtraWorkout', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load all extra workouts for user
 */
export async function loadExtraWorkouts() {
  try {
    // Try to load from backend
    if (isOnline()) {
      const response = await apiCall('GET', `/loadExtraWorkouts?userId=${currentUserId}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    // Fallback to localStorage
    const cached = localStorage.getItem('extra-workouts');
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('[API] Failed to load extra workouts:', error);
    return {};
  }
}

/**
 * Remove an extra workout
 */
export async function removeExtraWorkout(activityId) {
  try {
    if (isOnline()) {
      return apiCall('DELETE', `/removeExtraWorkout?userId=${currentUserId}&activityId=${activityId}`);
    }
    return { success: true, queued: true };
  } catch (error) {
    console.error('[API] Failed to remove extra workout:', error);
    return { success: false };
  }
}

// ============================================================
// PUBLIC API: Calendar Tracking
// ============================================================

/**
 * Save calendar tracking data
 */
export async function saveCalendarTracking(dateKey, calendarData) {
  const operation = {
    type: 'sync-calendar-tracking',
    data: { dateKey, calendarData }
  };
  
  queueChange(operation);
  
  if (isOnline()) {
    return apiCall('POST', '/syncCalendarTracking', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load calendar tracking for a specific date
 */
export async function loadCalendarTracking(dateKey) {
  try {
    if (isOnline()) {
      const response = await apiCall('GET', `/loadCalendarTracking?userId=${currentUserId}&dateKey=${dateKey}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    const cached = localStorage.getItem(`calendar-tracking-${dateKey}`);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('[API] Failed to load calendar tracking:', error);
    return {};
  }
}

// ============================================================
// PUBLIC API: Calendar Reschedules
// ============================================================

/**
 * Save calendar reschedules
 */
export async function saveCalendarReschedules(reschedules) {
  const operation = {
    type: 'sync-calendar-reschedules',
    data: { reschedules }
  };
  
  queueChange(operation);
  
  if (isOnline()) {
    return apiCall('POST', '/syncCalendarReschedules', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load calendar reschedules
 */
export async function loadCalendarReschedules() {
  try {
    if (isOnline()) {
      const response = await apiCall('GET', `/loadCalendarReschedules?userId=${currentUserId}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    const cached = localStorage.getItem('calendar-reschedules');
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('[API] Failed to load calendar reschedules:', error);
    return {};
  }
}

// ============================================================
// PUBLIC API: Calendar UI State
// ============================================================

/**
 * Save calendar UI state
 */
export async function saveCalendarUiState(uiState) {
  try {
    localStorage.setItem('calendar-ui-state', JSON.stringify(uiState));
    return { success: true };
  } catch (error) {
    console.error('[API] Failed to save calendar UI state:', error);
    return { success: false };
  }
}

/**
 * Load calendar UI state
 */
export async function loadCalendarUiState() {
  try {
    const cached = localStorage.getItem('calendar-ui-state');
    return cached ? JSON.parse(cached) : { categoryFilter: 'all', statusFilter: 'all', view: 'compact' };
  } catch (error) {
    console.error('[API] Failed to load calendar UI state:', error);
    return { categoryFilter: 'all', statusFilter: 'all', view: 'compact' };
  }
}

// ============================================================
// PUBLIC API: Strength Logs
// ============================================================

/**
 * Save strength logs
 */
export async function saveStrengthLogs(dateKey, logs) {
  const operation = {
    type: 'sync-strength-logs',
    data: { dateKey, logs }
  };
  
  queueChange(operation);
  
  if (isOnline()) {
    return apiCall('POST', '/syncStrengthLogs', { userId: currentUserId, ...operation.data });
  }
  
  return { success: true, queued: true };
}

/**
 * Load strength logs for a specific date
 */
export async function loadStrengthLogs(dateKey) {
  try {
    if (isOnline()) {
      const response = await apiCall('GET', `/loadStrengthLogs?userId=${currentUserId}&dateKey=${dateKey}`);
      if (response.success && response.data) {
        return response.data;
      }
    }
    
    const cached = localStorage.getItem(`strength-logs-${dateKey}`);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('[API] Failed to load strength logs:', error);
    return {};
  }
}

// ============================================================
// PUBLIC API: Full Sync (Load All User Data)
// ============================================================

/**
 * Load all user data from backend
 * Useful when app first loads or user switches devices
 */
export async function loadAllUserData() {
  try {
    if (!isOnline()) {
      console.warn('[API] Cannot load from backend: offline');
      return {
        activityMatches: {},
        extraWorkouts: {}
      };
    }
    
    const response = await apiCall('GET', `/loadAllUserData?userId=${currentUserId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return { activityMatches: {}, extraWorkouts: {} };
  } catch (error) {
    console.error('[API] Failed to load all user data:', error);
    return { activityMatches: {}, extraWorkouts: {} };
  }
}

/**
 * Force shutdown (for logout/cleanup)
 */
export function shutdown() {
  stopBackgroundSync();
  currentUserId = null;
  localStorage.removeItem(SYNC_QUEUE_KEY);
  localStorage.removeItem(SYNC_STATUS_KEY);
  console.log('[API] Shutdown complete');
}

// ============================================================
// Debug/Admin Functions
// ============================================================

/**
 * Get current sync queue (for debugging)
 */
export function getDebugInfo() {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    const status = getSyncStatus();
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    
    return {
      initialized: currentUserId !== null,
      currentUserId,
      syncQueue: queue,
      syncStatus: status,
      lastSync,
      isOnline: isOnline(),
      isSyncing
    };
  } catch (error) {
    console.error('[API] Failed to get debug info:', error);
    return { error: error.message };
  }
}

/**
 * Clear sync queue (use with caution)
 */
export function clearSyncQueue() {
  localStorage.removeItem(SYNC_QUEUE_KEY);
  setSyncStatus('idle');
  console.log('[API] Sync queue cleared');
}

export default {
  initializeAPI,
  getSyncStatus,
  isOnline,
  startBackgroundSync,
  stopBackgroundSync,
  syncNow,
  saveTracking,
  loadTracking,
  saveActivityMatch,
  loadActivityMatches,
  removeActivityMatch,
  saveExtraWorkout,
  loadExtraWorkouts,
  removeExtraWorkout,
  saveCalendarTracking,
  loadCalendarTracking,
  saveCalendarReschedules,
  loadCalendarReschedules,
  saveCalendarUiState,
  loadCalendarUiState,
  saveStrengthLogs,
  loadStrengthLogs,
  loadAllUserData,
  shutdown,
  getDebugInfo,
  clearSyncQueue
};
