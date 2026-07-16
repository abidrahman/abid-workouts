/**
 * app-api.js
 *
 * Direct Firestore SDK integration — no Cloud Functions needed.
 * Works on Firebase free (Spark) plan.
 * Offline-first: all writes go to localStorage immediately,
 * then sync to Firestore in the background.
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApGPbSOvHW_dh-OVmt0oijbL4vEfc_Y84",
  authDomain: "abid-workouts.firebaseapp.com",
  projectId: "abid-workouts",
  storageBucket: "abid-workouts.firebasestorage.app",
  messagingSenderId: "763079466618",
  appId: "1:763079466618:web:0cc04f75393f9e8209a5c3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Enable offline persistence so the app works without internet
enableIndexedDbPersistence(db).catch(() => {
  // Persistence may already be enabled or unavailable in this context — safe to ignore
});


// ── State ────────────────────────────────────────────────────────────────────
let currentUserId = null;

// ── Init ─────────────────────────────────────────────────────────────────────

/** Call once on app start with a stable per-user ID. */
export function initializeAPI(userId) {
  currentUserId = userId;
  console.log('[Firebase] API initialized for user:', userId);
  return { isInitialized: true, userId };
}

export function getCurrentUserId() { return currentUserId; }

// ── Helpers ──────────────────────────────────────────────────────────────────

function userDoc(...segments) {
  return doc(db, 'users', currentUserId, ...segments);
}
function userCollection(...segments) {
  return collection(db, 'users', currentUserId, ...segments);
}

// ── Workout Tracking ─────────────────────────────────────────────────────────

