// backend/routes/users.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   PUT /api/users/:userId/profile
// @desc    Update user profile
// @access  Private (User only)
router.put('/:userId/profile', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        const { userId } = req.params;
        const { skills, experience } = req.body;

        if (type !== 'user' || id !== userId) {
            return res.status(403).json({ msg: 'Access denied.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        user.profile.skills = skills || user.profile.skills;
        user.profile.experience = experience || user.profile.experience;

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/users/:userId/applied-jobs
// @desc    Get all jobs the user has applied to
// @access  Private (User only)
router.get('/:userId/applied-jobs', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        const { userId } = req.params;

        if (type !== 'user' || id !== userId) {
            return res.status(403).json({ msg: 'Access denied.' });
        }

        const user = await User.findById(userId).populate({
            path: 'appliedJobs',
            populate: { path: 'companyId', select: 'companyName' },
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(user.appliedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
