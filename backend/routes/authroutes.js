const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controller/authcontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);

module.exports = router;
