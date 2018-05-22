const cheerio = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request-promise-native');
const requestHeaders = require('./shared/request-headers');

const EMOJI_NAME = 'verified';

class TwitterVerification {
  constructor(client) {
    client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
      try {
        if (e.message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
          this.verifyTweet(e.message);
        }
      } catch (e) {
        console.error('==== Twitter Images Blew Up ====\n', e);
        return;
      }
    });
  }

  verifyTweet(message) {
    let guild = message.guild;
    let host = 'http://twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    let url = host + path;

    let tweetUri = this.getUri(message);
    let tweetId = this.getId(message);

    request({
      headers: requestHeaders,
      uri: tweetUri,
      transform: body => cheerio.load(body)
    })
      .then($ => {
        if ($('.permalink-header .Icon--verified')[0]) {
          return guild.fetchEmoji().then(emojis => {
            let bluecheck = emojis.find(emo => emo.name === EMOJI_NAME);
            if (!bluecheck)
              throw new Error(`Emoji name :${EMOJI_NAME}: not found!`);
            message.addReaction(bluecheck);
          });
        }
      })
      .catch(e => console.error('==== Twitter Verification Blew Up ====\n', e));
  }

  getId(message) {
    let id = message.content.split('/status/')[1].split('?')[0];
    return id;
  }

  getUri(message) {
    let host = 'http://www.twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    return host + path;
  }

}

module.exports = TwitterVerification;
