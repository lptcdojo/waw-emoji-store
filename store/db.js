'use strict';

const Datastore = require('nedb');
const config = require('../config');

const db = new Datastore({ filename: config.dbFile });
module.exports = db;
