const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model("Picture", PictureSchema);
