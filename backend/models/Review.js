const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  review: String,
  rating: Number,
  date: { type: Date, default: Date.now },
});

// Export the model only if it hasn't already been compiled
module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
