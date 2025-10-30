import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  LinearProgress,
  CircularProgress
} from "@mui/material";
import animations from "../assets/animations";


const GameScreen = ({ settings, onEndGame }) => {
    const [status, setStatus] = useState('countdown');
    const [countdown, setCountdown] = useState(3);
    const [results, setResults] = useState([]);
    const [circle, setCircle] = useState({ x: 0, y: 0, visible: false, bursting: false });
    const [shake, setShake] = useState(false);
    const [streak, setStreak] = useState(0);
    const [bestTime, setBestTime] = useState(null);
    
    const gameBoxRef = useRef(null);
    const startTimeRef = useRef(0);
    const lastPosRef = useRef(null);

    const difficultyMap = {
        easy: { size: 80, color: '#10b981', spawnDelay: [800, 1500] },
        medium: { size: 60, color: '#f59e0b', spawnDelay: [500, 1200] },
        hard: { size: 40, color: '#ef4444', spawnDelay: [300, 800] },
    };
    const { size, color, spawnDelay } = difficultyMap[settings.difficulty];

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
                const delay = spawnDelay[0] + Math.random() * (spawnDelay[1] - spawnDelay[0]);
                const spawnTimer = setTimeout(spawnCircle, delay);
                return () => clearTimeout(spawnTimer);
            } else {
                setStatus('finished');
            }
        }
    }, [status, results, circle.visible, circle.bursting, settings.iterations, spawnDelay]);
    
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

        if (!bestTime || reactionTime < bestTime) {
            setBestTime(reactionTime);
        }
        
        if (reactionTime < 0.3) {
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }
        
        setShake(true);
        setTimeout(() => setShake(false), 300);
        
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
        }, 300);
    };

    const progress = (results.length / settings.iterations) * 100;

    if (status === 'countdown') {
        return (
            <Box textAlign="center" p={4} height={500} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography variant="h2" sx={{ mb: 4 }}>Get Ready! 🎯</Typography>
                <Typography 
                    variant="h1" 
                    sx={{ 
                        ...animations.countdownAnimation,
                        fontSize: '8rem',
                        animation: 'countdownBounce 1s ease-in-out',
                        color: countdown <= 1 ? '#ef4444' : countdown <= 2 ? '#f59e0b' : '#10b981'
                    }}
                >
                    {countdown}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ ...animations.shakeAnimation, animation: shake ? 'screenShake 0.3s ease-in-out' : 'none' }}>
            <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'rgba(30, 41, 59, 0.8)', borderRadius: 2 }}>
                <Stack spacing={2} alignItems="center">
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            width: '100%',
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(45deg, #6366f1, #f59e0b)',
                            }
                        }} 
                    />
                    <Typography variant="h6" color="text.primary" textAlign="center" sx={{ fontWeight: 600 }}>
                        Round {results.length + 1} of {settings.iterations}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                        {bestTime && (
                            <Chip 
                                label={`Best: ${bestTime.toFixed(3)}s`} 
                                color="success" 
                                variant="outlined"
                                size="small"
                            />
                        )}
                        {streak > 0 && (
                            <Chip 
                                label={`🔥 ${streak} streak`} 
                                color="warning"
                                size="small"
                                sx={{ animation: streak > 3 ? 'glow 2s infinite' : 'none' }}
                            />
                        )}
                    </Stack>
                </Stack>
            </Paper>

            <Box
                ref={gameBoxRef}
                sx={{
                    position: 'relative',
                    height: '70vh',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.3))',
                    border: '3px solid',
                    borderColor: 'primary.main',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    backdropFilter: 'blur(5px)',
                }}
            >
                {(circle.visible || circle.bursting) && (
                    <>
                        <Box
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCircleClick();
                            }}
                            sx={{
                                ...animations.burstAnimation,
                                ...animations.pulseAnimation,
                                position: 'absolute',
                                top: circle.y,
                                left: circle.x,
                                width: size,
                                height: size,
                                backgroundColor: color,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: '3px solid rgba(255, 255, 255, 0.3)',
                                animation: circle.bursting 
                                    ? 'burst 0.3s ease-out forwards' 
                                    : 'pulse 2s infinite, glow 3s ease-in-out infinite',
                                zIndex: 2,
                            }}
                        />
                        {circle.bursting && (
                            <Box
                                sx={{
                                    ...animations.burstAnimation,
                                    position: 'absolute',
                                    top: circle.y + size/2 - 2,
                                    left: circle.x + size/2 - 2,
                                    width: 4,
                                    height: 4,
                                    border: `2px solid ${color}`,
                                    borderRadius: '50%',
                                    animation: 'ripple 0.3s ease-out forwards',
                                    zIndex: 1,
                                }}
                            />
                        )}
                    </>
                )}
                
                {status === 'playing' && !circle.visible && !circle.bursting && results.length < settings.iterations && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 2 }}>
                        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                        <Typography color="text.secondary">Next target incoming...</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default GameScreen;