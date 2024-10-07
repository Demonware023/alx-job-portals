// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerCompany,
    loginCompany,
} = require('../controllers/authController');

// User registration route
router.post('/register/user', registerUser);

// User login route
router.post('/login/user', loginUser);

// Company registration route
router.post('/register/company', registerCompany);

// Company login route
router.post('/login/company', loginCompany);

// Export the router
module.exports = router;
