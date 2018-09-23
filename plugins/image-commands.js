const AbstractPlugin = require('./abstract-plugin');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

class ImageCommands extends AbstractPlugin {
  constructor(client) {
    super();
    client.on('message', message => {
      try {
        const uploadTable = (this.uploadTable = [
          ['!smug', './smug/'],
          ['!thinking', './reactions/'],
          ['!angry', './angry/'],
          ['!brainlet', './brainlets/'],
          ['!lewdlolis', './lewd/'],
          ['!happy', './happy/']
        ]);

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

  getDescription() {
    return `Randomized images. Call with:\n\t${this.uploadTable
      .map(([command, dir]) => '`' + command + '`')
      .join('\n\t')}`;
  }
}

module.exports = ImageCommands;
