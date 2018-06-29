const Discord = require('discord.js');

class Reporter {
  constructor() {}

  async error(error) {
    try {
      const embed = new Discord.RichEmbed({
        author: { name: 'ERROR' },
        fields: [
          {
            name: 'Data',
            value: JSON.stringify(error.data, null, 4)
          },
          {
            name: 'Message',
            value: error.message
          },
          {
            name: 'Stack Trace',
            value: error.stack.slice(0, 1023)
          }
        ]
      });

      await this._user.send(embed);
    } catch (e) {
      console.error('ERROR REPORTER BLEW UP! THIS SHIT IS GETTING META\n', e);
    }
  }

  async info(message) {
    try {
      const embed = new Discord.RichEmbed({
        fields: [{ name: 'Message', value: message }]
      });

      await this._user.send(embed);
    } catch (e) {
      console.error('ERROR REPORTER BLEW UP! THIS SHIT IS GETTING META\n', e);
    }
  }

  async register({ userId, client }) {
    try {
      this._client = client;
      this._user = await this._client.fetchUser(userId);

      Object.freeze(this);
    } catch (e) {
      console.error('ERROR REPORTER BLEW UP! THIS SHIT IS GETTING META\n', e);
    }
  }
}

module.exports = Reporter;
