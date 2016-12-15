let Link = require('../models/link');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('file read')

router.get('/', (request, response) => {
  console.log('fired');
  // Link.find((err, urls) => {
  //   if (err){ response.send(err) }
  //   console.log(urls);
  //   response.json(urls);
  // });
});

router.post('/', function(req, res) {
  var dinosaur = new Dinosaur(req.body);

  dinosaur.save(function(err) {
    if (err) {
      res.send(err)
    }
    Dinosaur.find(function(err, dinos) {
      res.render('index.ejs', {dinosaurs: dinos})
    })
  })
})

router.get('/:id', (request, response) => {

  app.locals.db.urls.data = app.locals.db.urls.data.map( (url) => {
    if (url.id === request.params.id){
      url.clicks++;
    }
  });

  let thisLink = app.locals.db.urls.data.find( (url) => {
    return url.id === request.params.id;
  });

  if(!thisLink.longUrl) { return response.sendStatus(404); }

  response.redirect(301, thisLink.longUrl);
});

router.post('/urls', (request, response) => {
  const { longUrl } = request.body;
  const id = shortid.generate();
  const link = { id, longUrl, clicks: 0, timestamp: Date.now() };
  app.locals.db.urls.data.push(link);

  if (!longUrl) {
    return response.status(422).send({
      error: 'No url provided'
    });
  }

  response.json(app.locals.db.urls.data);
});

module.exports = router;
