import { getDB } from "../db/db_instance.js";

/**
 * Gets the top 10 leaderboard scores, with an optional game type filter.
 * Joins with the users table to get username and avatar.
 * @param {string} gameType - (Optional) The game type to filter by.
 * @returns {Promise<Array>} A promise that resolves to the leaderboard data.
 */
export async function getLeaderboard(gameType = null) {
  // Base query text
  let queryText = `
    SELECT 
      "g"."score_time_ms", 
      "g"."game_type", 
      "g"."accuracy", 
      "u"."username", 
      "u"."avatar_key",
      RANK() OVER (ORDER BY "g"."score_time_ms" ASC) as "rank"
    FROM 
      "game_scores" AS "g"
    JOIN 
      "users" AS "u" ON "g"."user_id" = "u"."id"
  `;

  const queryParams = [];

  // Add a WHERE clause if gameType is provided
  if (gameType) {
    queryParams.push(gameType);
    // THE FIX IS HERE: Removed the semicolon (;) from the end of this line
    queryText += ` WHERE "g"."game_type" = $1`;
  }

  // Add the final ordering and limit
  queryText += `
    ORDER BY 
      "rank" ASC, "g"."created_at" ASC
    LIMIT 10
  `;

  const db = getDB();

  try {
    const { rows } = await db.query(queryText, queryParams);
    return rows;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
}
