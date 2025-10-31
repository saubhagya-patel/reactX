import { getDB } from "../db/db_instance.js";

/**
 * Gets the top 10 scores, now from the simplified 'game_scores' table.
 * Can be filtered by game type and difficulty.
 * @param {string | null} gameType - Optional game type to filter.
 * @param {string | null} difficulty - Optional difficulty to filter.
 * @returns {Promise<Array<object>>} The leaderboard data.
 */
export async function getLeaderboard(gameType, difficulty) {
  const db = getDB();
  let query = `
    SELECT 
      u."username", 
      u."avatar_key",
      gs."game_type",
      gs."difficulty",
      gs."avg_score_time_ms",
      gs."avg_accuracy"
    FROM "game_scores" AS gs
    JOIN "users" AS u ON gs."user_id" = u."id"
  `;

  const values = [];
  const whereClauses = [];

  if (gameType) {
    values.push(gameType);
    whereClauses.push(`gs."game_type" = $${values.length}`);
  }
  
  if (difficulty) {
    values.push(difficulty);
    whereClauses.push(`gs."difficulty" = $${values.length}`);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  // Rank by fastest time
  query += ' ORDER BY gs."avg_score_time_ms" ASC LIMIT 10';

  try {
    const result = await db.query(query, values);
    // Add a 'rank' to each result
    return result.rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
}