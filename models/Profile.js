const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  intro: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: null
  },
  sex: {
    type: String,
    enum: ["male", "female"]
  },
  pics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture"
    }
  ],
  occupation: {
    type: String,
    default: ""
  },
  drink: {
    type: String,
    enum: ["yes", "socially", "never"]
  },
  smoke: {
    type: String,
    enum: ["yes", "socially", "never"]
  },
  marijuana: {
    type: String,
    enum: ["friendly", "unfriendly"]
  },
  kids: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Profile", ProfileSchema);
