const { join } = require('path');
const { Collection } = require('discord.js');
const Event = require('./Event');
const Store = require('./Store');

class EventStore extends Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });
        
        this.coreDir = join(this.client.coreBaseDir, 'events');

        this.userDir = join(this.client.clientBaseDir, 'events');

        this.holds = Event;

        this.name = 'events';
    }

    clear() {
		for (const event of this.keys()) this.delete(event);
	}

    delete(name) {
        const event = this.resolve(name);
        if (!event) return false;
        super.delete(event.name);
        return true;
    }

    set(event) {
        if (!(event instanceof this.holds)) return this.client.emit('error', 'Solo los eventos pueden ser guargados en un EventStore.');
        const existing = this.get(event.name);
        if (existing) this.delete(existing);
        this.client.on(event.name, event._run.bind(event));
        super.set(event.name, event);
        return event;
    }

    init() {}
	load() {}
	async loadAll() {}
	resolve() {}
}

Store.applyClass(EventStore);

module.exports = EventStore;