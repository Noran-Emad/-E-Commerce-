const express = require("express")
const router = express.Router();
const { GetReviews, AddReview, RemoveRating } = require('../Controllers/Review.controller');


router.get('/reviews/:id',GetReviews);

router.post('/reviews/:id',AddReview);

router.delete('/reviews/:id',RemoveRating);


module.exports = router;