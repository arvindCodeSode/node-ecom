const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productTitle:String,
    category:String,
    price:String,
    companyName:String,
    userId:String
});
module.exports = mongoose.model('products', productSchema);