const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    default: null
  },
  lng: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model("Location", LocationSchema);
