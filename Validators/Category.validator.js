const joi = require("joi");

let CategoryValidation = (Category) => {
  Categoryschema = joi.object({
    CategoryName: joi.string().min(3).required(),
    CategoryDescription: joi.string().min(10).required()
  });
  return Categoryschema.validate(Category);
};

let CategoryEditValidation = (Category) => {
  Categoryschema = joi.object({
    CategoryName: joi.string().min(3),
    CategoryDescription: joi.string().min(10)
  });
  return Categoryschema.validate(Category);
};

module.exports = {
  CategoryValidation,
  CategoryEditValidation,
};
