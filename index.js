'use strict';
const Discordie = require("discordie");
const Events = Discordie.Events;

const config = require('./config');
const packagemanager = require('./src/packagemanager');


const client = new Discordie({autoReconnect: true});

client.connect({token: config.token});

const messageHandler = function(e){
  if(e && e.message && e.message.content && e.message.content[0] === "!") {
    // !command argument argument argument ...
    const params = e.message.content.split(" ");
    const command = params.shift().substr(1).toLowerCase();
    packagemanager(client, e.message, command, params);
  }
};
client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});
client.Dispatcher.on(Events.MESSAGE_CREATE, messageHandler);

process.on('uncaughtException', function(err) {
  if (err.code !== 'ECONNRESET') {
    throw err;
  } else {
    console.error(err);
  }
});