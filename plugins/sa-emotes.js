const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const fs = require('fs');
const path = require('path');

const reporter = new Reporter();

class SaEmotes {
  constructor(client) {
    reporter.register({
      userId: '268183210297393152',
      client
    });

    client.on('message', async message => {
      try {
        if (/\:(\w+)\:/g.test(message.content)) {
          const fileExtensions = ['\\.png', '\\.gif']; // escape the '.' because these will be used to build a regex
          const saEmotesPath = path.join(__rootdir, 'saemotes');
          const cEmotesPath = path.join(__rootdir, 'cemotes');

          // Extract emotes from message
          const emoteTags = message.content
            .match(/:(\w+):/g)
            .map(tag => '%3A' + tag.slice(1, -1) + '%3A'); // convert colons to URI Encoded colons (wtf?)

          // Construct a list of filepaths to the emote images
          let emoteFilePaths = fs
            .readdirSync(saEmotesPath)
            .map(filename => path.join(saEmotesPath, filename))
            .concat(
              fs
                .readdirSync(cEmotesPath)
                .map(filename => path.join(cEmotesPath, filename))
            );

          // Send an emote image for everything that matches
          for (let tag of emoteTags) {
            // check SaEmotes
            const candidateFilenames = fileExtensions.map(
              ext => new RegExp(tag + ext)
            );

            const filepath = emoteFilePaths.find(filename =>
              candidateFilenames.find(candidateName =>
                filename.match(candidateName)
              )
            );

            if (filepath) {
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

module.exports = SaEmotes;
