const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  mainImage: String,
  supportImages: [String],
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("listing", listingSchema);

