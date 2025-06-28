const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const authRoutes = require("./routes/auth");
const stayRoutes = require("./routes/stayroutes");
const listings = require("./routes/listings");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/listings", listings);
app.use("/api", authRoutes);
app.use("/api/stays", stayRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT, ()=>console.log(`Server running on port ${process.env.PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));
