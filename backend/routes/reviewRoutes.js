const express=require("express");
const {writeReview ,getReview} = require("../controllers/reviewController")
const reviewRoutes=express.Router();

// review routes
reviewRoutes.post('/reviews',writeReview);
reviewRoutes.get('/reviews/:listingId', getReview);

module.exports =reviewRoutes;