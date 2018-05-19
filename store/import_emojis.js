'use strict';

const fs = require('fs');
const config = require('../config');
const request = require('request');

const unicodeEmojiUrl = 'https://unicode.org/Public/emoji/11.0/emoji-test.txt';
const emojiDataLineRe = /(.+);(.+)#.+?\s+(.+)/;
const codePointsSep = ' ';
const db = require('../store/db');

const parseEmojiDataLine = (line) => {
  let d = line.match(emojiDataLineRe);

  const fullyQualified = (d[2].trim() === 'fully-qualified');
  if (!fullyQualified) return;

  const cpHexStrs = d[1].trim().split(codePointsSep);
  let codePoints = [];
  cpHexStrs.forEach((cpHexStr) => {
    codePoints.push(parseInt(cpHexStr, 16));
  });
  const name = d[3].trim();
  return {
    name: name,
    tags: name.split(' '),
    char: String.fromCodePoint(...codePoints)
  }
};

const getEmojis = (data) => {
  let lines = data.split('\n');
  let emojis = [];
  let  id = 1;

  const isCommentOrBlank = (l) => {
    return (l.indexOf('#') === 0 || l.length === 0);
  }

  lines.forEach((line) => {
    if (!isCommentOrBlank(line)) {
      emoji = parseEmojiDataLine(line);
      if (emoji) {
        emoji['_id'] = id++;
        emojis.push(emoji);
      };
    }
  });

  return emojis;
}

const logError = (err) => {
  console.error(`⚠️  Error when running the emojis import:\n ==> ${err}`);
  console.error('\n⚠️  Aborted');
}

const run = () => {
  request.get(unicodeEmojiUrl)
    .on('error', (err) => {
      logError(err);
      return;
    })
    .on('response', (res) => {
      console.log('Received Emoji data. Writing...');

      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString('utf8');
      });
      res.on('end', () => {
        const emojis = getEmojis(data);

        if (emojis.length > 0) {
          // Make sure to remove the DB file before inserting records.
          if (fs.existsSync(config.dbFile)) {
            fs.unlinkSync(config.dbFile);
          }

          db.loadDatabase((err) => {
            db.insert(emojis, (err) => {
              if (err) {
                logError(err);
                return;
              }
              console.log('Finished importing data 😄.');
            });
          });
        }
      });
    });
}

run();
