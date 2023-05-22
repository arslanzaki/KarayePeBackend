const express = require("express");
const {
  searchFeedAds,
  searchAdsByCategory,
  getAdsByUser,
  addToFavourites,
  removeFromFavourites,
} = require("../controllers/ad");
const getFeedAds = require("../controllers/ad").getFeedAds;
const router = express.Router();

router.get("/", getFeedAds);
router.get("/adsByUserId/:userId", getAdsByUser);
router.get("/search", searchFeedAds);
router.get("/search/category", searchAdsByCategory);
router.patch("/addFavouriteAds", addToFavourites);
router.patch("/removeFavouriteAds", removeFromFavourites);

module.exports = router;
