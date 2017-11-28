const { Command } = require('../../index');

module.exports = class extends Command {
    
    constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Reboots the bot.'
		});
	}

	async run(msg) {
		await msg.channel.send(msg.client.languages.default.get('COMMAND_REBOOT')).catch(err => this.client.emit('error', err));
		process.exit();
	}

};