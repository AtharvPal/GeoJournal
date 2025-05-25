const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  imageUrl: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Places" }], // this is a reference to the Place model, so we can populate the places field with the actual Place documents
});

module.exports = mongoose.model("Users", userSchema); // this will create a collection called "places" in the database
