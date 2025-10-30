import express from 'express';
const router = express.Router();

import { user_controller } from '../controllers/index.js';
import { auth_middleware } from '../middleware/index.js';

// All routes in this file are protected
router.use(auth_middleware.protect);

// GET /api/users/me
// Get the logged-in user's profile
router.get('/me', user_controller.getMyProfile);

// PATCH /api/users/me
// Update the logged-in user's profile
router.patch('/me', user_controller.updateMyProfile);

export default router;
