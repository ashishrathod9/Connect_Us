const express = require('express');
const router = express.Router();
const {
    createService,
    getAllServices,
    getServiceById,
    getServicesByCategory,
    updateService,
    deleteService,
    searchServices
} = require('../Controller/service');

// Public routes
router.get('/', getAllServices);
router.get('/search', searchServices);
router.get('/category/:categoryId', getServicesByCategory);
router.get('/:id', getServiceById);

// Protected routes (you'll need to add authentication middleware)
router.post('/', createService); // Admin only
router.put('/:id', updateService); // Admin only
router.delete('/:id', deleteService); // Admin only

module.exports = router;