const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Experience Details (from card)
    experienceId: {
      type: Number,
      required: [true, "Experience ID is required"]
    },
    experienceTitle: {
      type: String,
      required: [true, "Experience title is required"]
    },
    experiencePrice: {
      type: Number,
      required: [true, "Experience price is required"]
    },
    experienceCategory: {
      type: String,
      required: [true, "Experience category is required"]
    },

    // Optional descriptive fields
    duration: { type: String },
    description: { type: String },
    included: [{ type: String }],

    // Booking Details
    selectedDate: {
      type: String,
      required: [true, "Selected date is required"]
    },
    selectedSlot: {
      type: String,
      required: [true, "Selected time slot is required"]
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },

    // Document/Image
    documentUrl: {
      type: String,
      default: null
    },
    imagePath: {
      type: String,
      default: null
    },

    // Customer Details
    customerName: {
      type: String,
      required: [true, "Customer name is required"]
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"]
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },

    // Payment Details
    basePrice: {
      type: Number,
      required: [true, "Base price is required"]
    },
    finalPrice: {
      type: Number,
      required: [true, "Final price is required"]
    },
    discountApplied: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;