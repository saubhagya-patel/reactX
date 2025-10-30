import React from 'react';
import { Box, Paper, Typography } from '@mui/material';


const ReactionTimeChart = ({ userTime }) => {
    const animalData = [
        { name: 'Fly', time: 20, emoji: '🪰' },
        { name: 'Hummingbird', time: 50, emoji: '🐦' },
        { name: 'Cat', time: 70, emoji: '🐱' },
        { name: 'Chimpanzee', time: 150, emoji: '🐵' },
        { name: 'Human Avg', time: 250, emoji: '👤' },
        { name: 'Sloth', time: 450, emoji: '🦥' },
    ];

    const allData = [...animalData, { name: 'You', time: userTime * 1000, emoji: '⭐' }]
        .sort((a, b) => a.time - b.time);
    const maxTime = Math.max(...allData.map(d => d.time), 500);
    
    const getUserRank = () => {
        const userIndex = allData.findIndex(d => d.name === 'You');
        return userIndex + 1;
    };

    return (
        <Paper elevation={8} sx={{ p: 3, background: 'rgba(30, 41, 59, 0.8)', borderRadius: 3 }}>
            <Typography variant="h5" textAlign="center" gutterBottom sx={{ mb: 3 }}>
                🏆 Animal Kingdom Leaderboard
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
                You ranked #{getUserRank()} out of {allData.length} competitors!
            </Typography>
            
            <Box display="flex" justifyContent="space-around" alignItems="flex-end" height={300} p={2} 
                 sx={{ border: '2px solid rgba(99, 102, 241, 0.3)', borderRadius: 2, background: 'rgba(15, 23, 42, 0.3)' }}>
                {allData.map((item, index) => (
                    <Box key={item.name} display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="flex-end">
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {item.emoji}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                            color: item.name === 'You' ? 'secondary.main' : 'text.primary',
                            fontWeight: item.name === 'You' ? 'bold' : 'normal',
                            mb: 1
                        }}>
                            {Math.round(item.time)}ms
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 30, sm: 40 },
                                height: `${(item.time / maxTime) * 100}%`,
                                background: item.name === 'You' 
                                    ? 'linear-gradient(180deg, #f59e0b, #ef4444)' 
                                    : `linear-gradient(180deg, #6366f1, #8b5cf6)`,
                                borderRadius: '6px 6px 0 0',
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: item.name === 'You' 
                                    ? '0 0 20px rgba(245, 158, 11, 0.5)' 
                                    : '0 4px 12px rgba(99, 102, 241, 0.3)',
                                border: item.name === 'You' ? '2px solid #f59e0b' : 'none',
                            }}
                        />
                        <Typography variant="body2" fontWeight={item.name === 'You' ? 'bold' : 'normal'} 
                                    color={item.name === 'You' ? 'secondary.main' : 'text.primary'} sx={{ mt: 1 }}>
                            {item.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default ReactionTimeChart;