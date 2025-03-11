const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const { User } = require("../models/user");
const Trainer = require("../models/Trainer");


async function searchEmail(req, res, next) {

  try {
      const userId = req.userId;
      const user = await User.findById(userId);

      if (user) {
        req.email = user.email;
        next();
      } else {
        return res.status(403).json({
          message: "invalid user",
        });
      }
  } catch (error) {
    return res.status(403).json({
      message: "Error in searchEmail",
      error: error.message,
    });
  }
}

module.exports = {
    searchEmail
};
