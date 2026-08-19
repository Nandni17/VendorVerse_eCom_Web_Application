const HeroBanner = require("../models/heroBanner");

// GET active hero banners
exports.getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find({
      active: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json(banners);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};