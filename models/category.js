const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    }
}, { 
    timestamps: true 
});

// Create a text index for better search performance
categorySchema.index({ name: 'text' });

// Joi Validation Schema
const categoryValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.empty': 'Category name cannot be empty',
            'string.min': 'Category name must be at least 2 characters long',
            'string.max': 'Category name cannot exceed 100 characters'
        })
});

// Validation Function
const validateCategory = (category) => {
    return categoryValidationSchema.validate(category, { abortEarly: false });
};

// Create Mongoose Model
const Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category,
    validateCategory
};