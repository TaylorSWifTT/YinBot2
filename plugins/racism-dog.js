const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const fs = require('fs');
const path = require('path');

const reporter = new Reporter();

class RacismDog {
  constructor(client) {
    reporter.register({
      userId: '358407021344587777',
      client
    });

    client.on('message', async message => {
      try {
        if (message.content.match(/\b(fuck|fucking|kill|hate) (white|whitey|whites)\b|\b(white|trailer)\b \b(trash|genocide)\b|\b(cracker|crackers|redneck|rednecks|honky|honkie|honkies|honkey|hillbilly|hillbillies)\b/i)) {
          const file = "./cemotes/racism-dog.png";
          if (file) {
            const filepath = path.join(__rootdir, file);
            await message.channel.send(new Discord.Attachment(filepath));
            await message.channel.send("Woof");
          }
        }
      } catch (e) {
        e.data = { messageContent: message.content };
        reporter.error(e);
      }
    });
  }
}

module.exports = RacismDog;
