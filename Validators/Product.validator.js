const joi = require('joi');

let ProductValidation = (product) =>{
    productschema = joi.object({
        ProductName: joi.string().min(3).required(),
        productImage:joi.string().required(),
        productDescription:joi.string().min(10).required(),
        productPrice:joi.number().min(1).required(),
        productQuantity:joi.number().min(0).required(),
        CategoryID:joi.required()
    })
  return productschema.validate(product);
}

let ProductEditValidation = (product) =>{
    productschema = joi.object({
        ProductName: joi.string().min(3),
        productImage:joi.string(),
        productDescription:joi.string().min(10),
        productPrice:joi.number().min(1),
        productQuantity:joi.number().min(0),
    })
  return productschema.validate(product);
}

module.exports = {
    ProductValidation,
    ProductEditValidation
}

