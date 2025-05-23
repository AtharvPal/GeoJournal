require("dotenv").config();
const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

const getCoordsForAddress = async (address) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not find location for the specified address.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "ZERO_RESULTS") {
        throw new HttpError("Could not find location for the specified address.", 422);
      }
      console.log(data);
      const coordinates = data.results[0].geometry.location;
      return {
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
    });
};

module.exports = getCoordsForAddress;
