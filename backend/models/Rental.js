const mongoose = require('mongoose');

// Rental Schema
const rentalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    availability: {
      days: [
        {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          required: true,
        },
      ],
    },
    timeSlots: [
      {
        start: { type: String, required: true }, 
        end: { type: String, required: true },
      },
    ],
    images: [
      {
        url: { type: String, required: true }, 
        description: { type: String }, 
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    pricing: {
      dailyRate: { type: Number, required: true }, 
      hourlyRate: { type: Number, required: true },
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    category: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    amenities: [{ type: String, required: true }],
  },
  { timestamps: true } 
);

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;


