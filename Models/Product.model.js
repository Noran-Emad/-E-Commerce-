const mongoose = require("mongoose");

const DBProductShema = mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
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
    maxLength: 400,
  },
  productDescription: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 400,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 1,
    default:0
  },
  Discount: {
    type: Number,
    required: false,
    min: 0,
    max:100,
    default:0
  },
  productQuantity: {
    type: Number,
    required: true,
    min: 0,
    default:0
  },
});

module.exports = mongoose.model("Product", DBProductShema);
