const joi = require('joi');

let ProductValidation = (product) =>{
    productschema = joi.object({
      CategoryID:joi.required(),
      productImage:joi.string().required(),
      ProductName: joi.string().min(3).required(),
      productPrice:joi.number().min(1).required(),
      productQuantity:joi.number().min(0).required(),
      productDescription:joi.string().min(10).required(),
    })
    
  return productschema.validate(product);
}

let ProductEditValidation = (product) =>{
    productschema = joi.object({
      productImage:joi.string(),
      productPrice:joi.number().min(1),
      ProductName: joi.string().min(3),
      productQuantity:joi.number().min(0),
      productDescription:joi.string().min(10),
    })

  return productschema.validate(product);
}

module.exports = {
    ProductValidation,
    ProductEditValidation
}