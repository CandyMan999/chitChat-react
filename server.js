const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.use(
//   multer({
//     dest: "./uploads/",
//     rename: function(fieldname, filename) {
//       return filename;
//     }
//   })
// );
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
//app.use(routes);
//this is middleware for handling photo uploads

// post route for our photo
app.post("/api/photo", function(req, res) {
  const newItem = new Picture();
  newItem.img.data = fs.readFileSync(req.files.userPhoto.path);
  newItem.img.contentType = "image/png";
  newItem.save();
});

app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chitchat");

//api routes
const apiRoutes = require("./routes/apiRoutes.js");
app.use(apiRoutes);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
