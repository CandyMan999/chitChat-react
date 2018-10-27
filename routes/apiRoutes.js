const db = require("../models");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const Chatkit = require("pusher-chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:a55d6d92-ceb4-4e02-a75e-b47722122dcb",
  key:
    "1e28b3ff-92aa-4df1-a5db-2a113523ad2f:erUgKYEhx/4tA5mf8KZxL6ey+f7Qu/lKPael4YBx5Ts="
});

router.get("/api/users/:id", (req, res) => {
  db.User.findOne({
    _id: req.params.id
  })
    .then(response => res.json(response))
    .catch(err => console.log("had error getting user: ", err));
});

router.post("/api/users", (req, res) => {
  console.log("seeing if this hits");
  db.User.create(req.body)
    .then(response => res.json(response))
    .catch(err => console.log(err));
});

router.post("/login", (req, res) => {
  db.User.findOne({
    email: req.body.email
  })
    .populate("profile")
    .then(function(dbProfile) {
      res.json(dbProfile);
      console.log(dbProfile);
    })
    .catch(err => console.log(err));
});

router.post("/users", (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === "services/chatkit/user_already_exists") {
        res.sendStatus(200);
      } else {
        res.status(error.status).json(error);
      }
    });
});

router.post("/api/users/:id", (req, res) => {
  console.log("did this fire");
  db.Profile.create(req.body).then(function(dbProfile) {
    return db.User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      { $push: { profile: dbProfile._id } },
      {
        new: true
      }
    )
      .then(function(dbProfile) {
        res.json(dbProfile);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

module.exports = router;
