const $ = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request');

const EMOJI_NAME = 'verified';

class TwitterImageEnumeration {
  constructor(client) {
    client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
      if (e.message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
        console.log('========');
        console.log(JSON.stringify(e.message, null, 2));
        console.log('========');
        this.embedImageUrls(e.message);
      }
    });
  }

  embedImageUrls(message) {
    let tweetUrl = this.getUrl(message);
    let tweetId = this.getId(message);

    request(tweetUrl, (err, res, body) => {
      if (err) return console.error(err);

      let $html = $.load(body)();
      let query = '[data-tweet-id="' + tweetId + '"]'
      console.log('query: ', query);

      let $imageContainer = $html
        .find('[data-tweet-id="448927844979056641"]')

      console.log($imageContainer);
      console.log('numImageContainers: ', $imageContainer.length);
      if ($imageContainer.length) {
        let $images = $($imageContainer[0]).find('img');
        console.log('numImages: ', $images.length);
        $images.each((i, el) => {
          if (!i) return;
          let imageUrl = $(el).attr('src');
          console.log($(el).attr('src'));
          message.channel.sendMessage('', false, {
            color: 0x00aced,
            author: {name: `${i} / ${$images.length - 1}`},
            image: {height: 8000, url: imageUrl},
            attachment: {url: imageUrl},
            url: 'http://google.com'
            // timestamp: '2016-11-13T03:43:32.127Z',
            // fields: [{name: 'some field', value: 'some value'}],
            // footer: {text: 'footer text'}
          });
        });
      }
    }).end();
  }

  getId(message) {
    let id = message.content.split('/status/')[1].split('?')[0];
    console.log('tweetId:', id);
    return id;
  }

  getUrl(message) {
    let host = 'http://twitter.com';
    let path = message.content.split('twitter.com')[1].split(' ')[0];
    return host + path;
  }
}

module.exports = TwitterImageEnumeration;
