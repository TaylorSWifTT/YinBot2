const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const fs = require('fs');
const path = require('path');

const reporter = new Reporter();

class RapinBill {
  constructor(client) {
    reporter.register({
      userId: '358407021344587777',
      client
    });

    client.on('message', async message => {
      try {
        if (message.content.match(/rape|raped/i)) {
          const file = "./bill/rapinbill.png";
          if (file) {
            const filepath = path.join(__rootdir, file);
            await message.channel.send(new Discord.Attachment(filepath));
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
