const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  pics: { url: String }
});

module.exports = mongoose.model("Picture", PictureSchema);
