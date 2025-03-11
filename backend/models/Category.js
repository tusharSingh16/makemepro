const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: [String],
    required: true,
    default: [],
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = {
    Category,
};
