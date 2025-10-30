import { user_util } from "../util/index.js";

/**
 * Controller to get the logged-in user's profile.
 * GET /api/users/me
 */
export const getMyProfile = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const user = await user_util.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile.' });
  }
};

/**
 * Controller to update the logged-in user's profile.
 * PATCH /api/users/me
 */
export const updateMyProfile = async (req, res) => {
  const user_id = req.user.userId;
  const { username, avatar_key } = req.body;

  // Basic validation
  if (!username && !avatar_key) {
    return res.status(400).json({ message: 'No fields to update.' });
  }

  try {
    const updatedUser = await user_util.updateUser(user_id, { username, avatar_key });
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle specific errors, e.g., unique constraint for username
    if (error.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'Username already taken.' });
    }
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
