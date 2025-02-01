const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  salt: String,
  hash: String,
  token: String,
  saved: { comics: Array, characters: Array },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
