const mongoose = require("mongoose");

const DBCartShema = mongoose.Schema({
  User: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  CartProducts: [
    {
      Product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      Quantity: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
});

/* make a driven prop in run time to calc the total price */
DBCartShema.virtual("TotalPrice").get(function () {
  let totalPrice = 0;

  for (const cartProduct of this.CartProducts) {
    totalPrice += cartProduct.Quantity * cartProduct.Product.productPrice;
  }

  return totalPrice;
});

DBCartShema.set("toObject", { virtuals: true });
DBCartShema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Cart", DBCartShema);
