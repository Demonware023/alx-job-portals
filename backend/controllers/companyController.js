// backend/controllers/companyController.js

const Company = require('../models/Company');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new company
exports.registerCompany = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, email, password } = req.body;

    try {
        // Check if the company already exists
        let company = await Company.findOne({ email });
        if (company) {
            return res.status(400).json({ msg: 'Company already exists' });
        }

        // Create a new company instance
        company = new Company({
            companyName,
            email,
            password,
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(password, salt);

        // Save the company to the database
        await company.save();

        res.status(201).json({ msg: 'Company registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Company login
exports.loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the company exists
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a JSON Web Token
        const token = jwt.sign(
            { id: company._id, type: 'company' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, msg: 'Company logged in successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get company profile
exports.getCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update company profile
exports.updateCompanyProfile = async (req, res) => {
    const { companyName, email, password } = req.body;

    // Validate input (optional - can add more checks as needed)
    if (!companyName && !email && !password) {
        return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    try {
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        // Update fields
        if (companyName) company.companyName = companyName;
        if (email) company.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            company.password = await bcrypt.hash(password, salt);
        }

        await company.save();
        res.json({ msg: 'Company profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
