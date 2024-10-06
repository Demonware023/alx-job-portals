// backend/routes/companyRoutes.js

const express = require('express');
const router = express.Router();
const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} = require('../controllers/companyController');
const authMiddleware = require('../middleware/auth');

// Route to create a new company (protected route)
router.post('/', authMiddleware, createCompany);

// Route to get all companies
router.get('/', getCompanies);

// Route to get a company by ID
router.get('/:id', getCompanyById);

// Route to update a company by ID (protected route)
router.put('/:id', authMiddleware, updateCompany);

// Route to delete a company by ID (protected route)
router.delete('/:id', authMiddleware, deleteCompany);

// Export the router
module.exports = router;
