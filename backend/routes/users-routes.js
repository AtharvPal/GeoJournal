const express = require("express");
const { check } = require("express-validator");

const { getUsers, signUp, login } = require("../controllers/users-controller");

const router = express.Router();

// the order of the middleware is important

router.get("/", getUsers);

router.post(
  "/signup",
  check("name").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  signUp
);

router.post("/login", login);

module.exports = router;
