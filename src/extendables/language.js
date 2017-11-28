const { Extendable } = require('./../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'Guild']);
	}

	get extend() {
		return this.client.languages.default;
	}

};