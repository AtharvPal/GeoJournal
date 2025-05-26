const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload"); // this is used to upload files

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");

const router = express.Router();

// the order of the middleware is important

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  createPlace
); // chaining of middleware, from left to right

router.patch(
  "/:pid",
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  updatePlace
);

router.delete("/:pid", deletePlace);

module.exports = router;
