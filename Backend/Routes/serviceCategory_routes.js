const express = require('express');
const router = express.Router();
const {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    getServiceCategoryBySlug,
    updateServiceCategory,
    deleteServiceCategory
} = require('../Controller/serviceCategory');

// Public routes
router.get('/', getAllServiceCategories);
router.get('/slug/:slug', getServiceCategoryBySlug);
router.get('/:id', getServiceCategoryById);

// Protected routes (you'll need to add authentication middleware)
router.post('/', createServiceCategory); // Admin only
router.put('/:id', updateServiceCategory); // Admin only
router.delete('/:id', deleteServiceCategory); // Admin only

module.exports = router;