const AbstractPlugin = require('./abstract-plugin');
const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const fs = require('fs');
const path = require('path');

const reporter = new Reporter();

class RapinBill extends AbstractPlugin {
  constructor(client) {
    super();
    reporter.register({
      userId: '358407021344587777',
      client
    });

    client.on('message', async message => {
      try {
        if (message.content.match(/\b(rape|raped|raping|rapist)\b/i)) {
          const file = './cemotes/rapin.png';
          if (Math.floor(Math.random() * 10) + 1 == 10) {
            if (file) {
              const filepath = path.join(__rootdir, file);
              await message.channel.send(new Discord.Attachment(filepath));
            }
          }
        }
      } catch (e) {
        e.data = { messageContent: message.content };
        reporter.error(e);
      }
    });
  }
}

module.exports = RapinBill;
