const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const Listing = require("../model/listing");

//Create listing
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      mainImage,
      supportImages,
      guests 
    } = req.body;

    const listing = await Listing.create({
      title,
      description,
      location,
      price,
      mainImage,
      supportImages,
      hostId: req.user.id,
      guests
    });

    res.status(201).json({ message: "Listing created", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating listing" });
  }
});

//Filtered get listings
router.get("/", async (req, res) => {
  try {
    console.log("Filters received:", req.query);

    const { location, guests } = req.query;

    const filter = {};

    if (location?.trim()) {
      filter.location = { $regex: location.trim(), $options: "i" };
    }

    if (guests && !isNaN(parseInt(guests))) {
      filter.guests = { $gte: parseInt(guests) };
    }

    console.log("Final filter used:", filter);

    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Server error while fetching listings" });
  }
});

module.exports = router;
