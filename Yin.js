const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
// var Events = Discordie.Events;
// var S = require("string");
// var catte = require("cat-ascii-faces");
// var dogge = require("dog-ascii-faces");
// const chalk = require("chalk");
// var urban = require("urban");
// var arrayquery = require("array-query");
// var gizoogle = require("gizoogle");

const config = require('./config');

// Absolute filepath of the directory housing Yinbot.js
global.__rootdir = path.resolve(__dirname);

const client = new Discord.Client();
client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));

/*****************/
/* Plugin Loader */
/*****************/
(function() {
  const pluginPath = path.join(__dirname, 'plugins');
  const plugins = fs
    .readdirSync(pluginPath)
    .filter(filename => fs.statSync(path.join(pluginPath, filename)).isFile())
    .map(filename => require(path.join(pluginPath, filename)))
    .forEach(plugin => new plugin(client));
})();

/*************/
/* Start it! */
/*************/
client.login(config.token);

/*************************************/
/* Old Stuff from the Discordie Days */
/*************************************/

//      // This IS a package manager, but it's written in some old awkward ES3 or something
//      // Using the Plugin Loader a above is recommended
//      const packagemanager = require('./src/packagemanager');
//
//      const messageHandler = function(e) {
//        if (e && e.message && e.message.content && e.message.content[0] === '!') {
//          // !command argument argument argument ...
//          const params = e.message.content.split(' ');
//          const command = params
//            .shift()
//            .substr(1)
//            .toLowerCase();
//          packagemanager(client, e.message, command, params);
//        }
//      };
//      client.Dispatcher.on(Events.MESSAGE_CREATE, messageHandler);
//
//      client.Dispatcher.on(Events.GATEWAY_READY, e => {
//        console.log(chalk.bold.green('Connected as: ' + client.User.username));
//      });
//
//      var streamingGame = {
//        type: 1,
//        name: 'Deez Nuts',
//        url: 'https://www.twitch.tv/taylorswiftt'
//      }; // "Streaming"
//      // note: streaming status requires a valid twitch url:
//      //       ex. "http://twitch.tv/channel"
//      client.User.setGame(streamingGame); // streaming
//
//      ///.setgame Example
//
//      /* var game = {name: "with code"}; // sets game as "Playing with code"
//      var streamingGame = {type: 1, name: "something", url: ""}; // "Streaming"
//      // note: streaming status requires a valid twitch url:
//      //       ex. "http://twitch.tv/channel"
//      client.User.setGame(game); // playing
//      client.User.setGame("with code"); // playing
//      client.User.setGame(streamingGame); // streaming
//      client.User.setGame(null); // not playing */
//
//      client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
//        var guild = e.message.guild;
//        var channel = e.message.channel;
//        var author = e.message.author;
//
//        message = e.message.content.toLowerCase();
//        origMessage = e.message.content;
//        var random = Math.floor(Math.random() * 100 + 1);
//
//
//        if (/:([\w]+):/g.test(S(message)) == true) {
//          var smilie = S(message).match(/:([\w]+):/g);
//          for (i in smilie) {
//            channel
//              .uploadFile('./saemotes/' + smilie[i] + '.png', '' + smilie[i] + '.png')
//              .catch();
//            channel
//              .uploadFile('./saemotes/' + smilie[i] + '.gif', '' + smilie[i] + '.gif')
//              .catch();
//            channel
//              .uploadFile('./cemotes/' + smilie[i] + '.png', '' + smilie[i] + '.png')
//              .catch();
//            channel
//              .uploadFile('./cemotes/' + smilie[i] + '.gif', '' + smilie[i] + '.gif')
//              .catch();
//          }
//        } else if (message == "i'm gay" || message == 'im gay') {
//          channel.sendMessage('same');
//        } else if (
//          S(message).contains('weeaboo' || 'weeaboos' || 'weeb' || 'weebs')
//        ) {
//          channel.sendMessage('オタクは自分の家族に不名誉をもたらします。');
//        } else if (message === '!saemotes') {
//          author.openDM().then(function(dm) {
//            dm.sendMessage(
//              "You can view all of Something Awful's emotes by following this link: http://discordgoons.com/sa-emotes.html"
//            );
//          });
//        } else if (message === '!bmwemotes') {
//          author.openDM().then(function(dm) {
//            dm.sendMessage('Suck a fart out of my ass');
//          });
//        } else if (S(message).match(/\bnamaste\b/) != null) {
//          /*else if (/!thinking/g.test(S(message)) == true) {
//          fs.readdir(reactionsFolder, (err, files) => {
//            randomReaction = files[Math.floor(Math.random() * files.length)];
//            channel.uploadFile(reactionsFolder + randomReaction).catch();
//          })
//        }*/
//          if (author.id === client.User.id) return;
//          channel.sendMessage('Namaste, friend.');
//        } else if (S(message).match(/\brick and morty\b/) != null) {
//          if (author.id === client.User.id) return;
//          channel.sendMessage('To be fair...');
//        } else if (S(message).match(/\bnice meltdown\b/) != null) {
//          channel.sendMessage('Yeah, Nice Meldown lmbo');
//          channel.uploadFile('saemotes/:ssmug:.png');
//        } else if (S(message).match(/\bsportsball\b/) != null) {
//          channel.uploadFile('images/sports.png');
//        } else if (S(message).startsWith('!decide')) {
//          responses = ['Definitely', 'Obviously', 'Absolutely', 'Duh,'];
//          randomResponse = responses[Math.floor(Math.random() * responses.length)];
//          message = origMessage.slice(8);
//          split = message.split(` or `);
//
//          randomChoice = split[Math.floor(Math.random() * split.length)];
//
//          channel.sendMessage(`${randomResponse} **${randomChoice}**`);
//        } else if (S(message).startsWith('!urban')) {
//          word = origMessage.slice(6);
//          urbanQuery = urban(word);
//          urbanQuery.first(json => {
//            if (json) {
//              channel.sendMessage(
//                `${json.word}: ${json.definition}\n :arrow_up: ${
//                  json.thumbs_up
//                } :arrow_down: ${json.thumbs_down}\n\n Example: ${json.example}`
//              );
//            } else {
//              channel.sendMessage(`Could not find a definition for  ${message}.`);
//            }
//          });
//        } else if (S(message).startsWith('!8ball')) {
//          replies = [
//            'Obviously',
//            'It is certain',
//            'It is decidedly so',
//            'Without a doubt',
//            'Yes, definitely',
//            'You may rely on it',
//            'As I see it, yes',
//            'Most likely',
//            'Outlook seems good',
//            'Yes',
//            'Signs point to yes',
//            "Don't count on it",
//            'My reply is no',
//            'My sources say no',
//            'Outlook is not so good',
//            'Seems doubtful',
//            'All signs point to no',
//            'Most definitely not',
//            'Most likely... no',
//            'Do not rely on it',
//            'Why are you asking me this?',
//            'Fuck off, fag'
//          ];
//
//          reply = replies[Math.floor(Math.random() * replies.length)];
//          channel.sendMessage(reply);
//        } else if (S(message).startsWith('!snoop ')) {
//          message = origMessage.slice(7);
//          gizoogle.string(message, function(error, translation) {
//            channel.sendMessage(translation);
//          });
//        } else if (message === '!yinhelp') {
//          channel.sendMessage(
//            '```\n' +
//              '\t\t\t\t\t\t\t\t\t#########################\n' +
//              '\t\t\t\t\t\t\t\t\t#### Yin Commands ####\n' +
//              '\t\t\t\t\t\t\t\t\t#########################\n\n' +
//              '!sfx <filename>: Plays a sound from !sfxlist\n' +
//              '!thinking: Posts a random thinking emoji to show the neurons are really firing atm\n' +
//              '!angry: Posts an angry or dissappointed face. Just like your father makes.\n' +
//              '!smug: Posts the smuggest fucking faces in history\n' +
//              '!funfact: Posts a random BMW fun fact that is always 100% true*\n' +
//              '!urban: searches Urban Dictionary for a definition\n' +
//              "!decide <option1> or <option2> or ... or <optionN>: chooses a random option separated by 'or'\n" +
//              '!8ball <question>: responds to a question for The Almighty 8Ball\n' +
//              '!snoop <sentence>: Snoopify your sentence\n' +
//              '!cat & !dog: Posts a cute ASCII cat or dog. nyan~\n' +
//              '!bird: posts a random emote flipping you off\n' +
//              '!saemotes: direct messages you the list of Something Awful smilies.\n' +
//              '!gel [tag1] [tag2] etc: Searches Gelbooru based on tags. Caution! Contains NSFW!\n' +
//              '!safe [tag1] [tag2] etc: Searches Safebooru based on tags.\n' +
//              ':sa_smilie_code: attachs that smilie on a separate message. This can be used anywhere in a message.\n\n' +
//              "If an SA emote is the same as a Discord emote, add 'sa' to the beginning, i.e. :v: = :sav:\n\n" +
//              'YinBot also responds to some catchphrases\n' +
//              'Credit to Pohlman for making the originalDVaBot so I could fuck this up. Oh and that another loser for his loserbot.\n' +
//              '```'
//          );
//        } else if (message === '!funfact') {
//          funfacts = [
//            'BMW Fun Fact #1: BMW Sucks',
//            "BMW Fun Fact #2: I'm Gay",
//            "BMW Fun Fact #3: Traps Aren't Gay",
//            'BMW Fun Fact #4: Traps Are Gay',
//            'BMW Fun Fact #5: Tay Is Always Right',
//            'BMW Fun Fact #6: Anime Was A Mistake',
//            'BMW Fun Fact #7: Snazzle Was Fat',
//            'BMW Fun Fact #8: EA Survival Games Never Succeed',
//            'BMW Fun Fact #9: Fuck Goons (.com)',
//            'BMW Fun Fact #10: Peaches Is Best Boy',
//            'BMW Fun Fact #11: #pol Was A Mistake',
//            'BMW Fun Fact #12: Prude Posted His Butthole',
//            'BMW Fun Fact #13: BMW Has That Weird Free Speech Thing',
//            'BMW Fun Fact #14: Tay Once Posted The Door Codes In A YouTube Video',
//            'BMW Fun Fact #15: We Once Killed The Griefing Thread',
//            'BMW Fun Fact #16: FAU Is The Worst SA Mod',
//            'BMW Fun Fact #17: We Once Doxxed A 12 Year Old',
//            "BMW Fun Fact #18: If you can piss 6 feet in the air straight up and not get wet you're good enough for us!",
//            'BMW Fun Fact #19: There Is No Secret Tay Friends Channel',
//            'BMW Fun Fact #20: Succ Gets Carried By Asians',
//            'BMW Fun Fact #21: Ban Joe',
//            'BMW Fun Fact #22: The Unibomber Is A Member Of BMW http://i.imgur.com/Rl0KfzH.png',
//            'BMW Fun Fact #23: BMW Does Not Lewd The Lolis',
//            'BMW Fun Fact #24: http://i.imgur.com/fo3YUzc.jpg',
//            'BMW Fun Fact #25: Bill Clinton Is A Rapist Infowars.com',
//            'BMW Fun Fact #25: Harminoff Condones Pedophilia http://i.imgur.com/wSYKN8T.png',
//            'BMW Fun Fact #26: BMW Is Goony But In The Bad Way http://i.imgur.com/vhpWsf7.png',
//            'BMW Fun Fact #27: Jackard Doesnt Actually Know What A Redditor Is http://i.imgur.com/jmfIena.png',
//            'BMW Fun Fact #28: Putting Faith In Nate Silver Never Backfires http://i.imgur.com/N3W3xhI.png',
//            'BMW Fun Fact #29: Snazzle Made Really Good Election Predictions http://i.imgur.com/2Uyj6ai.png',
//            'BMW Fun Fact #30: Swayze Is A Verb',
//            'BMW Fun Fact #31: Fallout 4 Is The Best Fallout http://i.imgur.com/swlHR5T.jpg',
//            'BMW Fun Fact #32: Always trust in Jack, but always hedge your bets.',
//            'BMW Fun Fact #33: BMW Is A Hate Free Group http://i.imgur.com/RmkOEEp.jpg',
//            'BMW Fun Fact #34: WuTang Aint Nothing To Fuck With',
//            'BMW Fun Fact #35: FORD Once Lost A Battle Against 2 GAYS',
//            'BMW Fun Fact #36: http://i.imgur.com/iO9ZpG2.png',
//            'BMW Fun Fact #37: BEEFY BOYS Was A Failed Off Shoot. COMMIE CREW Was Superior',
//            'BMW Fun Fact #38: Jack and Ashy got banned for posting Taylor Swift trans porn',
//            "BMW Fun Fact #39: BMW exists because Ozmiander wouldn't let Taylor in Lake Town",
//            'BMW Fun Fact #40: Fuck Laketown',
//            'BMW Fun Fact #41: DAS DREADFORT was never been taken during a seige',
//            'BMW Fun Fact #42: DETROIT was never raided',
//            'BMW Fun Fact #43: Roll Tight',
//            'BMW Fun Fact #44: We Dindu Nuffin. We Good Boys. We In Church. We In School. We Love Learning.',
//            'BMW Fun Fact #45: BMW Stands for Big Meaty Women',
//            'BMW Fun Fact #46: Real Socialism Has Never Been Tried',
//            'BMW Fun Fact #47: Taylor Doesnt Play Video Games',
//            'BMW Fun Fact #48: BLM Is Bigger Than Sports',
//            'BMW Fun Fact #49: Prester Jane Has A Mangled Penis',
//            'BMW Fun Fact #50: Yuri Is The Purest Form of Love https://i.imgur.com/Lm7cJYh.jpg',
//            'BMW Fun Fact #51: https://i.imgur.com/46p4udN.png',
//            'BMW Fun Fact #52: Spacedad Is a Cuck https://i.imgur.com/K9lZ3cF.png',
//            'BMW Fun Fact #53: https://i.imgur.com/mGAJTWS.png',
//            'BMW Fun Fact #420: Smoke Weed Everyday',
//            'BMW Fun Fact #1488: Hitler Did Nothing Wrong'
//          ];
//          randomFact = funfacts[Math.floor(Math.random() * funfacts.length)];
//          channel.sendMessage(randomFact);
//        } else if (message === '!bird') {
//          /*else if(message === "!funfact") {
//          testfacts = [
//            "BMW Fun Fact #69: Suck my dick you fuckman"
//            channel.uploadFile("./saemotes/ripp.png"),
//          ];
//          randomFact = testfacts[Math.floor(Math.random() * testfacts.length)];
//          channel.sendMessage(randomFact);
//        } */
//
//          /* Moved that shit to packages/roles.js
//          else if (S(message).startsWith("!join-role ")) {
//          roleName = origMessage.slice(11);
//          if(roleName.toLowerCase() === "bit boys" || roleName.toLowerCase() === "admin" || roleName.toLowerCase() === "carbon" || roleName.toLowerCase() === "mods" || roleName.toLowerCase() === "veteran poopsockers" || roleName.toLowerCase() === "bot" || roleName.toLowerCase() === "bad bots" || roleName.toLowerCase() === "make discord great again" || roleName.toLowerCase() === "Ａｅｓｔｈｅｔｉｃ" || roleName.toLowerCase() === "poopsockers" || roleName.toLowerCase() === "the fuzz" || roleName.toLowerCase() === "lord of the waifus" || roleName.toLowerCase() === "Tech, Admin, & Dev Duders" || roleName.toLowerCase() === "manage quotes" || roleName.toLowerCase() === "gdn muted" || roleName.toLowerCase() === "bmw propaganda" || roleName.toLowerCase() === "oniichanbot" || roleName.toLowerCase() === "spergbot" || roleName.toLowerCase() === "rude duders" || roleName.toLowerCase() === "dig nick bigger") {
//            channel.sendMessage(":no_entry_sign:`Wow you must think you're really clever`:no_entry_sign:");
//            return;
//          }
//          role = guild.roles.find(r => r.name.toLowerCase() == roleName.toLowerCase());
//          if(role) {
//            author.memberOf(guild).assignRole(role);
//            channel.sendMessage(`Assigned ${roleName} to ${author.mention}`)
//          }
//          else {
//            channel.sendMessage(":no_entry_sign: `Error: Not allowed/non-existent role` :no_entry_sign:");
//          }
//        }
//
//          else if (S(message).startsWith("!leave-role ")) {
//          roleName = origMessage.slice(12)
//          role = guild.roles.find(r => r.name.toLowerCase() == roleName.toLowerCase() );
//          if(role) {
//            author.memberOf(guild).unassignRole(role);
//            channel.sendMessage(`Removed ${roleName} from ${author.mention}`);
//          }
//          else {
//            channel.sendMessage(":no_entry_sign: `Error: Not allowed/non-existent role` :no_entry_sign:");
//          }
//        }
//        */
//          birds = [
//            '凸(｀0´)凸',
//            '凸ಠ益ಠ)凸',
//            '╭∩╮(︶︿︶)╭∩╮',
//            '┌∩┐(ಠ_ಠ)┌∩┐',
//            'ᕕ༼ ͠ຈ Ĺ̯ ͠ຈ ༽┌∩┐',
//            '凸(⊙▂⊙ )',
//            '┌П┐(►˛◄’!)',
//            '凸(｀⌒´メ)凸',
//            '凸(｀△´＋）',
//            '( ︶︿︶)_╭∩╮',
//            '凸(>皿<)凸',
//            '凸(^▼ｪ▼ﾒ^)',
//            't(- n -)t',
//            '┌∩┐(◣_◢)┌∩┐',
//            '┌∩┐(ಠ_ಠ)┌∩┐'
//          ];
//
//          randomBird = birds[Math.floor(Math.random() * birds.length)];
//          channel.sendMessage(randomBird);
//          //this is going to be rewritten as a library in the future
//        } else if (message === '!dog') {
//          channel.sendMessage(dogge());
//        } else if (message === '!cat') {
//          channel.sendMessage(catte());
//        } else if (message === '!roles') {
//          channel.sendMessage(`${e.message.guild.roles.map(r => r.name).join(', ')}`);
//        } else if (message === '!guilds') {
//          channel.sendMessage(`${client.Guilds.map(g => g.name).join(', ')}`);
//        } else if (message === '!delete-bot-messages') {
//          if (author.can(Discordie.Permissions.General.MANAGE_GUILD, guild)) {
//            channel.sendMessage('Deleting previous OniiChanBot messages...');
//          } else {
//            channel.sendMessage(
//              ':no_entry_sign: `you do not have permissions to do that` :no_entry_sign:'
//            );
//          }
//        } else if (message === '!invite') {
//          if (
//            author.can(!Discordie.Permissions.General.CREATE_INSTANT_INVITE, guild)
//          ) {
//            channel.sendMessage(
//              ':no_entry_sign: `I do not have permissions to do that` :no_entry_sign:'
//            );
//          } else {
//            var generateInvite = channel.createInvite({
//              temporary: false,
//              xkcdpass: false
//            });
//            generateInvite.then(function(res) {
//              channel.sendMessage('https://discord.gg/' + res.code);
//            });
//          }
//        } else if (S(message).match(/\b\shth\b/) !== null) {
//          channel.sendMessage('plz dont be a jerk');
//        } else if (S(message).match(/\brip\b/) !== null) {
//          if (author.id === client.User.id) {
//            return;
//          }
//          if (random >= 1 && random <= 100) {
//            channel.sendMessage('Ya, RIP');
//            channel.uploadFile('./saemotes/ripp.png', 'rip.png').catch();
//          } else {
//            return;
//          }
//        } else if (S(message).match(/\bsteam name\b/) !== null) {
//          if (author.id === client.User.id) {
//            return;
//          }
//          if (random >= 1 && random <= 100) {
//            channel.sendMessage(
//              'Easiest way to get Bimmers steam names? The Steam group! http://steamcommunity.com/groups/Wrongthinktank'
//            );
//            channel.uploadFile('./saemotes/:eng101:.png', 'eng101.png').catch();
//          } else {
//            return;
//          }
//        }
//      });

process.on('uncaughtException', function(err) {
  if (err.code !== 'ECONNRESET') {
    throw err;
  } else {
    console.error(err);
  }
});
