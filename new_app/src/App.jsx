import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
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
  Grid,
  Chip,
  LinearProgress,
} from "@mui/material";

// --- Enhanced Keyframes for Animations ---
const backgroundAnimation = {
  "@keyframes gradientFlow": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

const burstAnimation = {
  "@keyframes burst": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
      filter: "brightness(1)",
    },
    "50%": {
      transform: "scale(1.8)",
      opacity: 0.8,
      filter: "brightness(2)",
    },
    "100%": {
      transform: "scale(3)",
      opacity: 0,
      filter: "brightness(0.5)",
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(0)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(4)",
      opacity: 0,
    },
  },
};

const shakeAnimation = {
  "@keyframes screenShake": {
    "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
    "10%": { transform: "translate(-2px, -1px) rotate(-0.5deg)" },
    "20%": { transform: "translate(2px, 1px) rotate(0.5deg)" },
    "30%": { transform: "translate(-1px, 2px) rotate(-0.5deg)" },
    "40%": { transform: "translate(1px, -1px) rotate(0.5deg)" },
    "50%": { transform: "translate(-2px, 1px) rotate(-0.5deg)" },
    "60%": { transform: "translate(2px, -2px) rotate(0.5deg)" },
    "70%": { transform: "translate(-1px, -1px) rotate(-0.5deg)" },
    "80%": { transform: "translate(1px, 2px) rotate(0.5deg)" },
    "90%": { transform: "translate(-2px, -1px) rotate(-0.5deg)" },
  },
};

const pulseAnimation = {
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 0 rgba(255, 107, 129, 0.7)",
    },
    "50%": {
      transform: "scale(1.05)",
      boxShadow: "0 0 0 10px rgba(255, 107, 129, 0.3)",
    },
    "100%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 20px rgba(255, 107, 129, 0)",
    },
  },
  "@keyframes glow": {
    "0%, 100%": { filter: "drop-shadow(0 0 5px currentColor)" },
    "50%": { filter: "drop-shadow(0 0 20px currentColor)" },
  },
};

const countdownAnimation = {
  "@keyframes countdownBounce": {
    "0%": { transform: "scale(0.8)", opacity: 0.8 },
    "50%": { transform: "scale(1.2)", opacity: 1 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
};

// Enhanced theme with modern colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // Indigo
      light: "#818cf8",
      dark: "#4338ca",
    },
    secondary: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444", // Red
      light: "#f87171",
      dark: "#dc2626",
    },
    success: {
      main: "#10b981", // Emerald
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f97316", // Orange
    },
    background: {
      default: "#0f172a", // Slate 900
      paper: "rgba(30, 41, 59, 0.8)", // Slate 800 with opacity
    },
    text: {
      primary: "#f8fafc", // Slate 50
      secondary: "#cbd5e1", // Slate 300
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      background: "linear-gradient(45deg, #6366f1, #f59e0b)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontWeight: 700,
      background: "linear-gradient(45deg, #f59e0b, #ef4444)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h5: {
      color: "#f8fafc",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.MuiMenu-paper": {
            backgroundColor: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.2)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(99, 102, 241, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.4)",
            },
          },
        },
      },
    },
  },
});

// --- Component Definitions ---

const SetupScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState("medium");
  const [iterations, setIterations] = useState(10);
  const [error, setError] = useState("");

  const handleStart = () => {
    const iterNum = Number(iterations);
    if (isNaN(iterNum) || iterNum < 2 || iterNum > 50) {
      setError("Iterations must be a number between 5 and 50.");
      return;
    }
    setError("");
    onStartGame({ difficulty, iterations: iterNum });
  };

  const difficultyInfo = {
    easy: { color: "#10b981", description: "Large targets, slow pace" },
    medium: { color: "#f59e0b", description: "Medium targets, moderate pace" },
    hard: { color: "#ef4444", description: "Small targets, fast pace" },
  };

  return (
    <Box textAlign="center" p={4}>
      <Stack spacing={4} alignItems="center" maxWidth={500} mx="auto">
        <Box>
          <Typography variant="h1" sx={{ fontSize: "3.5rem", mb: 2 }}>
            ⚡ Reaction Master
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Test your reflexes and compete with the animal kingdom!
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            width: "100%",
          }}
        >
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
                          borderRadius: "50%",
                          backgroundColor: info.color,
                        }}
                      />
                      <Box>
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {key}
                        </Typography>
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
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
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
            fontSize: "1.2rem",
            background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(45deg, #4338ca, #7c3aed)",
            },
          }}
        >
          🎯 Start Challenge
        </Button>
      </Stack>
    </Box>
  );
};

