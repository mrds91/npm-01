const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  refreshToken:{
    type: String,
    required: true
  },
  accessToken:{
    type:String,
    required: true
  },
  username:{
    type:String,
    required:true
  }
})

const Tokens = mongoose.model("Token", TokenSchema);

module.exports = Tokens