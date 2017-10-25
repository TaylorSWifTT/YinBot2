'use strict';
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

let guildSfxQueues = {};

console.log('init voice');



function buildOutputArgs(msg, path, rate, tempo, seek) {
  console.log('getting into output args with, ', path, rate, tempo);
  const outputArgs = ['-filter_complex'];
  let filter = 'volume=' + volume;

  if (rate) {
    let num = +rate;
    if (isNaN(num)) msg.reply("Rate is not a number");
    else {
      let probe = path;
      if (typeof path !== 'number') {
        probe = spawnSync('avprobe', [path]).stderr.toString();
        if (typeof probe === 'string') {
          probe = probe.match(/(\d+) Hz/);
          if (probe && probe.length > 1) {
            probe = +probe[1];
          }
        } else {
          probe = null;
        }
      }
      if (probe) {
        filter += ', asetrate=' + (probe * num);
      }
    }
  }
  if (tempo) {
    let num = +tempo;
    if (isNaN(num) || num < 0.5 || num > 2.0) msg.reply("Tempo needs to be between 0.5 and 2.0");
    else {
      filter += ', atempo=' + num;
    }
  }
  outputArgs.push(filter);
  if (seek) {
    outputArgs.push('-ss');
    outputArgs.push(seek);
  }
  return outputArgs;
}


module.exports = {
  name: 'Voice',
  commands: [
    // SFX
    {
      alias: ['sfx', 'file', 'audio'],
      params: 'filename',
      help: 'Try to play a file with the supplied filename',
      action: (bot, msg, params) => {
        // Helper function for recursive queue playback
        function playQueue(guildId) {
          var entry = guildSfxQueues[guildId];
          if (!entry) return;

          var queue = entry.sfxQueue;
          var voiceCon = entry.voiceConnection;
          var nextEntry = queue.pop();
          if (!nextEntry) {
            voiceCon.disconnect();
            delete guildSfxQueues[guildId];
            return;
          }

          var enc = voiceCon.createExternalEncoder({
            type: "ffmpeg",
            source: 'sfx/' + params[0] + '.mp3',
            outputArgs: buildOutputArgs(msg, 'sfx/' + nextEntry[0] + '.mp3', nextEntry[1], nextEntry[2]),
          });

          if (enc) {
            enc.play();
            enc.once('end', () => {
              playQueue(guildId);
            });
          }
        }

        // Action starts here
        const authorChannel = msg.author.getVoiceChannel(msg.guild);
        if (!authorChannel) {
          msg.reply("You're not in a voice channel.");
          return; // Fucko ain't even in a voice channel so let's just return and do nothing
        }
        if (params.length < 1) {
          msg.reply('Please pass a filename');
        } else {
          if (!guildSfxQueues[msg.guild.id]) {
            // No queue exists for this guild yet so let's set this shit up
            guildSfxQueues[msg.guild.id] = {}; // Create a new structure for this guildid
            guildSfxQueues[msg.guild.id].sfxQueue = []; // Add a queue to the structure for this guild
            guildSfxQueues[msg.guild.id].sfxQueue.push([
              params[0], params[1], params[2]
            ]);
            authorChannel.join().then(info => {
              // Save that voiceConnection for the guild and let's start working down the queue
              guildSfxQueues[msg.guild.id].voiceConnection = info.voiceConnection;
              playQueue(msg.guild.id);
            });
          } else {
            // Oh hey we're already in a voice channel, so let's just append the sfx params to the queue to later be processed by playQueue()
            guildSfxQueues[msg.guild.id].sfxQueue.push([
              params[0], params[1], params[2]
            ]);
          }
        }
      } // action end
    },

    // SFX list
    {
      alias: ['sfxlist', 'audiolist'],
      help: 'List files in sfx directory',
      action: (bot, msg, params) => {
        let res = 'Sfx options: ';
        const files = fs.readdirSync('sfx/');
        for (let i = 0; i < files.length; i++) {
          files[i] = files[i].substring(0, files[i].length - 4);
        }
        res += files.join(', ');
        msg.reply(res);
      }
    },

  ]
};