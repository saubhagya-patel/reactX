import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';
import { submitGameResult } from '../services/api_client';

// Game Components (assuming they are in the same folder)
import VisualSimpleGame from './VisualSimpleGame';
import VisualChoiceGame from './VisualChoiceGame';
import AuditorySimpleGame from './AuditorySimpleGame';
import StroopEffectGame from './StroopEffectGame';

// --- GameSettings Component ---
const GameSettings = ({ gameName, onSubmit }) => {
  const [rounds, setRounds] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rounds: Number(rounds), difficulty });
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white text-center mb-6">{gameName}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="rounds" className="block text-sm font-medium text-gray-300">
            Rounds
          </label>
          <select
            id="rounds"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={2}>2 Rounds</option>
            <option value={5}>5 Rounds</option>
            <option value={10}>10 Rounds</option>
            <option value={20}>20 Rounds</option>
            <option value={30}>30 Rounds</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

// --- GameSummary Component ---
const GameSummary = ({ results, onPlayAgain }) => {
  
  // Guard clause for NaN
  if (!results || results.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white">Loading results...</h2>
      </div>
    );
  }

  // Calculate Averages
  const totalTime = results.reduce((sum, r) => sum + r.score_time_ms, 0);
  const avgTime = (totalTime / results.length).toFixed(1);
  
  const accuracyResults = results.filter(r => r.accuracy !== null && r.accuracy !== undefined);
  
  let avgAccuracy = "N/A"; // Default to N/A
  if (accuracyResults.length > 0) {
    const totalAccuracy = accuracyResults.reduce((sum, r) => sum + r.accuracy, 0);
    avgAccuracy = ((totalAccuracy / accuracyResults.length) * 100).toFixed(1) + "%";
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-xl text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Game Over!</h2>
      
      <div className="grid grid-cols-2 gap-4 text-center mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-sm uppercase text-gray-400">Avg. Time</div>
          <div className="text-3xl font-bold text-indigo-400">{avgTime} ms</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-sm uppercase text-gray-400">Avg. Accuracy</div>
          <div className="text-3xl font-bold text-indigo-400">{avgAccuracy}</div>
        </div>
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        Play Again
      </button>

      <Link
          to={`/leaderboard`}
          className="mt-2 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          See Leaderboard
        </Link>
  
      <Link
          to={`/`}
          className="mt-2 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Play another one
        </Link>
    </div>
  );
};

// --- GamePage Component (Main) ---
function GamePage() {
  const { gameType } = useParams();
  const token = useAuthStore((state) => state.token);
  
  const [gameState, setGameState] = useState('settings'); // settings, playing, finished
  const [gameSettings, setGameSettings] = useState({ rounds: 10, difficulty: 'medium' });
  const [results, setResults] = useState([]);

  // Find the correct game component to render
  const GameComponent = gameComponents[gameType]?.component || null;
  const gameName = gameComponents[gameType]?.name || 'Game';

  // Called from GameSettings
  const handleGameStart = (settings) => {
    setGameSettings(settings);
    setResults([]); // Clear old results
    setGameState('playing');
  };

  // Called from the individual game component
  const handleGameEnd = (gameResults) => {
    
    // ** THE FIX IS HERE **
    // Guard clause to prevent processing if gameResults is empty or invalid
    if (!gameResults || gameResults.length === 0) {
      console.error("handleGameEnd was called with no results.");
      setResults([]); // Set to empty array to be safe
      setGameState('finished');
      return; 
    }

    // 1. Calculate final averages
    const totalTime = gameResults.reduce((sum, r) => sum + r.score_time_ms, 0);
    const avgTimeMs = totalTime / gameResults.length;
    
    const accuracyResults = gameResults.filter(r => r.accuracy !== null && r.accuracy !== undefined);
    let avgAccuracy = null;
    if (accuracyResults.length > 0) {
      const totalAccuracy = accuracyResults.reduce((sum, r) => sum + r.accuracy, 0);
      avgAccuracy = totalAccuracy / accuracyResults.length;
    }

    // 2. Set local state to show summary
    setResults(gameResults);
    setGameState('finished');

    // 3. Save the *averaged* score to backend
    if (token) {
      const scoreData = {
        game_type: gameType,
        difficulty: gameSettings.difficulty,
        // Ensure we send a number, not NaN
        avg_score_time_ms: Math.round(avgTimeMs) || 0,
        avg_accuracy: avgAccuracy
      };

      console.log('Submitting averaged score:', scoreData);
      submitGameResult(scoreData, token).catch(err => {
        // Log error, but don't block user
        console.error("Failed to submit scores:", err);
      });
    }
  };

  // Called from GameSummary
  const handlePlayAgain = () => {
    setGameState('settings');
  };

  if (!GameComponent) {
    return <div className="p-8 text-center text-red-500">Error: Game type "{gameType}" not found.</div>;
  }

  // Render the correct component based on the game state
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {gameState === 'settings' && (
        <GameSettings gameName={gameName} onSubmit={handleGameStart} />
      )}
      
      {gameState === 'playing' && (
        <GameComponent
          settings={gameSettings}
          onGameEnd={handleGameEnd}
        />
      )}

      {gameState === 'finished' && (
        <GameSummary results={results} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}

// Map of game components
const gameComponents = {
  visual_simple: {
    component: VisualSimpleGame,
    name: 'Visual Reaction Test',
  },
  visual_choice: {
    component: VisualChoiceGame,
    name: 'Choice Reaction Test',
  },
  auditory_simple: {
    component: AuditorySimpleGame,
    name: 'Auditory Reaction Test',
  },
  stroop_effect: {
    component: StroopEffectGame,
    name: 'Stroop Effect Test',
  },
};

export default GamePage;
