const mongoose = require('mongoose');


const productSchema =  mongoose.Schema({
    name: String,
    price: Number,
    stock: Boolean,
    phone: Number,
    description: String,
    image: String
});


exports = mongoose.model('product',productSchema)