import express from 'express';
const router = express.Router();

import { auth_middleware } from '../middleware/index.js';
import { game_score_controller } from '../controllers/index.js';

// All routes in this file are protected
router.use(auth_middleware.protect);

// POST /api/scores
// Submit a new score for the logged-in user
router.post('/', game_score_controller.submitScore);

// GET /api/scores/me
// Get all scores for the logged-in user
router.get('/me', game_score_controller.getMyScores);

export default router;
