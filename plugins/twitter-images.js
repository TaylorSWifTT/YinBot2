const $ = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request');

const EMOJI_NAME = 'verified';

class TwitterImages {
  constructor(client) {
    client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
      if (e.message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
        this.embedImageUrls(e.message);
      }
    });
  }

  embedImageUrls(message) {
    let tweetUrl = this.getUrl(message);
    let tweetId = this.getId(message);

    request(tweetUrl, (err, res, body) => {
      if (err) return console.error(err);

      let $html = $.load(body);
      let query = '[data-tweet-id="' + tweetId + '"]'

      let $tweet = $html('.permalink-tweet');
      if ($tweet.attr('data-tweet-id') !== tweetId) return;

      let $imageContainer = $tweet
        .find('.AdaptiveMedia-container')


      if ($imageContainer.length) {
        let $images = $($imageContainer[0]).find('img');

        $images.each((i, el) => {
          if (!i) return;
          let imageUrl = $(el).attr('src');

          message.channel.sendMessage('', false, {
            color: 0x00aced,
            author: {name: `TwitPic: ${i + 1} / ${$images.length}`},
            image: {height: 8000, url: imageUrl}
          });
        });
      }
    }).end();
  }

  getId(message) {
    let id = message.content.split('/status/')[1].split('?')[0];
    return id;
  }

  getUrl(message) {
    let host = 'http://twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    return host + path;
  }
}

module.exports = TwitterImages;
