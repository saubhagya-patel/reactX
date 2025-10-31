import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth_store';
import { updateMyProfile, getMyScores } from '../services/api_client';
import AvatarSelector, { AVATARS } from '../components/AvatarSelector';

// A mapping of avatar keys to emojis for display
const AVATAR_MAP = {
  fire: '🔥',
  water: '💧',
  air: '🌬️',
  earth: '🌿',
  lightning: '⚡',
  ice: '❄️',
};

// A mapping of game keys to formatted titles
const GAME_TYPE_MAP = {
  visual_simple: 'Visual Reaction',
  visual_choice: 'Choice Reaction',
  auditory_simple: 'Auditory Reaction',
  stroop_effect: 'Stroop Reaction',
};

const ProfilePage = () => {
  const { user, token, updateUser: updateUserInStore } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    updateUser: state.updateUser,
  }));

  const [scores, setScores] = useState([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [error, setError] = useState(null);

  // State for the profile editor
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar_key || 'fire');
  const [editMessage, setEditMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch the user's score history
  useEffect(() => {
    const fetchScores = async () => {
      if (!token) return;
      setIsLoadingScores(true);
      try {
        const response = await getMyScores(token);
        // Sort scores by date, most recent first
        setScores(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (err) {
        console.error('Error fetching scores:', err);
        setError('Failed to load score history.');
      } finally {
        setIsLoadingScores(false);
      }
    };

    fetchScores();
  }, [token]);

  // Handle the profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setEditMessage({ type: '', text: '' });

    try {
      const updatedData = {
        username: editUsername,
        avatar_key: editAvatar,
      };
      const response = await updateMyProfile(updatedData, token);
      
      // Update the user in the global Zustand store
      updateUserInStore(response.data);
      
      setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false); // Close the edit form
    } catch (err) {
      console.error('Error updating profile:', err);
      const message = err.response?.data?.message || 'Failed to update profile.';
      setEditMessage({ type: 'error', text: message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return <div className="p-12 text-center text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Header / Editor */}
      <div className="rounded-lg bg-gray-800 p-8 shadow-xl">
        {!isEditing ? (
          // --- View Mode ---
          <div className="flex items-center space-x-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 text-6xl shadow-inner">
              {AVATAR_MAP[user.avatar_key]}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditMessage({ type: '', text: '' }); // Clear any old messages
                }}
                className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // --- Edit Mode ---
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Edit Your Profile</h3>
            {editMessage.text && (
              <div
                className={`rounded-md p-3 text-center text-sm ${
                  editMessage.type === 'success'
                    ? 'bg-green-900 text-green-200'
                    : 'bg-red-900 text-red-200'
                }`}
              >
                {editMessage.text}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="mt-1 p-2 block w-full max-w-sm rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <AvatarSelector selectedAvatar={editAvatar} onAvatarChange={setEditAvatar} />
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Score History */}
      <div className="rounded-lg bg-gray-800 shadow-xl">
        <h3 className="border-b border-gray-700 p-6 text-2xl font-bold text-white">
          My Score History
        </h3>
        <div className="overflow-x-auto">
          {isLoadingScores ? (
            <div className="p-12 text-center text-gray-400">Loading scores...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">{error}</div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              You haven't played any games yet.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Score (ms)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {scores.map((score) => (
                  <tr key={score.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {GAME_TYPE_MAP[score.game_type] || score.game_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-400">
                      {score.avg_score_time_ms} ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {score.accuracy !== null ? `${score.accuracy * 100}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(score.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
