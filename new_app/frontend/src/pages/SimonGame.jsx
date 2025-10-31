import React, { useState, useEffect, useRef, useCallback } from "react";

function SimonGame({ settings, onGameEnd }) {
  const colors = ["red", "green", "blue", "yellow"];
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState([]);
  const [flashing, setFlashing] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [status, setStatus] = useState("ready"); // ready, showing, waiting, feedback, result
  const startTimeRef = useRef(0);

  const { rounds, difficulty } = settings;
  const speedMap = { easy: 800, medium: 600, hard: 400 };
  const flashSpeed = speedMap[difficulty] || 600;

  const flashButton = useCallback(
    (color) => {
      return new Promise((resolve) => {
        setFlashing(color);
        setTimeout(() => {
          setFlashing(null);
          setTimeout(() => {
            resolve();
          }, 100); // Shorter pause after flash
        }, flashSpeed);
      });
    },
    [flashSpeed]
  ); // Add flashSpeed as dependency

  // Play sequence visually
  const playSequence = useCallback(async () => {
    setIsPlayingSequence(true);
    setStatus("showing");
    await new Promise((res) => setTimeout(res, 500)); // Pause before starting
    for (let i = 0; i < sequence.length; i++) {
      await flashButton(sequence[i]);
    }
    setIsPlayingSequence(false);
    setStatus("waiting");
    startTimeRef.current = Date.now();
  }, [sequence, flashButton]); // Add dependencies


  useEffect(() => {
    if (status === "feedback") {
      if (round < rounds) {
        // Start next round
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        setSequence((prevSeq) => [...prevSeq, nextColor]);
        setPlayerInput([]);
        setRound((prevRound) => prevRound + 1);
        setStatus("showing"); // Trigger the playSequence effect
      } else {
        // Game over
        setStatus("result");
        onGameEnd(results);
      }
    }
  }, [status, round, rounds, results, onGameEnd]);

  useEffect(() => {
    if (status === "showing" && sequence.length > 0) {
      playSequence();
    }
  }, [status, sequence, playSequence]);

  // Handle player input
  const handleClick = (color) => {
    if (isPlayingSequence || status !== "waiting") return;

    const newInput = [...playerInput, color];
    setPlayerInput(newInput);

    const correctSoFar = newInput.every((c, i) => c === sequence[i]);

    if (!correctSoFar) {
      const time = Date.now() - startTimeRef.current;
      const res = { score_time_ms: time, accuracy: 0 };
      setResults((prev) => [...prev, res]);
      setStatus("feedback"); // Triggers the "start next round" effect
      return;
    }

    if (newInput.length === sequence.length) {
      const time = Date.now() - startTimeRef.current;
      const res = { score_time_ms: time, accuracy: 1 };
      setResults((prev) => [...prev, res]);
      setStatus("feedback"); // Triggers the "start next round" effect
    }
  };

  const handleStart = () => {
    setSequence([]);
    setResults([]);
    setRound(0); // Will be 1 in the effect
    setStatus("feedback"); // Trigger the "start next round" effect
  };

  const colorStyles = {
    red: "bg-red-600",
    green: "bg-green-600",
    blue: "bg-blue-600",
    yellow: "bg-yellow-400",
  };

  const flashStyles = {
    red: "bg-red-500 ring-red-100 brightness-[150%] scale-105",
    green: "bg-green-500 ring-green-100 brightness-[150%] scale-105",
    blue: "bg-blue-500 ring-blue-100 brightness-[150%] scale-105",
    yellow: "bg-yellow-300 ring-yellow-100 brightness-[150%] scale-105",
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-800 rounded-lg p-8 border-2 border-gray-700">
      {status === "ready" && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simon Memory Game
          </h2>
          <p className="text-gray-300 mb-6">
            Watch the sequence and repeat it by clicking the buttons.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {status !== "ready" && status !== "result" && (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-white text-lg">
            Round {round} / {rounds}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleClick(color)}
                disabled={isPlayingSequence}
                className={`w-28 h-28 rounded-xl shadow-xl border-4 border-gray-900 transition-all duration-150 ease-in-out ${
                  flashing === color ? flashStyles[color] : colorStyles[color]
                }`}
              />
            ))}
          </div>

          {status === "showing" && (
            <p className="text-gray-400 mt-4">Watch the sequence...</p>
          )}
          {status === "waiting" && (
            <p className="text-green-400 mt-4">Repeat the sequence!</p>
          )}
          {status === "feedback" && (
            <p className="text-yellow-400 mt-4">Loading next round...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SimonGame;
