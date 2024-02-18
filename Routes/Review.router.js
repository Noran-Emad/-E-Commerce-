const express = require("express")
const router = express.Router();
const { GetReviews, AddReview, AddRating } = require('../Controllers/Review.controller');


router.get('/reviews/:id',GetReviews);

router.post('/reviews/:id',AddReview);

router.post('/ratings/:id',AddRating);


module.exports = router;