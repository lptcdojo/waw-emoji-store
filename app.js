'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./store/db');

const app = express();

const errorHandler = (err, req, res, next) => {
  console.error(`Error occurred while handling the request: ${err}`);
  res.status(500).send('Error!');
}

// Middlewares.
app.use(bodyParser.json());
app.use(errorHandler);

// API routes.
app.use('/api/emojis/', require('./api'));

// Homepage.
app.get('/', (req, res) => {
  res.send('Hello Emoji world!');
});

db.loadDatabase();
const server = app.listen(config.port, () => {
  console.clear();
  console.log(`😎  Server listening on ${server.address().port}`);
});
