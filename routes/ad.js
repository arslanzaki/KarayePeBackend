const express = require("express");
const {
  searchFeedAds,
  searchAdsByCategory,
  getAdsByUser,
  addToFavourites,
  removeFromFavourites,
  deleteAd,
  searchAdsByCity,
} = require("../controllers/ad");
const getFeedAds = require("../controllers/ad").getFeedAds;
const router = express.Router();

router.get("/", getFeedAds);
router.get("/adsByUserId/:userId", getAdsByUser);
router.get("/search", searchFeedAds);
router.get("/search/category", searchAdsByCategory);
router.get("/search/city", searchAdsByCity);
router.post("/deleteAd", deleteAd);

module.exports = router;
