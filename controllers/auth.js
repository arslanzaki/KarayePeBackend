const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const dotenv = require("dotenv");

dotenv.config();

// User Registration

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      picturePath,
      isVerified,
      accountType,
      favouriteAds,
      location,
      occupation,
    } = req.body;

    const duplicateUser = await User.findOne({ email }).exec();
    if (duplicateUser) {
      return res.sendStatus(409); // Conflict
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      phoneNumber,
      picturePath,
      isVerified,
      accountType,
      favouriteAds,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User Login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User Does Not Exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setProfilePicture = async (req, res, next) => {
  try {
    const { userId, profilePicture } = req.body;
    // const user = await User.updateOne(userId, {
    //   $set: {
    //     profilePicture: profilePicture
    //   }
    // });

    const user = await User.findOne({ _id: userId }).exec();
    if (profilePicture) {
      user.picturePath = profilePicture;
    }

    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    if (!req?.params?.id) {
      return res.status(400).json({ message: "ID parameter is required!" });
    }
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `No User Matches ID ${req.params.id}` });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
const getAllUsers = async (req, res, next) => {
  //const userId = req.params.id;
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "name",
      "email",
      "picturePath",
      "_id",
    ]);

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const setAccountType = async (req, res) => {
  try {
    const { userId, accountType } = req.body;
    const user = await User.findOne({ _id: userId }).exec();
    user.accountType = accountType;
    const result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
module.exports = {
  register,
  login,
  getAllUsers,
  getUser,
  setProfilePicture,
  setAccountType,
};
