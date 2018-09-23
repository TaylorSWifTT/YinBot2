const AbstractPlugin = require('./abstract-plugin');
const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const cheerio = require('cheerio');
const http = require('http');
const request = require('request-promise-native');
const requestHeaders = require('./shared/request-headers');

const reporter = new Reporter();

class TwitterImages extends AbstractPlugin {
  constructor(client) {
    super();
    reporter.register({
      userId: '268183210297393152',
      client
    });

    client.on('message', async message => {
      try {
        const twitterAddrRegEx = /http(s?):\/\/(.*)twitter\.com\/(\w+)\/status/;
        if (!message.content.match(twitterAddrRegEx)) return;

        const tweetUrl = this.getUrl(message);
        const tweetId = this.getId(message);

        const $ = await request({
          headers: requestHeaders,
          uri: tweetUrl,
          transform: body => cheerio.load(body)
        });

        const $tweet = $('.permalink-tweet');
        if ($tweet.attr('data-tweet-id') !== tweetId) return;

        const $imageContainer = $tweet.find('.AdaptiveMedia-container');
        if ($imageContainer.length) {
          const $images = $($imageContainer[0]).find('img');

          $images.each((i, el) => {
            if (i === 0) return;
            const imageUrl = $(el).attr('src');

            const embed = new Discord.RichEmbed({
              color: 0x00aced,
              author: { name: `TwitPic: ${i + 1} / ${$images.length}` },
              image: { height: 8000, url: imageUrl }
            });

            message.channel.send(embed);
          });
        }
      } catch (e) {
        e.data = { messageContent: message.content };
        reporter.error(e);
      }
    });
  }

  getDescription() {
    return 'Show ALL the pictures for a tweet';
  }

  getId(message) {
    let id = message.content.split('/status/')[1].split('?')[0];
    return id;
  }

  getUrl(message) {
    let host = 'http://www.twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    return host + path;
  }
}

module.exports = TwitterImages;
