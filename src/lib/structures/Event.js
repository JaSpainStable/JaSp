const Piece = require('./Piece');

class Event {


    constructor(client, dir, file, options = {}) {

        this.client = client;
        
        this.dir = dir;
        
        this.file = file;
        
        this.name = options.name || file.slice(0, -3);
        
        this.type = 'event';
        
        this.enabled = 'enabled' in options ? options.enabled : true;

    }

    _run(...args) {
        if(this.enabled) this.run(...args);
    }

    run() {

    }

    async init() {

    }

    async reload() {}
    unload() {}
    disable() {}
    enable() {}

}

Piece.applyClass(Event);

module.exports = Event;