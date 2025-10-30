import { game_score_util } from "../util/index.js";

/**
 * Controller to submit a new score.
 * POST /api/scores
 */
export const submitScore = async (req, res) => {
  const { game_type, score_time_ms, accuracy } = req.body;
  
  // req.user.userId is attached by the 'protect' middleware
  const user_id = req.user.userId; 

  // Validation
  if (!game_type || !score_time_ms) {
    return res.status(400).json({ message: 'Game type and score are required.' });
  }

  try {
    const newScore = await game_score_util.createScore(
      user_id,
      game_type,
      score_time_ms,
      accuracy || null // Ensure accuracy is null if not provided
    );
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting score.' });
  }
};

/**
 * Controller to get all scores for the logged-in user.
 * GET /api/scores/me
 */
export const getMyScores = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const scores = await game_score_util.getScoresByUserId(user_id);
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving scores.' });
  }
};
