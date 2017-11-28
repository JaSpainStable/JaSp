const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Ping/Pong command. I wonder what this does? /sarcasm' });
	}

	async run(msg) {
		const message = await msg.send(msg.language.get('COMMAND_PING'));
		return msg.send(msg.language.get('COMMAND_PINGPONG', message.createdTimestamp - msg.createdTimestamp, Math.round(this.client.ping)));
	}

};