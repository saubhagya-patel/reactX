import React, { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
} from "@mui/material";
import Icons from "../assets/Icon_Assets";

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

  const difficultyInfo = {
    easy: { color: '#10b981', description: 'Large targets, slow pace' },
    medium: { color: '#f59e0b', description: 'Medium targets, moderate pace' },
    hard: { color: '#ef4444', description: 'Small targets, fast pace' },
  };

  return (
    <Box textAlign="center" p={4}>
      <Stack spacing={4} alignItems="center" maxWidth={500} mx="auto">
        <Box>
          <Typography variant="h1" sx={{ fontSize: '3.5rem', mb: 2 }}>
            ⚡ Reaction Master
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Test your reflexes and compete with the animal kingdom!
          </Typography>
        </Box>

        <Paper elevation={8} sx={{ p: 4, background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: 3, width: '100%' }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-label">Difficulty Level</InputLabel>
              <Select
                labelId="difficulty-label"
                value={difficulty}
                label="Difficulty Level"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {Object.entries(difficultyInfo).map(([key, info]) => (
                  <MenuItem key={key} value={key}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: info.color
                        }}
                      />
                      <Box>
                        <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {info.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Number of Rounds"
              type="number"
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
              error={!!error}
              helperText={error || "Choose between 5-50 rounds"}
              inputProps={{ min: 5, max: 50, step: 1 }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none',
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
            />
          </Stack>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleStart}
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
          🎯 Start Challenge
        </Button>

        {/* GitHub Link */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            🤓 Like the code? Check out the chaos behind the magic:
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
            View on GitHub
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SetupScreen;
