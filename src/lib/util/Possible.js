const maxMinTypes = ['str', 'string', 'num', 'number', 'float', 'int', 'integer'];
const regexTypes = ['reg', 'regex', 'regexp'];

class Possible {
    constructor([, name, type = 'literal', min, max, regex, flags]) {
        this.name = name;

        this.type = type.toLowerCase();

        this.min = maxMinTypes.includes(this.type) && min ? Possible.resolveLimit(min, 'min') : null;

        this.max = maxMinTypes.includes(this.type) && max ? Possible.resolveLimit(max, 'max') : null;

        this.regex = regexTypes.includes(this.type) && regex ? new RegExp(regex, flags) : null;

        if(regexTypes.includes(this.type) && !this.regex) throw 'Los tipos Regex tienen que incluir una expresion regular';
    }

    static resolveLimit(limit, type) {
		if (isNaN(limit)) throw `${type} tiene que ser un numero`;
		const tempMin = parseFloat(limit);
		if (['str', 'string', 'int', 'integer'].includes(type) && tempMin % 1 !== 0) throw `${type} tiene que ser un integer para este tipo.`;
		return tempMin;
	}
}

module.exports = Possible;