var express = require("express");
var router = express.Router();
const Thread = require("../models/club").Thread;
const Response = require("../models/club").Response;
const mongoose = require("mongoose");
router.get("/", (req, res) => {
    Thread.find().then(threads => {
      res.json({ threads });
    });
  });

  router.get('/:id', (req, res) => {
    Thread.findById(req.params.id, (_error, Thread) => {
        if (!Thread) (res.status(400).send('error'))
        res.json(Thread)
    })
})

router.post('/', (req, res) => {
    Thread.create(req.body, (error, newThread) => {
      res.json(newThread)
    })
  })

  router.delete('/:id', (req, res) => {
    Thread.findByIdAndRemove(req.params.id,req.body, (_error, Thread) => {
        if(!_error){
            console.log("Deleted");
        }
    })
})

router.put("/:id", (req, res)=> {
    Thread.update({ _id: mongoose.Types.ObjectId(req.params.id) },req.body,{ new: true })
    .then((success,doc) => {
        console.log(doc,success)
      res.json();
    })
    .catch((err) => {
        res.status(404).send(err);
    });
})

// CREATE response embedded in thread
router.post('/:id/responses', (req, res) => {
    const newResponse = new Response({ 
        text: req.body.text,
        profileImageURL: req.body.profileImageURL,
        username: req.body.username,
        likes:req.body.likes,
        timestamp: req.body.timestamp
    })
    // find thread in db by id and add new response
    Thread.findById(req.params.id, (error, foundThread) => {
      console.log(foundThread)
      foundThread.responses.push(newResponse)
      foundThread.save((error, savedThread) => {
          if(error) res.status(404).send(err);
        res.json(newResponse)
      })
    })
  })

module.exports = router;
