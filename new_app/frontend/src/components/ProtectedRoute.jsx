import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';

/**
 * A wrapper component that protects routes from unauthenticated access.
 *
 * If a user is not logged in, they are redirected to the /login page,
 * and the page they were trying to access is saved in the state.
 * After logging in, they can be redirected back.
 */
const ProtectedRoute = ({ children }) => {
  // Get the auth token from our Zustand store
  const { token } = useAuthStore((state) => ({ token: state.token }));
  const location = useLocation();

  if (!token) {
    // If no token, redirect to the login page
    // We pass the 'location' they came from in the state.
    // This allows us to redirect them back after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a token exists, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;
