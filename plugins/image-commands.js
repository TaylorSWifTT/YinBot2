const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

class ImageCommands {
  constructor(client) {
    client.on('message', message => {
      try {
        const uploadTable = [
          ['!smug', './smug/'],
          ['!thinking', './reactions/'],
          ['!angry', './angry/'],
          ['!brainlet', './brainlets/']
        ];

        for (const [command, dir] of uploadTable) {
          if (message.content.toLowerCase().startsWith(command)) {
            fs.readdir(dir, (err, files) => {
              const file = files[Math.floor(Math.random() * files.length)];
              const filepath = path.join(__rootdir, dir, file);
              message.channel.send(new Discord.Attachment(filepath));
            });
          }
        }
      } catch (e) {
        console.error('==== Twitter Images Blew Up ====\n', e);
        return;
      }
    });
  }
}

module.exports = ImageCommands;
