const express = require("express");
const bodyParser = require("body-parser");

const {
  getUsers,
  signUp,
  login,
} = require("../controllers/users-controller");

const router = express.Router();

// the order of the middleware is important

router.get("/", getUsers);

router.post("/signup", signUp);

router.post('/login', login);

module.exports = router;
