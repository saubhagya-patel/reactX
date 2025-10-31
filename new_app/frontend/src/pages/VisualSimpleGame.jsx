import React, { useState, useEffect, useRef } from 'react';

const difficultyMap = {
  easy: 100, // size in pixels
  medium: 70,
  hard: 40,
};

function VisualSimpleGame({ settings, onGameEnd }) {
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState('ready'); // ready, waiting, active
  const [results, setResults] = useState([]);
  const [circlePos, setCirclePos] = useState({ top: '50%', left: '50%' });

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const gameBoxRef = useRef(null); // Ref for the game area

  const { rounds, difficulty } = settings;
  const circleSize = difficultyMap[difficulty] || 70;

  // Main game loop logic
  useEffect(() => {
    if (status === 'waiting' && round < rounds) {
      // Wait a random time before showing the circle
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      timerRef.current = setTimeout(() => {
        const gameBox = gameBoxRef.current;
        if (gameBox) {
          const rect = gameBox.getBoundingClientRect();
          const x = Math.random() * (rect.width - circleSize);
          const y = Math.random() * (rect.height - circleSize);
          setCirclePos({ top: `${y}px`, left: `${x}px` });
        }
        setStatus('active');
        startTimeRef.current = Date.now();
      }, delay);
    }

    // Cleanup timer
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [status, round, rounds, circleSize]);

  // Handle game end
  useEffect(() => {
    if (round === rounds) {
      onGameEnd(results);
    }
  }, [round, rounds, onGameEnd, results]);

  const handleStart = () => {
    setRound(0);
    setResults([]);
    setStatus('waiting');
  };

  const handleClick = () => {
    if (status === 'active') {
      const reactionTime = Date.now() - startTimeRef.current;
      setResults([
        ...results,
        { score_time_ms: reactionTime, accuracy: null },
      ]);
      setRound((r) => r + 1);
      setStatus('waiting');
    } else if (status === 'waiting') {
      // Clicked too early!
      clearTimeout(timerRef.current);
      setResults([
        ...results,
        { score_time_ms: 9999, accuracy: null }, // Penalty for early click
      ]);
      setRound((r) => r + 1);
      setStatus('waiting'); // Move to next round
    }
  };

  if (status === 'ready') {
    return (
      <div
        className="h-[70vh] w-full bg-gray-800 rounded-lg flex flex-col items-center justify-center text-center p-8 cursor-pointer"
        onClick={handleStart}
      >
        <h3 className="text-3xl font-bold text-white mb-4">Visual Reaction Test</h3>
        <p className="text-lg text-gray-300 mb-8">
          Click the circle as soon as it appears.
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Click to Start
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game Info Bar */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <span className="font-medium text-white">Round: <span className="text-indigo-400">{round + 1} / {rounds}</span></span>
        <span className="text-gray-400">
          {status === 'waiting' && 'Wait for the circle...'}
          {status === 'active' && 'Click!'}
        </span>
        <span className="font-medium text-white capitalize">Difficulty: <span className="text-indigo-400">{difficulty}</span></span>
      </div>

      <div
        ref={gameBoxRef}
        onClick={handleClick}
        className="w-full h-[70vh] bg-gray-800 rounded-lg overflow-hidden cursor-crosshair relative"
      >
        {status === 'active' && (
          <div
            className="absolute rounded-full bg-indigo-500 shadow-xl"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              top: circlePos.top,
              left: circlePos.left,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default VisualSimpleGame;