const mongoose = require('mongoose');



const adminSchema =  mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    phone: Number,
    address: [addressSchema]
});


exports = mongoose.model('admin',adminSchema)