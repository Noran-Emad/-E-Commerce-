const express = require("express");
const app = express();
app.use(express.json());

const CartCollection = require("../Models/Cart.model");
const ProductCollection = require("../Models/Product.model");


/* create a cart and link it to the new user */
let CreateCart = async (createdUser) => {
  let createdcart = await CartCollection.create({ User: createdUser._id })
   createdUser.Cart = createdcart._id;
  await createdUser.save();
}


/* update all carts after making order to adjust the products quantity to be the current max quantity */
let UpdateCarts = async (usercart) => {
  for (let cartItem of usercart) {
    const product = await ProductCollection.findById(cartItem.Product).exec();
    
    if (product)
    await updateProductQuantityInCart( cartItem.Product, cartItem.Quantity,product.productQuantity);
}
};

/* match the products with greater quantity than the stock to the current product stock */
let  updateProductQuantityInCart = async (productId,cartQuantity, productQuantity) => {
  if (cartQuantity > productQuantity) {
    await CartCollection.updateMany(
      { "CartProducts.Product": productId },
      { $set: { "CartProducts.$.Quantity": productQuantity } });
      
    await CartCollection.updateMany(
      { "CartProducts.Product": productId },
      { $pull: { CartProducts: { Quantity: 0 } } });
  }
};

module.exports = {
  CreateCart,
  UpdateCarts,
  updateProductQuantityInCart,
};