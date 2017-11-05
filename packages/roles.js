'use strict';
const fs = require('fs');

const ownerId = '86531658622177280';
const roleFilename = 'roleWhitelist.json';

let roleWhitelist = {};
if (fs.existsSync(roleFilename)) {
	fs.readFile(roleFilename, 'utf8', (err, data) => {
		if (err) {
			console.error('Unable to read', roleFilename, ':', err);
			return;
		}

		if (data) roleWhitelist = JSON.parse(data);
	});
}
/* Sample structure for roleWhitelist
let roleWhitelist = {
	'guildid:': ['roleid1', 'roleid2', 'roleid3'],
	'guildid2': ['roleid1', 'roleid2', 'roleid3']
}
*/

module.exports = {
	name: 'Roles',
	commands: [{
			alias: ['join-role', 'jrole'],
			params: 'rolename',
			help: 'Assigns a whitelisted role to you',
			action: (bot, msg, params) => {
				if (params.length < 1) {
					msg.reply('Missing params');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length > 1) {
					msg.reply('Please only specify one role');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length == 1) {
					var role = msg.mention_roles[0];
				} else {
					var role = msg.guild.roles.find(role => role.name.toLowerCase() == params.join(' ').toLowerCase());
				}

				if (!role) {
					msg.reply('Unable to find role');
					return;
				}

				if (!roleWhitelist[msg.guild.id].find(roleid => roleid == role.id)) {
					msg.reply('Role ain\'t whitelisted');
					return;
				}

				msg.author.memberOf(msg.guild).assignRole(role);
			}
		},

		{
			alias: ['leave-role', 'lrole'],
			params: 'rolename',
			help: 'Removes a whitelisted role from you',
			action: (bot, msg, params) => {
				if (params.length < 1) {
					msg.reply('Missing params');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length > 1) {
					msg.reply('Please only specify one role');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length == 1) {
					var role = msg.mention_roles[0];
				} else {
					var role = msg.guild.roles.find(role => role.name.toLowerCase() == params.join(' ').toLowerCase());
				}

				if (!role) {
					msg.reply('Unable to find role');
					return;
				}

				if (!roleWhitelist[msg.guild.id].find(roleid => roleid == role.id)) {
					msg.reply('Role ain\'t whitelisted');
					return;
				}

				if (!msg.author.memberOf(msg.guild).hasRole(role)) {
					msg.reply('You don\'t even have that role assigned to you :thinking');
					return;
				}

				msg.author.memberOf(msg.guild).unassignRole(role);
			}
		},

		{
			alias: ['list-roles', 'lroles'],
			help: 'Lists available roles',
			action: (bot, msg, params) => {
				if (roleWhitelist[msg.guild.id] && roleWhitelist[msg.guild.id].length > 0) {
					// That filter/map crossreferences the guild roles against the whitelist and maps those roles to their rolenames
					msg.reply(
						'Available roles:\n```' +
						msg.guild.roles.filter(role => roleWhitelist[msg.guild.id].find(item => role.id == item)).map(role => role.name).join(', ') +
						'```'
					);
				} else {
					msg.reply('No roles have been whitelisted');
				}
			}
		},

		{
			alias: ['add-role', 'whitelist'],
			params: 'rolename',
			help: 'ADMIN ONLY, whitelists a role',
			action: (bot, msg, params) => {
				if (msg.author.id != ownerId) {
					msg.reply('You\'re not an admin');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length > 1) {
					msg.reply('Please only specify one role');
					return;
				}

				if (params.length < 1) {
					msg.reply('Missing params');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length == 1) {
					var role = msg.mention_roles[0];
				} else {
					var role = msg.guild.roles.find(role => role.name.toLowerCase() == params.join(' ').toLowerCase());
				}

				if (!role) {
					msg.reply('Unable to find role');
					return;
				}

				if (!roleWhitelist[msg.guild.id]) roleWhitelist[msg.guild.id] = [];
				roleWhitelist[msg.guild.id].push(role.id);
				fs.writeFile(roleFilename, JSON.stringify(roleWhitelist), 'utf8', err => {
					if (err) console.error('Unable to write to', roleFilename, ':', err);
				});
			}
		},

		{
			alias: ['del-role', 'unwhitelist'],
			params: 'rolename',
			help: 'ADMIN ONLY, removes a role from the whitelist',
			action: (bot, msg, params) => {
				if (msg.author.id != ownerId) {
					msg.reply('You\'re not an admin');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length > 1) {
					msg.reply('Please only specify one role');
					return;
				}

				if (params.length < 1) {
					msg.reply('Missing params');
					return;
				}

				if (msg.mention_roles && msg.mention_roles.length == 1) {
					var role = msg.mention_roles[0];
				} else {
					var role = msg.guild.roles.find(role => role.name.toLowerCase() == params.join(' ').toLowerCase());
				}

				if (!role) {
					msg.reply('Unable to find role');
					return;
				}

				roleWhitelist[msg.guild.id] = roleWhitelist[msg.guild.id].filter(item => item !== role.id);
				fs.writeFile(roleFilename, JSON.stringify(roleWhitelist), 'utf8', err => {
					if (err) console.error('Unable to write to', roleFilename, ':', err);
				});
			}
		}
	]
};