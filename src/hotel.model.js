const mongoose = require("mongoose");
const HotelSchema = { name:String,price:Number,avgRating:Number};
const Hotel = mongoose.model("Hotel",HotelSchema);
module.exports.Hotel=Hotel;