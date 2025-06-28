const mongoose = require("mongoose");

const staySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,
    price: Number,
    mainImage: String,
    supportImages: [String],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stay", staySchema);
