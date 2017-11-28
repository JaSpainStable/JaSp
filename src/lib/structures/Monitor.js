const Piece = require('./Piece');

class Monitor {

    constructor(client, dir, file, options = {}) {
        this.client = client;

        this.dir = dir;

        this.file = file;

        this.name = options.name || file.slice(0, -3);

        this.type = 'monitor';

        this.enabled = 'enabled' in options ? options.enabled : true;

        this.ignoreBots = 'ignoreBots' in options ? options.ignoreBots : true;

        this.ignoreSelf = 'ignoreSelf' in options ? options.ignoreSelf : true;

        this.ignoreOthers = 'ignoreOthers' in options ? options.ignoreOthers : true;
    }

    run() {

    }

    async init() {

    }

    async load() {}
    disable() {}
    enable() {}

}

Piece.applyClass(Monitor);

module.exports = Monitor;