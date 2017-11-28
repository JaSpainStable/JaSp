const { Event } = require('../index');

module.exports = class extends Event {
    constructor(client, dir, file){
        super(client, dir, file, {
            enabled: 'message' in client.config.consoleEvents ? !!client.config.consoleEvents.message : true
        });
    }

	run(msg) {
        this.client.monitors.init();
		if (this.client.ready) this.client.monitors.run(msg);
	}

};