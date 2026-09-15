const express = require("express");
const router = express.Router();

const categoryModel = require("../models/categoryModel");
const itemModel = require("../models/itemModel");

router.get("/", async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    const items = await itemModel.getAllItems();

    res.render("index", {
      title: "Inventory Dashboard",
      categories,
      items,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
