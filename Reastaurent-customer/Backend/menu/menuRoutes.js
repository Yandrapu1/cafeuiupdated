const express = require("express");
const {
  getCategory,
  getItemsByCategory,
  getItemAddons,
  getPopularItems,
} = require("./menuController");

const router = express.Router();

router.get("/popular", getPopularItems);
router.post("/categories", getCategory);
router.post("/items-by-category", getItemsByCategory);
router.post("/item-addons", getItemAddons);

module.exports = router;
