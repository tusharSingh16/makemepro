const mongoose = require("mongoose");
const { type } = require("os");
const { number } = require("zod");

const listingSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    // maxLength:30,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  priceMode:{
    type: String
  },
  price: {
    type: String,
  },
  mode: {
    type: String,
  },
  location:{
    type: String
  },
  quantity: {
    type: String,
    // required:true,
  },
  classSize:{
    type: String,
  },
  startDate: {
    type: String,
    // required:true,
  },
  endDate: {
    type: String,
  },
  days: {
    type: [String],
    default: [],
    required: true,
    // minLength:1,
  },
  gender: {
    type: String,
    required: true,
    // maxLength:10,
    trim: true,
  },
  startTime: {
    type: String,
    // required:true,
  },
  endTime: {
    type: String,
    // required:true,
  },
  minAge:{
    type: String
  },
  maxAge:{
    type: String
  },
  preRequistes: {
    type: String
  },
  description: {
    type: String,
    required: true,
    minlength: 100
  },
  avgRating:{
    type: Number,
    default: 0,
  },
  
  isApproved: { type: Boolean, default: false },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    ],
});

// Export the model only if it hasn't already been compiled
module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);