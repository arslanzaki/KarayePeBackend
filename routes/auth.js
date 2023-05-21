const express = require("express");
const { getAllUsers, getUser } = require("./../controllers/auth");
const register = require("./../controllers/auth").register;
const login = require("./../controllers/auth").login;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:id", getAllUsers);
router.get("/user/:id", getUser)

module.exports = router;
