const AbstractPlugin = require('./plugins/abstract-plugin.js');
const Discord = require('discord.js');
const Reporter = require('./lib/reporter.js');
const path = require('path');
const fs = require('fs');

function init(client) {
  const reporter = new Reporter();
  reporter.register({
    userId: '268183210297393152',
    client
  });

  const pluginPath = path.join(__dirname, 'plugins');
  const plugins = fs
    .readdirSync(pluginPath)
    .filter(
      filename =>
        fs.statSync(path.join(pluginPath, filename)).isFile() &&
        filename !== 'abstract-plugin.js'
    )
    .map(filename => {
      const plugin = require(path.join(pluginPath, filename));
      plugin.name = filename.slice(0, filename.indexOf('.js'));
      return plugin;
    })
    .map(plugin => {
      const pluginInstance = new plugin(client);
      pluginInstance.name = plugin.name;
      console.log('Loaded plugin: ', pluginInstance.name);
      return pluginInstance;
    });

  // Handle Help DM's
  client.on('message', async message => {
    try {
      if (message.channel instanceof Discord.DMChannel) {
        if (!/^\.help/.test(message.content)) return;

        const args = message.content
          .slice(5)
          .split(' ')
          .filter(arg => arg);

        if (args.length) {
          const plugin = plugins
            .filter(plugin => plugin instanceof AbstractPlugin)
            .find(
              plugin => plugin.name.toLowerCase() === args[0].toLowerCase()
            );
          if (plugin) {
            await message.reply(plugin.getHelp(args.slice(1)));
          } else {
            await message.reply(`**${args[0]}** is not a plugin`);
          }
        } else {
          const descriptions = plugins
            .filter(plugin => plugin instanceof AbstractPlugin)
            .map(
              plugin =>
                `**${plugin.name}**${
                  plugin.getDescription() ? `: ${plugin.getDescription()}` : ''
                }`
            )
            .join('\n');
          await message.reply(
            `Use \`.help [PluginName]\` for help for a specific plugin.\nInstalled Plugins:\n-----------------\n${descriptions}`
          );
        }
      }
    } catch (e) {
      e.data = { messageContent: message.content };
      reporter.error(e);
    }
  });
}

module.exports = { init };
