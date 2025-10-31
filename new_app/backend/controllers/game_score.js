import { game_score_util } from "../util/index.js";

/**
 * Submits a single, averaged game score.
 */
export const submitScore = async (req, res) => {
  // We get the user ID from our auth middleware
  const userId = req.user.userId;

  const { game_type, difficulty, avg_score_time_ms, avg_accuracy } = req.body;

  // Basic validation
  if (!game_type || !difficulty || !avg_score_time_ms) {
    return res.status(400).json({ message: 'Missing required score fields.' });
  }

  try {
    const newScore = await game_score_util.createGameScore(
      userId,
      game_type,
      difficulty,
      avg_score_time_ms,
      avg_accuracy || null // Ensure avg_accuracy is null if not provided
    );
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Server error submitting score.' });
  }
};

/**
 * Gets all scores for the logged-in user.
 */
export const getMyScores = async (req, res) => {
  const userId = req.user.userId;
  try {
    const scores = await game_score_util.getScoresByUserId(userId);
    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ message: 'Server error fetching scores.' });
  }
};
