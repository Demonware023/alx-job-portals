// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const authMiddleware = require('../middleware/auth');

// Register User
router.post('/register/user', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ username, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id, type: 'user' } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Register Company
router.post('/register/company', async (req, res) => {
    const { companyName, email, password } = req.body;
    try {
        let company = await Company.findOne({ email });
        if (company) {
            return res.status(400).json({ msg: 'Company already exists' });
        }
        company = new Company({ companyName, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(password, salt);

        await company.save();

        const payload = { user: { id: company.id, type: 'company' } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User or Company
router.post('/login', async (req, res) => {
    const { email, password, type } = req.body; // 'type' can be 'user' or 'company'
    try {
        let user;
        if (type === 'user') {
            user = await User.findOne({ email });
        } else if (type === 'company') {
            user = await Company.findOne({ email });
        } else {
            return res.status(400).json({ msg: 'Invalid user type' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, type } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Authenticated User
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const { id, type } = req.user;
        let user;
        if (type === 'user') {
            user = await User.findById(id).select('-password').populate('appliedJobs');
        } else if (type === 'company') {
            user = await Company.findById(id).select('-password').populate('postedJobs');
        }
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

