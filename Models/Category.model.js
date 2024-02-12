const mongoose = require("mongoose");

const DBCategoryShema = mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  Products:[
    {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }
  ]
});

module.exports = mongoose.model("Category", DBCategoryShema);