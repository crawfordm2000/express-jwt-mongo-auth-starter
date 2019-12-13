var express = require("express");
var router = express.Router();
const Club = require("../models/club").Club;

//INDEX for all Clubs

router.get("/", (req, res) => {
  Club.find().then(clubs => {
    res.json({ clubs });
  });
});

module.exports = router;
