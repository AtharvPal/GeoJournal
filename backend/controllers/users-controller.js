const HttpError = require("../models/http-error");
const User = require("../models/user"); // this is the mongoose model for the user
const { validationResult } = require("express-validator"); // this is used to validate the request body

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
  if (!existingUser || existingUser.password !== password) {
    throw new HttpError("Wrong credentails. Please try again checking", 401);
  }
  res.json({ message: "Logged in!" });
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

  const createdUser = new User({
    name,
    email,
    password,
    imageUrl: "sdffs",
    places: [],
  });

  try {
    await createdUser.save(); // this will save the user to the database
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later." + err, 500)
    );
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) }); // this will return the created user
};

module.exports = {
  getUsers,
  login,
  signUp,
};
