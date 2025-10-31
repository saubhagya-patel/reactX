// A mapping of avatar keys to emojis for display
export const AVATAR_EMOJI_MAP = {
  fire: '🔥',
  water: '💧',
  air: '🌬️',
  earth: '🌿',
  lightning: '⚡',
  ice: '❄️',
};

// A mapping of avatar keys to descriptions
export const AVATAR_DESCRIPTION_MAP = {
  fire: 'Energy, quick reflexes',
  water: 'Adaptability, flow',
  air: 'Clarity, fast thinking',
  earth: 'Stability, consistent focus',
  lightning: 'Instant reaction, burst speed',
  ice: 'Precision, control',
};

// A mapping of avatar keys to labels (optional, for readability)
export const AVATAR_LABEL_MAP = {
  fire: 'Fire',
  water: 'Water',
  air: 'Air',
  earth: 'Earth',
  lightning: 'Lightning',
  ice: 'Ice',
};

// Final avatar info array
export const AVATARS_INFO = Object.keys(AVATAR_EMOJI_MAP).map((key) => ({
  key,
  emoji: AVATAR_EMOJI_MAP[key],
  label: AVATAR_LABEL_MAP[key],
  description: AVATAR_DESCRIPTION_MAP[key],
}));



// A mapping of game keys to formatted titles
export const GAME_TYPE_MAP = {
  visual_simple: 'Visual Reaction',
  visual_choice: 'Choice Reaction',
  auditory_simple: 'Auditory Reaction',
  stroop_effect: 'Stroop Reaction',
  simon_game: 'Simon Reaction',
  number_order: 'Number Order Reaction',
};


// A mapping of game keys to descriptions
export const GAME_DESCRIPTION_MAP = {
  visual_simple: 'Click the shape as soon as it appears on the screen.',
  visual_choice: "Press the correct key (R, G, B) that matches the shape's color.",
  auditory_simple: 'Click the screen as soon as you hear the beep.',
  stroop_effect: 'Click the color of the text NOT the word.',
  simon_game: "The good ol'",
  number_order: 'Click numbers in ASC order.',
};


// A mapping of game keys to icons
export const GAME_ICON_MAP = {
  visual_simple: '🎯',
  visual_choice: '#️⃣',
  auditory_simple: '🎧',
  stroop_effect: '🌀',
  simon_game: '🎨',
  number_order: '🔢',
};


// Final games
export const GAMES_INFO = Object.keys(GAME_TYPE_MAP).map((type) => ({
  type,
  title: GAME_TYPE_MAP[type],
  description: GAME_DESCRIPTION_MAP[type],
  icon: GAME_ICON_MAP[type],
}));
