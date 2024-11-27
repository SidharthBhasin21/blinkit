const mongoose = require('mongoose');


const cartSchema =  mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    product:[{
        type: mongoose.Schema.ObjectId,
        ref: "product"
    }],
    totalPrice: Number,
});


exports = mongoose.model('cart',cartSchema)