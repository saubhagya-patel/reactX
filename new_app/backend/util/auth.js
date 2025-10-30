import bcrypt from 'bcrypt';

import { getDB } from '../db/db_instance.js';

/**
 * Finds a user in the database by their email OR username.
 * @param {string} email - The email to check.
 * @param {string} username - The username to check.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
export async function findUserByEmailOrUsername(email, username) {
    const db = getDB();
    try {
        const result = await db.query(
            'SELECT * FROM "users" WHERE "email" = $1 OR "username" = $2',
            [email, username]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error finding user by email/username:", error);
        throw error;
    }
}

/**
 * Finds a user in the database by their email.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
export async function findUserByEmail(email) {
    const db = getDB();
    try {
        const result = await db.query(
            'SELECT * FROM "users" WHERE "email" = $1',
            [email]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
}

/**
 * Creates a new user in the database.
 * Hashes the password before insertion.
 * @param {string} email
 * @param {string} username
 * @param {string} password - Plain-text password.
 * @param {string} avatar_key
 * @returns {Promise<object>} The newly created user object.
 */
export async function createUser(email, username, password, avatar_key) {
    const db = getDB();
    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUserQuery = `
      INSERT INTO "users" ("email", "username", "password_hash", "avatar_key")
      VALUES ($1, $2, $3, $4)
      RETURNING "id", "email", "username", "avatar_key", "created_at"
    `;

        const result = await db.query(newUserQuery, [
            email,
            username,
            password_hash,
            avatar_key,
        ]);

        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        // Rethrow to be handled by the controller
        throw error;
    }
}
