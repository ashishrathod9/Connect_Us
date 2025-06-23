const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    icon: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better performance
serviceCategorySchema.index({ name: 1 });
serviceCategorySchema.index({ slug: 1 });
serviceCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);