// backend/routes/companies.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   GET /api/companies/posted-jobs
// @desc    Get all jobs posted by the authenticated company
// @access  Private (Company only)
router.get('/posted-jobs', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;

        if (type !== 'company') {
            return res.status(403).json({ msg: 'Access denied. Not a company.' });
        }

        const company = await Company.findById(id).populate({
            path: 'postedJobs',
            populate: { path: 'applications', populate: { path: 'userId', select: 'username email' } },
        });

        if (!company) {
            return res.status(404).json({ msg: 'Company not found.' });
        }

        res.json(company.postedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/companies/post-job
// @desc    Create a new job posting
// @access  Private (Company only)
router.post('/post-job', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;

        if (type !== 'company') {
            return res.status(403).json({ msg: 'Access denied. Not a company.' });
        }

        const { title, description, location, skillsRequired } = req.body;

        if (!title || !description || !location || !skillsRequired) {
            return res.status(400).json({ msg: 'Please provide all required fields.' });
        }

        const job = new Job({
            title,
            description,
            location,
            companyId: id,
            skillsRequired,
        });

        await job.save();

        // Add job to company's postedJobs
        await Company.findByIdAndUpdate(id, { $push: { postedJobs: job._id } });

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/companies/jobs/:jobId/applications
// @desc    Get all applications for a specific job
// @access  Private (Company only)
router.get('/jobs/:jobId/applications', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        const { jobId } = req.params;

        if (type !== 'company') {
            return res.status(403).json({ msg: 'Access denied. Not a company.' });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: { path: 'userId', select: 'username email profile' },
        });

        if (!job) {
            return res.status(404).json({ msg: 'Job not found.' });
        }

        if (job.companyId.toString() !== id) {
            return res.status(403).json({ msg: 'Access denied. Not authorized to view applications for this job.' });
        }

        res.json(job.applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/companies/jobs/:jobId
// @desc    Delete a job posting
// @access  Private (Company only)
router.delete('/jobs/:jobId', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        const { jobId } = req.params;

        if (type !== 'company') {
            return res.status(403).json({ msg: 'Access denied. Not a company.' });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found.' });
        }

        if (job.companyId.toString() !== id) {
            return res.status(403).json({ msg: 'Access denied. Not authorized to delete this job.' });
        }

        // Remove job from company's postedJobs
        await Company.findByIdAndUpdate(id, { $pull: { postedJobs: jobId } });

        // Optionally, delete all applications related to this job
        await Application.deleteMany({ jobId });

        // Delete the job
        await job.remove();

        res.json({ msg: 'Job deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/companies/jobs/:jobId
// @desc    Update a job posting
// @access  Private (Company only)
router.put('/jobs/:jobId', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        const { jobId } = req.params;
        const { title, description, location, skillsRequired } = req.body;

        if (type !== 'company') {
            return res.status(403).json({ msg: 'Access denied. Not a company.' });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found.' });
        }

        if (job.companyId.toString() !== id) {
            return res.status(403).json({ msg: 'Access denied. Not authorized to update this job.' });
        }

        // Update job fields if provided
        if (title) job.title = title;
        if (description) job.description = description;
        if (location) job.location = location;
        if (skillsRequired) job.skillsRequired = skillsRequired;

        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
