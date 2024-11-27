const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    order:{
        type: mongoose.Schema.ObjectId,
        ref: "order"
    },
    amount: Number,
    method: String,
    status: String,
    transactionID: String,
})

exports = mongoose.model('payment', paymentSchema)