import React from 'react';
import { useState, useEffect, useRef } from 'react';

// A simple beep generator
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const playBeep = () => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1); // Beep for 0.1s
};


function AuditorySimpleGame({ settings, onGameEnd }) {
  const [gameState, setGameState] = useState('ready'); // ready, waiting, playing, result
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'too-soon', 'good', 'missed'
  const startTime = useRef(0);
  const beepTimer = useRef(null);
  const nextRoundTimer = useRef(null); // Added ref for the next round timer

  // This is the new, correct game-end logic
  useEffect(() => {
    // This effect now *only* handles the game end logic.
    if (results.length > 0 && results.length === settings.rounds) {
      onGameEnd(results);
    }
  }, [results, settings.rounds, onGameEnd]);


  const startRound = () => {
    setFeedback(null);
    setGameState('waiting');
    
    // Random delay between 2 and 5 seconds
    const delay = Math.random() * 3000 + 2000; 

    beepTimer.current = setTimeout(() => {
      playBeep();
      setGameState('playing'); // Now listening for the click
      startTime.current = Date.now();
    }, delay);
  };

  // Main game loop logic
  useEffect(() => {
    if (gameState === 'ready') {
      const startTimer = setTimeout(() => {
        startRound();
      }, 1000); // Initial 1-second "Get Ready"
      return () => clearTimeout(startTimer);
    }
    
    // Cleanup timers on unmount
    return () => {
      if (beepTimer.current) clearTimeout(beepTimer.current);
      if (nextRoundTimer.current) clearTimeout(nextRoundTimer.current);
    }
  }, [gameState]);


  const handleClick = () => {
    // Don't do anything if game is over or in feedback state
    if (gameState === 'result' || gameState === 'ready') return;

    let resultData = {};

    if (gameState === 'waiting') {
        // Clicked too soon → apply penalty
        clearTimeout(beepTimer.current);
        const penalty = 9999; // 9.999 seconds — you can tune this
        setFeedback(`Too soon! +${penalty}ms penalty`);
        setGameState('result');
        resultData = { score_time_ms: penalty, accuracy: null }; // Counted as "miss"
    }

    if (gameState === 'playing') {
      // Correct click
      const reactionTime = Date.now() - startTime.current;
      setFeedback(`Good! Your time: ${reactionTime}ms`);
      setGameState('result'); // Move to result state
      resultData = { score_time_ms: reactionTime, accuracy: null };
    }
    
    // ** THE FIX IS HERE **
    // Use a functional update for setResults to get the most up-to-date state
    setResults((prevResults) => {
      const updatedResults = [...prevResults, resultData];

      // Now, check the length of the *updated* array
      if (updatedResults.length < settings.rounds) {
        // If the game is NOT over, set the timer for the next round
        setGameState("ready");
        nextRoundTimer.current = setTimeout(startRound, 2000);
      }
      
      // Return the new state
      return updatedResults;
    });
  };


  if (gameState === 'ready') {
    return <div className="text-center p-8"><h2 className="text-2xl font-bold text-white">Get Ready...</h2></div>;
  }

  // ... (rest of the UI is unchanged) ...
  return (
    <div 
      className="w-full h-80 flex flex-col justify-center items-center bg-gray-800 rounded-lg p-6 border-2 border-gray-700 cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-center">
        {gameState === 'waiting' && (
          <p className="text-2xl text-gray-400">Wait for the beep...</p>
        )}
        {gameState === 'playing' && (
          <p className="text-2xl text-green-400">CLICK!</p>
        )}
        
        {/* Show feedback only in the result state */}
        {gameState === 'result' && feedback && (
          <p className="text-xl text-yellow-400 mt-4">{feedback}</p>
        )}

        {/* Show "Next round..." in the result state */}
        {gameState === 'result' && (
          <p className="text-xl text-gray-500 mt-2">Next round...</p>
        )}
      </div>
    </div>
  );
}

export default AuditorySimpleGame;

