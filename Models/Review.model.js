const mongoose = require("mongoose");

const DBReviewShema = mongoose.Schema({
  User: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  Product: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  Title: {
    type: String,
    manLength: 400,
  },
  Rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Review", DBReviewShema);