// backend/controllers/jobController.js

const Job = require('../models/Job');
const { body, validationResult } = require('express-validator');

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Company only)
const createJob = [
    // Validate inputs
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements').notEmpty().withMessage('Requirements are required'),
    body('salary').notEmpty().withMessage('Salary is required'),
    body('location').notEmpty().withMessage('Location is required'),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, requirements, salary, location } = req.body;
        const companyId = req.user.id; // Assuming you're getting the company ID from the authenticated user

        try {
            const newJob = new Job({
                title,
                description,
                requirements,
                salary,
                location,
                company: companyId,
            });

            await newJob.save();
            res.status(201).json(newJob);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create job' });
        }
    },
];

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'name');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve jobs' });
    }
};

// @route   GET /api/jobs/:id
// @desc    Get a job by ID
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name');
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve job' });
    }
};

// @route   PUT /api/jobs/:id
// @desc    Update a job by ID
// @access  Private (Company only)
const updateJob = [
    // Validate inputs
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('requirements').optional().notEmpty().withMessage('Requirements cannot be empty'),
    body('salary').optional().notEmpty().withMessage('Salary cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const job = await Job.findById(req.params.id);
            if (!job) {
                return res.status(404).json({ msg: 'Job not found' });
            }

            // Check if the user is the company that posted the job
            if (job.company.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Access denied. You cannot update this job.' });
            }

            const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedJob);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update job' });
        }
    },
];

// @route   DELETE /api/jobs/:id
// @desc    Delete a job by ID
// @access  Private (Company only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check if the user is the company that posted the job
        if (job.company.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied. You cannot delete this job.' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

// Export all functions
module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
};
