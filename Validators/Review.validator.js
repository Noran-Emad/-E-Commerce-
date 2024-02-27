const joi = require("joi");

let VAddReview = (review) => {
  const ReviewSchema = joi.object({
    Title: joi.string().min(3).max(400).required(),
  });

 return ReviewSchema.validate(review);
};

let VAddRating = (rate) => {
  const RatingSchema = joi.object({
    Rating: joi.number().integer().min(1).max(5).required(),
  });

 return RatingSchema.validate(rate);
};

module.exports = {
  VAddReview,
  VAddRating
};