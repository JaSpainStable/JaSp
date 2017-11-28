const { Language, util } = require('../index');

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.language = {
            DEFAULT: (key) => `La clave '${key}' no ha sido traducida para 'es-ES'`,
            DEFAULT_LANGUAGE: 'Idioma predeterminado',
            COMMANDMESSAGE_MISSING: 'Faltan uno o más argumentos al final de la entrada.',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} es un argumento requerido.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Falta una opción requerida: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `Su opción no coincide con ninguna de las posibilidades: (${possibles})`,
            COMMAND_PING: 'Ping?',
            COMMAND_PINGPONG: (diff, ping) => `Pong! (El viaje duró: ${diff}ms. Latido: ${ping}ms.)`,
            COMMAND_RELOAD: (type, name) => `✔ Se ha recargado la pieza de tipo ${type}: ${name}`,
            COMMAND_RELOAD_ALL: (type) => `✔ Se han recargado las piezas de tipo ${type}.`,
            COMMAND_HELP_DM: '📥 | La lista de comandos ha sido enviado a tus mensajes privados.',
            COMMAND_HELP_NODM: '❌ | Parece que tienes tus mensajes privados desactivados, no pude enviarte la lista de comandos.',
            COMMAND_REBOOT: '⭕ Reiniciando...',
            RESOLVER_INVALID_PIECE: (name, piece) => `${name} debe ser un nombre válido de ${piece}.`,
            RESOLVER_STRING_SUFFIX: ' carácteres'
        };
    }
};