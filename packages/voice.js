'use strict';
const fs= require('fs');
const ytdl = require('ytdl-core');
const spawnSync = require('child_process').spawnSync;

let voiceConnection = false;
let encoder = false;
let volume = 1.0;

console.log('init voice');
const DVA_SFX = fs.readdirSync('dvasfx/');
const WOW_RACES = ['dwarf', 'gnome', 'human', 'nightelf', 'orc', 'tauren', 'troll', 'undead'];
const WOW_SFX = {};
for (let i = 0; i < WOW_RACES.length; i++) {
    let race = WOW_RACES[i];
    WOW_SFX[race] = {
        male:   fs.readdirSync('wow/' + race + '/male'),
        female: fs.readdirSync('wow/' + race + '/female'),
    };
}


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

        // Join
        {
            alias:['join', 'vjoin'],
            help:'Join your voice channel',
            action: (bot, msg, params) => {
                const authorChannel = msg.author.getVoiceChannel(msg.guild);
                if (!authorChannel) {
                  msg.reply("You're not in a voice channel.");
                } else {
                  authorChannel.join().then((info) => {
                    voiceConnection = info.voiceConnection;
                  }).catch((err) => {msg.reply(err);});
                }
            }
        },

        // Leave
        {
            alias:['leave', 'vleave'],
            help:'Leave the voice channel',
            action: (bot, msg, params) => {
              bot.Dispatcher.removeAllListeners('VOICE_CHANNEL_JOIN');
              if (voiceConnection) {
                if (encoder) encoder.play();
                setTimeout(() => {
                  voiceConnection.disconnect();
                  voiceConnection = false;
                }, 2500);
              }
            }
        },

        // Play Sound
        {
            alias: ['play', 'vplay', 'p'],
            params: 'url, rate (ratio, optional), tempo (0.5-2.0, optional)',
            help: 'Play a YouTube url or a url that contains an audio file.',
            action: (bot, msg, params) => {
                if (!voiceConnection) msg.reply("I'm not in a voice channel, use !join first.");
                else if (params.length > 0) {
                  try {
                    ytdl.getInfo(params[0], (err, mediaInfo) => {
                      if (err) {

                      }
                      else {
                        var formats = mediaInfo.formats.filter(f => f.container === "webm").sort((a, b) => b.audioBitrate - a.audioBitrate);
                        var bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);
                        if (!bestaudio) msg.reply("No valid formats");
                        else {
                          let t = params[0].match(/\?.*t=(\d+)/);
                          if (t && t.length > 1) t = +t[1];
                          if (isNaN(t)) t = undefined;

                          encoder = voiceConnection.createExternalEncoder({
                            type: "ffmpeg",
                            source: bestaudio.url,
                            outputArgs: buildOutputArgs(msg, 44100, params[1], params[2], t),
                            debug: true
                          });
                          encoder.play();
                        }
                      }
                    });
                  } catch (e) {
                    // Not a youtube url, try playing it with ffmpeg
                    encoder = voiceConnection.createExternalEncoder({
                      type: "ffmpeg",
                      source: params[0],
                      outputArgs: buildOutputArgs(msg, params[0], params[1], params[2]),
                      debug: true
                    });
                    if (encoder) encoder.play();
                  }
                }
                else msg.reply("Pass a URL to play.");
            }
        },

        // Stop
        {
            alias:['stop', 's', 'vstop'],
            help:'Stop playing',
            action: (bot, msg, params) => {
              if (encoder) {
                encoder.stop();
                encoder = false;
              }
            }
        },

        // Volume
        {
            alias:['v', 'vol', 'volume'],
            params:'volume, 1-100',
            help:'Set voice volume',
            action: (bot, msg, params) => {
                if (params.length < 1) msg.reply('Pass a volume between 1 and 100.');
                else {
                  const num = parseInt(params[0]);
                  if (isNaN(num) || num < 1 || num > 100) msg.reply('Pass a volume between 1 and 100.');
                  else {
                    volume = num / 100 * 1;
                    msg.channel.sendMessage('Volume set to: *' + num + '*.');
                  }
                }
            }
        },

        
        // SFX
        {
            alias: ['sfx', 'file', 'audio'],
            params: 'filename',
            help: 'Try to play a file with the supplied filename',
            action: (bot, msg, params) => {
                const authorChannel = msg.author.getVoiceChannel(msg.guild);
                if (!authorChannel) {
                    msg.reply("You're not in a voice channel.");
                    return;
                }
                if (params.length < 1) {
                    msg.reply('Please pass a filename');
                } else {
                    authorChannel.join().then((info) => {
                        voiceConnection = info.voiceConnection;
                        encoder = voiceConnection.createExternalEncoder({
                            type: "ffmpeg",
                            source: 'sfx/' + params[0] + '.mp3',
                            outputArgs: buildOutputArgs(msg, 'sfx/' + params[0] + '.mp3', params[1], params[2]),
                        });
                        if (encoder) {
                            encoder.play();
                            encoder.once('end', () => {
                                voiceConnection.disconnect();
                            });
                        }
                    });
                }
            } // action end
        },

        // SFX list
        {
            alias:['sfxlist', 'audiolist'],
            help:'List files in sfx directory',
            action: (bot, msg, params) => {
                let res = 'Sfx options: ';
                const files = fs.readdirSync('sfx/');
                for (let i=0;i<files.length;i++) {
                    files[i] = files[i].substring(0, files[i].length - 4);
                }
                res += files.join(', ');
                msg.reply(res);
            }
        },

    ]
};