import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { auth_util } from '../util/index.js';


function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    const { email, username, password, avatar_key } = req.body;

    if (!email || !username || !password || !avatar_key) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        const existingUser = await auth_util.findUserByEmailOrUsername(email, username);
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email or username already exists.' });
        }

        const newUser = await auth_util.createUser(email, username, password, avatar_key);

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully.',
            token: token,
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                avatar_key: newUser.avatar_key
            }
        });

    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await auth_util.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful.',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar_key: user.avatar_key
            }
        });

    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
