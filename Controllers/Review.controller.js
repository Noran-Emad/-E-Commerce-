const express = require("express");
const app = express();
app.use(express.json());

const ProductCollection = require("../Models/Product.model.js");
const ReviewCollection = require("../Models/Review.model");
const { VAddReview, VAddRating } = require("../Validators/Review.validator.js");
const { getUserfromJWT, isidValid,} = require("../Services/validator.service.js");




/* get all reviews of a product */
let GetReviews = async (req, res) => {
  
  /* check product id is valid and is exist */
  if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");
  let product = await ProductCollection.findById(req.params.id).exec();
  if (!product)  return res.status(404).send("There is no product with this id");
  
  let Reviews = await ReviewCollection.find({Product: product._id}).exec();
  res.status(200).send(Reviews)
};


/* create Review */
let AddReview = async (req, res) => {
  let { error, value } = VAddReview(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    /* get the user from jwt header and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;

    /* check product id is valid and is exist */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");
    let product = await ProductCollection.findById(req.params.id).exec();
    if (!product)  return res.status(404).send("There is no product with this id");
    
    let isReviewExist = await ReviewCollection.findOne({ User: user._id, Product: product._id}).exec();
    
    /* check if the review exist with this product and this user add the review title to it */
    if (isReviewExist) {
      let updatedreview = await ReviewCollection.findOneAndUpdate(isReviewExist,{ Title: value.Title },{ new: true });
      return res.send(updatedreview);
    } else {
      /* if not create a new review with that title */
      let createdReview = await ReviewCollection.create({User: user._id, Product: req.params.id, Title: value.Title });
      return res.send(createdReview);
    }
  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};



/* create Rating */
let AddRating = async (req, res) => {
  let { error, value } = VAddRating(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    /* get the user from jwt header and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;

    /* check product id is valid and is exist */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");
    let product = await ProductCollection.findById(req.params.id).exec();
    if (!product)  return res.status(404).send("There is no product with this id");
    
    let isReviewExist = await ReviewCollection.findOne({ User: user._id, Product: product._id}).exec();
    
    /* check if the review exist with this product and this user add the review title to it */
    if (isReviewExist) {
      let updatedreview = await ReviewCollection.findOneAndUpdate(isReviewExist,{ Rating: value.Rating },{ new: true });
      return res.send(updatedreview);
    } else {
      /* if not create a new review with that Rating */
      let createdReview = await ReviewCollection.create({User: user._id, Product: req.params.id, Rating: value.Rating });
      return res.send(createdReview);
    }
  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};



module.exports = {
  GetReviews,
  AddReview,
  AddRating,
};