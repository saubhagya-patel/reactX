import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';
import { submitScore } from '../services/api_client';

// Import the individual game components
import VisualSimpleGame from './VisualSimpleGame';
import VisualChoiceGame from './VisualChoiceGame';
import AuditorySimpleGame from './AuditorySimpleGame';

// Game metadata
const GAME_COMPONENTS = {
  visual_simple: {
    component: VisualSimpleGame,
    title: 'Visual Reaction',
  },
  visual_choice: {
    component: VisualChoiceGame,
    title: 'Choice Reaction',
  },
  auditory_simple: {
    component: AuditorySimpleGame,
    title: 'Auditory Reaction',
  },
};

/**
 * GamePage acts as a host for all the different games.
 * It manages the overall game state ('ready', 'playing', 'finished')
 * and handles submitting the final score to the backend.
 */
const GamePage = () => {
  const { gameType } = useParams(); // Get 'visual_simple' etc. from URL
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [results, setResults] = useState(null); // Will store { score_time_ms, accuracy }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const CurrentGame = GAME_COMPONENTS[gameType]?.component;
  const gameTitle = GAME_COMPONENTS[gameType]?.title || 'Game';

  // This function is passed down to the active game component.
  // The game will call this when it's finished.
  const handleGameEnd = (gameResults) => {
    setResults(gameResults);
    setGameState('finished');
  };

  // This is called by the GameSummary component
  const handleSaveScore = async () => {
    if (!results || !token) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const scoreData = {
        game_type: gameType,
        score_time_ms: results.score_time_ms,
        accuracy: results.accuracy || null,
      };
      await submitScore(scoreData, token);
      // On success, navigate to the profile to see the new score
      navigate('/profile');
    } catch (err) {
      console.error('Failed to submit score:', err);
      setSubmitError('Failed to save score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    setResults(null);
    setGameState('ready'); // Reset the state to 'ready'
  };

  // Render logic based on the game state
  const renderContent = () => {
    switch (gameState) {
      case 'ready':
        return (
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">{gameTitle}</h2>
            <p className="mb-8 text-lg text-gray-300">
              When you're ready, click the button below to start.
            </p>
            <button
              onClick={() => setGameState('playing')}
              className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-transform duration-200 hover:scale-105"
            >
              Start
            </button>
          </div>
        );
      case 'playing':
        return CurrentGame ? (
          <CurrentGame onGameEnd={handleGameEnd} />
        ) : (
          <p className="text-center text-red-400">Error: Game not found.</p>
        );
      case 'finished':
        return (
          <GameSummary
            results={results}
            onSaveScore={handleSaveScore}
            onPlayAgain={handlePlayAgain}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl">
      {renderContent()}
    </div>
  );
};

// A sub-component to show the game results
const GameSummary = ({ results, onSaveScore, onPlayAgain, isSubmitting, submitError }) => {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-3xl font-bold text-white">Game Over!</h2>
      <div className="mb-6 space-y-2">
        <p className="text-xl text-gray-300">Your average reaction time was:</p>
        <p className="text-5xl font-bold text-indigo-400">{results.score_time_ms} ms</p>
        {results.accuracy !== undefined && (
          <p className="text-xl text-gray-300">
            Accuracy: <span className="text-indigo-400">{results.accuracy * 100}%</span>
          </p>
        )}
      </div>

      {submitError && (
        <div className="mb-4 rounded-md bg-red-900 p-3 text-center text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={onPlayAgain}
          className="rounded-md bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-500"
        >
          Play Again
        </button>
        <button
          onClick={onSaveScore}
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Score'}
        </button>
      </div>
    </div>
  );
};

export default GamePage;
