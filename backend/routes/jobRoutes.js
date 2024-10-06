// backend/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

// Route to create a new job (protected route)
router.post('/', authMiddleware, createJob);

// Route to get all jobs
router.get('/', getJobs);

// Route to get a job by ID
router.get('/:id', getJobById);

// Route to update a job by ID (protected route)
router.put('/:id', authMiddleware, updateJob);

// Route to delete a job by ID (protected route)
router.delete('/:id', authMiddleware, deleteJob);

// Export the router
module.exports = router;
