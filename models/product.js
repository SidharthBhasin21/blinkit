const mongoose = require('mongoose');
const Joi = require('joi');

// Joi Validation Schema
const productValidationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name cannot exceed 100 characters',
        'any.required': 'Product name is required'
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Price must be a positive number',
        'number.precision': 'Price can have maximum 2 decimal places',
        'any.required': 'Price is required'
    }),
    stock: Joi.boolean().required().messages({
        'any.required': 'Stock availability is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,12}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10-12 digits',
        'any.required': 'Contact phone number is required'
    }),
    description: Joi.string().trim().min(10).max(1000).optional().messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 1000 characters'
    }),
    image: Joi.string().uri().optional().messages({
        'string.uri': 'Image must be a valid URL'
    })
});

// Mongoose Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String, // Changed to String to accommodate phone number validation
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10,12}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    image: {
        type: String,
        validate: {
            validator: function(v) {
                // Optional URL validation
                return v === '' || /^https?:\/\/.+/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    }
});

// Validation Function
const validateProduct = (productData) => {
    return productValidationSchema.validate(productData, { abortEarly: false });
};

// Mongoose Model
const Product = mongoose.model('product', productSchema);

module.exports = {
    Product,
    validateProduct
};