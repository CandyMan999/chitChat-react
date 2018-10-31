const db = require("../models");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const Chatkit = require("pusher-chatkit-server");
const jwt = require("jsonwebtoken");
const SECRET = "shhhh";

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:a55d6d92-ceb4-4e02-a75e-b47722122dcb",
  key:
    "1e28b3ff-92aa-4df1-a5db-2a113523ad2f:erUgKYEhx/4tA5mf8KZxL6ey+f7Qu/lKPael4YBx5Ts="
});

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

router.get("/api/users/:username", (req, res) => {
  db.User.findOne({
    username: req.params.username
  })
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
