const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  password: String,
  role: { type: String, default: "user" },
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Auto-delete after 1 hour
  otpAttempts: { type: Number, default: 0 },
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = PendingUser;
