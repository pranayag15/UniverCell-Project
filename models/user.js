var mongoose = require("mongoose");
var passportLOcalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLOcalMongoose);

module.exports = mongoose.model("User", UserSchema); 