const mongoose = require('mongoose');



const orderSchema =  mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    product:[{
        type: mongoose.Schema.ObjectId,
        ref: "product"
    }],
    address: String,
    totalPrice: Number,
    status: String,
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'payment'
    },
    delivery :{
        type: mongoose.Schema.ObjectId,
        ref: 'delivery'
    }
},{ timestamps: true });


exports = mongoose.model('order',orderSchema)