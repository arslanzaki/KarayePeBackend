const { query } = require("express");
const Ad = require("./../models/Ad");
const User = require("./../models/User");

const createAd = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      adPicturePath,
      category,
      itemRent,
      rentDuration,
      securityRequirement,
    } = req.body;

    const user = await User.findById(userId);
    const newAd = new Ad({
      userId,
      name: user.name,
      userPicturePath: user.picturePath,
      title,
      description,
      adPicturePath,
      category,
      itemRent,
      rentDuration,
      securityRequirement,
    });

    await newAd.save();

    const ad = await Ad.find();
    res.status(201).json(ad);
    console.log(res);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ

const getFeedAds = async (req, res) => {
  try {
    const ad = await Ad.find();
    res.status(200).json(ad);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAdsByUser = async(req,res) => {
  const userId = req.query;
  try{
    const ads = await Ad.find(userId);
    res.status(200).json(ads)

  } catch(err){
    res.status(404).json({message: err.message})
  }
}

const searchFeedAds = async (req, res) => {
  try {
    const filters = req.query.search;
    const filteredAds = await Ad.find({ $text: { $search: filters } });
    res.status(200).json(filteredAds);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const searchAdsByCategory = async (req, res) => {
  try {
    const filters = req.query.search;
    const filteredAds = await Ad.find({category: filters});
    res.status(200).json(filteredAds);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
module.exports = { createAd, getFeedAds, searchFeedAds, searchAdsByCategory, getAdsByUser };
