import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';

const avatarMap = {
  fire: '🔥',
  water: '💧',
  air: '🌬️',
  earth: '🌿',
  lightning: '⚡',
  ice: '❄️',
};

function Navbar() {
  const { user, token, logout } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    logout: state.logout,
  }));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // No need to navigate, auth store change will trigger route protection
  };

  // Define styles for active and inactive links
  const navClass = 'block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:border-0 md:hover:text-indigo-400 md:p-0';
  const activeClass = 'block py-2 px-3 text-white bg-indigo-500 rounded md:bg-transparent md:text-indigo-400 md:p-0';

  // Helper function for NavLink className
  const getNavLinkClass = ({ isActive }) => (isActive ? activeClass : navClass);

  return (
    <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 fixed w-full z-20 top-0 left-0">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              react<span className="text-indigo-400">X</span>
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Links */}
          <div
            className={`${
              isOpen ? 'block' : 'hidden'
            } w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
              <li>
                <NavLink to="/" className={getNavLinkClass} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/leaderboard" className={getNavLinkClass}>
                  Leaderboard
                </NavLink>
              </li>
              {token ? (
                // --- Authenticated Links ---
                <>
                  <li>
                    <NavLink to="/profile" className={getNavLinkClass}>
                      <span className="mr-2">{avatarMap[user?.avatar_key] || '👤'}</span>
                      {user?.username || 'Profile'}
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left py-2 px-3 text-gray-300 rounded hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:border-0 md:hover:text-red-500 md:p-0">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                // --- Public Links ---
                <>
                  <li>
                    <NavLink to="/login" className={getNavLinkClass}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className={getNavLinkClass}>
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
