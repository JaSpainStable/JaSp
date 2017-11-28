const { Command } = require('./../../index');
const snek = require('snekfetch');
const fs = require('fs-nextra');
const { dirname, resolve } = require('path');
const vm = require('vm');

const piecesURL = 'https://gitlab.com/JaSpain/JaSp-pieces/raw/master/';
const types = ['commands', 'monitors', 'extendables'];

const mod = { exports: {} };

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            enable: false,
            permLevel: 10,
            description: 'Decsrga una pieza de un enlaze o del repositorio oficial',
            usage: '<commands|monitors|extendables|url:url> [location: str] [folder:str]',
            usageDelim: ' '
        });
    }

    async run(msg, [link, piece, folder = 'Downloaded']) {
        const genericURL = types.includes(link) ? `${piecesURL}${link}/${piece}.js` : link;
        if (link === 'commands' && !/\w+\/\w+/.test(piece)) {
			return msg.sendMessage(`${msg.author} | Error in folder, example: Misc/test`);
        }
        
        const text = await this.requestAndCheck(genericURL).catch(err => { throw `${msg.author} | ${err}`; });
		return this.process(msg, text, link, folder);
    }

    async requestAndCheck(newURL) {
        const { text } = await snek.get(newURL)
        .catch((error) => {
            if (error.message === 'Unexpected token <') {
                throw `Ha ocurrido un error: **${error}**`;
            }
            if (error.message === 'Not Found') throw `Ha ocurrido un error: **${error}**`;
            throw `Ha ocurrido un error: **${error}**`;
        });
    return text;
    }

    async process(msg, text, link, folder) {
		try {
			vm.runInNewContext(text, { module: mod, exports: mod.exports, require }, { timeout: 500 });
		} catch (err) {
			return this.client.emit('log', err, 'error');
		}

		const { name } = mod.exports;
		const description = mod.exports.description || 'Ninguna descripcion proporcionada.';
		const type = mod.exports.type || link;
		const modules = mod.exports.requiredModules || '!No hay modulos requeridos, sii!';

		try {
			this.runChecks(type, name);
			if (mod.exports.selfbot && this.client.user.bot) throw `No soy un autobot, así que no puedo descargar ni usar ${name}.`;
		} catch (err) {
			return msg.sendMessage(`${msg.author} | ${err}`);
		}

		const code = [
			'```asciidoc',
			'=== NOMBRE ===',
			name,
			'\n=== DESCRIPCION ===',
			description,
			'\n=== MODULOS REQUERIDOS ===',
			modules,
			'```'
		];

		await msg.sendMessage([
			`Estas seguro de cargar el siguiente ${type.slice(0, -1)} en tu bot?`,
			`Instalara los modulos requeridos. Esta consola solo durara 20 segundos.${code.join('\n')}`
		]);
		const collector = msg.channel.createMessageCollector(mes => mes.author === msg.author, { time: 20000 });

		collector.on('collect', (mes) => {
			if (mes.content.toLowerCase() === 'no') collector.stop('aborted');
			if (mes.content.toLowerCase() === 'si') collector.stop('success');
		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'aborted') return msg.sendMessage(`📵 Carga abortada, ${type.slice(0, -1)} no instalado.`);
			else if (reason === 'time') return msg.sendMessage(`⏲ Carga abortada, ${type.slice(0, -1)} no instalado. Lo corriste fuera de tiempo.`);
			await msg.sendMessage(`📥 \`Cargando ${type.slice(0, -1)}\``).catch(err => this.client.emit('log', err, 'error'));
			if (Array.isArray(modules) && modules.length > 0) {
				await this.client.funcs.installNPM(modules.join(' '))
					.catch((err) => {
						this.client.emit('error', err);
						process.exit();
					});
			}
			return this.load(msg, type, text, name, mod.exports.category || this.client.funcs.toTitleCase(folder));
		});

		return true;
	}
}