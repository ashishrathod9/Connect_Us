const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { authorizeAdmin } = require('../middleware/authorize');
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
router.post('/', authenticateUser, authorizeAdmin, createServiceCategory);
router.put('/:id', authenticateUser, authorizeAdmin, updateServiceCategory);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteServiceCategory);

module.exports = router;