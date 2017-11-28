const { join } = require('path');
const { Collection } = require('discord.js');
const Language = require('./Language');
const Store = require('./Store');

class LanguageStore extends Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.coreDir = join(this.client.coreBaseDir, 'idioms');

        this.userDir = join(this.client.clientBaseDir, 'idioms');

        this.holds = Language;

        this.name = 'languages';
    }

    get default() {
        return this.get(this.client.config.language);
    }

    delete(name) {
        const language = this.resolve(name);
        if (!language) return false;
        super.delete(language.name);
        return true;
    }

    set(language) {
        if (!(language instanceof this.holds)) return new Error(`Only ${this.name} may be stored in the Store.`);
        const existing = this.get(language.name);
        if (existing) this.delete(existing);
        super.set(language.name, language);
        return language;
    }

    init() {}
	load() {}
	async loadAll() {}
	resolve() {}
}

Store.applyClass(LanguageStore);

module.exports = LanguageStore;