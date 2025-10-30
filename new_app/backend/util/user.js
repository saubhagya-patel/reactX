import { getDB } from "../db/db_instance.js";

/**
 * Finds a user by their ID (UUID).
 * @param {string} id - The user's UUID.
 * @returns {Promise<object|null>} The user object (without password) or null.
 */
export async function findUserById(id) {
  const db = getDB();
  try {
    const result = await db.query(
      'SELECT "id", "email", "username", "avatar_key", "created_at" FROM "users" WHERE "id" = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw error;
  }
}

/**
 * Updates a user's profile information.
 * @param {string} id - The user's UUID.
 * @param {object} updates - An object with fields to update (e.g., { username, avatar_key }).
 * @returns {Promise<object>} The updated user object.
 */
export async function updateUser(id, { username, avatar_key }) {
  const db = getDB();
  try {
    // We only update the fields that are provided
    const result = await db.query(
      `UPDATE "users"
       SET 
         "username" = COALESCE($1, "username"),
         "avatar_key" = COALESCE($2, "avatar_key")
       WHERE "id" = $3
       RETURNING "id", "email", "username", "avatar_key"`,
      [username, avatar_key, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
