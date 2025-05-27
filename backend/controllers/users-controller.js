const HttpError = require("../models/http-error");
const User = require("../models/user"); // this is the mongoose model for the user
const { validationResult } = require("express-validator"); // this is used to validate the request body
const bcrypt = require("bcrypt"); // this is used to hash the password
const jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtKey = process.env.JWT_KEY;

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, { password: 0 }); // this will find all the users and exclude the password field
    console.log(users);
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later." + err, 500)
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) }); // this will return the users in the response
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); // this will find the user with the email
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later." + err, 500)
    );
  }
  if (!existingUser) {
    throw new HttpError("Wrong credentails. Please try again checking", 401);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password); // this will compare the password with the hashed password
  } catch (err) {
    return next(
      new HttpError("Could not log you in, please check your credentials.", 500)
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Wrong credentails. Please try again checking", 401)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      jwtKey,
      { expiresIn: "1h" }
    ); // this will create a token for the user
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later." + err, 500)
    );
  }

  res.json({ message: "Logged in!", userId: existingUser.id, email: existingUser.email, token}); // this will return the user in the response
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req); // this will check if the request body is valid
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid isign in passed, please check your data.", 422)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); // this will find the user with the email
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 500)
    ); // this will skip all the other middleware and go to the error handling middleware
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); // this will hash the password
  } catch (err) {
    return next(
      new HttpError("Could not create user, please try again." + err, 500)
    );
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword, // this will save the hashed password to the database
    imageUrl: req.file.path,
    places: [],
  });

  try {
    await createdUser.save(); // this will save the user to the database
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later." + err, 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      jwtKey,
      { expiresIn: "1h" }
    ); // this will create a token for the user
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later." + err, 500)
    );
  }
  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token}); // this will return the created user
};

module.exports = {
  getUsers,
  login,
  signUp,
};
