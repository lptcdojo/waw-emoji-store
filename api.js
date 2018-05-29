'use strict';

const express = require('express');
const db = require('./store/db');

const router = express.Router();

/**
 * GET /api/emojis/
 *
 * List emojies matching the criteria passed via the query parameters.
 */
router.route('/').get(async (req, res) => {
  const limit = req.query.limit || 100;
  let criteria = {};
  let name = req.query.name;
  let tags = req.query.tags;

  if (name) {
    name = name.trim();
    criteria.name = new RegExp(`${name}`, 'i');
    console.log(criteria.name);
  }
  if (tags) {
    let ts = [];
    tags.trim().split(',').forEach((t) => {
      ts.push(t.trim());
      ts.push(t.trim().toLowerCase());
    });
    criteria.tags = {$in: ts};
  }
  console.log(criteria);

  db.find(criteria)
    .limit(limit)
    .sort({name: 1})
    .exec((err, emojis) => {
      if (err) next(err);
      if (!emojis) {
        res.status(404).json({'error': `No emojis found matching criteria.`});
      }
      res.status(200).json(emojis);
    })
});

module.exports = router;
