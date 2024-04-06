const mongoose = require("mongoose");

const DBOrderShema = mongoose.Schema({
  User:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  OrderDate: {
    type:Date,
    default: Date.now(),
  },
  TotalPrice: {
    required: true,
    type: Number,
    min: 0,
  },
  OrderStatus: {
    type: String,
    enum: ["pending", "done", "canceled"],
    default:"pending",
    required: true,
  },
  Products: [
    {
      required: true,
      type: {
        Product: {
        },
        Quantity: {
          type: Number,
          min: 1,
        },
      },
    },
  ],
});

module.exports = mongoose.model("Order", DBOrderShema);