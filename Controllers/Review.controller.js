const express = require("express");
const app = express();
app.use(express.json());

const ProductCollection = require("../Models/Product.model.js");
const ReviewCollection = require("../Models/Review.model");
const { AddReviewValidation } = require("../Validators/Review.validator.js");
const { getUserfromJWT, isidValid, getUserfromJWTDefult,} = require("../Services/validator.service.js");




/* get all reviews of a product */
  let GetReviews = async (req, res) => {
    
    
    /* check product id is valid and is exist */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");
    let product = await ProductCollection.findById(req.params.id).exec();
    if (!product)  return res.status(404).send("There is no product with this id");
    
    let reviews = await ReviewCollection.find({ Product: product._id }).populate("User", "name email").skip((+req.query.page -1) * 2).limit(2);;

    let user = await getUserfromJWTDefult(req.headers.jwt);
    let UserReviewexiest = null;
    if(user) UserReviewexiest = await ReviewCollection.find({Product:product._id , User:user._id}).exec();
    

    let totalPages =Math.ceil(await ReviewCollection.find({ Product: product._id }).countDocuments()/2);

    res.status(200).send({reviews,UserReviewexiest,totalPages})
  };


/* create Review */
let AddReview = async (req, res) => {
  let { error, value } = AddReviewValidation(req.body);
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
      let updatedreview = await ReviewCollection.findOneAndUpdate(isReviewExist,{ Title: value.Title,Rating:value.Rating },{ new: true });
      return res.send(updatedreview);
    } else {
      /* if not create a new review with that title */
      let createdReview = await ReviewCollection.create({User: user._id, Product: req.params.id, Title: value.Title, Rating: value.Rating });
      return res.send(createdReview);
    }
  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};


/* delete Rating */
let RemoveRating = async (req, res) => {
  try {
    /* get the user from jwt header and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if (!user) return;

    /* check product id is valid and is exist */
    if (!isidValid(req.params.id)) return res.status(400).send("product id is invalid");
    let product = await ProductCollection.findById(req.params.id).exec();
    if (!product)  return res.status(404).send("There is no product with this id");
    
    let isReviewExist = await ReviewCollection.findOne({ User: user._id, Product: product._id}).exec();
    
    /* check if the review exist with this product and this user */
    if (!isReviewExist) return;
     
    await ReviewCollection.findOneAndDelete({ User: user._id, Product: product._id });
    return res.send();
   
  } catch (err) {
    res.status(400).send('sorry something went wrong');
  }
};




module.exports = {
  GetReviews,
  AddReview,
  RemoveRating
};