import express from 'express';
const router = express.Router();

import { leaderboard_controller } from '../controllers/index.js';


// This is a public route, no 'protect' middleware needed

// GET /api/leaderboard
// GET /api/leaderboard?game=visual_choice
router.get('/', leaderboard_controller.getTopScores);

export default router;
