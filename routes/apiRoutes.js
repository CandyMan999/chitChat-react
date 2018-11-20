const db = require("../models");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const Chatkit = require("@pusher/chatkit-server");
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

  return jwt.verify(token, SECRET, (err, decoded) => {
    if (err || !decoded) return res.status(401).json(err);

    return db.User.findById(decoded.id)
      .populate("pics")
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => res.status(401).json(err));
  });
};

router.delete("/api/rooms/:id", (req, res) => {
  console.log("wat");
  chatkit
    .deleteRoom({
      id: req.params.id
    })
    .then(() => console.log("gone forever") || res.json({ result: "success" }))
    .catch(err => console.error(err) || res.sendStatus(401));
});

// chatkit.deleteMessage({
//   id: messageToDelete.id
// })
//   .then(() => console.log('gone forever'))
//   .catch(err => console.error(err))

// chatkit
//   .getRooms({})
//   .then(rooms => console.log("got rooms", rooms))
//   .catch(err => console.error(err));

router.delete("/api/users/:id/images/:photo_id", (req, res) => {
  console.log("$$$", req.params.id, req.params.photo_id);
  db.User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $pull: { pics: req.params.photo_id }
    },
    { new: true }
  )
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

router.post("/api/users/:id/image", parser.single("image"), (req, res) => {
  console.log("!!!!!!!!!", req.file);
  console.log("?????", req.body);
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
          res.json({
            data: {
              imageId: dbImage.pics.slice(-1)
            }
          });
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
    //console.log("this is my user: ", userRes);

    db.User.findOneAndUpdate(
      { username: userRes.username },
      { $set: { isLoggedIn: true } }
    ).catch(err => console.log(err));

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
    .populate("pics")
    .then(function(user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json(err);
        }
        const token = jwt.sign({ id: user._id }, SECRET, {
          expiresIn: "14 days"
        });

        db.User.findOneAndUpdate(
          { username: req.body.username },
          { $set: { isLoggedIn: true } },
          { new: true }
        )

          .then(() => {
            res.json({ user, token });
          })
          .catch(err => res.json(err));
      });
    })
    .catch(err => res.status(401).json(err));
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

router.get("/api/users", (req, res) => {
  db.User.find({
    hasAccepted: true,
    isLoggedIn: true
  })
    .populate("pics")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err));
});

router.put("/api/logout/:username", (req, res) => {
  db.User.findOneAndUpdate(
    { username: req.params.username },
    { $set: { isLoggedIn: false } },
    { new: true }
  )
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

router.put("/api/block/:blockingUser/:blockedUser", (req, res) => {
  console.log("###########", req.params.blockingUser, req.params.blockedUser);
  db.User.findOneAndUpdate(
    { username: req.params.blockingUser },
    { $push: { blockedUsers: req.params.blockedUser } },
    { new: true }
  )
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

router.put("/api/unblock/:blockingUser/:blockedUser", (req, res) => {
  db.User.findOneAndUpdate(
    { username: req.params.blockingUser },
    {
      $pull: { blockedUsers: req.params.blockedUser }
    },
    { new: true }
  )
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

//TODO run authentication middleware on this
router.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

module.exports = router;
