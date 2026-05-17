const express = require("express");
const { getRestaurantSettings } = require("./restaurantController");

const router = express.Router();

router.get("/settings", getRestaurantSettings);

module.exports = router;
