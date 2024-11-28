const mongoose = require('mongoose');
const Joi = require('joi');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Joi Validation Schema
const orderValidationSchema = Joi.object({
    user: Joi.string().hex().length(24).required().messages({
        'string.hex': 'User ID must be a valid MongoDB ObjectId',
        'string.length': 'User ID must be exactly 24 characters long',
        'any.required': 'User ID is required'
    }),
    product: Joi.array().items(
        Joi.string().hex().length(24).required()
    ).min(1).messages({
        'array.base': 'Product must be an array',
        'array.min': 'At least one product is required',
        'string.hex': 'Each product ID must be a valid MongoDB ObjectId',
        'string.length': 'Each product ID must be exactly 24 characters long'
    }),
    address: Joi.string().trim().min(5).max(200).required().messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address cannot exceed 200 characters',
        'any.required': 'Address is required'
    }),
    totalPrice: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Total price must be a positive number',
        'number.precision': 'Total price can have maximum 2 decimal places',
        'any.required': 'Total price is required'
    }),
    status: Joi.string().valid(
        'pending', 
        'processing', 
        'shipped', 
        'delivered', 
        'cancelled'
    ).default('pending').messages({
        'any.only': 'Invalid order status'
    }),
    payment: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Payment ID must be a valid MongoDB ObjectId',
        'string.length': 'Payment ID must be exactly 24 characters long',
        'any.required': 'Payment ID is required'
    }),
    delivery: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Delivery ID must be a valid MongoDB ObjectId',
        'string.length': 'Delivery ID must be exactly 24 characters long',
        'any.required': 'Delivery ID is required'
    })
});

// Mongoose Schema
const orderSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "user",
        required: true
    },
    product: [{
        type: ObjectId,
        ref: "product",
        required: true
    }],
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment: {
        type: ObjectId,
        ref: 'payment',
        required: true
    },
    delivery: {
        type: ObjectId,
        ref: 'delivery',
        required: true
    }
}, { timestamps: true });

// Validation Function
const validateOrder = (orderData) => {
    return orderValidationSchema.validate(orderData, { abortEarly: false });
};

// Mongoose Model
const Order = mongoose.model('order', orderSchema);

module.exports = {
    Order,
    validateOrder
};