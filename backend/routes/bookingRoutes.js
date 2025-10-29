const express = require("express");
const { createBooking, getBookings, getUserBookings } = require("../controller/bookingController");
const { upload } = require("../utils/imageUpload");

const router = express.Router();

router.post("/", upload.single('image'), createBooking);
router.get("/", getBookings);
router.get("/user/:userId", getUserBookings);

module.exports = router;