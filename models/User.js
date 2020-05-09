// file name in models first letter needs be capitalize

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // allow attach a profile image to the email
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});
//export model User and UserSchema
module.exports = User = mongoose.model("user", UserSchema);
