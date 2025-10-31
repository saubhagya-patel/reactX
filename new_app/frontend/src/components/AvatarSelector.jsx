import React from 'react';
import { AVATARS_INFO } from '../store/app_info_store';

/**
 * A reusable component to select a user avatar.
 * @param {string} selectedAvatar - The key of the currently selected avatar (e.g., 'fire').
 * @param {function} onAvatarChange - Function to call when a new avatar is selected.
 */
const AvatarSelector = ({ selectedAvatar, onAvatarChange }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">Choose your Avatar</label>
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-800 p-4">
        {AVATARS_INFO.map((avatar) => (
          <button
            type="button" // Important: prevents form submission
            key={avatar.key}
            onClick={() => onAvatarChange(avatar.key)}
            className={`rounded-lg border-2 p-3 text-center transition-all duration-150
              ${
                selectedAvatar === avatar.key
                  ? 'border-indigo-500 bg-indigo-900 ring-2 ring-indigo-500'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-500'
              }
            `}
          >
            <div className="text-3xl">{avatar.emoji}</div>
            <div className="mt-1 text-sm font-medium text-white">{avatar.label}</div>
            <div className="text-xs text-gray-400">{avatar.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
