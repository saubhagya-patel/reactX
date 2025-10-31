import React, { useState, useEffect, useRef } from 'react';

function NumberOrderGame({ settings, onGameEnd }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, feedback
  const [roundIndex, setRoundIndex] = useState(0);
  const [numbers, setNumbers] = useState([]); // shuffled numbers for current round
  const [nextNumber, setNextNumber] = useState(1); // expected next number to click
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
  const startTimeRef = useRef(0);

  const { rounds = 5, difficulty = 'medium' } = settings || {};

  // Number of tiles per round depending on difficulty
  const countMap = { easy: 4, medium: 6, hard: 8 };
  const tileCount = countMap[difficulty] || 6;

  // Utility: shuffle array
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Start a new round: generate numbers and show them
  const startRound = () => {
    const start = Math.floor(Math.random() * 50) + 1; // random start point between 1–50
    const base = Array.from({ length: tileCount }, (_, i) => start + i);
    setNumbers(shuffle(base));
    setNextNumber(start);
    setFeedback(null);
    setGameState('playing');
    // record start time immediately when grid is shown
    startTimeRef.current = Date.now();
  };

  // Start game handler
  const handleStart = () => {
    setResults([]);
    setRoundIndex(0);
    setGameState('readying');
    setTimeout(() => {
      startRound();
    }, 600);
  };

  // When results complete, call onGameEnd
  useEffect(() => {
    if (results.length === rounds) {
      onGameEnd(results);
    }
  }, [results, rounds, onGameEnd]);

  // Handle tile clicks
  const handleTileClick = (num) => {
    if (gameState !== 'playing') return;

    // If correct tile clicked
    if (num === nextNumber) {
      // If that was the last number, round complete successfully
      if (nextNumber === Math.max(...numbers)) {
        const elapsed = Date.now() - startTimeRef.current;
        const result = { score_time_ms: elapsed, accuracy: 1 };
        setResults((prev) => {
          const updated = [...prev, result];
          return updated;
        });
        setFeedback('correct');
        setGameState('feedback');
        // move to next round (or finish)
        setTimeout(() => {
          if (roundIndex + 1 < rounds) {
            setRoundIndex((r) => r + 1);
            startRound();
          } else {
            // onGameEnd will be triggered by useEffect when results length === rounds
          }
        }, 900);
      } else {
        // advance expected number
        setNextNumber((n) => n + 1);
      }
    } else {
      // Wrong click -> mark round incorrect and move on
      const elapsed = Date.now() - startTimeRef.current;
      const result = { score_time_ms: elapsed, accuracy: 0 };
      setResults((prev) => [...prev, result]);
      setFeedback('incorrect');
      setGameState('feedback');
      setTimeout(() => {
        if (roundIndex + 1 < rounds) {
          setRoundIndex((r) => r + 1);
          startRound();
        } else {
          // onGameEnd will be triggered by useEffect
        }
      }, 900);
    }
  };

  // Render tile (disabled style for already-clicked numbers)
  const renderTile = (num) => {
    const clicked = num < nextNumber; // numbers already clicked
    return (
      <button
        key={num}
        onClick={() => handleTileClick(num)}
        disabled={clicked || gameState !== 'playing'}
        className={`w-20 h-20 flex items-center justify-center rounded-lg text-2xl font-bold transition-colors
          ${clicked ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
        `}
      >
        {num}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-800 rounded-lg p-8 border-2 border-gray-700">
      {gameState === 'ready' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Number Order</h2>
          <p className="text-gray-300 mb-6">Click numbers in ascending order as fast as you can.</p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {gameState !== 'ready' && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="text-white mb-4">Round {roundIndex + 1} / {rounds}</div>

          <div
            className={`grid gap-4 mb-6`}
            style={{
              gridTemplateColumns: `repeat(${Math.min(4, Math.ceil(Math.sqrt(tileCount)))}, 1fr)`,
              width: 'min(560px, 90%)',
            }}
          >
            {numbers.map((n) => renderTile(n))}
          </div>

          {gameState === 'playing' && (
            <div className="text-gray-300 mb-2">Next: <span className="text-indigo-400 font-semibold">{nextNumber}</span></div>
          )}

          {gameState === 'feedback' && feedback && (
            <div className="mb-4">
              <span className={`text-xl ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback === 'correct' ? 'Correct!' : 'Wrong!'}
              </span>
            </div>
          )}

          {/* Small summary of progress */}
          <div className="text-gray-400 text-sm">
            Completed: {results.length} / {rounds}
          </div>
        </div>
      )}
    </div>
  );
}

export default NumberOrderGame;
