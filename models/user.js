const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// Mongoose Address Schema
const addressSchema = new mongoose.Schema({
    state: {
        type: String,
        trim: true,
        maxlength: 50
    },
    zip: {
        type: Number,
        min: 10000,
        max: 999999
    },
    city: {
        type: String,
        trim: true,
        maxlength: 100
    },
    address: {
        type: String,
        trim: true,
        maxlength: 500
    }
});

// Mongoose User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    address: [addressSchema]
}, { 
    timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Joi Validation Schema
const userValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim(),
    
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase(),
    
    password: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .message('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'),
    
    phone: Joi.number()
        .integer()
        .min(1000000000)
        .max(9999999999)
        .required(),
    
    address: Joi.array().items(Joi.object({
        state: Joi.string()
            .trim()
            .max(50)
            .optional(),
        
        zip: Joi.number()
            .integer()
            .min(10000)
            .max(99999)
            .optional(),
        
        city: Joi.string()
            .trim()
            .max(100)
            .optional(),
        
        address: Joi.string()
            .trim()
            .max(500)
            .optional()
    })).optional()
});

// Validation Function
const validateUser = (user) => {
    return userValidationSchema.validate(user, { abortEarly: false });
};

// Create Mongoose Model
const User = mongoose.model('user', userSchema);

module.exports = {
    User,
    validateUser
};