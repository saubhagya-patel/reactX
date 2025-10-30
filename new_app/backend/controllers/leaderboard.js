import { leaderboard_util } from "../util/index.js";

/**
 * Controller to get the leaderboard.
 * GET /api/leaderboard
 * Can be filtered with ?game=game_type
 */
export const getTopScores = async (req, res) => {
  // Read the 'game' query parameter from the URL
  const { game } = req.query; 

  try {
    // Pass the game_type (or null) to the utility function
    const scores = await leaderboard_util.getLeaderboard(game, 10);
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving leaderboard.' });
  }
};
