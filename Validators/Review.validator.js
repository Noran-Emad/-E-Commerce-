const joi = require("joi");

let AddReviewValidation = (review) => {
  const ReviewSchema = joi.object({
    Title: joi.string().max(400).required(),
    Rating: joi.number().integer().min(1).max(5).required(),
  });
  
  return ReviewSchema.validate(review);
};

module.exports = {
  AddReviewValidation,
};