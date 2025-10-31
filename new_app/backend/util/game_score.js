import { getDB } from "../db/db_instance.js";

/**
 * Creates a new single game score entry in the database.
 * @param {string} userId - The user's UUID.
 * @param {string} gameType - The type of game (e.g., 'visual_simple').
 * @param {string} difficulty - The difficulty (e.g., 'medium').
 * @param {number} avgScoreTimeMs - The average reaction time.
 * @param {number | null} avgAccuracy - The average accuracy (if applicable).
 * @returns {Promise<object>} The newly created game score object.
 */
export async function createGameScore(userId, gameType, difficulty, avgScoreTimeMs, avgAccuracy) {
    const db = getDB();
    const query = `
    INSERT INTO "game_scores" 
      ("user_id", "game_type", "difficulty", "avg_score_time_ms", "avg_accuracy")
    VALUES 
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

    // This is the correct, simplified data we're inserting.
    const values = [userId, gameType, difficulty, avgScoreTimeMs, avgAccuracy];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating game score:', error);
        throw error;
    }
}

/**
 * Gets all game scores for a specific user.
 * @param {string} userId - The user's UUID.
 * @returns {Promise<Array<object>>} A list of the user's game scores.
 */
export async function getScoresByUserId(userId) {
    const db = getDB();
    const query = `
    SELECT "game_type", "difficulty", "avg_score_time_ms", "avg_accuracy", "created_at" 
    FROM "game_scores" 
    WHERE "user_id" = $1 
    ORDER BY "created_at" DESC;
  `;
    try {
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error getting user scores:', error);
        throw error;
    }
}
