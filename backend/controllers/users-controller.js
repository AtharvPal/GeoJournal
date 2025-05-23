const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator"); // this is used to validate the request body
const { v4: uuidv4 } = require("uuid"); // this is a random id generator

let DUMMY_USERS = [
  {
    id: "p1",
    name: "John Doe",
    email: "test@test.com",
    password: "test123",
  },
  {
    id: "p2",
    name: "John Doe 2",
    email: "tes2t@test.com",
    password: "test12322222",
  },
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("Could not identify user, credentials seem to be wrong.", 401);
    }
    res.json({ message: "Logged in!" });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid isign in passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }
  const { name, email, password } = req.body;
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

module.exports = {
  getUsers,
  login,
  signUp,
};
