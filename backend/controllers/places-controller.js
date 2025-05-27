const HttpError = require("../models/http-error");
const fs = require("fs");
const { validationResult } = require("express-validator"); // this is used to validate the request body
const mongoose = require("mongoose");

const getCoordsForAddress = require("../util/location"); // this is used to get the coordinates of the address
const Place = require("../models/place"); // this is the mongoose model for the place
const User = require("../models/user"); // this is the mongoose model for the user
const place = require("../models/place");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ place: place.toObject({ getters: true }) }); // { place} => { place: place }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId }); // this will find all the places for the userId
    console.log("places: " + places);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Could not find places for the provided user: ." + err, 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  res.json({ places: places.map((p) => p.toObject({ getters: true })) }); // { place} => { place: place }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  const { title, description, address } = req.body; // this is possible because of the body-parser middleware
  let coordinates = { lat: 0, lng: 0 }; // dummy coordinates
  // try {
  //   coordinates = await getCoordsForAddress(address); // this will return the coordinates of the address
  // } catch (error) {
  //   return next(new HttpError("Could not convert coords.", 500));
  // }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return next(
      new HttpError("Could not find user for the provided id." + err, 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    imageUrl: req.file.path,
    creator: req.userData.userId, // this is the userId of the creator
  });

  try {
    const sess = await mongoose.startSession(); // this will start a session for the transaction
    sess.startTransaction(); // this will start the transaction
    user.places.push(createdPlace); // this will add the place to the user's places array
    await user.save({ session: sess }); // this will save the user with the session
    await createdPlace.save({ session: sess }); // this will save the place with the session
    await sess.commitTransaction(); // this will commit the transaction
  } catch (err) {
    return next(
      new HttpError("Creating place failed, please try again." + err, 500)
    );
  }

  return res.status(201).json({
    place: createdPlace,
  }); // this will return the created place
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }
  if (!updatedPlace) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  if (place.creater.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 403)); // this will skip all the other middleware and go to the error handling middleware
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save(); // this will save the updated place to the database
  } catch (err) {
    return next(new HttpError("Updating place failed, please try again.", 500));
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) }); // this will return the updated place
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  if (place.creater.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this place.", 403)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  try {
    const sess = await mongoose.startSession(); // this will start a session for the transaction
    sess.startTransaction(); // this will start the transaction
    await place.deleteOne({ session: sess }); // this will remove the place from the database
    place.creator.places.pull(place); // this will remove the place from the user's places array
    await place.creator.save({ session: sess }); // this will save the user with the session
    await sess.commitTransaction(); // this will commit the transaction
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place." + err, 500)
    );
  }

  fs.unlink(place.imageUrl, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });

  res.status(200).json({ message: "Deleted place." });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
