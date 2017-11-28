const Tag = require('./Tag');

class ParsedUsage {

    constructor(client, command) {

        Object.defineProperty(this, 'client', { value: client });

        this.names = [command.name];

        this.commands = this.names.length === 1 ? this.names[0] : `(${this.names.join('|')})`;

        this.delimitedUsage = command.usageString !== '' ? ` ${command.usageString.split(' ').join(command.usageDelim)}` : '';

        this.usageString = command.usageString;

        this.parsedUsage = this.constructor.parseUsage(this.usageString);

        this.nearlyUsage = `${this.commands}${this.delimitedUsage}`;
    }

    fullUsage(msg) {
        const prefix = msg.client.config.prefix;
        return `${prefix}${this.nearlyUsage}`;
    }

    static parseUsage(usageString) {
        let usage = {
            tags: [],
            opened: 0,
            current: '',
            openRegex: false,
            openReq: false,
            last: false,
            char: 0,
            from: 0,
            at: '',
            fromto: ''
        };

        for (let i = 0; i < usageString.length; i++) {
            const char = usageString[i];
            usage.char = i + 1;
            usage.from = usage.char - usage.current.length;
            usage.at = `at char #${usage.char} '${char}'`;
            usage.fromto = `from char #${usage.from} to #${usage.char} '${usage.current}'`;

            if(usage.last && char !== ' ') throw `${usage.at}: no puede haber nada más después de la etiqueta de repetición.`;

            if(char === '/' && usage.current[usage.current.length - 1] !== '\\') usage.openRegex = !usage.openRegex;

            if(usage.openRegex) {
                usage.current += char;
                continue;
            }

            if(['<', '['].includes(char)) usage = ParsedUsage.tagOpen(usage, char);
			else if(['>', ']'].includes(char)) usage = ParsedUsage.tagClose(usage, char);
			else if([' ', '\n'].includes(char)) usage = ParsedUsage.tagSpace(usage, char);
			else usage.current += char;
        }

        if(usage.opened) throw `desde char #${usageString.length - usage.current.length} '${usageString.substr(-usage.current.length - 1)}' para terminar: una etiqueta se dejó abierta`;
		if(usage.current) throw `desde char #${(usageString.length + 1) - usage.current.length} para terminar '${usage.current}' un literal fue encontrado fuera de una etiqueta.`;

		return usage.tags;
    }

    static tagOpen(usage, char) {
		if (usage.opened) throw `${usage.at}: no puedes abrir una etiqueta dentro de otra etiqueta.`;
		if (usage.current) throw `${usage.fromto}: no puede haber un literal fuera de una etiqueta`;
		usage.opened++;
		usage.openReq = char === '<';
		return usage;
	}

	static tagClose(usage, char) {
		const required = char === '>';
		if (!usage.opened) throw `${usage.at}: etiqueta de cierre no válida encontrada`;
		if (!usage.openReq && required) throw `${usage.at}: Cierre inválido de '[${usage.current}' con '>'`;
		if (usage.openReq && !required) throw `${usage.at}: Cierre inválido de '<${usage.current}' con ']'`;
		if (!usage.current) throw `${usage.at}: etiqueta vacia encontrada`;
		usage.opened--;
		if (usage.current === '...') {
			if (usage.openReq) throw `${usage.at}: no se puede requerir la etiqueta de repetición`;
			if (usage.tags.length < 1) throw `${usage.fromto}: no puede haber una repetición al principio`;
			usage.tags.push({ type: 'repeat' });
			usage.last = true;
		} else {
			usage.tags.push(new Tag(usage.current, usage.tags.length + 1, required));
		}
		usage.current = '';
		return usage;
    }
    
    static tagSpace(usage, char) {
		if (char === '\n') throw `${usage.at}: no puede haber un salto de línea en la cadena de uso`;
		if (usage.opened) throw `${usage.at}: espacios no están permitidos dentro de una etiqueta`;
		if (usage.current) throw `${usage.fromto}: no puede haber un literal fuera de una etiqueta.`;
		return usage;
	}
}

module.exports = ParsedUsage;