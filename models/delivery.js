const mongoose = require('mongoose');

const deliverySchema =  mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "order"
    },
    deliveryBoy: String,
    status: String,
    trackingURL: String,
    estimatedDeliveryTime, Number
});


exports = mongoose.model('delivery',deliverySchema)