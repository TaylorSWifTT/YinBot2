const Reporter = require('../lib/reporter.js');
const cheerio = require('cheerio');
const http = require('http');
const request = require('request-promise-native');
const requestHeaders = require('./shared/request-headers');

const EMOJI_NAME = 'verified';
const reporter = new Reporter();

class TwitterVerification {
  constructor(client) {
    reporter.register({
      userId: '268183210297393152',
      client
    });

    client.on('message', async message => {
      try {
        const twitterAddrRegEx = /http(s?):\/\/(.*)twitter\.com\/(\w+)\/status/;
        if (!message.content.match(twitterAddrRegEx)) return;

        const tweetUri = this.getUri(message);
        const tweetId = this.getId(message);

        const $ = await request({
          headers: requestHeaders,
          uri: tweetUri,
          transform: body => cheerio.load(body)
        });

        if ($('.permalink-header .Icon--verified')[0]) {
          const bluecheck = await message.guild.emojis.find(
            emoji => emoji.name === EMOJI_NAME
          );
          if (!bluecheck) {
            throw new Error(`Emoji name :${EMOJI_NAME}: not found!`);
          }
          await message.react(bluecheck);
        }
      } catch (e) {
        e.data = { messageContent: message.content };
        reporter.error(e);
      }
    });
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
