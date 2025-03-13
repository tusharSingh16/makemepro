const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  password: String,
  role: { type: String, default: "user" },
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = PendingUser;
