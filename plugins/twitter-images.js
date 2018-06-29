const Discord = require('discord.js');
const cheerio = require('cheerio');
const Events = require('discordie').Events;
const http = require('http');
const request = require('request-promise-native');
const requestHeaders = require('./shared/request-headers');

class TwitterImages {
  constructor(client) {
    client.on('message', message => {
      try {
        if (message.content.match(/http(s?):\/\/(.*)twitter\.com\//)) {
          this.embedImageUrls(message);
        }
      } catch (e) {
        console.error('==== Twitter Images Blew Up ====\n', e);
        return;
      }
    });
  }

  embedImageUrls(message) {
    let tweetUrl = this.getUrl(message);
    let tweetId = this.getId(message);

    request({
      headers: requestHeaders,
      uri: tweetUrl,
      transform: body => cheerio.load(body)
    })
      .then($ => {
        let $tweet = $('.permalink-tweet');
        if ($tweet.attr('data-tweet-id') !== tweetId) return;

        let $imageContainer = $tweet.find('.AdaptiveMedia-container');
        if ($imageContainer.length) {
          let $images = $($imageContainer[0]).find('img');

          $images.each((i, el) => {
            if (!i) return;
            let imageUrl = $(el).attr('src');

            let embed = new Discord.RichEmbed({
              color: 0x00aced,
              author: { name: `TwitPic: ${i + 1} / ${$images.length}` },
              image: { height: 8000, url: imageUrl }
            });

            message.channel.send(embed);
          });
        }
      })
      .catch(e => console.error('==== Twitter Images Blew Up ====\n', e));
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
