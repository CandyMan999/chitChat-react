const db = require("../models");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const Chatkit = require("pusher-chatkit-server");
const jwt = require("jsonwebtoken");
const SECRET = "shhhh";
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const fs = require("fs");
require("dotenv").config();

const chatkit = new Chatkit.default({
  instanceLocator: process.env.INSTANCE_LOCATOR,
  key: process.env.CHATKIT_KEY
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "aolisback",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 281, crop: "scale" }]
});
const parser = multer({ storage: storage });

const tokenAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1]; //TODO check for bearer keyword
  console.log(`!!${token}!!`);
  return jwt.verify(token, SECRET, (err, decoded) => {
    if (err || !decoded) return res.status(401).json(err);

    return db.User.findById(decoded.id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => res.status(401).json(err));
  });
};

router.post("/api/users/:id/image", parser.single("image"), (req, res) => {
  console.log("!!!!!!!!!", req.file);
  // const foo = fs.readFile(req.file.buffer);
  // cloudinary.v2.uploader.upload(foo, {}, () => console.log("anything"));

  const image = {
    pics: { url: req.file.url }
  };

  console.log("this is what I am trying to store: ", image);

  db.Picture.create(image) // save image information in database
    .then(function(dbImage) {
      console.log("image created");
      return db.User.findOneAndUpdate(
        {
          _id: req.params.id
        },
        { $push: { pics: dbImage._id } },
        {
          new: true
        }
      )
        .then(function(dbImage) {
          console.log("i found something: ", dbImage);
          res.redirect("/");
        })
        .catch(function(err) {
          res.json(err);
        });
    });
});

router.get("/api/users/:username", (req, res) => {
  db.User.findOne({
    username: req.params.username
  })
    .populate("pics")
    .then(response => res.json(response))
    .catch(err => console.log("had error getting user: ", err));
});

router.post("/api/users", async (req, res) => {
  try {
    const userRes = await db.User.create(req.body);
    console.log("this is my user: ", userRes);

    const token = jwt.sign({ id: userRes._id }, SECRET, {
      expiresIn: "14 days"
    });
    console.log("my token: ", token);

    chatkit
      .createUser({
        id: userRes.username,
        name: userRes.username
      })
      .then(() => res.status(201).json({ userRes, token }))
      .catch(error => {
        res.status(error.status).json(error);
      });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", (req, res) => {
  db.User.findOne({
    username: req.body.username
  })
    .then(function(user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401);
        }
        const token = jwt.sign({ id: user._id }, SECRET, {
          expiresIn: "14 days"
        });
        console.log("my token: ", token);
        res.json({ user, token });
      });
    })
    .catch(err => console.log(err));
});

router.put("/api/users/:id", tokenAuthenticate, (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    return res.sendStatus(401);
  }
  db.User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(response => {
      res.json(response);
    })
    .catch(err => console.log("we had an error on updating the user: ", err));
});

router.get("/api/me", tokenAuthenticate, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
