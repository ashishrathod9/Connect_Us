const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['per hour', 'fixed', 'per square foot', 'per item', 'per day', 'per visit'],
        default: 'fixed'
    },
    imageUrl: {
        type: String,
        default: null
    },
    keywords: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    duration: {
        type: Number, // in minutes
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    requirements: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for search functionality
serviceSchema.index({ name: 'text', description: 'text', keywords: 'text' });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;