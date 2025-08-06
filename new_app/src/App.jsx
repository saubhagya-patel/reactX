import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Box, 
    Container, 
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid
} from '@mui/material';

// --- Keyframes for Animations ---
const backgroundAnimation = {
    '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
};

const burstAnimation = {
    '@keyframes burst': {
        '0%': { transform: 'scale(1)', opacity: 1 },
        '100%': { transform: 'scale(2.5)', opacity: 0 },
    },
};

// 1. Define the custom theme with your color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#799EFF',
    },
    secondary: {
      main: '#FEFFC4',
    },
    error: {
      main: '#EA5B6F',
    },
    warning: {
      main: '#FF894F',
    },
    background: {
      default: '#242124',
      paper: '#2E2B2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FEFFC4',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: {
        fontWeight: 700,
        color: '#FEFFC4',
    },
    h5: {
        color: '#FFFFFF'
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1.1rem',
    }
  },
});

// --- Component Definitions ---

const SetupScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [iterations, setIterations] = useState(10);
  const [error, setError] = useState('');

  const handleStart = () => {
    const iterNum = Number(iterations);
    if (isNaN(iterNum) || iterNum < 5 || iterNum > 50) {
      setError('Iterations must be a number between 5 and 50.');
      return;
    }
    setError('');
    onStartGame({ difficulty, iterations: iterNum });
  };

  return (
    <Box textAlign="center" p={4}>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h2" gutterBottom>Response Time Test</Typography>
        <Typography variant="h5">Choose your settings to begin</Typography>
        
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Number of Iterations"
          type="number"
          value={iterations}
          onChange={(e) => setIterations(e.target.value)}
          error={!!error}
          helperText={error}
          inputProps={{ min: 5, max: 50, step: 1 }}
          sx={{
            width: 300,
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
              display: 'none',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />

        <Button 
            variant="contained" 
            color="primary" 
            onClick={handleStart}
            sx={{ px: 5, py: 1.5 }}
        >
          Start Game
        </Button>
      </Stack>
    </Box>
  );
};

const GameScreen = ({ settings, onEndGame }) => {
    const [status, setStatus] = useState('countdown');
    const [countdown, setCountdown] = useState(3);
    const [results, setResults] = useState([]);
    const [circle, setCircle] = useState({ x: 0, y: 0, visible: false, bursting: false });
    
    const gameBoxRef = useRef(null);
    const startTimeRef = useRef(0);
    const lastPosRef = useRef(null);

    const difficultyMap = {
        easy: { size: 70, color: 'primary.main' },
        medium: { size: 50, color: 'warning.main' },
        hard: { size: 30, color: 'error.main' },
    };
    const { size, color } = difficultyMap[settings.difficulty];

    useEffect(() => {
        if (status !== 'countdown') return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setStatus('playing');
        }
    }, [status, countdown]);

    useEffect(() => {
        if (status === 'playing' && !circle.visible && !circle.bursting) {
            if (results.length < settings.iterations) {
                const spawnDelay = setTimeout(spawnCircle, 300);
                return () => clearTimeout(spawnDelay);
            } else {
                setStatus('finished');
            }
        }
    }, [status, results, circle.visible, circle.bursting]);
    
    useEffect(() => {
        if (status === 'finished') {
            onEndGame(results);
        }
    }, [status, onEndGame, results]);

    const spawnCircle = () => {
        const gameBox = gameBoxRef.current;
        if (!gameBox) return;
        const rect = gameBox.getBoundingClientRect();
        const x = Math.random() * (rect.width - size);
        const y = Math.random() * (rect.height - size);
        setCircle({ x, y, visible: true, bursting: false });
        startTimeRef.current = Date.now();
    };

    const handleCircleClick = () => {
        if (!circle.visible || circle.bursting) return;
        const endTime = Date.now();
        const reactionTime = (endTime - startTimeRef.current) / 1000;
        const currentPos = { x: circle.x, y: circle.y };
        let distance = 0;
        if (lastPosRef.current) {
            const dx = currentPos.x - lastPosRef.current.x;
            const dy = currentPos.y - lastPosRef.current.y;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
        lastPosRef.current = currentPos;
        
        setCircle(c => ({ ...c, bursting: true }));

        setTimeout(() => {
            setResults(prevResults => [
                ...prevResults,
                {
                    time: parseFloat(reactionTime.toFixed(3)),
                    distance: parseFloat(distance.toFixed(2)),
                    speed: reactionTime > 0 ? parseFloat((distance / reactionTime).toFixed(2)) : 0
                }
            ]);
            setCircle({ x: 0, y: 0, visible: false, bursting: false });
        }, 300); // Animation duration
    };

    if (status === 'countdown') {
        return (
            <Box textAlign="center" p={4} height={400} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography variant="h2" color="secondary">Get Ready!</Typography>
                <Typography variant="h1" sx={{ fontSize: '6rem' }}>{countdown}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Time: {results[results.length - 1]?.time || 0}s</Typography>
                <Typography variant="h6">Round: {results.length} / {settings.iterations}</Typography>
            </Stack>
            <Box
                ref={gameBoxRef}
                sx={{
                    position: 'relative',
                    height: '60vh',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'crosshair'
                }}
            >
                {(circle.visible || circle.bursting) && (
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCircleClick();
                        }}
                        sx={{
                            ...burstAnimation,
                            position: 'absolute',
                            top: circle.y,
                            left: circle.x,
                            width: size,
                            height: size,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: '0 0 15px 5px rgba(255,255,255,0.3)',
                            animation: circle.bursting ? 'burst 0.3s ease-out forwards' : 'none',
                        }}
                    />
                )}
                {status === 'playing' && !circle.visible && results.length < settings.iterations && (
                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const ReactionTimeChart = ({ userTime }) => {
    const animalData = [
        { name: 'Fly', time: 20 },
        { name: 'Dragonfly', time: 50 },
        { name: 'Cat', time: 70 },
        { name: 'Chimpanzee', time: 150 },
        { name: 'Human', time: 250 },
        { name: 'Sloth', time: 450 },
    ];

    const allData = [...animalData, { name: 'You', time: userTime * 1000 }].sort((a, b) => a.time - b.time);
    const maxTime = Math.max(...allData.map(d => d.time), 500);

    return (
        <Box>
            <Typography variant="h5" textAlign="center" gutterBottom>Reaction Time Comparison (ms)</Typography>
            <Box display="flex" justifyContent="space-around" alignItems="flex-end" height={250} p={2} sx={{ border: '1px solid grey', borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {allData.map(item => (
                    <Box key={item.name} display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="flex-end">
                        <Typography variant="caption" sx={{ color: item.name === 'You' ? 'secondary.main' : 'text.primary' }}>
                            {Math.round(item.time)}ms
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 20, sm: 30 },
                                height: `${(item.time / maxTime) * 100}%`,
                                backgroundColor: item.name === 'You' ? 'secondary.main' : 'primary.main',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.5s ease-out',
                                boxShadow: item.name === 'You' ? '0 0 10px #FEFFC4' : 'none',
                            }}
                        />
                        <Typography variant="body2" fontWeight={item.name === 'You' ? 'bold' : 'normal'} color={item.name === 'You' ? 'secondary.main' : 'text.primary'}>
                            {item.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const ResultsScreen = ({ results, onPlayAgain }) => {
    const averages = useMemo(() => {
        if (results.length === 0) return { time: 0, distance: 0, speed: 0 };
        const totalTime = results.reduce((sum, r) => sum + r.time, 0);
        const totalSpeed = results.reduce((sum, r) => sum + r.speed, 0);
        const count = results.length;
        return {
            time: (totalTime / count).toFixed(3),
            speed: (totalSpeed / count).toFixed(2),
        };
    }, [results]);

    return (
        <Stack spacing={4} textAlign="center">
            <Typography variant="h2">Your Results</Typography>
            
            <ReactionTimeChart userTime={averages.time} />

            <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Round</TableCell>
                            <TableCell align="right">Time (s)</TableCell>
                            <TableCell align="right">Distance (px)</TableCell>
                            <TableCell align="right">Speed (px/s)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((row, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="right">{row.time}</TableCell>
                                <TableCell align="right">{row.distance}</TableCell>
                                <TableCell align="right">{row.speed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="contained" onClick={onPlayAgain} sx={{ py: 1.5 }}>
                Play Again
            </Button>
        </Stack>
    );
};


// --- Main App Component ---

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
          ...backgroundAnimation,
          background: 'linear-gradient(270deg, #242124, #2E2B2E, #799EFF, #EA5B6F)',
          backgroundSize: '800% 800%',
          animation: 'gradient 20s ease infinite',
          minHeight: '100vh',
        }}
      >
        <Box 
          sx={{
            width: '100%',
            minHeight: '100vh',
            bgcolor: 'rgba(46, 43, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            p: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '900px' }}>
            {renderGameState()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
