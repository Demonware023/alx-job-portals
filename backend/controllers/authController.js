// backend/controllers/AuthController.js

const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all fields.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);
        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to login.' });
    }
};

// Register a new company
const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields.' });
        }

        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(400).json({ message: 'Company already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCompany = new Company({ name, email, password: hashedPassword });

        await newCompany.save();
        const token = generateToken(newCompany._id);
        res.status(201).json({ company: newCompany, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register company.' });
    }
};

// Login company
const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all fields.' });
        }

        const company = await Company.findOne({ email });
        if (!company || !(await bcrypt.compare(password, company.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(company._id);
        res.json({ company, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to login company.' });
    }
};

// Exporting functions
module.exports = {
    registerUser,
    loginUser,
    registerCompany,
    loginCompany,
};
