const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

// the order of the middleware is important

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  console.log("GET places");
  if (!place) {
    return next(new HttpError("Could not find a place for the provided id.", 404)); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ place });  // { place} => { place: place }
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  console.log("GET user");
  if (!user) {
    return next(new HttpError("Could not find a user for the provided id.", 404)); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ user });  // { place} => { place: place }
});

module.exports = router