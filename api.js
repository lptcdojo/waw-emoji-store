'use strict';

const express = require('express');
const db = require('./store/db');

const router = express.Router();

/**
 * GET /api/emojis/
 *
 * List emojies matching the criteria passed via the query parameters.
 */
router.route('/').get(async (req, res, next) => {
  const limit = req.query.limit || 100;
  let criteria = {};
  let name = req.query.name;
  let tags = req.query.tags;

  if (name) {
    name = name.trim();
    criteria.name = new RegExp(`${name}`);
  }
  if (tags) {
    let ts = [];
    tags.trim().split(',').forEach((t) => {
      ts.push(t.trim());
    });
    criteria.tags = {$in: ts};
  }

  db.find(criteria)
    .limit(limit)
    .exec((err, emojis) => {
      if (err) next(err);
      if (!emojis) {
        res.status(404).json({'error': `No emojis found matching criteria.`});
      }
      res.status(200).json(emojis);
    })
});

module.exports = router;
