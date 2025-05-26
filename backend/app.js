const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

require("dotenv").config();

const dbUser = process.env.MONGODB_USER;
const dbPass = encodeURIComponent(process.env.MONGODB_PASS);
const dbHost = process.env.MONGODB_HOST;
const dbName = process.env.MONGODB_DB;
const appName = process.env.MONGODB_APPNAME;

const app = express();

app.use(bodyParser.json()); // application/json
app.use('/uploads/images', express.static(path.join('uploads', 'images'))); // this will serve the images from the uploads/images folder

app.use((req, res, next) => {
  /// this is a middleware that will be executed for every request
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // allow these methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin, X-Requested-With, Accept"
  ); // allow these headers
  next(); // call the next middleware
});

app.use("/api/places", placesRoutes); /// this enables placeRoutes to be used as middleware
app.use("/api/users", usersRoutes); /// this enables userRoutes to be used as middleware

app.use((req, res, next) => {
  /// this is a middleware that will be executed for every request
  res.status(404).json({ message: "Could not find this route." });
});

app.use((error, req, res, next) => {
  if (req.file) {
    /// if there is a file, delete it
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  }
  /// special error handling middleware
  if (res.headerSent) {
    return next(error);
  }
  return res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=${appName}`
  )
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });
