const cheerio = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request-promise-native');
const requestHeaders = require('./shared/request-headers');

const EMOJI_NAME = 'verified';

class TwitterVerification {
  constructor(client) {
    client.on('message', message => {
      try {
        if (message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
          this.verifyTweet(message);
        }
      } catch (e) {
        console.error('==== Twitter Images Blew Up ====\n', e);
        return;
      }
    });
  }

  verifyTweet(message) {
    const guild = message.guild;
    const host = 'http://twitter.com';
    const path = message.content.split('twitter.com')[1].split(' ')[0];
    const url = host + path;

    const tweetUri = this.getUri(message);
    const tweetId = this.getId(message);

    request({
      headers: requestHeaders,
      uri: tweetUri,
      transform: body => cheerio.load(body)
    })
      .then($ => {
        if ($('.permalink-header .Icon--verified')[0]) {
          const bluecheck = message.guild.emojis.find(
            emoji => emoji.name === EMOJI_NAME
          );
          if (!bluecheck)
            throw new Error(`Emoji name :${EMOJI_NAME}: not found!`);
          message.react(bluecheck);
          // });
        }
      })
      .catch(e => console.error('==== Twitter Verification Blew Up ====\n', e));
  }

  getId(message) {
    const id = message.content.split('/status/')[1].split('?')[0];
    return id;
  }

  getUri(message) {
    const host = 'http://www.twitter.com';
    const path = message.content.split('twitter.com')[1].split(' ')[0];
    return host + path;
  }
}

module.exports = TwitterVerification;
