import { getDB } from "../db/db_instance.js";

/**
 * Creates a new game score in the database.
 * @param {string} user_id - The UUID of the user.
 * @param {string} game_type - The type of game (e.g., 'visual_simple').
 * @param {number} score_time_ms - The reaction time in milliseconds.
 * @param {number|null} accuracy - The accuracy (e.g., 0.95) or null.
 * @returns {Promise<object>} The newly created score object.
 */
export async function createScore(user_id, game_type, score_time_ms, accuracy) {
    const db = getDB();
    try {
        const newScoreQuery = `
      INSERT INTO "game_scores" ("user_id", "game_type", "score_time_ms", "accuracy")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = await db.query(newScoreQuery, [
            user_id,
            game_type,
            score_time_ms,
            accuracy,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating score:', error);
        throw error;
    }
}

/**
 * Gets all scores for a specific user.
 * @param {string} user_id - The UUID of the user.
 * @returns {Promise<Array<object>>} An array of score objects.
 */
export async function getScoresByUserId(user_id) {
    const db = getDB();
    try {
        const query = `
      SELECT "id", "game_type", "score_time_ms", "accuracy", "created_at"
      FROM "game_scores"
      WHERE "user_id" = $1
      ORDER BY "created_at" DESC
    `;
        const result = await db.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        console.error('Error getting scores by user id:', error);
        throw error;
    }
}
