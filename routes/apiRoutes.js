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

router.get("/api/test", function(res, res) {
  res.json({ hello: "world" });
});
router.post("/api/users", (req, res) => {
  console.log("seeing if this hits");
  db.User.create(req.body)
    .then(response => res.json(response))
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

module.exports = router;
