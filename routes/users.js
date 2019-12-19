var express = require("express");
var router = express.Router();
const jwt = require("jwt-simple");
const jwtCheck = require("express-jwt");
const passport = require("../config/passport");
const config = require("../config/config");
const User = require("../models/User");
const Club = require("../models/club").Club;
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/", (req, res) => {
  User.find().then(users => {
    res.json({ users });
  });
});

/* SIGNUP a user. */
router.post("/signup", (req, res) => {
  if (req.body.username && req.body.password) {
    let newUser = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };
    User.findOne({ username: req.body.username }).then(user => {
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

router.get("/:id",  (req, res) => {
  // let decoded = jwt.decode(
  //   req.headers.authorization.split(" ")[1],
  //   config.jwtSecret
  // );

  User.findById(req.params.id).then(user => {
  
      res.json(user);
    
  });
});

router.post("/:id/clubs", (request, response) => {
  const newClub = new Club({
    title: request.body.title,
    description: request.body.description,
    currentTopic: request.body.currentTopic,
    thumbnailURL: request.body.thumbnailURL,
    backdropURL: request.body.backdropURL,
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

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, req.body, (_error, deletedUser) => {
      if(!_error){
          console.log("Deleted");
      } else {
        response.json({deletedUser})
      }
  })
})

router.put("/:id", (req, res)=> {
  User.update({ _id: mongoose.Types.ObjectId(req.params.id) },req.body,{ new: true })
  .then((success,doc) => {
      console.log(doc,success)
    res.json({doc});
  })
  .catch((err) => {
      res.status(404).send(err);
  });
})

module.exports = router;
