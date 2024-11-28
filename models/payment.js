const mongoose = require('mongoose');
const Joi = require('joi');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Joi Validation Schema
const paymentValidationSchema = Joi.object({
    order: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Order ID must be a valid MongoDB ObjectId',
        'string.length': 'Order ID must be exactly 24 characters long',
        'any.required': 'Order ID is required'
    }),
    amount: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Amount must be a positive number',
        'number.precision': 'Amount can have maximum 2 decimal places',
        'any.required': 'Amount is required'
    }),
    method: Joi.string().valid(
        'creditcard', 
        'debitcard',
        'cod',
        'upi'
    ).required().messages({
        'any.only': 'Invalid payment method',
        'any.required': 'Payment method is required'
    }),
    status: Joi.string().valid(
        'pending', 
        'completed', 
        'failed', 
        'refunded'
    ).default('pending').messages({
        'any.only': 'Invalid payment status'
    }),
    transactionID: Joi.string().trim().min(5).max(100).required().messages({
        'string.min': 'Transaction ID must be at least 5 characters long',
        'string.max': 'Transaction ID cannot exceed 100 characters',
        'any.required': 'Transaction ID is required'
    })
});

// Mongoose Schema
const paymentSchema = new mongoose.Schema({
    order: {
        type: ObjectId,
        ref: "order",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        required: true,
        enum: ['creditcard', 'debitcard', "cod", "upi"]
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionID: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    }
});

// Validation Function
const validatePayment = (paymentData) => {
    return paymentValidationSchema.validate(paymentData, { abortEarly: false });
};

// Mongoose Model
const Payment = mongoose.model('payment', paymentSchema);

module.exports = {
    Payment,
    validatePayment
};