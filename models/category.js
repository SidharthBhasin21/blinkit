const mongoose = require('mongoose');


const categorySchema =  mongoose.Schema({
    name: String,
});


exports = mongoose.model('category',categorySchema)