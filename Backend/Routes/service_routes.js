const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeAdmin = require('../middleware/authorizeAdmin');
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
router.get('/', authenticateUser , getAllServices);
router.get('/search', authenticateUser , searchServices);
router.get('/category/:categoryId', authenticateUser , getServicesByCategory);
router.get('/:id', authenticateUser , getServiceById);

// Protected routes (you'll need to add authentication middleware)
router.post('/', authenticateUser, authorizeAdmin ,  createService); // Admin only
router.put('/:id', authenticateUser, authorizeAdmin , updateService); // Admin only
router.delete('/:id', authenticateUser, authorizeAdmin , deleteService); // Admin only

module.exports = router;