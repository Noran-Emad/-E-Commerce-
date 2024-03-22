const joi = require('joi');

let ProductValidation = (product) =>{
    productschema = joi.object({
      CategoryID:joi.string().required(),
      productPrice:joi.number().min(1).required(),
      Discount:joi.number().integer().min(0).max(100),
      productImage:joi.string().min(1).max(400).required(),
      ProductName: joi.string().min(3).max(100).required(),
      productQuantity:joi.number().integer().min(0).required(),
      productDescription:joi.string().min(10).max(400).required(),
    })
    
  return productschema.validate(product);
}

let ProductEditValidation = (product) =>{
    productschema = joi.object({
      CategoryID:joi.string(),
      productPrice:joi.number().min(1),
      productImage:joi.string().min(1).max(400),
      ProductName: joi.string().min(3).max(100),
      productQuantity:joi.number().integer().min(0),
      Discount:joi.number().integer().min(0).max(100),
      productDescription:joi.string().min(10).max(400),
    })

  return productschema.validate(product);
}

module.exports = {
    ProductValidation,
    ProductEditValidation
}