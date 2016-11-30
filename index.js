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
    data: []
  }
};

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

// app.get('/urls', (request, response) => {
//   response.send({ urls: app.locals.db.urls.data });
// });

app.get('/urls', (request, response) => {
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

  if(!thisLink) { return response.sendStatus(404); }

  response.redirect(301, thisLink.longUrl);
});

app.post('/urls', (request, response) => {
  const { longUrl } = request.body;
  const id = shortid.generate();
  const link = { id, longUrl, clicks: 0 };
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
