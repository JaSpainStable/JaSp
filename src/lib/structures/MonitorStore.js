const { join } = require('path');
const { Collection } = require('discord.js');
const Monitor = require('./Monitor');
const Store = require('./Store');

class MonitorStore extends Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.coreDir = join(this.client.coreBaseDir, 'monitors');

        this.userDir = join(this.client.clientBaseDir, 'monitors');

        this.holds = Monitor;

        this.name = 'monitors';
    }

    delete(name) {
        const piece = this.resolve(name);
        if (!piece) return false;
        super.delete(piece.name);
        return true;
    }

    run(msg) {
        for (const monit of this.values()) {
            monit.run(msg);
            //if(monit.enabled && !(monit.ignoreBots && msg.author.bot) && !(monit.ignoreSelf && this.client.user === msg.author) && !(monit.ignoreOthers && this.client.user !== msg.author)) monit.run(msg);
        }
    }

    set(monitor) {
		if (!(monitor instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(monitor.name);
		if (existing) this.delete(existing);
		super.set(monitor.name, monitor);
		return monitor;
    }
    
    init() {}
	load() {}
	async loadAll() {}
	resolve() {}
}

Store.applyClass(MonitorStore);

module.exports = MonitorStore;