const $ = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request');

const EMOJI_NAME = 'bluecheck';

class TwitterVerification {
  constructor(client) {
    client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
      if (e.message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
        this.verifyTweet(e.message);
      }
    });
  }

  verifyTweet(message) {
    let guild = message.guild;
    let host = 'http://twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    let url = host + path;

    request(url, (err, res, body) => {
      if (err) return console.error(err);

      let $html = $.load(body);
      if ($html('.permalink-header .Icon--verified')[0]) {
        try {
          guild
            .fetchEmoji()
            .then(emojis => {
              let bluecheck = emojis.find(emo => emo.name === EMOJI_NAME);
              message.addReaction(bluecheck);
            })
            .catch(e => {
              console.error(
                'Something blew up while finding the bluecheck emoji'
              );
              console.error(e);
            });
        } catch (e) {
          console.error('Something blew up in Twitter Verification');
          console.error(e);
        }
      }
    }).end();
  }
}

module.exports = TwitterVerification;
