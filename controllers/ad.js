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

const getAdsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const ads = await Ad.find({ userId: userId });
    res.status(200).json(ads);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

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
    const filteredAds = await Ad.find({ category: filters });
    res.status(200).json(filteredAds);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const addToFavourites = async (req, res) => {
  try {
    const { userId, adId } = req.body;

    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return res.status(204).json({ message: `No User Matches ID ${userId}` });
    }
    const ad = await Ad.findOne({ _id: adId }).exec();
    if (!ad) {
      return res.status(204).json({ message: `No User Matches ID ${adId}` });
    }
    user.favouriteAds.push(ad);
    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const removeFromFavourites = async (req, res) => {
  try {
    const { userId, adId } = req.body;

    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return res.status(204).json({ message: `No User Matches ID ${userId}` });
    }
    const ad = await Ad.findOne({ _id: adId }).exec();
    if (!ad) {
      return res.status(204).json({ message: `No User Matches ID ${adId}` });
    }
    user.favouriteAds = user.favouriteAds.filter((item) => {
      return item !== ad;
    });
    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const checkFavouriteAds = (req,res) => {

  
}

module.exports = {
  createAd,
  getFeedAds,
  searchFeedAds,
  searchAdsByCategory,
  getAdsByUser,
  addToFavourites,
  removeFromFavourites,
};
