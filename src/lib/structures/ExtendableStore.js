const { join } = require('path');
const Discord = require('discord.js');
const Extendable = require('./Extendable');
const Store = require('./Store');

class ExtendableStore extends Discord.Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.coreDir = join(this.client.coreBaseDir, 'extendables');

        this.userDir = join(this.client.clientBaseDir, 'extendables');

        this.holds = Extendable;

        this.name = 'extendables';
    }

    delete(name) {
        const constructor = this.resolve(name);
        if (!constructor) return false;
        for (const structure of constructor.appliesTo) delete Discord[structure].prototype[this.name];
        super.delete(constructor.name);
        return true;
    }

    clear() {
		for (const constructor of this.keys()) this.delete(constructor);
    }
    
    set(constructor) {
        if (!(constructor instanceof Extendable)) return this.client.emit('error', 'Solo las Extendables pueden ser alamacenados en una ExtendableStore');
        constructor.init();
        super.set(constructor.name, constructor);
        return constructor;
    }

    init() {}
	load() {}
	async loadAll() {}
	resolve() {}
}

Store.applyClass(ExtendableStore);

module.exports = ExtendableStore;