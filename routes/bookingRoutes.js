const express = require("express");
const router = express.Router();
const Booking = require("../model/Booking");
const Listing = require("../model/listing");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const checkInDate = new Date(checkIn + "T00:00:00");
    const checkOutDate = new Date(checkOut + "T00:00:00");
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    const totalPrice = listing.price * nights;

    const newBooking = new Booking({
      userId: req.user.id,
      listingId,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});


// Get bookings of logged-in user So we can show listing details
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});




module.exports = router;
