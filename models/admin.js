const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// Mongoose Admin Schema
const adminSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        enum: ['superadmin', 'admin'],
        default: 'admin'
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
    }
}, { 
    timestamps: true 
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Joi Validation Schema
const adminValidationSchema = Joi.object({
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
    
    role: Joi.string()
        .valid('superadmin', 'admin')
        .default('admin'),
    
    phone: Joi.number()
        .integer()
        .min(1000000000)
        .max(9999999999)
        .required()
});

// Validation Function
const validateAdmin = (admin) => {
    return adminValidationSchema.validate(admin, { abortEarly: false });
};

// Create Mongoose Model
const Admin = mongoose.model('admin', adminSchema);

module.exports = {
    Admin,
    validateAdmin
};