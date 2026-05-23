const express = require("express");
const { getGalleryImages } = require("./galleryController");

const router = express.Router();

router.get("/", getGalleryImages);

module.exports = router;
