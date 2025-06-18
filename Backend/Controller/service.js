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

        // Check if category exists
        const categoryExists = await ServiceCategory.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid service category' });
        }

        // Check if service already exists in this category
        const existingService = await Service.findOne({ name, category });
        if (existingService) {
            return res.status(400).json({ message: 'Service already exists in this category' });
        }

        const newService = new Service({
            name,
            description,
            category,
            basePrice,
            unit,
            imageUrl,
            keywords: keywords || [],
            duration,
            difficulty,
            requirements: requirements || []
        });

        await newService.save();
        
        // Populate category details in response
        await newService.populate('category');
        
        res.status(201).json({ 
            message: 'Service created successfully', 
            service: newService 
        });

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, unit, difficulty } = req.query;
        
        let filter = { isActive: true };
        
        // Filter by category
        if (category) {
            filter.category = category;
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }
        
        // Filter by unit
        if (unit) {
            filter.unit = unit;
        }
        
        // Filter by difficulty
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        
        let query = Service.find(filter).populate('category');
        
        // Search functionality
        if (search) {
            query = Service.find({
                ...filter,
                $text: { $search: search }
            }).populate('category');
        }
        
        const services = await query.sort({ createdAt: -1 });
        
        res.status(200).json({ 
            services,
            count: services.length 
        });

    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id).populate('category');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json({ service });

    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Check if category exists
        const categoryExists = await ServiceCategory.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        const services = await Service.find({ 
            category: categoryId, 
            isActive: true 
        }).populate('category').sort({ createdAt: -1 });
        
        res.status(200).json({ 
            services,
            category: categoryExists,
            count: services.length 
        });

    } catch (error) {
        console.error('Error fetching services by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If category is being updated, check if it exists
        if (updateData.category) {
            const categoryExists = await ServiceCategory.findById(updateData.category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid service category' });
            }
        }

        const service = await Service.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('category');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json({ 
            message: 'Service updated successfully', 
            service 
        });

    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete service (soft delete)
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        service.isActive = false;
        await service.save();

        res.status(200).json({ message: 'Service deleted successfully' });

    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search services
const searchServices = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const services = await Service.find({
            isActive: true,
            $text: { $search: q }
        }).populate('category').sort({ score: { $meta: 'textScore' } });
        
        res.status(200).json({ 
            services,
            count: services.length,
            query: q 
        });

    } catch (error) {
        console.error('Error searching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getServicesByCategory,
    updateService,
    deleteService,
    searchServices
};