import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api_client';

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
};

const LeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const [gameFilter, setGameFilter] = useState(''); // Empty string means all games
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass the filter to the API service.
        // If gameFilter is "", it will fetch the default leaderboard.
        const response = await getLeaderboard(gameFilter || null);
        setScores(response.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameFilter]); // Re-fetch whenever the gameFilter changes

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-800 p-6 shadow-xl">
        <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        {/* Filter Dropdown */}
        <div className="w-1/3">
          <label htmlFor="gameFilter" className="mb-1 block text-sm font-medium text-gray-300">
            Filter by game
          </label>
          <select
            id="gameFilter"
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="w-full p-2 rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Games</option>
            <option value="visual_simple">Visual Reaction</option>
            <option value="visual_choice">Choice Reaction</option>
            <option value="auditory_simple">Auditory Reaction</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading scores...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : scores.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No scores yet. Be the first!</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Game
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Score (ms)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {scores.map((score, index) => (
                <tr key={score.id || index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-lg font-bold ${
                        index === 0
                          ? 'text-yellow-400'
                          : index === 1
                          ? 'text-gray-300'
                          : index === 2
                          ? 'text-yellow-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">{AVATAR_MAP[score.avatar_key] || '❔'}</span>
                      <span className="font-medium text-white">{score.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {GAME_TYPE_MAP[score.game_type] || score.game_type}
                    {score.accuracy && (
                      <span className="ml-2 text-xs text-blue-400">({score.accuracy * 100}% acc)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-indigo-400">
                    {score.score_time_ms} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
