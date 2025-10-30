import { getDB } from "../db/db_instance";

/**
 * Gets the top scores for the leaderboard, optionally filtered by game type.
 * @param {string|null} game_type - Optional game type to filter by (e.g., 'visual_simple').
 * @param {number} limit - The number of scores to return.
 * @returns {Promise<Array<object>>} An array of leaderboard entry objects.
 */
export async function getLeaderboard(game_type = null, limit = 10) {
    const db = getDB();
    try {
        let query;
        const params = [limit];

        if (game_type) {
            // --- Filtered query ---
            // Gets the best score for each user *for that specific game*
            query = `
        SELECT
          DISTINCT ON (u."id")
          s."score_time_ms",
          s."accuracy",
          s."game_type",
          u."username",
          u."avatar_key"
        FROM "game_scores" s
        JOIN "users" u ON s."user_id" = u."id"
        WHERE s."game_type" = $1
        ORDER BY u."id", s."score_time_ms" ASC
        LIMIT $2;
      `;
            params.unshift(game_type); // Add game_type as the first parameter
        } else {
            // --- Global query ---
            // Gets the single best score for each user *across all games*
            query = `
        SELECT
          DISTINCT ON (u."id")
          s."score_time_ms",
          s."accuracy",
          s."game_type",
          u."username",
          u."avatar_key"
        FROM "game_scores" s
        JOIN "users" u ON s."user_id" = u."id"
        ORDER BY u."id", s."score_time_ms" ASC
        LIMIT $1;
      `;
        }

        // This outer query is necessary to re-order the results
        // The DISTINCT ON query groups by user, this one orders the final list
        const finalQuery = `
      SELECT * FROM (${query}) AS user_best_scores
      ORDER BY "score_time_ms" ASC
      LIMIT $${params.length};
    `;

        const result = await db.query(finalQuery, params);

        // Add rank
        return result.rows.map((row, index) => ({
            rank: index + 1,
            ...row,
        }));

    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
}
