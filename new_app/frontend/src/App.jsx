import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { GamePage, HomePage, LeaderboardPage, LoginPage, ProfilePage, RegisterPage } from './pages';
import { MainLayout, ProtectedRoute } from './components';

function App() {
  return (
    <Router>
      {/* The Layout component wraps all routes.
        It renders the Navbar and an <Outlet /> for the matched route.
      */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* Protected Routes */}
          <Route
            path="game/:gameType"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
