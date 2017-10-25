'use strict';


module.exports = {
    name: 'Misc',
    commands: [
        {
            alias:['status', 'game'],
            params:'status',
            help:'Set the bot\'s status message',
            action: (bot, msg, params) => {
                const game = params.length ? params.join(' ') : '';
                bot.User.setStatus('online', {name: game});
            }
        },
        /*{
            alias:['roll', 'dice'],
            params:'sides, default=6',
            help:'Roll a die',
            action: (bot, msg, params) => {
                let sides = 6;
                if (params.length > 0) {
                    const num = params[0] * 1;
                    if (!isNaN(num)) sides = num;
                }
                msg.reply('you rolled: **' + (Math.floor(Math.random() * sides) + 1) + '** out of ' + sides + '.');
            }
        },*/
        {
            alias:['coin', 'flip'],
            params:'guess, default=heads',
            help:'Roll a die',
            action: (bot, msg, params) => {
                const dict = {
                    true: 'Heads',
                    false: 'Tails'
                };
                let choice = true;
                if (params.length > 0) {
                    choice = params[0].toLowerCase().indexOf('head') !== -1;
                }
                const flip = Math.random() >= 0.5;
                const win = flip === choice ? "Congrats! :+1:" : "Sorry for your loss. :ghost:";
                const res = "**" + dict[flip+''] + "** was flipped. You guessed **" + dict[choice+''] + "**. " + win;
                msg.reply(res);
            }
        },
    ]
};
