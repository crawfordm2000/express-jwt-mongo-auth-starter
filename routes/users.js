var express = require("express");
var router = express.Router();
const jwt = require("jwt-simple");
const jwtCheck = require("express-jwt");
const passport = require("../config/passport");
const config = require("../config/config");
const User = require("../models/User");
const Club = require("../models/club").Club;

/* GET users listing. */
router.get("/", (req, res) => {
  User.find().then(users => {
    res.json({ users });
  });
});

/* SIGNUP a user. */
router.post("/signup", (req, res) => {
  if (req.body.email && req.body.password) {
    let newUser = {
      email: req.body.email,
      password: req.body.password
    };
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        User.create(newUser).then(user => {
          res.json({ user });
        });
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.post("/login", (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        if (user.password === req.body.password) {
          const payload = {
            id: user.id
          };
          const token = jwt.encode(payload, config.jwtSecret);
          res.json({ token, user });
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.post("/", (req, res) => {
  console.log(req.headers);
  var decoded = jwt.decode(req.headers.authorization, config.jwtSecret);
  console.log(decoded);
  User.findById(decoded.id).then(user => {
    res.json({ user });
  });
});

router.get("/:id", jwtCheck({ secret: config.jwtSecret }), (req, res) => {
  let decoded = jwt.decode(
    req.headers.authorization.split(" ")[1],
    config.jwtSecret
  );

  User.findById(req.params.id).then(user => {
    if (user.id === decoded.id) {
      res.json(user);
    } else {
      res.json({ message: "You are not authorized to see that" });
    }
  });
});

// POST a Club with embedded in a User

router.post("/:id/clubs", (request, response) => {
  const newClub = new Club({
    title: request.body.title,
    description: request.body.description,
    currentTopic: request.body.currentTopic,
    currentMovieURL: request.body.currentMovieURL,
    threads: [],
    members: []
  });

  User.findById(request.params.id, (error, foundUser) => {
    foundUser.clubs.push(newClub);
    newClub.members.push(foundUser);
    foundUser.save((error, savedUser) => {
      response.json(newClub);
    });
    newClub.save();
  });
});

module.exports = router;
