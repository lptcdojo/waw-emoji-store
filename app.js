'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const config = require('./config');
const db = require('./store/db');

const app = express();

// Template engine.
nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

// Middlewares.
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

// API routes.
app.use('/api/emojis/', require('./api'));

// Homepage.
app.get('/', (req, res) => {
  res.render('index.html');
});

db.loadDatabase();
const server = app.listen(config.port, () => {
  console.clear();
  console.log(`😎  Server listening on ${server.address().port}`);
});
