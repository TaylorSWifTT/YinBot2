'use strict';
const giphy = require('giphy-api')();
const request = require('request');
const xml2js = require('xml2js');

const config = require('../config');


module.exports = {
    name: 'Images',
    commands: [

        // Giphy
        {
            alias:['gif', 'g', 'giphy'],
            params:'tags',
            help:'Get a random gif',
            action: (bot, msg, params) => {
                giphy.random({tag: params.join(' '), rating: 'r', fmt: 'json'}, (err, res) => {
                    if (err) msg.channel.sendMessage('Error connecting to giphy.');
                    else {
                        if (res.data && res.data.image_url) {
                            msg.channel.sendMessage(res.data.image_url);
                        } else {
                            msg.channel.sendMessage('Unable to find gif for: **' + params.join(' ') + '**.');
                        }
                    }
                });
            }
        },


        // Safebooru
        {
            alias:['safe', 'anime', 'safebooru'],
            params:'tags',
            help:'Anime pic search',
            action: (bot, msg, params) => {
                const tags = params.join('+');
                const options = {
                    url: 'http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&tags=' + tags
                };

                request.get(options, function(err, res, body) {
                    if (err) msg.channel.sendMessage('Error getting your dumb animes. :cry:');
                    else {

                        xml2js.parseString(body, function(err, res){
                            if (err) msg.channel.sendMessage('Failed parsing Safebooru response.');
                            else {
                                if (res && res.posts && res.posts.post && typeof res.posts.post[0]['$'] !== 'undefined') {
                                    const post = res.posts.post[0]['$'];
                                    let ret = post.file_url;
                                    if (ret.indexOf('//') === 0) {
                                        ret = 'http:' + ret;
                                    }
                                    if (post.tags) {
                                        ret += '\n';
                                        const tags = post.tags.split(' ');
                                        for (var i=0;i<tags.length;i++) {
                                            ret += tags[i] + ' ';
                                        }
                                    }
                                    msg.channel.sendMessage(ret);
                                } else {
                                    msg.channel.sendMessage('Bad response from Safebooru?');
                                }
                            }
                        });
                    }
                });
            }
        },
		
		        // Safebooru
        {
            alias:['gel', 'gelbooru'],
            params:'tags',
            help:'Anime pic search',
            action: (bot, msg, params) => {
                const tags = params.join('+');
                const options = {
                    url: 'https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=1&tags=' + tags
                };

                request.get(options, function(err, res, body) {
                    if (err) msg.channel.sendMessage('Error getting your dumb animes. :cry:');
                    else {

                        xml2js.parseString(body, function(err, res){
                            if (err) msg.channel.sendMessage('Failed parsing Gelbooru response.');
                            else {
                                if (res && res.posts && res.posts.post && typeof res.posts.post[0]['$'] !== 'undefined') {
                                    const post = res.posts.post[0]['$'];
                                    let ret = post.file_url;
                                    if (ret.indexOf('//') === 0) {
                                        ret = 'http:' + ret;
                                    }
                                    if (post.tags) {
                                        ret += '\n';
                                        const tags = post.tags.split(' ');
                                        for (var i=0;i<tags.length;i++) {
                                            ret += tags[i] + ' ';
                                        }
                                    }
                                    msg.channel.sendMessage(ret);
                                } else {
                                    msg.channel.sendMessage('Bad response from Gelbooru?');
                                }
                            }
                        });
                    }
                });
            }
        },

    ]
};
