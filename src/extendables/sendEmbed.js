const { Extendable } = require('./../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(embed, content, options) {
		if (!options && typeof content === 'object') {
			options = content;
			content = '';
		} else if (!options) {
			options = {};
		}
		return this.sendMessage(content, Object.assign(options, { embed }));
	}

};