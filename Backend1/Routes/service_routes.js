const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { authorizeAdminOrProvider } = require('../middleware/authorize');
const {
    getAllServices,
    getServiceById,
    getServicesByCategory,
    createService,
    updateService,
    deleteService,
    searchServices,
    debugServices,
    fixServicesWithoutProviders
} = require('../Controller/service');

// Public routes - Make sure these paths are correct
router.get('/', getAllServices);
router.get('/search', searchServices);
router.get('/category/:categoryId', getServicesByCategory);
router.get('/:id', getServiceById);

// Debug route (temporary)
router.get('/debug/status', debugServices);

// Fix services without providers (temporary)
router.post('/fix-providers', fixServicesWithoutProviders);

// Protected routes (admin or provider)
router.post('/', authenticateUser, authorizeAdminOrProvider, createService);
router.put('/:id', authenticateUser, authorizeAdminOrProvider, updateService);
router.delete('/:id', authenticateUser, authorizeAdminOrProvider, deleteService);

module.exports = router;