const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Command = require('./Command');
const Store = require('./Store');

class CommandStore extends Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.coreDir = join(this.client.coreBaseDir, 'commands');

        this.userDir = join(this.client.clientBaseDir, 'commands');

        this.holds = Command;

        this.name = 'commands';
    }

    get(name) {
		return super.get(name);
    }
    
    has(name) {
		return super.has(name);
    }
    
    set(command) {
		if (!(command instanceof Command)) return this.client.emit('error', 'Solo los comandos pueden ser guardados en un CommandStore.');
		const existing = this.get(command.name);
		if (existing) this.delete(existing);
		super.set(command.name, command);
		return command;
    }
    
    delete(name) {
		const command = this.resolve(name);
		if (!command) return false;
		super.delete(command.name);
		return true;
    }
    
    clear() {
		super.clear();
    }
    
    async loadAll() {
		this.clear();
		await CommandStore.walk(this, this.coreDir);
		await CommandStore.walk(this, this.userDir);
		return this.size;
    }
    
    init() {}
    resolve() {}
    
    static async walk(store, dir, subs = []) {
		const files = await fs.readdir(join(dir, ...subs)).catch(() => { fs.ensureDir(dir).catch(err => store.client.emit('error', err)); });
    
    if (!files) return true;
		return Promise.all(files.map(async file => {
      if (file.endsWith('.js')) return store.load(dir, [...subs, file]);
			return CommandStore.walk(store, dir, [...subs, file]);
		}));
	}
}

Store.applyClass(CommandStore, ['loadAll']);

module.exports = CommandStore;