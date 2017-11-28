const { Extendable } = require('./../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(attachment, name, content, options = {}) {
		return this.send({ files: [{ attachment, name }], content, options });
	}

};