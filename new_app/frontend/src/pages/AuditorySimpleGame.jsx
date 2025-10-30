import React, { useState, useEffect, useRef } from 'react';

// Game settings
const ROUNDS = 5;
const MIN_DELAY = 2000;
const MAX_DELAY = 5000;
const BEEP_PENALTY = 5000; // Penalty for clicking before beep

// Tone.js is not available, so we use the Web Audio API to create a beep
let audioContext;
const playBeep = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A4 note
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  
  oscillator.start(audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
  oscillator.stop(audioContext.currentTime + 0.3);
};

/**
 * Game 3: Click as soon as you hear the beep.
 */
const AuditorySimpleGame = ({ onGameEnd }) => {
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState('waiting'); // 'waiting', 'listening'
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Game loop effect
  useEffect(() => {
    if (round >= ROUNDS) {
      // Game over
      const totalTime = results.reduce((sum, r) => sum + r, 0);
      onGameEnd({
        score_time_ms: Math.round(totalTime / results.length),
      });
      return;
    }

    // Start next round
    setStatus('waiting');
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    timerRef.current = setTimeout(() => {
      playBeep();
      setStatus('listening');
      startTimeRef.current = Date.now();
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [round, results, onGameEnd]);

  const handleClick = () => {
    if (status === 'waiting') {
      // Clicked too early
      clearTimeout(timerRef.current);
      setResults([...results, BEEP_PENALTY]);
      setRound(round + 1);
    } else if (status === 'listening') {
      // Clicked on time
      const reactionTime = Date.now() - startTimeRef.current;
      setResults([...results, reactionTime]);
      setRound(round + 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex h-96 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900"
    >
      <div className="text-center text-gray-400">
        <p className="text-2xl font-bold">🎧</p>
        <p className="mt-4 text-xl">
          {status === 'waiting'
            ? 'Wait for the beep...'
            : 'CLICK!'}
        </p>
        <p className="mt-2 text-sm">(Click anywhere)</p>
      </div>

      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        Round: {round + 1} / {ROUNDS}
      </div>
    </div>
  );
};

export default AuditorySimpleGame;
