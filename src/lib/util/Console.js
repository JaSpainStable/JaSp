const { Console } = require('console');
const Colors = require('./Colors');
const moment = require('moment');
const { inspect } = require('util');

class JaSpConsole extends Console {

    constructor({ stdout = process.stdout, stderr = process.stderr, useColor, colors = {}, timestamps = true }) {
        super(stdout, stderr);

        Object.defineProperty(this, 'stdout', { value: stdout });

        Object.defineProperty(this, 'stderr', { value: stderr });

        this.timestamps = timestamps === true ? 'DD/MM/YYYY HH:mm:ss' : timestamps;

        this.useColors = typeof useColor === 'undefined' ? this.stdout.isTTY || false : useColor;

        this.colors = {
            debug: colors.debug || {
                type: 'log',
                message: { background: null, text: null, style: null},
                time: { background: 'magenta', text: null, style: null}
            },
            error: colors.error || {
                type: 'error',
                message: { background: null, text: null, style: null},
                time: { background: 'red', text: null, style: null}
            },
            log: colors.log || {
                type: 'log',
                message: { background: null, text: null, style: null},
                time: { background: 'blue', text: null, style: null}
            },
            verbose: colors.verbose || {
                type: 'log',
                message: { background: null, text: 'gray', style: null},
                time: { background: null, text: 'gray', style: null}
            },
            warn: colors.warn || {
                type: 'warn',
                message: { background: null, text: null, style: null},
                time: { background: 'lightyellow', text: 'black', style: null}
            },
            wtf: colors.wtf || {
                type: 'error',
                message: { background: null, text: 'red', style: null},
                time: { background: 'red', text: null, style: null}
            }
        }
    }

    write(data, type = 'log') {
        data = JaSpConsole.flatten(data, this.useColors);
        const color = this.colors[type.toLowerCase()] || {};
        const message = color.message || {};
        const time = color.time || {};
        const timestamp = this.timestamps ?  `${this.timestamp(`[${moment().format(this.timestamps)}]`, time)} ` : '';
        super[color.type || 'log'](data.split('\n').map(str =>  `${timestamp}${this.messages(str, message)}`).join('\n'));
    }

    log(...data) {
		this.write(data, 'log');
    }
    
    warn(...data) {
		this.write(data, 'warn');
    }
    
    error(...data) {
		this.write(data, 'error');
    }
    
    debug(...data) {
		this.write(data, 'debug');
    }
    
    verbose(...data) {
		this.write(data, 'verbose');
    }
    
    wtf(...data) {
		this.write(data, 'wtf');
    }
    
    messages(string, message) {
		if (!this.useColors) return string;
		return Colors.format(string, message);
	}

    timestamp(timestamp, time) {
        if (!this.useColors) return timestamp;
        return Colors.format(timestamp, time);
    }

    static flatten(data, useColors) {
        if (typeof data === 'undefined' || typeof data === null) return String(data);
        if (typeof data === 'string') return data;
        if (typeof data === 'object') {
            if (Array.isArray(data)) return data.join('\n');
            return data.stack || data.message || inspect(data, { depth: 0, colors: useColors });
        }
        return String(data);
    }
}

module.exports = JaSpConsole;