const express = require("express");
const zod = require("zod");
const { SearchAlert } = require("../models/SearchAlert");
const {Listing} = require("../models/Listing")
const { authMiddleware } = require("../middleware/authMiddleware");
const {searchEmail} = require("../middleware/searchEmail");
const searchAlertRouter = express.Router();

const Schema = zod.object({
  // userId: zod.string(),
  category: zod.string().optional(),
  minPrice: zod.string().optional(),
  maxPrice: zod.string().optional(),
  mode: zod.string().optional(),
  location: zod.string().optional(),
  gender: zod.string().optional(),
  startTime: zod.string().optional(),
  endTime: zod.string().optional(),
  minAge: zod.string().optional(),
  maxAge: zod.string().optional(),
});
searchAlertRouter.post("/",authMiddleware,searchEmail, async function (req, res) {
  const inputData = req.body
  
  const result = Schema.safeParse(inputData);

  if (!result.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
      result,
    });
  }

  try {
    const isUnique = await SearchAlert.findOne({...inputData, userId: req.userId });
    if (isUnique) {
      return res.status(411).json({
        message: "Similar searchAlert found ",
      });
    }

    const result = await SearchAlert.create({...inputData, userId: req.userId ,email: req.email });
    res.status(200).json({
      message: "searchAlert created successfully",
      searchAlert:result
    });
  } catch (error) {
    res.status(411).json({
      message: " Incorrect searchAlert input",
      error,
    });
  }
});

searchAlertRouter.get("/",authMiddleware, async function (req, res) {
  try {
    const data= await SearchAlert.find({ userId:req.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = searchAlertRouter;
