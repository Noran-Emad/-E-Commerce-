const mongoose = require("mongoose");

const DBProductShema = mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  CategoryID: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  productImage: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  productDescription: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 1,
  },
  productQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Product", DBProductShema);
