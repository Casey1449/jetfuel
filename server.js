'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');

app.use(express.static('lib'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Tinyify';
app.locals.db = {
  urls: {
    data: [
      {id:"HkrRLh2Ge",longUrl:"https://www.google.com/", clicks: 5, timestamp: 1480556223476},
      {id:"asdfjkl", longUrl:"http://frontend.turing.io", clicks: 11, timestamp: 1480556245673},
      {id:"qwerty", longUrl:"http://www.nytimes.com", clicks: 6, timestamp: 1480556267588},
    ]
  }
};

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/urls', (request, response) => {
  if (!app.locals.db.urls.data) {
    return response.status(422).send({
      error: 'No urls stored'
    });
  }

  response.json(app.locals.db.urls.data);
});

app.get('/:id', (request, response) => {

  app.locals.db.urls.data.forEach( (url) => {
    if (url.id === request.params.id){
      url.clicks++;
      return url;
    }
  });

  let thisLink = app.locals.db.urls.data.find( (url) => {
    return url.id === request.params.id;
  });

  if(!thisLink.longUrl) { return response.sendStatus(404); }

  response.redirect(301, thisLink.longUrl);
});

app.post('/urls', (request, response) => {
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

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} now listening on 3000`);
  });
}

module.exports = app;
