import axios from 'axios';
import conf from '../conf/conf';

// === Main API Client ===
// We will use this single client for all requests.
const apiClient = axios.create({
  baseURL: conf.apiUrl || 'http://localhost:3000/api',
});

// =================================================================
// PUBLIC ROUTES (No Auth Needed)
// =================================================================

/**
 * Registers a new user.
 * @param {object} userData - { email, username, password, avatar_key }
 */
export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

/**
 * Logs in an existing user.
 * @param {object} credentials - { email, password }
 */
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const getLeaderboard = (game, difficulty) => {
  let query = '/leaderboard';
  const params = [];
  if (game) params.push(`game=${game}`);
  if (difficulty) params.push(`difficulty=${difficulty}`);
  
  if (params.length > 0) {
    query += '?' + params.join('&');
  }
  
  return apiClient.get(query);
};

// =================================================================
// PROTECTED ROUTES (Auth Token Required)
// =================================================================

/**
 * Helper function to get the auth headers.
 * @param {string} token - The user's JWT.
 */
const getAuthHeaders = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};

/**
 * Submits a SINGLE, AVERAGED game result.
 * @param {object} scoreData - The final averaged score object.
 * @param {string} token - The user's JWT
 */
export const submitGameResult = (scoreData, token) => {
  // scoreData should be { game_type, difficulty, avg_score_time_ms, avg_accuracy }
  return apiClient.post('/scores', scoreData, getAuthHeaders(token));
};

/**
 * Gets the full score history for the logged-in user.
 * @param {string} token - The user's JWT.
 */
export const getMyScores = (token) => {
  return apiClient.get('/scores/me', getAuthHeaders(token));
};

/**
 * Gets the profile for the logged-in user.
 * @param {string} token - The user's JWT.
 */
export const getMyProfile = (token) => {
  return apiClient.get('/users/me', getAuthHeaders(token));
};

/**
 * Updates the logged-in user's profile.
 * @param {object} profileData - { username, avatar_key }
 * @param {string} token - The user's JWT.
 */
export const updateMyProfile = (profileData, token) => {
  return apiClient.patch('/users/me', profileData, getAuthHeaders(token));
};
