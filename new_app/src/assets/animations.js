// --- Enhanced Keyframes for Animations ---
const backgroundAnimation = {
    '@keyframes gradientFlow': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
};

const burstAnimation = {
    '@keyframes burst': {
        '0%': { 
            transform: 'scale(1)', 
            opacity: 1,
            filter: 'brightness(1)',
        },
        '50%': { 
            transform: 'scale(1.8)', 
            opacity: 0.8,
            filter: 'brightness(2)',
        },
        '100%': { 
            transform: 'scale(3)', 
            opacity: 0,
            filter: 'brightness(0.5)',
        },
    },
    '@keyframes ripple': {
        '0%': { 
            transform: 'scale(0)', 
            opacity: 1 
        },
        '100%': { 
            transform: 'scale(4)', 
            opacity: 0 
        },
    },
};

const shakeAnimation = {
    '@keyframes screenShake': {
        '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
        '10%': { transform: 'translate(-2px, -1px) rotate(-0.5deg)' },
        '20%': { transform: 'translate(2px, 1px) rotate(0.5deg)' },
        '30%': { transform: 'translate(-1px, 2px) rotate(-0.5deg)' },
        '40%': { transform: 'translate(1px, -1px) rotate(0.5deg)' },
        '50%': { transform: 'translate(-2px, 1px) rotate(-0.5deg)' },
        '60%': { transform: 'translate(2px, -2px) rotate(0.5deg)' },
        '70%': { transform: 'translate(-1px, -1px) rotate(-0.5deg)' },
        '80%': { transform: 'translate(1px, 2px) rotate(0.5deg)' },
        '90%': { transform: 'translate(-2px, -1px) rotate(-0.5deg)' },
    },
};

const pulseAnimation = {
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 107, 129, 0.7)' },
        '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(255, 107, 129, 0.3)' },
        '100%': { transform: 'scale(1)', boxShadow: '0 0 0 20px rgba(255, 107, 129, 0)' },
    },
    '@keyframes glow': {
        '0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
        '50%': { filter: 'drop-shadow(0 0 20px currentColor)' },
    },
};

const countdownAnimation = {
    '@keyframes countdownBounce': {
        '0%': { transform: 'scale(0.8)', opacity: 0.8 },
        '50%': { transform: 'scale(1.2)', opacity: 1 },
        '100%': { transform: 'scale(1)', opacity: 1 },
    },
};

const animations = {
    backgroundAnimation,
    burstAnimation,
    shakeAnimation,
    pulseAnimation,
    countdownAnimation,
}

export default animations;