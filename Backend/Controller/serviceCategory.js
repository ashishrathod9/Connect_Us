const ServiceCategory = require('../models/serviceCategory_model');

// Helper function to generate slug
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
        const { name, description, imageUrl } = req.body;

        // Check if category already exists
        const existingCategory = await ServiceCategory.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Service category already exists' });
        }

        // Generate slug from name
        const slug = generateSlug(name);

        const newCategory = new ServiceCategory({
            name,
            description,
            imageUrl,
            slug
        });

        await newCategory.save();
        res.status(201).json({ 
            message: 'Service category created successfully', 
            category: newCategory 
        });

    } catch (error) {
        console.error('Error creating service category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all service categories
const getAllServiceCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ categories });

    } catch (error) {
        console.error('Error fetching service categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get service category by ID
const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Service category not found' });
        }

        res.status(200).json({ category });

    } catch (error) {
        console.error('Error fetching service category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get service category by slug
const getServiceCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await ServiceCategory.findOne({ slug, isActive: true });

        if (!category) {
            return res.status(404).json({ message: 'Service category not found' });
        }

        res.status(200).json({ category });

    } catch (error) {
        console.error('Error fetching service category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update service category
const updateServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl, isActive } = req.body;

        const category = await ServiceCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Service category not found' });
        }

        // Update fields
        if (name) {
            category.name = name;
            category.slug = generateSlug(name); // Update slug when name changes
        }
        if (description) category.description = description;
        if (imageUrl !== undefined) category.imageUrl = imageUrl;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();
        res.status(200).json({ 
            message: 'Service category updated successfully', 
            category 
        });

    } catch (error) {
        console.error('Error updating service category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete service category (soft delete)
const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ServiceCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Service category not found' });
        }

        category.isActive = false;
        await category.save();

        res.status(200).json({ message: 'Service category deleted successfully' });

    } catch (error) {
        console.error('Error deleting service category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    getServiceCategoryBySlug,
    updateServiceCategory,
    deleteServiceCategory
};