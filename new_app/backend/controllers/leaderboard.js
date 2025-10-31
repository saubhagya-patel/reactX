import { leaderboard_util } from "../util/index.js";

/**
 * Controller to get the leaderboard.
 * GET /api/leaderboard
 * Can be filtered with ?game=game_type
 */
export const getTopScores = async (req, res) => {
  // Read the 'game' query parameter from the URL
  const { game, difficulty } = req.query; 

  try {
    const scores = await leaderboard_util.getLeaderboard(game, difficulty);
    res.status(200).json(scores);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error retrieving leaderboard.' });
  }
};
