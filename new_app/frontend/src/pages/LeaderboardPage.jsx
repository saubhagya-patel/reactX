import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api_client';
import { GAME_ICON_MAP } from './HomePage';

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
  simon_game: 'Simon Reaction',
  number_order: 'Number Reaction',
};

const LeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const [gameFilter, setGameFilter] = useState(''); // Empty string means all games
  const [difficultyFilter, setDifficultyFilter] = useState(''); // Empty string means all
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass both filters to the API service.
        const response = await getLeaderboard(
          gameFilter || null,
          difficultyFilter || null
        );
        setScores(response.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameFilter, difficultyFilter]); // Re-fetch whenever filters change

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between rounded-lg bg-gray-800 p-6 shadow-xl gap-4">
        <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        
        {/* Filter Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Game Filter Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="gameFilter" className="mb-1 block text-sm font-medium text-gray-300">
              Game
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
              <option value="stroop_effect">Stroop Reaction</option>
              <option value="simon_game">Simon Reaction</option>
              <option value="number_order">Number Reaction</option>
            </select>
          </div>

          {/* Difficulty Filter Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="difficultyFilter" className="mb-1 block text-sm font-medium text-gray-300">
              Difficulty
            </label>
            <select
              id="difficultyFilter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full p-2 rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* ** MODIFIED SECTION ** */}
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">
                        {GAME_ICON_MAP[score.game_type] || '❔'}
                      </span>
                      <div>
                        <div className="text-sm text-gray-300">
                          {GAME_TYPE_MAP[score.game_type] || score.game_type}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          ({score.difficulty})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Score and Accuracy */}
                    <div className="text-lg font-semibold text-indigo-400">{score.avg_score_time_ms} ms</div>
                    
                    {typeof score.avg_accuracy === 'number' ? (
                      <span className="text-xs text-blue-400">
                        ({(score.avg_accuracy * 100).toFixed(0)}% acc)
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">(N/A)</span>
                    )}
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
