import React, { useState, useEffect, useRef } from 'react';

const colorMap = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#facc15',
  white: '#f9fafb',
};
const colorNames = Object.keys(colorMap);

function StroopEffectGame({ settings, onGameEnd }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, result
  const [challenge, setChallenge] = useState({ word: null, color: null });
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const startTime = useRef(0);
  const nextRoundTimer = useRef(null);

  // Spawn new challenge
  const spawnChallenge = () => {
    const word = colorNames[Math.floor(Math.random() * colorNames.length)];
    let color = colorNames[Math.floor(Math.random() * colorNames.length)];
    while (color === word) {
      color = colorNames[Math.floor(Math.random() * colorNames.length)];
    }
    setChallenge({ word, color });
    setFeedback(null);
    setGameState('playing');
    startTime.current = Date.now();
  };

  // Start game
  useEffect(() => {
    if (gameState === 'ready') {
      const startTimer = setTimeout(() => spawnChallenge(), 1000);
      return () => clearTimeout(startTimer);
    }
  }, [gameState]);

  // Handle color choice
  const handleChoice = (choice) => {
    if (gameState !== 'playing') return;

    const reactionTime = Date.now() - startTime.current;
    const isCorrect = choice === challenge.color;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setGameState('result');

    const newResult = {
      score_time_ms: reactionTime,
      accuracy: isCorrect ? 1 : 0,
    };

    setResults((prev) => {
      const updated = [...prev, newResult];

      if (updated.length < settings.rounds) {
        nextRoundTimer.current = setTimeout(() => {
          spawnChallenge();
        }, 1000);
      } else {
        onGameEnd(updated);
      }

      return updated;
    });
  };

  useEffect(() => {
    return () => {
      if (nextRoundTimer.current) clearTimeout(nextRoundTimer.current);
    };
  }, []);

  // UI rendering
  if (gameState === 'ready') {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white">Get Ready...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh] bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
      <div className="text-center mb-8">
        {feedback === 'correct' && <p className="text-2xl text-green-500 mb-2">Correct!</p>}
        {feedback === 'incorrect' && <p className="text-2xl text-red-500 mb-2">Wrong!</p>}

        {gameState === 'playing' && challenge.color && (
          <>
            <p className="text-xl text-gray-400 mb-2">Click the button matching the <strong>color of the word</strong></p>
            <h1
              className="text-5xl font-bold mb-4"
              style={{ color: colorMap[challenge.color] }}
            >
              {challenge.word.toUpperCase()}
            </h1>
          </>
        )}
        {gameState === 'result' && feedback && (
          <p className="text-gray-400 text-xl">Next round...</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {colorNames.map((color) => (
          <button
            key={color}
            onClick={() => handleChoice(color)}
            className="px-6 py-3 rounded-xl text-lg font-medium transition-all shadow-md"
            style={{
              backgroundColor: colorMap[color],
              color: color === 'white' ? '#000' : '#fff',
              opacity: gameState === 'playing' ? 1 : 0.6,
              pointerEvents: gameState === 'playing' ? 'auto' : 'none',
            }}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StroopEffectGame;
