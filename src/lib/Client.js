const Discord = require('discord.js');
const path = require('path');
const util = require('./util/util');
const Stopwatch = require('./util/Stopwatch');
const ArgResolver = require('./parsers/ArgResolver');
const InternalCommand = require('./structures/InternCommand');
const ExtendableStore = require('./structures/ExtendableStore');
const CommandStore = require('./structures/CommandStore');
const Console = require('./util/Console');
const LanguageStore = require('./structures/LanguageStore');
const EventStore = require('./structures/EventStore');
const MonitorStore = require('./structures/MonitorStore');

/**
 * El cliente de JaSp, lo que controla todo.
 * @extends external:Client
 */
class JaSpClient extends Discord.Client {

    /**
     * @typedef {Object} JaSpConfig
     * @memberOf JaSpClient
     * @property {string} prefix El prefijo para los comandos
     * @property {DiscordJSConfig} [clientOptions={}] Las opciones para pasar a Discord.js
     * @property {string} [clientBaseDir=path.dirname(require.main.filename)] El directorio donde todas las piezas pueden ser encontradas
     */

    constructor(config = {}) {
        if (typeof config !== 'object') throw new TypeError('La configuracion para JaSp tiene que ser un objeto');
        super(config.clientOptions);

        /**
         * La configuracion pasada a new JaSp.Client
         * @since 0.0.1
         * @type {JaSpConfig}
         */
        this.config = config;
        this.config.console = config.console || {};
        this.config.consoleEvents = config.consoleEvents || {};
        this.config.language = config.language || 'es-ES';

        /**
         * El directorio de node_modules donde esta la carpeta de JaSp
         * @since 0.0.1
         * @type {string}
         */
        this.coreBaseDir = path.join(__dirname, '../');
    
        /**
         * El directorio donde se almacenan los datos de el usuario
         * @since 0.0.1
         * @type {string}
         */
        this.clientBaseDir = config.clientBaseDir ? path.resolve(config.clientBaseDir) : path.dirname(require.main.filename);
    
        this.console = new Console({
			stdout: this.config.console.stdout,
			stderr: this.config.console.stderr,
			useColor: this.config.console.useColor,
			colors: this.config.console.colors,
			timestamps: this.config.console.timestamps
		});

        this.ready = false;

        this.argResolver = new ArgResolver(this);

        this.languages = new LanguageStore(this);

        this.pieceStores = new Discord.Collection();

        this.events = new EventStore(this);

        this.commands = new CommandStore(this);

        this.extendables = new ExtendableStore(this);

        this.monitors = new MonitorStore(this);

        this.commandMessages = new Discord.Collection();

        this.commandMessageLifetime = config.commandMessageLifetime || 1800;

        this.commandMessageSweep = config.commandMessageSweep || 900;

        this.methods = {
            Collection: Discord.Collection,
            Embed: Discord.MessageEmbed,
            MessageCollector: Discord.MessageCollector,
            Webhook: Discord.WebhookClient,
            escapeMarkdown: Discord.escapeMarkdown,
            splitMessage: Discord.splitMessage,
            InternalCommand,
            util
        }

        this.application = null;

        this.registerStore(this.languages)
                .registerStore(this.events)
                .registerStore(this.commands)
                .registerStore(this.monitors)
                .registerStore(this.extendables);

        this.once('ready', this._ready.bind(this));
    }

    registerStore(store) {
		this.pieceStores.set(store.name, store);
		return this;
    }
    
    registerPiece(pieceName, store) {
		ArgResolver.prototype[pieceName] = async function (arg, currentUsage, possible, repeat, msg) {
			const piece = store.get(arg);
			if (piece) return piece;
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, pieceName);
		};
		return this;
    }
    
    unregisterPiece(pieceName) {
		delete ArgResolver.prototype[pieceName];
		return this;
	}

    async login(token) {
        const loaded = await Promise.all(this.pieceStores.map(async store => `Cargado ${await store.loadAll()} ${store.name}.`))
        .catch((err) => {
            console.error(err);
            process.exit();
        });
        this.emit('log', loaded.join('\n'));
        return super.login(token);
    }

    async _ready() {
        if (this.user.bot) this.application = await super.fetchApplication();

        util.initSensitive(this);
        this.setInterval(this.sweepCommandMessages.bind(this), this.commandMessageSweep * 1000);

        this.ready = true;
        this.emit('JSReady');
    }

    sweepCommandMessages(lifetime = this.commandMessageLifetime) {
		if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
		if (lifetime <= 0) {
			this.emit('log', "Didn't sweep messages - lifetime is unlimited");
			return -1;
		}

		const lifetimeMs = lifetime * 1000;
		const rightNow = Date.now();
		const messages = this.commandMessages.size;

		for (const [key, message] of this.commandMessages) {
			if (rightNow - (message.trigger.editedTimestamp || message.trigger.createdTimestamp) > lifetimeMs) this.commandMessages.delete(key);
		}

		this.emit('log', `Swept ${messages - this.commandMessages.size} commandMessages older than ${lifetime} seconds.`);
		return messages - this.commandMessages.size;
	}
}

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});

module.exports = JaSpClient;