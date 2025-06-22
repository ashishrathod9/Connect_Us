const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { authorizeAdmin } = require('../middleware/authorize');
const {
    getAllServiceCategories,
    getServiceCategoryById,
    getServiceCategoryBySlug,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory
} = require('../Controller/serviceCategory');

// Public routes - Make sure these paths are correct
router.get('/', getAllServiceCategories);
router.get('/:id', getServiceCategoryById);
router.get('/slug/:slug', getServiceCategoryBySlug);

// Protected routes (admin only)
router.post('/', authenticateUser, authorizeAdmin, createServiceCategory);
router.put('/:id', authenticateUser, authorizeAdmin, updateServiceCategory);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteServiceCategory);

module.exports = router;