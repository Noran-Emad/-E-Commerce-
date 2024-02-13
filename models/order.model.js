const mongoose = require("mongoose");

const DBOrderShema = mongoose.Schema({
  OrderName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
});

module.exports = mongoose.model("Order", DBOrderShema);
