const joi = require("joi");

let PlaceOrderValidation = (order) => {
  const OrderSchema = joi.object({
    Products: joi.string().required(),
    TotalPrice: joi.number().min(1).required(),
    OrderStatus: Joi.string().valid("pending", "done", "canceled").default("pending").required()
  });

  return OrderSchema.validate(order);
};

let EditOrderValidation = (order) => {
  const OrderSchema = joi.object({
    Quantity: joi.number().integer().min(1).required(),
  });
  
  return OrderSchema.validate(order);
};

module.exports = {
  PlaceOrderValidation,
  EditOrderValidation,
};