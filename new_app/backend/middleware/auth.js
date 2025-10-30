import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes.
 * Verifies the JWT token from the Authorization header.
 */
export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authorized, no token provided.' });
    }

    // The header format is "Bearer <token>", so we split and take the second part
    const token = bearer.split(' ')[1];

    try {
        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user's info (payload) to the request object
        // Our controllers can now access req.user.userId
        req.user = payload;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Not authorized, token is invalid.' });
    }
};
