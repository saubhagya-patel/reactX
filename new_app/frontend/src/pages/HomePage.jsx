import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';
import { GAMES_INFO } from '../store/app_info_store';

const HomePage = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }));

  return (
    <div className="space-y-12">
      <div className="rounded-lg bg-gray-800 p-8 text-center shadow-xl">
        <h1 className="text-4xl font-bold text-white">
          Welcome to the <span className="text-indigo-400">reactX</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          {user
            ? `Ready to test your skills, ${user.username}?`
            : 'Log in or create an account to save your scores and hit the leaderboard.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {GAMES_INFO.map((game) => (
          <GameCard key={game.type} game={game} />
        ))}
      </div>
    </div>
  );
};

// A sub-component for the game selection cards
const GameCard = ({ game }) => {
  return (
    <div className="transform rounded-lg bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="p-6">
        <div className="mb-4 text-5xl">{game.icon}</div>
        <h3 className="mb-2 text-2xl font-bold text-white">{game.title}</h3>
        <p className="mb-6 text-sm text-gray-400">{game.description}</p>
        <Link
          to={`/game/${game.type}`}
          className="inline-block rounded-md bg-indigo-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-indigo-500"
        >
          Play Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
