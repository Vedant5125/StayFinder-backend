const express = require("express");
const router = express.Router();
const Stay = require("../model/Stay");
const Listing = require("../model/listing");
const authenticateToken = require("../middleware/authMiddleware");

//Route to create a Stay (maybe deprecated)
router.post("/stay", authenticateToken, async (req, res) => {
  console.log("Received stay data:", req.body);
  try {
    const {
      title,
      description,
      location,
      price,
      mainImage,
      supportImages
    } = req.body;

    const newStay = new Stay({
      title,
      description,
      location,
      price,
      mainImage,
      supportImages,
      host: req.user.id
    });

    await newStay.save();
    res.json({ message: "Stay created successfully", stay: newStay });
  } catch (err) {
    res.status(500).json({ error: "Failed to create stay" });
  }
});

//Route to create a Listing (authenticated)
router.post("/listing", authenticateToken, async (req, res) => {
  try {
    const { title, description, location, price, mainImage } = req.body;

    const listing = new Listing({
      title,
      description,
      location,
      price,
      mainImage,
      hostId: req.user.id
    });

    await listing.save();
    res.status(201).json({ message: "Listing created", listing });
  } catch (err) {
    console.error("Error adding listing:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Public route to get all listings (for homepage)
router.get("/listing", async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.json(allListings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/listing/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error fetching listing" });
  }
});

router.get("/my-stays", authenticateToken, async (req, res) => {
  try {
    const stays = await Stay.find({ host: req.user.id });
    res.json(stays);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stays" });
  }
});

//Delete stay
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const stay = await Stay.findOneAndDelete({
      _id: req.params.id,
      host: req.user.id
    });
    if (!stay) {
      return res.status(404).json({ error: "Stay not found or unauthorized" });
    }
    await Listing.findOneAndDelete({ title: stay.title, hostId: req.user.id });
    res.json({ message: "Stay deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete stay" });
  }
});

module.exports = router;
