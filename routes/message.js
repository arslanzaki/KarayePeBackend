const express = require("express");
const {
  saveMessageToDB,
  setUserMessages,
  getUserMessages,
  getMessages,
} = require("../controllers/message");

const router = express.Router();

router.post("/saveMessageToDB", saveMessageToDB);
router.post("/getMessages", getMessages);
router.post("/setUserMessages", setUserMessages);
router.post("/getUserMessages", getUserMessages);

module.exports = router;
