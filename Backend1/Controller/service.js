const Service = require('../models/service_model');
const ServiceCategory = require('../models/serviceCategory_model');

// Create new service
const createService = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            category, 
            basePrice, 
            unit, 
            imageUrl, 
            keywords, 
            duration, 
            difficulty, 
            requirements 
        } = req.body;

        // Validation
        if (!name || !description || !category || !basePrice) {
            return res.status(400).json({ 
                success: false,
                message: 'Name, description, category, and base price are required' 
            });
        }

        // Check if category exists
        const categoryExists = await ServiceCategory.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid category' 
            });
        }

        const newService = new Service({
            name,
            description,
            category,
            basePrice,
            unit: unit || 'fixed',
            imageUrl,
            keywords: keywords || [],
            duration: duration || 60,
            difficulty: difficulty || 'medium',
            requirements: requirements || [],
            provider: req.user.id,
        });

        await newService.save();
        await newService.populate('category');
        await newService.populate('provider', 'name email phone address serviceType contact status');
        
        res.status(201).json({ 
            success: true,
            message: 'Service created successfully', 
            service: newService 
        });

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, difficulty, minPrice, maxPrice } = req.query;
        
        let filter = { isActive: true };
        
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }
        
        const services = await Service.find(filter)
            .populate('category')
            .populate('provider', 'name email phone address serviceType contact status')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Service.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            services,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id)
            .populate('category')
            .populate('provider', 'name email phone address serviceType contact status');

        if (!service) {
            return res.status(404).json({ 
                success: false,
                message: 'Service not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            service 
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Check if category exists
        const categoryExists = await ServiceCategory.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }
        
        const services = await Service.find({ 
            category: categoryId, 
            isActive: true 
        }).populate('category').populate('provider', 'name email phone address serviceType contact status').sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true,
            services,
            category: categoryExists,
            count: services.length 
        });

    } catch (error) {
        console.error('Error fetching services by category:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ 
                success: false,
                message: 'Service not found' 
            });
        }

        // If category is being updated, validate it exists
        if (updateData.category) {
            const categoryExists = await ServiceCategory.findById(updateData.category);
            if (!categoryExists) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid category' 
                });
            }
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category').populate('provider', 'name email phone address serviceType contact status');

        res.status(200).json({ 
            success: true,
            message: 'Service updated successfully', 
            service: updatedService 
        });

    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Delete service (soft delete)
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ 
                success: false,
                message: 'Service not found' 
            });
        }

        // Soft delete
        service.isActive = false;
        await service.save();

        res.status(200).json({ 
            success: true,
            message: 'Service deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Search services
const searchServices = async (req, res) => {
    try {
        const { q, category, difficulty, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        
        let filter = { isActive: true };
        let textSearch = {};

        if (q) {
            // Text search on name, description, keywords, and provider's name
            textSearch.$text = { $search: q };
        }
        
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }
        
        const query = { ...textSearch, ...filter };

        const services = await Service.find(query)
            .populate('category')
            .populate('provider', 'name email phone address serviceType contact status')
            .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Service.countDocuments(query);
        
        res.status(200).json({
            success: true,
            services,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            total
        });

    } catch (error) {
        console.error('Error searching services:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Debug function to check service provider status
const debugServices = async (req, res) => {
    try {
        const services = await Service.find({}).populate('provider', 'name email phone address serviceType contact status').populate('category', 'name');
        
        const servicesWithProviders = services.filter(s => s.provider);
        const servicesWithoutProviders = services.filter(s => !s.provider);
        
        res.status(200).json({
            success: true,
            totalServices: services.length,
            servicesWithProviders: servicesWithProviders.length,
            servicesWithoutProviders: servicesWithoutProviders.length,
            servicesWithoutProvidersList: servicesWithoutProviders.map(s => ({
                id: s._id,
                name: s.name,
                category: s.category?.name
            }))
        });
    } catch (error) {
        console.error('Error debugging services:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Fix services without providers by assigning a default provider
const fixServicesWithoutProviders = async (req, res) => {
    try {
        // Find a provider user to assign as default
        const User = require('../models/user_model');
        const defaultProvider = await User.findOne({ role: 'provider', status: 'approved' });
        
        if (!defaultProvider) {
            return res.status(400).json({
                success: false,
                message: 'No approved provider found to assign services to'
            });
        }

        // Find services without providers and assign the default provider
        const result = await Service.updateMany(
            { provider: { $exists: false } },
            { provider: defaultProvider._id }
        );

        res.status(200).json({
            success: true,
            message: `Assigned ${result.modifiedCount} services to provider: ${defaultProvider.name}`,
            defaultProvider: {
                id: defaultProvider._id,
                name: defaultProvider.name,
                email: defaultProvider.email
            },
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error fixing services without providers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    getServicesByCategory,
    createService,
    updateService,
    deleteService,
    searchServices,
    debugServices,
    fixServicesWithoutProviders
};