const ServiceCategory = require('../models/serviceCategory_model');

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

// Create new service category
const createServiceCategory = async (req, res) => {
    try {
        const { name, description, icon, isActive } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await ServiceCategory.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        // Generate slug
        const slug = generateSlug(name);

        const newCategory = new ServiceCategory({
            name,
            description: description || '',
            slug,
            icon: icon || '',
            isActive: isActive !== undefined ? isActive : true
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Service category created successfully',
            category: newCategory
        });

    } catch (error) {
        console.error('Error creating service category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all service categories
const getAllServiceCategories = async (req, res) => {
    try {
        const { isActive } = req.query;
        
        let filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const categories = await ServiceCategory.find(filter)
            .sort({ name: 1 })
            .select('name description slug icon isActive createdAt');

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error('Error fetching service categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get service category by ID
const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ServiceCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Service category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Error fetching service category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get service category by slug
const getServiceCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await ServiceCategory.findOne({ slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Service category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Error fetching service category by slug:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update service category
const updateServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, isActive } = req.body;

        const category = await ServiceCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Service category not found'
            });
        }

        // Update fields
        if (name) {
            category.name = name;
            category.slug = generateSlug(name);
        }
        if (description !== undefined) category.description = description;
        if (icon !== undefined) category.icon = icon;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Service category updated successfully',
            category
        });

    } catch (error) {
        console.error('Error updating service category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete service category
const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ServiceCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Service category not found'
            });
        }

        await ServiceCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Service category deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting service category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    updateServiceCategory,
    deleteServiceCategory,
    getServiceCategoryBySlug
};