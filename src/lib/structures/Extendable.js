const Piece = require('./Piece');
const Discord = require('discord.js');

class Extendable {

    constructor(client, dir, file, appliesTo = [], options = {}) {

        this.client = client;

        this.dir = dir;

        this.file = file;

        this.name = options.name || file.slice(0, -3);

        this.type = 'extendable';

        this.appliesTo = appliesTo;

        this.enabled= 'enabled' in options ? options.enabled : true;

        this.target = options.JaSp ? require('./../../index') : Discord;
    }

    extend() {

    }

    async init() {
        if (this.enabled) this.enable(true);
    }

    disable() {
        if (this.client.listenerCount('pieceDisabled')) this.client.emit('pieceDisabled', this);
		this.enabled = false;
		for (const structure of this.appliesTo) delete this.target[structure].prototype[this.name];
		return this;
    }

    enable(init = false) {
        if (!init && this.client.listenerCount('pieceEnabled')) this.client.emit('pieceEnabled', this);
		this.enabled = true;
		for (const structure of this.appliesTo) Object.defineProperty(this.target[structure].prototype, this.name, Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend'));
		return this;
    }

    async load() {}
    unload() {}
}

Piece.applyClass(Extendable, ['disable', 'enable']);

module.exports = Extendable;