const express = require("express");
const { searchFeedAds, searchAdsByCategory, getAdsByUser } = require("../controllers/ad");
const getFeedAds = require("../controllers/ad").getFeedAds;
const router = express.Router();

router.get("/", getFeedAds);
router.get("/adsByUserId", getAdsByUser)
router.get("/search", searchFeedAds)
router.get("/search/category", searchAdsByCategory)

module.exports = router;
