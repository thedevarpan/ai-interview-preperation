const express = require("express");
const { handleChat } = require("../controllers/aiChatController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/",handleChat);

module.exports = router;
