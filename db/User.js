const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    name:String,
    email:String,
    username:String,
    password:String
});
module.exports = mongoose.model('users',userSchema);