export async function saveTracking(dateKey, sessions, metrics = {}) {
  try {
    await setDoc(userDoc('workoutTracking', dateKey), { date: dateKey, sessions, metrics, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveTracking:', e); return { success: false }; }
}

export async function loadTracking(dateKey) {
  try {
    const snap = await getDoc(userDoc('workoutTracking', dateKey));
    return snap.exists() ? snap.data() : { date: dateKey, sessions: {}, metrics: {} };
  } catch (e) { console.error('[Firebase] loadTracking:', e); return { date: dateKey, sessions: {}, metrics: {} }; }
}

// ── Calendar Tracking ────────────────────────────────────────────────────────

export async function saveCalendarTracking(dateKey, calendarData) {
  try {
    await setDoc(userDoc('calendarTracking', dateKey), { ...calendarData, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveCalendarTracking:', e); return { success: false }; }
}

export async function loadCalendarTracking(dateKey) {
  try {
    const snap = await getDoc(userDoc('calendarTracking', dateKey));
    return snap.exists() ? snap.data() : {};
  } catch (e) { console.error('[Firebase] loadCalendarTracking:', e); return {}; }
}

// ── Calendar Reschedules ─────────────────────────────────────────────────────

export async function saveCalendarReschedules(reschedules) {
  try {
    await setDoc(userDoc('calendarState', 'reschedules'), { data: reschedules, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveCalendarReschedules:', e); return { success: false }; }
}

export async function loadCalendarReschedules() {
  try {
    const snap = await getDoc(userDoc('calendarState', 'reschedules'));
    return snap.exists() ? (snap.data().data || {}) : {};
  } catch (e) { console.error('[Firebase] loadCalendarReschedules:', e); return {}; }
}

// ── Calendar UI State ─────────────────────────────────────────────────────────

export async function saveCalendarUiState(uiState) {
  try {
    await setDoc(userDoc('calendarState', 'uiState'), { ...uiState, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveCalendarUiState:', e); return { success: false }; }
}

export async function loadCalendarUiState() {
  const defaults = { categoryFilter: 'all', statusFilter: 'all', view: 'compact' };
  try {
    const snap = await getDoc(userDoc('calendarState', 'uiState'));
    return snap.exists() ? { ...defaults, ...snap.data() } : defaults;
  } catch (e) { console.error('[Firebase] loadCalendarUiState:', e); return defaults; }
}

// ── Activity Matches ─────────────────────────────────────────────────────────

export async function saveActivityMatch(activityId, workoutId, matchData = {}) {
  try {
    await setDoc(userDoc('activityMatches', String(activityId)), { activityId: String(activityId), workoutId, ...matchData, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveActivityMatch:', e); return { success: false }; }
}

export async function loadActivityMatches() {
  try {
    const snap = await getDocs(userCollection('activityMatches'));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
  } catch (e) { console.error('[Firebase] loadActivityMatches:', e); return {}; }
}

export async function removeActivityMatch(activityId) {
  try {
    await deleteDoc(userDoc('activityMatches', String(activityId)));
    return { success: true };
  } catch (e) { console.error('[Firebase] removeActivityMatch:', e); return { success: false }; }
}

// ── Extra / Unplanned Workouts ────────────────────────────────────────────────

export async function saveExtraWorkout(activityId, activityData = {}) {
  try {
    await setDoc(userDoc('extraWorkouts', String(activityId)), { activityId: String(activityId), ...activityData, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveExtraWorkout:', e); return { success: false }; }
}

export async function loadExtraWorkouts() {
  try {
    const snap = await getDocs(userCollection('extraWorkouts'));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
  } catch (e) { console.error('[Firebase] loadExtraWorkouts:', e); return {}; }
}

export async function removeExtraWorkout(activityId) {
  try {
    await deleteDoc(userDoc('extraWorkouts', String(activityId)));
    return { success: true };
  } catch (e) { console.error('[Firebase] removeExtraWorkout:', e); return { success: false }; }
}

// ── Strength Logs ─────────────────────────────────────────────────────────────

export async function saveStrengthLogs(dateKey, logs) {
  try {
    await setDoc(userDoc('strengthLogs', dateKey), { date: dateKey, logs, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) { console.error('[Firebase] saveStrengthLogs:', e); return { success: false }; }
}

export async function loadStrengthLogs(dateKey) {
  try {
    const snap = await getDoc(userDoc('strengthLogs', dateKey));
    return snap.exists() ? (snap.data().logs || {}) : {};
  } catch (e) { console.error('[Firebase] loadStrengthLogs:', e); return {}; }
}

// ── Bulk load ─────────────────────────────────────────────────────────────────

export async function loadAllUserData() {
  const [activityMatches, extraWorkouts] = await Promise.all([loadActivityMatches(), loadExtraWorkouts()]);
  return { activityMatches, extraWorkouts };
}

// ── Sync Meta (seed-once coordination) ────────────────────────────────────────

/**
 * Read the sync-meta doc that records whether the shared cloud tree has been
 * seeded yet. Returns { ok } so callers can distinguish "confirmed absent"
 * (ok:true, exists:false) from "couldn't read" (ok:false) — important so an
 * offline/failed read never causes a device to wrongly re-seed and clobber cloud.
 */
export async function loadSyncMeta() {
  try {
    const snap = await getDoc(userDoc('meta', 'sync'));
    return { ok: true, exists: snap.exists(), data: snap.exists() ? snap.data() : null };
  } catch (e) {
    console.error('[Firebase] loadSyncMeta:', e);
    return { ok: false, exists: false, data: null };
  }
}

/** Mark the shared cloud tree as seeded so every other device switches to pull-only. */
export async function markSeeded(info = {}) {
  try {
    await setDoc(userDoc('meta', 'sync'), { seeded: true, seededAt: serverTimestamp(), ...info }, { merge: true });
    return { success: true };
  } catch (e) { console.error('[Firebase] markSeeded:', e); return { success: false }; }
}

// ── Startup Sync ──────────────────────────────────────────────────────────────

/**
 * Sync all user data from Firestore on app startup.
 * Ensures workout states, activity matches, and extra workouts are current across devices.
 * Called once during app initialization.
 */
export async function syncDataOnStartup() {
  try {
    console.log('[Firebase] Starting startup sync...');
    const result = await loadAllUserData();
    console.log('[Firebase] Startup sync complete:', result);
    return { success: true, ...result };
  } catch (e) {
    console.error('[Firebase] Startup sync failed:', e);
    return { success: false, error: e.message };
  }
}

// ── Compat stubs ──────────────────────────────────────────────────────────────

export function getSyncStatus() { return { status: 'synced', lastSync: new Date().toISOString() }; }
export function isOnline() { return navigator.onLine; }
export function startBackgroundSync() {}
export function stopBackgroundSync() {}
export async function syncNow() { return { success: true }; }
export function shutdown() {}
export function getDebugInfo() { return { currentUserId, isOnline: isOnline() }; }
export function clearSyncQueue() {}

export default {
  initializeAPI, getCurrentUserId, getSyncStatus, isOnline,
  startBackgroundSync, stopBackgroundSync, syncNow, syncDataOnStartup,
  saveTracking, loadTracking,
  saveCalendarTracking, loadCalendarTracking,
  saveCalendarReschedules, loadCalendarReschedules,
  saveCalendarUiState, loadCalendarUiState,
  saveActivityMatch, loadActivityMatches, removeActivityMatch,
  saveExtraWorkout, loadExtraWorkouts, removeExtraWorkout,
  saveStrengthLogs, loadStrengthLogs,
  loadSyncMeta, markSeeded,
  loadAllUserData, shutdown, getDebugInfo, clearSyncQueue
};