const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const { User } = require("../models/user");
const Trainer = require("../models/Trainer");

function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  
  // Check if the token exists
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    console.log("No token provided or incorrect format");
    return res.status(403).json({
      message: "No token provided or incorrect format",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded && decoded.userId) {
      // Attach the userId to the request object
      req.userId = decoded.userId;
      next();
    } else {
        console.log("Invalid token payload: ", decoded);
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: "Error in authentication middleware",
      error: error.message,
    });
  }
}

async function trainerAuthMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      message: "No token provided or incorrect format",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded && decoded.userId) {
      const trainerId = decoded.userId;

      // Find user and trainer
      const user = await User.findById(trainerId);
      const trainer = await Trainer.findById(trainerId);

      // Check if user is a trainer and if the trainer is approved
      if (user && user.role === "trainer" && trainer && trainer.isApproved === true) {
        req.trainerId = trainerId;  // Attach trainerId to request
        next();
      } else {
        return res.status(403).json({
          message: "You need to be an approved trainer",
        });
      }
    } else {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: "Error in trainer authentication middleware",
      error: error.message,
    });
  }
}

module.exports = {
  authMiddleware,
  trainerAuthMiddleware,
};
