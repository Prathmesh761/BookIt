const Booking = require("../models/Booking");
const { sendBookingConfirmation } = require("../utils/emailService");
const path = require("path");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    // Extract all possible fields from request body
    const {
      // Experience details
      experienceId,
      experienceTitle,
      experiencePrice,
      experienceCategory,
      duration,
      description,
      included,

      // Booking details
      selectedDate,
      selectedSlot,
      documentUrl,
      bookingStatus,

      // Customer details
      customerName,
      customerEmail,
      customerPhone,
      userId,

      // Payment details
      finalPrice,
      discountApplied
    } = req.body;

    // Validate core required fields (document upload is optional)
    if (!experienceId || !experienceTitle || !experiencePrice || !experienceCategory ||
        !selectedDate || !selectedSlot ||
        !customerEmail || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking information"
      });
    }

    // Get image path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create the booking with all available data
    const booking = await Booking.create({
      // Experience details
      experienceId: Number(experienceId),
      experienceTitle,
      experiencePrice: Number(experiencePrice),
      experienceCategory,
      duration,
      description,
      included: Array.isArray(included) ? included : [],

      // Booking details
      selectedDate,
      selectedSlot,
      bookingStatus: bookingStatus || 'pending',
      
      // Document/Image handling
      documentUrl,
      imagePath: imagePath || documentUrl,

      // Customer details
      customerName,
      customerEmail,
      customerPhone,
      userId,

      // Payment details
      basePrice: Number(experiencePrice),
      finalPrice: Number(finalPrice || experiencePrice),
      discountApplied: discountApplied || null
    });
    
    // Send confirmation email
    await sendBookingConfirmation(booking);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get bookings by user ID
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};