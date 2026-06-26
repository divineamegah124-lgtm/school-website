// api.js
// Central API helper for Divine Tech Venture School Platform
// Handles all backend communication with localStorage fallback

const API_BASE = 'https://school-website-backend-production.up.railway.app/api';
const SCHOOL_ID = 'PRESEC';

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('admin-token');
}

// Save JWT token to localStorage
function setToken(token) {
  localStorage.setItem('admin-token', token);
}

// Remove JWT token (logout)
function clearToken() {
  localStorage.removeItem('admin-token');
}

// Core fetch wrapper with auth header
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

// Check if backend is reachable
async function backendAvailable() {
  try {
    const res = await fetch(`${API_BASE.replace('/api', '')}`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------
// AUTH
// -------------------------------------------------------
async function apiLogin(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.token) setToken(data.token);
  return data;
}

function apiLogout() {
  clearToken();
}

// -------------------------------------------------------
// ANNOUNCEMENTS
// -------------------------------------------------------
async function getAnnouncements() {
  try {
    return await apiFetch(`/announcements/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-announcements');
    return stored ? JSON.parse(stored) : [];
  }
}

async function createAnnouncement(data) {
  return await apiFetch('/announcements', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateAnnouncement(id, data) {
  return await apiFetch(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteAnnouncement(id) {
  return await apiFetch(`/announcements/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// EVENTS
// -------------------------------------------------------
async function getEvents() {
  try {
    return await apiFetch(`/events/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-events');
    return stored ? JSON.parse(stored) : [];
  }
}

async function createEvent(data) {
  return await apiFetch('/events', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateEvent(id, data) {
  return await apiFetch(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteEvent(id) {
  return await apiFetch(`/events/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// STAFF
// -------------------------------------------------------
async function getStaff() {
  try {
    return await apiFetch(`/staff/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-staff-directory');
    return stored ? JSON.parse(stored) : [];
  }
}

async function createStaff(data) {
  return await apiFetch('/staff', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateStaff(id, data) {
  return await apiFetch(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteStaff(id) {
  return await apiFetch(`/staff/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// FEEDBACK
// -------------------------------------------------------
async function submitFeedback(data) {
  return await apiFetch('/feedback', {
    method: 'POST',
    body: JSON.stringify({ ...data, schoolId: SCHOOL_ID })
  });
}

async function getFeedback() {
  try {
    return await apiFetch(`/feedback/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-feedback');
    return stored ? JSON.parse(stored) : [];
  }
}

async function resolveFeedback(id) {
  return await apiFetch(`/feedback/${id}/resolve`, { method: 'PATCH' });
}

async function deleteFeedback(id) {
  return await apiFetch(`/feedback/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// NOTICES
// -------------------------------------------------------
async function getNotices() {
  try {
    return await apiFetch(`/notices/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-notices');
    return stored ? JSON.parse(stored) : [];
  }
}

async function createNotice(data) {
  return await apiFetch('/notices', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function deleteNotice(id) {
  return await apiFetch(`/notices/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// ADMISSIONS
// -------------------------------------------------------
async function getAdmissions() {
  try {
    return await apiFetch(`/admissions/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-admissions');
    return stored ? JSON.parse(stored) : {};
  }
}

async function updateAdmissions(data) {
  return await apiFetch('/admissions', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// -------------------------------------------------------
// LEADERSHIP
// -------------------------------------------------------
async function getLeadership() {
  try {
    return await apiFetch(`/leadership/${SCHOOL_ID}`);
  } catch {
    const stored = localStorage.getItem('school-leadership');
    return stored ? JSON.parse(stored) : [];
  }
}

async function createLeader(data) {
  return await apiFetch('/leadership', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateLeader(id, data) {
  return await apiFetch(`/leadership/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteLeader(id) {
  return await apiFetch(`/leadership/${id}`, { method: 'DELETE' });
}

// -------------------------------------------------------
// SETTINGS
// -------------------------------------------------------
async function getSettings() {
  try {
    return await apiFetch(`/settings/${SCHOOL_ID}`);
  } catch {
    return null;
  }
}

async function updateSettings(data) {
  return await apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}