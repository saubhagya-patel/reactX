import React, { useState, useCallback } from 'react';
import { 
    ThemeProvider,
    CssBaseline, 
    Box,
} from '@mui/material';
import theme from './assets/theme';
import animations from './assets/animations';
import { GameScreen, ResultsScreen, SetupScreen } from './components';


function App() {
  const [gameState, setGameState] = useState('setup');
  const [gameSettings, setGameSettings] = useState(null);
  const [gameResults, setGameResults] = useState([]);

  const handleStartGame = useCallback((settings) => {
    setGameSettings(settings);
    setGameState('playing');
  }, []);

  const handleEndGame = useCallback((results) => {
    setGameResults(results);
    setGameState('results');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameSettings(null);
    setGameResults([]);
    setGameState('setup');
  }, []);

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        return <GameScreen settings={gameSettings} onEndGame={handleEndGame} />;
      case 'results':
        return <ResultsScreen results={gameResults} onPlayAgain={handlePlayAgain} />;
      case 'setup':
      default:
        return <SetupScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          ...animations.backgroundAnimation,
          background: 'linear-gradient(270deg, #0f172a, #1e293b, #6366f1, #8b5cf6, #ef4444)',
          backgroundSize: '1000% 1000%',
          animation: 'gradientFlow 30s ease infinite',
          minHeight: '100vh',
        }}
      >
        <Box 
          sx={{
            width: '100%',
            minHeight: '100vh',
            bgcolor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            p: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '1000px' }}>
            {renderGameState()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
