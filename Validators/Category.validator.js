const joi = require("joi");

let CategoryValidation = (category) => {
  categoryschema = joi.object({
    CategoryName: joi.string().min(3).required(),
    CategoryDescription: joi.string().min(10).required()
  });

  return categoryschema.validate(category);
};

let CategoryEditValidation = (category) => {
  categoryschema = joi.object({
    CategoryName: joi.string().min(3),
    CategoryDescription: joi.string().min(10)
  });
  
  return categoryschema.validate(category);
};

module.exports = {
  CategoryValidation,
  CategoryEditValidation,
};