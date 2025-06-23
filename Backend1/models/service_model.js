const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        maxlength: [200, 'Service name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: [true, 'Service category is required']
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Service provider is required']
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
    },
    unit: {
        type: String,
        enum: ['fixed', 'hourly', 'daily', 'per_item'],
        default: 'fixed'
    },
    imageUrl: {
        type: String,
        trim: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    duration: {
        type: Number, // in minutes
        default: 60,
        min: [1, 'Duration must be at least 1 minute']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    requirements: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better performance
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Service', serviceSchema);
