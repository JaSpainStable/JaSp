const { Command } = require('../../index');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Muestra la ayuda de un comando',
            usage: '[Command:cmd]'
        });
    }

    async run(msg, [cmd]) {
        const method = this.client.user.bot ? 'author' : 'channel';
        if (cmd) {
            const info = [
                `= ${cmd.name} =`,
                cmd.description,
                `uso :: ${cmd.usage.fullUsage(msg)}`,
                'Ayuda extendida ::',
                cmd.extendedHelp
            ].join('\n');
            return msg.channel.send(info, { code: 'asciidoc' });
        }
        const help = await this.buildHelp(msg);
		const categories = Object.keys(help);
		const helpMessage = [];
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**Comandos del ${categories[cat]}**: \`\`\`asciidoc`, '');
			const subCategories = Object.keys(help[categories[cat]]);
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
			helpMessage.push('```\n\u200b');
		}

		return msg[method].send(helpMessage, { split: { char: '\u200b' } })
			.then(() => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.channel.send(msg.client.languages.default.get('COMMAND_HELP_DM')); })
			.catch(() => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.channel.send(msg.client.languages.default.get('COMMAND_HELP_NODM')); });
	}

    async buildHelp(msg) {
        const help =  {};

        const commandNames = Array.from(this.client.commands.keys());
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        await Promise.all(this.client.commands.map((command) => {
            if (!help.hasOwnProperty(command.category)) help[command.category] = {};
            if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
            help[command.category][command.subCategory].push(`${msg.client.config.prefix}${command.name.padEnd(longest)} :: ${command.description}`);
            return;
        }));

        return help;
    }
};