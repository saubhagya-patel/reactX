import axios from 'axios';

// Create an Axios instance for our API
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Our backend server
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

/**
 * Gets the public leaderboard.
 * @param {string | null} gameType - Optional game type to filter (e.g., 'visual_choice')
 */
export const getLeaderboard = (gameType = null) => {
  const params = gameType ? { game: gameType } : {};
  return apiClient.get('/leaderboard', { params });
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
 * Submits a new score for the logged-in user.
 * @param {object} scoreData - { game_type, score_time_ms, accuracy }
 * @param {string} token - The user's JWT.
 */
export const submitScore = (scoreData, token) => {
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
