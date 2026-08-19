const express = require("express");

const {
  getHeroBanners,
} = require("../controllers/heroBannerController");

const router = express.Router();

router.get("/", getHeroBanners);

module.exports = router;