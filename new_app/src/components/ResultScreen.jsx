import React, { useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import ReactionTimeChart from './ReactionTimeChart';


const ResultsScreen = ({ results, onPlayAgain }) => {
    const averages = useMemo(() => {
        if (results.length === 0) return { time: 0, distance: 0, speed: 0, fastest: 0, consistency: 0 };
        const totalTime = results.reduce((sum, r) => sum + r.time, 0);
        const totalSpeed = results.reduce((sum, r) => sum + r.speed, 0);
        const count = results.length;
        const fastestTime = Math.min(...results.map(r => r.time));
        const consistency = results.length > 1 ? 
            Math.sqrt(results.reduce((sum, r) => sum + Math.pow(r.time - (totalTime/count), 2), 0) / count) : 0;
            
        return {
            time: (totalTime / count).toFixed(3),
            speed: (totalSpeed / count).toFixed(2),
            fastest: fastestTime.toFixed(3),
            consistency: consistency.toFixed(3)
        };
    }, [results]);

    const getPerformanceGrade = () => {
        const avgTime = parseFloat(averages.time);
        if (avgTime < 0.2) return { grade: 'S+', color: '#10b981', message: 'Superhuman!' };
        if (avgTime < 0.25) return { grade: 'S', color: '#10b981', message: 'Excellent!' };
        if (avgTime < 0.3) return { grade: 'A', color: '#f59e0b', message: 'Great!' };
        if (avgTime < 0.4) return { grade: 'B', color: '#f59e0b', message: 'Good!' };
        if (avgTime < 0.5) return { grade: 'C', color: '#ef4444', message: 'Average' };
        return { grade: 'D', color: '#ef4444', message: 'Keep practicing!' };
    };

    const performance = getPerformanceGrade();

    return (
        <Stack spacing={4}>
            <Box textAlign="center">
                <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>
                    🎯 Mission Complete!
                </Typography>
                <Chip 
                    label={`Grade: ${performance.grade} - ${performance.message}`}
                    sx={{ 
                        fontSize: '1.2rem', 
                        p: 2,
                        backgroundColor: performance.color,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                />
            </Box>
            
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={3}>
                    <Paper elevation={4} sx={{ p: 2, textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
                        <Typography variant="h4" color="success.main">{averages.time}s</Typography>
                        <Typography variant="body2" color="text.secondary">Average Time</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper elevation={4} sx={{ p: 2, textAlign: 'center', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' }}>
                        <Typography variant="h4" color="secondary.main">{averages.fastest}s</Typography>
                        <Typography variant="body2" color="text.secondary">Fastest Time</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper elevation={4} sx={{ p: 2, textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1' }}>
                        <Typography variant="h4" color="primary.main">{averages.speed}</Typography>
                        <Typography variant="body2" color="text.secondary">Avg Speed (px/s)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper elevation={4} sx={{ p: 2, textAlign: 'center', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6' }}>
                        <Typography variant="h4" sx={{ color: '#8b5cf6' }}>{averages.consistency}</Typography>
                        <Typography variant="body2" color="text.secondary">Consistency</Typography>
                    </Paper>
                </Grid>
            </Grid>
            
            <ReactionTimeChart userTime={averages.time} />

            <TableContainer component={Paper} elevation={8} sx={{ maxHeight: 300, background: 'rgba(30, 41, 59, 0.8)' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Round</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Time (s)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Distance (px)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Speed (px/s)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((row, index) => (
                            <TableRow 
                                key={index} 
                                sx={{ 
                                    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
                                    backgroundColor: row.time < 0.25 ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1} {row.time < 0.25 ? '⚡' : ''}
                                </TableCell>
                                <TableCell align="right" sx={{ color: row.time < 0.25 ? 'success.main' : 'text.primary' }}>
                                    {row.time}
                                </TableCell>
                                <TableCell align="right">{row.distance}</TableCell>
                                <TableCell align="right">{row.speed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box textAlign="center">
                <Button 
                    variant="contained" 
                    onClick={onPlayAgain} 
                    size="large"
                    sx={{ 
                        px: 6, 
                        py: 2, 
                        fontSize: '1.2rem',
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #4338ca, #7c3aed)',
                        }
                    }}
                >
                    🚀 Play Again
                </Button>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        🧠 Curious about the code wizardry?
                    </Typography>
                    <Button
                        component="a"
                        href="https://github.com/saubhagya-patel/Response-Time-Calculator"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<Icons.GitHubIcon />}
                        sx={{
                            color: 'text.secondary',
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                            fontSize: '1rem',
                            textTransform: 'none',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            '&:hover': {
                                transform: 'none',
                                boxShadow: 'none',
                                borderColor: 'primary.light',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)'
                            },
                            transform: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Peek at the GitHub
                    </Button>
                </Box>
            </Box>
        </Stack>
    );
};

export default ResultsScreen;