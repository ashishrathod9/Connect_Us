const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    getServiceCategoryBySlug,
    updateServiceCategory,
    deleteServiceCategory
} = require('../Controller/serviceCategory');

// Public routes
router.get('/', authenticateUser , getAllServiceCategories);
router.get('/slug/:slug', authenticateUser , getServiceCategoryBySlug);
router.get('/:id', authenticateUser , getServiceCategoryById);

// Protected routes (you'll need to add authentication middleware)
router.post('/', authenticateUser,authorizeAdmin ,createServiceCategory); // Admin only
router.put('/:id', authenticateUser,authorizeAdmin ,updateServiceCategory); // Admin only
router.delete('/:id', authenticateUser,authorizeAdmin ,deleteServiceCategory); // Admin only

module.exports = router;