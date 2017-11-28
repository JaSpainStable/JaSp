const Piece = require('./Piece');

class Language {

    constructor(client, dir, file, options = {}) {

        this.client = client;

        this.dir = dir;

        this.file = file;

        this.name = options.name || file.slice(0, -3);

        this.type = 'language';

        this.enabled = 'enabled' in options ? options.enabled : true;
    }

    get(term, ...args) {
        if (!this.enabled && this !== this.client.languages.default) return this.client.languages.default.get(term, ...args);
        if (!this.language[term]) {
            if (this === this.client.languages.default) return this.language.DEFAULT(term);
            return [
                    `${this.language.DEFAULT(term)}`,
                    '',
                    `**${this.language.DEFAULT_LANGUAGE}:**`,
                    `${(args.length > 0 ? this.client.languages.default.language[term](...args) : this.client.languages.default.language[term]) || this.client.languages.default.language.DEFAULT(term)}`
            ].join('\n');
        }
        return args.length > 0 ? this.language[term](...args) : this.language[term];
    }

    async init() {

    }

    async load() {}
    disable() {}
    enable() {}
}

Piece.applyClass(Language);

module.exports = Language;