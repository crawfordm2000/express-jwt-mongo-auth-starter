var express = require("express");
var router = express.Router();
const Response = require("../models/club").Response;

router.get("/", (req, res) => {
    Response.find().then(responses => {
      res.json({ responses });
    });
  });

  router.get('/:id', (req, res) => {
    Response.findById(req.params.id, (_error, Response) => {
        if (!Response) (res.status(400).send('error'))
        res.json(Response)
    })
})
router.post('/', (req, res) => {
    Response.create(req.body, (error, newResponse) => {
      res.json(newResponse)
    })
  })

  router.delete('/:id', (req, res) => {
    Response.findByIdAndRemove(req.params.id,req.body, (_error, Response) => {
        if(!_error){
            console.log("Deleted");
        }
    })
})
module.exports = router;
