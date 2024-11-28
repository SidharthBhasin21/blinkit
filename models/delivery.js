const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    status: {
        type: String,
        required: true,
        enum: [
            'pending', 
            'processing', 
            'out_for_delivery', 
            'delivered', 
            'failed', 
            'cancelled'
        ],
        default: 'pending'
    },
    trackingURL: {
        type: String,
        validate: {
            validator: function(v) {
                // Basic URL validation
                return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    estimatedDeliveryTime: {
        type: Number, // Assuming this is timestamp or duration in hours
        min: 0
    }
}, { 
    timestamps: true 
});

// Create index for faster queries
deliverySchema.index({ order: 1, status: 1 });

// Joi Validation Schema
const deliveryValidationSchema = Joi.object({
    order: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'Order ID must be a valid MongoDB ObjectId',
            'string.length': 'Order ID must be exactly 24 characters long'
        }),
    
    deliveryBoy: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.empty': 'Delivery boy name cannot be empty',
            'string.min': 'Delivery boy name must be at least 2 characters long',
            'string.max': 'Delivery boy name cannot exceed 100 characters'
        }),
    
    status: Joi.string()
        .valid(
            'pending', 
            'processing', 
            'out_for_delivery', 
            'delivered', 
            'failed', 
            'cancelled'
        )
        .default('pending'),
    
    trackingURL: Joi.string()
        .uri()
        .optional()
        .allow(null),
    
    estimatedDeliveryTime: Joi.number()
        .min(0)
        .optional()
        .messages({
            'number.min': 'Estimated delivery time must be a non-negative number'
        })
});

// Validation Function
const validateDelivery = (delivery) => {
    return deliveryValidationSchema.validate(delivery, { abortEarly: false });
};

// Create Mongoose Model
const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = {
    Delivery,
    validateDelivery
};