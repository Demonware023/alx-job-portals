// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   GET /api/jobs/recommendations
// @desc    Get recommended jobs based on user skills
// @access  Private (User only)
router.get('/recommendations', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;

        if (type !== 'user') {
            return res.status(403).json({ msg: 'Access denied. Not a user.' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const userSkills = user.profile.skills.map(skill => skill.toLowerCase());

        // Find jobs that require at least one of the user's skills
        const recommendedJobs = await Job.find({
            skillsRequired: { $in: userSkills },
        }).populate('companyId', 'companyName');

        // Format the response to include companyName
        const formattedJobs = recommendedJobs.map(job => ({
            _id: job._id,
            title: job.title,
            description: job.description,
            location: job.location,
            companyName: job.companyId.companyName,
            skillsRequired: job.skillsRequired,
        }));

        res.json(formattedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Additional routes for jobs (CRUD) can be implemented here

module.exports = router;
