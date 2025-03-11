const mongoose = require('mongoose');

const registeredMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required:  true,
    minlength: 2,
  },
  age: {
    type: Number,
    required:  true,
    min: 0,
  },
  dob: {
    type: Date,
    required:  true,
  },
  relationship: {
    type: String,
    enum: ['brother', 'child', 'father', 'mother'],
    required:  true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required:  true,
  },
  address: {
    type: String,
    required:  true,
    minlength: 5,
  },
  city: {
    type: String,
    required:  true,
    minlength: 2,
  },
  postalCode: {
    type: String,
    required:  true,
    minlength: 5,
  },
  agreeToTerms: {
    type: Boolean,
    required:  true,
  },
  doctorName: {
    type: String,
    default: '',
  },
  doctorNumber: {
    type: String,
    default: '',
  }
});

const RegisteredMember = mongoose.model('RegisteredMember', registeredMemberSchema);

module.exports = RegisteredMember;