const express = require("express");
const zod = require("zod");
const { Category } = require("../models/Category");
const categoryRouter = express.Router();

const postCategorySchema = zod.object({
  category: zod.string(),
  subCategory: zod.array(zod.string()),
});
categoryRouter.post("/add-category", async function (req, res) {
  const inputData = {
    category: req.body.category,
    subCategory: req.body.subCategory,
  };
  const result = postCategorySchema.safeParse(inputData);

  if (!result.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
      result,
    });
  }

  try {
    const isUniqueCategory = await Category.findOne({
      category: inputData.category,
    });
    if (isUniqueCategory) {
      return res.status(411).json({
        message: "Similar category found ",
      });
    }

    const category = await Category.create(inputData);
    res.status(200).json({
      message: "category created successfully",
      category: category.category,
      subCategory: category.subCategory,
    });
  } catch (error) {
    res.status(411).json({
      message: " Incorrect category input",
      error,
    });
  }
});

categoryRouter.patch(
  "/:categoryName/add-subcategory",
  async function (req, res) {
    try {
      const { categoryName } = req.params; 
      const { subCategory } = req.body; 

      const updatedCategory = await Category.findOneAndUpdate(
        { category: categoryName },
        { $push: { subCategory } }, 
        { new: true } 
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
categoryRouter.get("/", async function (req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
categoryRouter.get("/:categoryName", async function (req, res) {
  try {
    const { categoryName } = req.params; 
    const categories = await Category.find({category:categoryName});
    res.status(200).json(categories[0].subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = categoryRouter;
