import React, { useState, useEffect, useRef } from 'react';

// Game settings
const ROUNDS = 10;
const MIN_DELAY = 800;
const MAX_DELAY = 3000;
const COLORS = [
  { key: 'r', hex: '#EF4444', name: 'Red' }, // R key
  { key: 'g', hex: '#22C55E', name: 'Green' }, // G key
  { key: 'b', hex: '#3B82F6', name: 'Blue' }, // B key
];

/**
 * Game 2: Press the correct key (R, G, B) for the color.
 */
const VisualChoiceGame = ({ onGameEnd }) => {
  const [round, setRound] = useState(0);
  const [currentColor, setCurrentColor] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [results, setResults] = useState([]); // Stores { time, isCorrect }
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Game loop effect
  useEffect(() => {
    if (round >= ROUNDS) {
      // Game over
      const totalTime = results.reduce((sum, r) => sum + r.time, 0);
      const correctCount = results.filter((r) => r.isCorrect).length;
      onGameEnd({
        score_time_ms: Math.round(totalTime / results.length),
        accuracy: correctCount / results.length,
      });
      return;
    }

    // Start next round
    setIsWaiting(true);
    setCurrentColor(null);
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    timerRef.current = setTimeout(() => {
      const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setCurrentColor(nextColor);
      setIsWaiting(false);
      startTimeRef.current = Date.now();
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [round, results, onGameEnd]);

  // Key press listener effect
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isWaiting || !currentColor) return; // Don't do anything if not in active state

      const key = e.key.toLowerCase();
      if (key !== 'r' && key !== 'g' && key !== 'b') return; // Ignore other keys

      const reactionTime = Date.now() - startTimeRef.current;
      const isCorrect = key === currentColor.key;
      
      // Store result and advance
      setResults([...results, { time: reactionTime, isCorrect }]);
      setRound(round + 1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);

  }, [isWaiting, currentColor, round, results]);

  return (
    <div className="relative flex h-96 w-full items-center justify-center rounded-lg bg-gray-900">
      {isWaiting && (
        <div className="text-center text-gray-400">
          <p className="text-xl">Get ready...</p>
        </div>
      )}
      
      {currentColor && (
        <div className="text-center">
          <div
            className="h-32 w-32 rounded-lg shadow-lg"
            style={{ backgroundColor: currentColor.hex }}
          />
          <p className="mt-4 text-2xl font-bold text-white">Press {currentColor.key.toUpperCase()}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-sm text-gray-400">
        Press (R)ed, (G)reen, or (B)lue
      </div>
      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        Round: {round + 1} / {ROUNDS}
      </div>
    </div>
  );
};

export default VisualChoiceGame;
