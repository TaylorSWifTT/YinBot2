# YinBot2

## Getting Started
* Clone Repo
* `npm install`
* Copy `config-template.js` to `config.js` and set your bot credentials
* `npm start`

## Development
* **Tabs are for scrubs**
* Start with `npm run dev` for automatic restarting whenever you make a change
* Be a cool dude and use Prettier for auto-formatting

### Plugins
Plugins must have/be a constructor function which accepts the Discord.js Client object as its only argument.

**Plugins should also implement:**

`getDescription()`: Returns a short description of the plugin to be displayed when a user DM's `.help` to Yinbot

and optionally:

`getHelp(...args)`: Handles requests for more in-depth help when a user DM's `.help SomePlugin [OPTIONAL ARGS]` to Yinbot
