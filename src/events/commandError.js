const { Event } = require('../index');

module.exports = class extends Event {

	run(msg, command, params, error) {
		if (error.stack) this.client.emit('log', error.stack);
		else if (error.message) msg.channel.sendCode('JSON', error.message).catch(err => this.client.emit('log', err));
		else msg.channel.send(error).catch(err => this.client.emit('log', err));
	}

};