const GameScreen = ({ settings, onEndGame }) => {
  const [status, setStatus] = useState("countdown");
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState([]);
  const [circle, setCircle] = useState({
    x: 0,
    y: 0,
    visible: false,
    bursting: false,
  });
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestTime, setBestTime] = useState(null);

  const gameBoxRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastPosRef = useRef(null);

  const difficultyMap = {
    easy: { size: 80, color: "#10b981", spawnDelay: [800, 1500] },
    medium: { size: 60, color: "#f59e0b", spawnDelay: [500, 1200] },
    hard: { size: 40, color: "#ef4444", spawnDelay: [300, 800] },
  };
  const { size, color, spawnDelay } = difficultyMap[settings.difficulty];

  useEffect(() => {
    if (status !== "countdown") return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setStatus("playing");
    }
  }, [status, countdown]);

  useEffect(() => {
    if (status === "playing" && !circle.visible && !circle.bursting) {
      if (results.length < settings.iterations) {
        const delay =
          spawnDelay[0] + Math.random() * (spawnDelay[1] - spawnDelay[0]);
        const spawnTimer = setTimeout(spawnCircle, delay);
        return () => clearTimeout(spawnTimer);
      } else {
        setStatus("finished");
      }
    }
  }, [status, results, circle.visible, circle.bursting]);

  useEffect(() => {
    if (status === "finished") {
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

    // Update best time and streak
    if (!bestTime || reactionTime < bestTime) {
      setBestTime(reactionTime);
    }

    if (reactionTime < 0.3) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Trigger screen shake
    setShake(true);
    setTimeout(() => setShake(false), 300);

    setCircle((c) => ({ ...c, bursting: true }));

    setTimeout(() => {
      setResults((prevResults) => [
        ...prevResults,
        {
          time: parseFloat(reactionTime.toFixed(3)),
          distance: parseFloat(distance.toFixed(2)),
          speed:
            reactionTime > 0
              ? parseFloat((distance / reactionTime).toFixed(2))
              : 0,
        },
      ]);
      setCircle({ x: 0, y: 0, visible: false, bursting: false });
    }, 300);
  };

  const progress = (results.length / settings.iterations) * 100;

  if (status === "countdown") {
    return (
      <Box
        textAlign="center"
        p={4}
        height={500}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h2" sx={{ mb: 4 }}>
          Get Ready! 🎯
        </Typography>
        <Typography
          variant="h1"
          sx={{
            ...countdownAnimation,
            fontSize: "8rem",
            animation: "countdownBounce 1s ease-in-out",
            color:
              countdown <= 1
                ? "#ef4444"
                : countdown <= 2
                ? "#f59e0b"
                : "#10b981",
          }}
        >
          {countdown}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...shakeAnimation,
        animation: shake ? "screenShake 0.3s ease-in-out" : "none",
      }}
    >
      {/* Game Stats Header */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          background: "rgba(30, 41, 59, 0.8)",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: "100%",
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(45deg, #6366f1, #f59e0b)",
              },
            }}
          />
          <Typography
            variant="h6"
            color="text.primary"
            textAlign="center"
            sx={{ fontWeight: 600 }}
          >
            Round {results.length + 1} of {settings.iterations}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
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
                sx={{ animation: streak > 3 ? "glow 2s infinite" : "none" }}
              />
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Game Area */}
      <Box
        ref={gameBoxRef}
        sx={{
          position: "relative",
          height: "70vh",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.3))",
          border: "3px solid",
          borderColor: "primary.main",
          borderRadius: 3,
          overflow: "hidden",
          cursor: "crosshair",
          backdropFilter: "blur(5px)",
        }}
      >
        {(circle.visible || circle.bursting) && (
          <>
            {/* Main circle */}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleCircleClick();
              }}
              sx={{
                ...burstAnimation,
                ...pulseAnimation,
                position: "absolute",
                top: circle.y,
                left: circle.x,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: "50%",
                cursor: "pointer",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                animation: circle.bursting
                  ? "burst 0.3s ease-out forwards"
                  : "pulse 2s infinite, glow 3s ease-in-out infinite",
                zIndex: 2,
              }}
            />
            {/* Ripple effect */}
            {circle.bursting && (
              <Box
                sx={{
                  ...burstAnimation,
                  position: "absolute",
                  top: circle.y + size / 2 - 2,
                  left: circle.x + size / 2 - 2,
                  width: 4,
                  height: 4,
                  border: `2px solid ${color}`,
                  borderRadius: "50%",
                  animation: "ripple 0.3s ease-out forwards",
                  zIndex: 1,
                }}
              />
            )}
          </>
        )}

        {/* Loading indicator */}
        {status === "playing" &&
          !circle.visible &&
          !circle.bursting &&
          results.length < settings.iterations && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <CircularProgress size={60} sx={{ color: "primary.main" }} />
              <Typography color="text.secondary">
                Next target incoming...
              </Typography>
            </Box>
          )}
      </Box>
    </Box>
  );
};

