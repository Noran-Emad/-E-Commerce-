const joi = require("joi");

let CategoryValidation = (category) => {
  categoryschema = joi.object({
    CategoryName: joi.string().min(3).max(50).required(),
    CategoryImage: joi.string().min(10).max(550).required(),
    CategoryDescription: joi.string().min(10).max(550).required(),
  });

  return categoryschema.validate(category);
};

let CategoryEditValidation = (category) => {
  categoryschema = joi.object({
    CategoryName: joi.string().min(3).max(50),
    CategoryImage: joi.string().min(10).max(550),
    CategoryDescription: joi.string().min(10).max(550)
  });
  
  return categoryschema.validate(category);
};

module.exports = {
  CategoryValidation,
  CategoryEditValidation,
};