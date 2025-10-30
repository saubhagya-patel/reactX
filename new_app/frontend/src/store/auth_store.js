import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,  // The JWT token
      user: null,   // The user object { id, username, email, avatar_key }

      /**
       * Action to log in a user.
       * Saves the token and user info to state and localStorage.
       * @param {string} token - The JWT token.
       * @param {object} user - The user's profile data.
       */
      login: (token, user) => set({ token, user }),

      /**
       * Action to log out a user.
       * Clears the token and user info from state and localStorage.
       */
      logout: () => set({ token: null, user: null }),

      /**
       * Action to update the user's profile (e.g., after they change their avatar).
       * @param {object} updatedUser - The new user object.
       */
      updateUser: (updatedUser) => set((state) => ({
        ...state,
        user: { ...state.user, ...updatedUser },
      })),

      /**
       * Selector to quickly check if the user is authenticated.
       * @returns {boolean} True if a token exists, false otherwise.
       */
      isAuthenticated: () => {
        const token = set.getState().token;
        return !!token;
      },
    }),
    {
      name: 'auth-storage', // Name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);
