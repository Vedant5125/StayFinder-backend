// seed.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./model/user");
const Listing = require("./model/listing");
const Booking = require("./model/Booking");
const Stay = require("./model/Stay");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/stayfinder";

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Clear old data
    await User.deleteMany();
    await Listing.deleteMany();
    await Booking.deleteMany();
    await Stay.deleteMany();

    console.log("Old data cleared");

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const host = new User({
      name: "John Host",
      email: "host@example.com",
      password: hashedPassword,
      role: "host",
    });

    const user = new User({
      name: "Jane User",
      email: "user@example.com",
      password: hashedPassword,
      role: "user",
    });

    await host.save();
    await user.save();
    console.log("Sample users created");

    // Create sample listings
    const listings = await Listing.insertMany([
      {
        title: "Cozy Mountain Cabin",
        location: "Manali",
        price: 1500,
        description: "Enjoy nature in this peaceful mountain retreat.",
        mainImage: "https://placehold.co/600x400?text=Cabin",
        supportImages: [
          "https://placehold.co/200x150?text=Interior",
          "https://placehold.co/200x150?text=View",
        ],
        hostId: host._id,
      },
      {
        title: "Seaside Villa",
        location: "Goa",
        price: 2500,
        description: "Walk to the beach from this stunning villa.",
        mainImage: "https://placehold.co/600x400?text=Villa",
        supportImages: [
          "https://placehold.co/200x150?text=Pool",
          "https://placehold.co/200x150?text=Beach",
        ],
        hostId: host._id,
      },
    ]);

    console.log("Sample listings created");

    const stays = await Stay.insertMany([
      {
        title: "Cozy Mountain Cabin",
        description: "Enjoy nature in this peaceful mountain retreat.",
        location: "Manali",
        price: 1500,
        mainImage: "https://placehold.co/600x400?text=Cabin",
        supportImages: [
          "https://placehold.co/200x150?text=Interior",
          "https://placehold.co/200x150?text=View",
        ],
        host: host._id,
      },
      {
        title: "Seaside Villa",
        description: "Walk to the beach from this stunning villa.",
        location: "Goa",
        price: 2500,
        mainImage: "https://placehold.co/600x400?text=Villa",
        supportImages: [
          "https://placehold.co/200x150?text=Pool",
          "https://placehold.co/200x150?text=Beach",
        ],
        host: host._id,
      },
    ]);

    console.log("Sample stays created");

    // Create a sample booking
    const booking = new Booking({
      listingId: listings[0]._id,
      userId: user._id,
      checkIn: "2025-07-01",
      checkOut: "2025-07-05",
      guests: 2,
      totalPrice: 1500 * 4, // 4 nights * ₹1500
    });

    await booking.save();
    console.log("Sample booking created");

    console.log("Seeding complete! Use the credentials below:");
    console.log("Host: host@example.com / password123");
    console.log("User: user@example.com / password123");

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

runSeeder();
