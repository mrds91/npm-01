const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: {type: String, required: true },
  lastName: {type: String, required: true },
  email: {type: String, required: true },
  phone: {type: String, required: true },
  password: {type: String, required: true },
  role: {type: Number, required: true , default: 0 }
});

const User = mongoose.model("Users", UserSchema);
module.exports = User;
