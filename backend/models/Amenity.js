const mongoose = require('mongoose');

// Amenity Schema
const amenitySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String, 
    },
  });
  
  const Amenity = mongoose.model('Amenity', amenitySchema);

  module.exports = Amenity;

