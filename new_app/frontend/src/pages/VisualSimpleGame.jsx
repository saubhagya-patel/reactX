import React, { useState, useEffect, useRef } from 'react';

// Game settings
const ROUNDS = 5;
const MIN_DELAY = 1000; // 1 second
const MAX_DELAY = 4000; // 4 seconds

/**
 * Game 1: Click the shape when it appears.
 */
const VisualSimpleGame = ({ onGameEnd }) => {
  const [round, setRound] = useState(0);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isTargetVisible, setIsTargetVisible] = useState(false);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // This effect runs the game loop
  useEffect(() => {
    if (round >= ROUNDS) {
      // Game over, calculate average and end
      const totalTime = results.reduce((sum, r) => sum + r, 0);
      onGameEnd({
        score_time_ms: Math.round(totalTime / results.length),
        // No accuracy for this game
      });
      return; // Stop the loop
    }

    // Start the next round
    setIsWaiting(true);
    setIsTargetVisible(false);
    
    // Set a random timeout to show the target
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    
    timerRef.current = setTimeout(() => {
      setIsWaiting(false);
      setIsTargetVisible(true);
      startTimeRef.current = Date.now();
    }, delay);

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timerRef.current);

  }, [round, results, onGameEnd]); // Re-run when 'round' changes

  const handleTargetClick = () => {
    if (!isTargetVisible) return;

    const reactionTime = Date.now() - startTimeRef.current;
    
    setResults([...results, reactionTime]); // Store the result
    setIsTargetVisible(false);
    setRound(round + 1); // Advance to the next round
  };

  const handleScreenClick = () => {
    // User clicked too early
    if (isWaiting) {
      clearTimeout(timerRef.current); // Cancel the scheduled target
      setResults([...results, 5000]); // Add a 5000ms penalty
      setRound(round + 1); // Advance to the next round (with penalty)
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="relative flex h-96 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900"
    >
      {isWaiting && (
        <div className="text-center text-gray-400">
          <p className="text-xl">Wait for the target...</p>
        </div>
      )}
      
      {isTargetVisible && (
        <div
          onClick={handleTargetClick}
          className="absolute h-32 w-32 cursor-crosshair rounded-full bg-indigo-500 shadow-lg transition-all hover:bg-indigo-400"
          // Random positioning (simple for now, can be improved)
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
          }}
        />
      )}
      
      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        Round: {round + 1} / {ROUNDS}
      </div>
    </div>
  );
};

export default VisualSimpleGame;
