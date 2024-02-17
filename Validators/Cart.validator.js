const joi = require("joi");

let AddToCartValidation = (cart) => {
  const cartProductSchema = joi.object({
    Product: joi.string().required(),
    Quantity: joi.number().integer().min(1).required(),
  });

 return cartProductSchema.validate(cart);
};

let EditCartValidation = (cart) => {
  const cartProductSchema = joi.object({
    Quantity: joi.number().integer().min(1).required(),
  });

 return cartProductSchema.validate(cart);
};

module.exports = {
  AddToCartValidation,
  EditCartValidation
};