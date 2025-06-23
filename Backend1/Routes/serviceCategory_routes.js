const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth'); // Fix the require statement
const {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    updateServiceCategory,
    deleteServiceCategory,
    getServiceCategoryBySlug
} = require('../Controller/serviceCategory');

// Public routes
router.get('/', getAllServiceCategories);
router.get('/slug/:slug', getServiceCategoryBySlug);
router.get('/:id', getServiceCategoryById);

// Protected routes (admin only)
router.post('/', authenticateUser, createServiceCategory);
router.put('/:id', authenticateUser, updateServiceCategory);
router.delete('/:id', authenticateUser, deleteServiceCategory);

module.exports = router;