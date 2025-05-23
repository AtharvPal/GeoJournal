const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); // this is used to validate the request body
const { v4: uuidv4 } = require("uuid"); // this is a random id generator

const getCoordsForAddress = require("../util/location"); // this is used to get the coordinates of the address

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  console.log("GET places");
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ place }); // { place} => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  }); 
  console.log("GET user");
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ places }); // { place} => { place: place }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  const { title, description, address, creator } = req.body; // this is possible because of the body-parser middleware
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address); // this will return the coordinates of the address
  } catch (error) {
    return next(error)
  }
  const createdPlace = {
    id: uuidv4(),
    creator,
    title,
    description,
    address,
    location: coordinates,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // creates a shallow copy of the object
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
