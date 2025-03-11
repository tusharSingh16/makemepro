const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email:{
    type: String,
  },
  category: {
    type: String,
    // required: true,
    trim: true,
  },
//   title: {
//     type: String,
//     required: true,
//     // maxLength:30,
//   },
//   priceMode:{
//     type: String
//   },
  minPrice: {
    type: String,
  },
  maxPrice: {
    type: String,
  },
  mode: {
    type: String,
  },
  location:{
    type: String
  },
//   quantity: {
//     type: String,
//     // required:true,
//   },
//   classSize:{
//     type: String,
//   },
//   startDate: {
//     type: String,
//     // required:true,
//   },
//   endDate: {
//     type: String,
//   },
//   days: {
//     type: [String],
//     default: [],
//     required: true,
//     // minLength:1,
//   },
  gender: {
    type: String,
    // required: true,
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
//   preRequistes: {
//     type: String
//   },
//   description: {
//     type: String,
//     required: true,
//     minlength: 100
//   },
//   isApproved: { type: Boolean, default: false },
});

const SearchAlert = mongoose.model("SearchAlert", listingSchema);

module.exports = {
    SearchAlert,
};
