const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: '{VALUE} is not a valid total price'
        }
    }
}, { 
    timestamps: true 
});

// Create compound index to improve query performance
cartSchema.index({ user: 1, product: 1 });

// Joi Validation Schema
const cartValidationSchema = Joi.object({
    user: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'User ID must be a valid MongoDB ObjectId',
            'string.length': 'User ID must be exactly 24 characters long'
        }),
    
    product: Joi.array()
        .items(
            Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    'string.hex': 'Product ID must be a valid MongoDB ObjectId',
                    'string.length': 'Product ID must be exactly 24 characters long'
                })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'Cart must contain at least one product'
        }),
    
    totalPrice: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.min': 'Total price must be a non-negative number'
        })
});

// Validation Function
const validateCart = (cart) => {
    return cartValidationSchema.validate(cart, { abortEarly: false });
};

// Create Mongoose Model
const Cart = mongoose.model('cart', cartSchema);

module.exports = {
    Cart,
    validateCart
};