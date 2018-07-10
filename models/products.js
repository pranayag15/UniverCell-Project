var mongoose = require("mongoose");

var productSchema  = new mongoose.Schema({
   name: String,
   image: String,
   category: String,
   description: String,
   price: {type: Number}
});

module.exports = mongoose.model("Products", productSchema);