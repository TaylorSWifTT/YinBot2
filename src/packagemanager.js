'use strict';
const fs = require('fs');

const config = require('../config');


const pkgs = [];
for (let i=0;i<config.packages.length;i++) {
    pkgs.push(require('../packages/' + config.packages[i]));
}


function commands(bot, msg, command, params) {

    if (command === 'hhhhhhelp') {
        help(bot, msg, params);
        return;
    }

    let cmd;
    for (let i=0;i<pkgs.length;i++) {
        for (let j=0;j<pkgs[i].commands.length;j++) {
            cmd = pkgs[i].commands[j];
            if (cmd.alias.indexOf(command) !== -1) {
                console.log(`command\t${command}\tparams\t${params}`);
                cmd.action(bot, msg, params);
                return;
            }
        }
    }



};


function help(bot, msg, params) {
    let help = "";
    help += "\nAvailable Commands:";

    let pkg, command, alias;
    // For each package
    for (let i=0;i<pkgs.length;i++) {
        pkg = pkgs[i];
        help += '\n\n***' + pkg.name.toUpperCase() + '***';

        // For each command in the package
        for (let j=0;j<pkg.commands.length;j++) {
            command = pkg.commands[j];
            help += '\n**';

            // Build alias list
            alias = command.alias instanceof Array ? command.alias : [command.alias];
            for (let k=0;k<alias.length;k++) {
                help += '!' + alias[k];
                if (k !== alias.length - 1) help += ', ';
            }
            help += '**';

            // Add params and description if they exist
            if (command.params) help += '\tParams: *' + command.params + '*';
            if (command.help) help += '\t' + command.help;
        }
    }

    msg.reply(help);
}

module.exports = commands;