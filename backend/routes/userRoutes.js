// backend/routes/userRoutes.js
import express from 'express';
import { createUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
router.post('/', createUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
