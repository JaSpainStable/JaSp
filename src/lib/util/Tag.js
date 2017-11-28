const Possible = require('./Possible');

class Tag {

    constructor(members, count, required) {

        this.type = required ? 'required' : 'optional';

        this.possibles = Tag.parseMembers(members, count);
    }

    static parseMembers(members, count) {
		const literals = [];
		const types = [];
		members = Tag.parseTrueMembers(members);
		return members.map((member, i) => {
			const current = `${members}: una etiqueta #${count} en límite #${i + 1}`;
			let possible;
			try {
				possible = new Possible(/^([^:]+)(?::([^{}/]+))?(?:{([^,]+)?(?:,(.+))?})?(?:\/(.+)\/(\w+)?)?$/i.exec(member));
			} catch (err) {
				if (typeof err === 'string') throw `${current}: ${err}`;
				throw `${current}: sintaxis inválida, no específica`;
			}
			if (possible.type === 'literal') {
				if (literals.includes(possible.name)) throw `${current}: no puede haber dos literales con el mismo texto.`;
				literals.push(possible.name);
			} else if (members.length > 1) {
				if (['str', 'string'].includes(possible.type) && members.length - 1 !== i) throw `${current}: el tipo String es vago, debe especificarlo en el último límite`;
				if (types.includes(possible.type)) throw `${current}: no puede haber dos límites con el mismo tipo (${possible.type})`;
				types.push(possible.type);
			}
			return possible;
		});
    }
    
    static parseTrueMembers(members) {
		const trueMembers = [];
		let regex = false;
		let current = '';
		for (const char of members) {
			if (char === '/') regex = !regex;
			if (char !== '|' || regex) {
				current += char;
			} else {
				trueMembers.push(current);
				current = '';
			}
		}
		trueMembers.push(current);
		return trueMembers;
    }
}

module.exports = Tag;