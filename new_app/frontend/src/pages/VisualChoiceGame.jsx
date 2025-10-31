import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';

// Key mapping
const keyMap = {
  r: 'red',
  g: 'green',
  b: 'blue',
};
const colors = ['red', 'green', 'blue'];
const colorHex = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
};

function VisualChoiceGame({ settings, onGameEnd }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, result
  const [results, setResults] = useState([]);
  const [challenge, setChallenge] = useState({ key: null, color: null });
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
  const startTime = useRef(0);
  const nextRoundTimer = useRef(null);

  // This is the correct game-end logic
  useEffect(() => {
    if (results.length > 0 && results.length === settings.rounds) {
      onGameEnd(results);
    }
  }, [results, settings.rounds, onGameEnd]);


  const spawnChallenge = () => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const nextKey = Object.keys(keyMap).find(key => keyMap[key] === nextColor);

    setChallenge({ key: nextKey, color: nextColor });
    setFeedback(null);
    setGameState('playing'); // Game is now active and waiting for input
    startTime.current = Date.now();
  };

  // Main game loop logic: "Get Ready" countdown
  useEffect(() => {
    if (gameState === 'ready') {
      const startTimer = setTimeout(() => {
        spawnChallenge();
      }, 1000); // Initial 1-second "Get Ready"
      return () => clearTimeout(startTimer);
    }
  }, [gameState]);


  // Event handler
  const handleKeyUp = useCallback((e) => {
    // Only run if we are in the 'playing' state
    if (gameState !== 'playing' || !challenge.key || !keyMap[e.key]) return;

    // We've received the input, move to 'result' state
    setGameState('result');
    const reactionTime = Date.now() - startTime.current;
    const isCorrect = keyMap[e.key] === challenge.color;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const newResult = {
      score_time_ms: reactionTime,
      accuracy: isCorrect ? 1 : 0
    };
    
    // ** THE FIX IS HERE **
    // We use a functional update for setResults.
    // The logic to start the next round is now *inside* this update,
    // so it has access to the correct, up-to-date results.
    setResults((prevResults) => {
      const updatedResults = [...prevResults, newResult];

      // Check if the game should continue
      if (updatedResults.length < settings.rounds) {
        nextRoundTimer.current = setTimeout(() => {
          spawnChallenge();
        }, 1000); // 1-second delay for feedback
      }

      return updatedResults;
    });
    
  }, [gameState, challenge, settings.rounds, keyMap]); // Removed stale dependencies

  // Add/Remove event listener
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      // Clear any pending timers when component unmounts
      if (nextRoundTimer.current) {
        clearTimeout(nextRoundTimer.current);
      }
    };
  }, [handleKeyUp]);


  if (gameState === 'ready') {
    return <div className="text-center p-8"><h2 className="text-2xl font-bold text-white">Get Ready...</h2></div>;
  }

  // Render the game UI
  return (
    <div className="w-full h-80 flex flex-col justify-center items-center bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
      <div className="text-center">
        {feedback === 'correct' && <p className="text-2xl text-green-500">Correct!</p>}
        {feedback === 'incorrect' && <p className="text-2xl text-red-500">Wrong!</p>}
        
        {gameState === 'playing' && challenge.color && (
          <>
            <p className="text-2xl text-gray-400 mb-4">Press the key for:</p>
            <div 
              className="w-24 h-24 rounded-lg"
              style={{ backgroundColor: colorHex[challenge.color] }}
            ></div>
            <p className="text-lg text-gray-500 mt-4">(R, G, or B)</p>
          </>
        )}

        {/* This shows while feedback is visible */}
        {gameState === 'result' && feedback && (
           <p className="text-2xl text-gray-400">Next round...</p>
        )}
      </div>
    </div>
  );
}

export default VisualChoiceGame;