const ReactionTimeChart = ({ userTime }) => {
  const animalData = [
    { name: "Fly", time: 20, emoji: "🪰" },
    { name: "Hummingbird", time: 50, emoji: "🐦" },
    { name: "Cat", time: 70, emoji: "🐱" },
    { name: "Chimpanzee", time: 150, emoji: "🐵" },
    { name: "Human Avg", time: 250, emoji: "👤" },
    { name: "Sloth", time: 450, emoji: "🦥" },
  ];

  const allData = [
    ...animalData,
    { name: "You", time: userTime * 1000, emoji: "⭐" },
  ].sort((a, b) => a.time - b.time);
  const maxTime = Math.max(...allData.map((d) => d.time), 500);

  const getUserRank = () => {
    const userIndex = allData.findIndex((d) => d.name === "You");
    return userIndex + 1;
  };

  return (
    <Paper
      elevation={8}
      sx={{ p: 3, background: "rgba(30, 41, 59, 0.8)", borderRadius: 3 }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom sx={{ mb: 3 }}>
        🏆 Animal Kingdom Leaderboard
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        You ranked #{getUserRank()} out of {allData.length} competitors!
      </Typography>

      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="flex-end"
        height={300}
        p={2}
        sx={{
          border: "2px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 2,
          background: "rgba(15, 23, 42, 0.3)",
        }}
      >
        {allData.map((item, index) => (
          <Box
            key={item.name}
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100%"
            justifyContent="flex-end"
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {item.emoji}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: item.name === "You" ? "secondary.main" : "text.primary",
                fontWeight: item.name === "You" ? "bold" : "normal",
                mb: 1,
              }}
            >
              {Math.round(item.time)}ms
            </Typography>
            <Box
              sx={{
                width: { xs: 30, sm: 40 },
                height: `${(item.time / maxTime) * 100}%`,
                background:
                  item.name === "You"
                    ? "linear-gradient(180deg, #f59e0b, #ef4444)"
                    : `linear-gradient(180deg, #6366f1, #8b5cf6)`,
                borderRadius: "6px 6px 0 0",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  item.name === "You"
                    ? "0 0 20px rgba(245, 158, 11, 0.5)"
                    : "0 4px 12px rgba(99, 102, 241, 0.3)",
                border: item.name === "You" ? "2px solid #f59e0b" : "none",
              }}
            />
            <Typography
              variant="body2"
              fontWeight={item.name === "You" ? "bold" : "normal"}
              color={item.name === "You" ? "secondary.main" : "text.primary"}
              sx={{ mt: 1 }}
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const ResultsScreen = ({ results, onPlayAgain }) => {
  const averages = useMemo(() => {
    if (results.length === 0) return { time: 0, distance: 0, speed: 0 };
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);
    const totalSpeed = results.reduce((sum, r) => sum + r.speed, 0);
    const count = results.length;
    const fastestTime = Math.min(...results.map((r) => r.time));
    const consistency =
      results.length > 1
        ? Math.sqrt(
            results.reduce(
              (sum, r) => sum + Math.pow(r.time - totalTime / count, 2),
              0
            ) / count
          )
        : 0;

    return {
      time: (totalTime / count).toFixed(3),
      speed: (totalSpeed / count).toFixed(2),
      fastest: fastestTime.toFixed(3),
      consistency: consistency.toFixed(3),
    };
  }, [results]);

  const getPerformanceGrade = () => {
    const avgTime = parseFloat(averages.time);
    if (avgTime < 0.2)
      return { grade: "S+", color: "#10b981", message: "Superhuman!" };
    if (avgTime < 0.25)
      return { grade: "S", color: "#10b981", message: "Excellent!" };
    if (avgTime < 0.3)
      return { grade: "A", color: "#f59e0b", message: "Great!" };
    if (avgTime < 0.4)
      return { grade: "B", color: "#f59e0b", message: "Good!" };
    if (avgTime < 0.5)
      return { grade: "C", color: "#ef4444", message: "Average" };
    return { grade: "D", color: "#ef4444", message: "Keep practicing!" };
  };

  const performance = getPerformanceGrade();

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box textAlign="center">
        <Typography variant="h1" sx={{ fontSize: "3rem", mb: 2 }}>
          🎯 Mission Complete!
        </Typography>
        <Chip
          label={`Grade: ${performance.grade} - ${performance.message}`}
          sx={{
            fontSize: "1.2rem",
            p: 2,
            backgroundColor: performance.color,
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              textAlign: "center",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
            }}
          >
            <Typography variant="h4" color="success.main">
              {averages.time}s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Time
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              textAlign: "center",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
            }}
          >
            <Typography variant="h4" color="secondary.main">
              {averages.fastest}s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fastest Time
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              textAlign: "center",
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid #6366f1",
            }}
          >
            <Typography variant="h4" color="primary.main">
              {averages.speed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Speed (px/s)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              textAlign: "center",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid #8b5cf6",
            }}
          >
            <Typography variant="h4" sx={{ color: "#8b5cf6" }}>
              {averages.consistency}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consistency
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <ReactionTimeChart userTime={averages.time} />

      <TableContainer
        component={Paper}
        elevation={8}
        sx={{ maxHeight: 300, background: "rgba(30, 41, 59, 0.8)" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Round</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Time (s)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Distance (px)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Speed (px/s)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                  backgroundColor:
                    row.time < 0.25
                      ? "rgba(16, 185, 129, 0.05)"
                      : "transparent",
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1} {row.time < 0.25 ? "⚡" : ""}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: row.time < 0.25 ? "success.main" : "text.primary",
                  }}
                >
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
            fontSize: "1.2rem",
            background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(45deg, #4338ca, #7c3aed)",
            },
          }}
        >
          🚀 Play Again
        </Button>
      </Box>
    </Stack>
  );
};

// --- Main App Component ---

function App() {
  const [gameState, setGameState] = useState("setup");
  const [gameSettings, setGameSettings] = useState(null);
  const [gameResults, setGameResults] = useState([]);

  const handleStartGame = useCallback((settings) => {
    setGameSettings(settings);
    setGameState("playing");
  }, []);

  const handleEndGame = useCallback((results) => {
    setGameResults(results);
    setGameState("results");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameSettings(null);
    setGameResults([]);
    setGameState("setup");
  }, []);

  const renderGameState = () => {
    switch (gameState) {
      case "playing":
        return <GameScreen settings={gameSettings} onEndGame={handleEndGame} />;
      case "results":
        return (
          <ResultsScreen results={gameResults} onPlayAgain={handlePlayAgain} />
        );
      case "setup":
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
          background:
            "linear-gradient(270deg, #0f172a, #1e293b, #6366f1, #8b5cf6, #ef4444)",
          backgroundSize: "1000% 1000%",
          animation: "gradientFlow 30s ease infinite",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            bgcolor: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(12px)",
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "1000px" }}>
            {renderGameState()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
