const Piece = require('./Piece');
const ParsedUsage = require('../util/ParsedUsage');

class Command {

    constructor(client, dir, file, options = {}) {

        this.client = client;

        this.type = 'command';

        this.enabled = 'enabled' in options ? options.enabled : true;

        this.runIn = options.runIn || ['text', 'dm', 'group'];

        this.cooldown = options.cooldown || 0;

        this.permLevel = options.permLevel || 0;

        this.Perms = options.Perms || [];

        this.requiredSettings = options.requiredSettings || [];

        this.name = options.name || file[file.length - 1].slice(0, -3);

        this.description = options.description || '';

        this.extendedHelp = options.extendedHelp || 'No hay ayuda extendida.';

        this.usageString = options.usage || '';

        this.usageDelim = options.usageDelim || undefined;

        this.quotedStringSupport = 'quotedStringSupport' in options ? options.quotedStringSupport : this.client.config.quotedStringSupport;
    
        this.fullCategory = file.slice(0, -1);

        this.category = this.fullCategory[0] || 'Normal';

        this.subCategory = this.fullCategory[1] || 'Normal';

        this.usage = new ParsedUsage(client, this);

        this.cooldowns = new Map();

        this.file = file;

        this.dir = dir;
    }

    async init() {
        
	}

    async run() {

    }

    async load() {}
    disable() {}
    enable () {}

}

Piece.applyClass(Command);

module.exports = Command;