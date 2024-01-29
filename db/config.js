const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/ecom");

const db = mongoose.connection;

db.on("error", console.error.bind(console,'connetions error'));
db.once('open', function(){
    console.log('connected to mongodb');
})
db.on("disconnect", function(){
    console.log('disconnected from mongodb');
})