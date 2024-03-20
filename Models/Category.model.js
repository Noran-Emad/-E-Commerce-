const mongoose = require("mongoose");

const DBCategoryShema = mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  CategoryDescription:{
    type: String,
    required: true,
    minLength: 10,
    maxLength: 550,
  },
  CategoryImage:{
    type: String,
    required: true,
    minLength: 10,
    maxLength: 550,
  },
  Products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Category", DBCategoryShema);