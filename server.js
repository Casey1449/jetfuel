const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
let Link = require('./models/link');

const app = express();

var dbName = 'linksDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port_number = process.env.PORT || 3000;

app.locals.title = 'Tinyify';

app.get('/', (req, res) => {
  Link.find(function(err, links) {
    console.log(links);
    if (err) {
      res.send(err);
    }
    res.send(links);
  });
});

app.get('/urls', function(req, res) {
  Link.find(function(err, links) {
    res.send(links);
  });
});

app.post('/urls', function(req, res) {
  var link = new Link({
    longUrl: req.body.longUrl,
    shortUrl: shortid.generate(),
    clicks: 0,
    timestamp: Date.now()
  });

  link.save(function(err) {
    if (err) {
      res.send(err);
    }
    Link.find(function(err, links) {
      res.send(links);
    });
  });
});

app.get('/urls/:shortUrl', (request, response) => {
  Link.find({ shortUrl: request.params.shortUrl }, function(err, thisLink) {
    if(!thisLink[0].longUrl) { return response.sendStatus(404); }
    thisLink[0].clicks++;
    response.redirect(301, thisLink[0].longUrl);
  });
});

  app.listen(port_number, () => {
    console.log(`${app.locals.title} now listening on ${port_number}`);
  });

module.exports = app;
