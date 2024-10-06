// backend/models/Job.js

const mongoose = require('mongoose');

// Job Schema
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    salary: {
        type: String, // Use String for salary to accommodate ranges (e.g., "$60,000 - $80,000")
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Reference to the Company model
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
});

// Create Job model
const Job = mongoose.model('Job', jobSchema);

// Export Job model
module.exports = Job;
