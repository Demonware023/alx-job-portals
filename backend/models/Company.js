// backend/models/Company.js

const mongoose = require('mongoose');

// Create a schema for Company
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    postedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
}, { timestamps: true });

// Create a model for Company
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
