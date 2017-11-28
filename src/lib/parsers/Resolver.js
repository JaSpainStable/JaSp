const url = require('url');
const { Message, User, GuildMember, Role, Guild, Channel } = require('discord.js');

class Resolver {

	constructor(client) {
		
		Object.defineProperty(this, 'client', { value: client });
	}

	async msg(message, channel) {
		if (message instanceof Message) return message;
		return this.constructor.regex.snowflake.test(message) ? channel.messages.fetch(message).catch(() => null) : undefined;
	}

	async user(user) {
		if (user instanceof User) return user;
		if (user instanceof GuildMember) return user.user;
		if (user instanceof Message) return user.author;
		if (typeof user === 'string' && this.constructor.regex.userOrMember.test(user)) {
			return this.client.user.bot ?
				this.client.users.fetch(this.constructor.regex.userOrMember.exec(user)[1]).catch(() => null) :
				this.client.users.get(this.constructor.regex.userOrMember.exec(user)[1]);
		}
		return null;
	}

	async member(member, guild) {
		if (member instanceof GuildMember) return member;
		if (member instanceof User) return guild.members.fetch(member);
		if (typeof member === 'string' && this.constructor.regex.userOrMember.test(member)) {
			const user = this.client.user.bot ?
				await this.client.users.fetch(this.constructor.regex.userOrMember.exec(member)[1]).catch(() => null) :
				this.client.users.get(this.constructor.regex.userOrMember.exec(member)[1]);
			if (user) return guild.members.fetch(user).catch(() => null);
		}
		return null;
	}

	async channel(channel) {
		if (channel instanceof Channel) return channel;
		if (typeof channel === 'string' && this.constructor.regex.channel.test(channel)) return this.client.channels.get(this.constructor.regex.channel.exec(channel)[1]);
		return null;
	}

	async guild(guild) {
		if (guild instanceof Guild) return guild;
		if (typeof guild === 'string' && this.constructor.regex.snowflake.test(guild)) return this.client.guilds.get(guild);
		return null;
	}

	async role(role, guild) {
		if (role instanceof Role) return role;
		if (typeof role === 'string' && this.constructor.regex.role.test(role)) return guild.roles.get(this.constructor.regex.role.exec(role)[1]);
		return null;
	}

	async boolean(bool) {
		if (bool instanceof Boolean) return bool;
		if (['1', 'true', '+', 't', 'yes', 'y'].includes(String(bool).toLowerCase())) return true;
		if (['0', 'false', '-', 'f', 'no', 'n'].includes(String(bool).toLowerCase())) return false;
		return null;
	}

	async string(string) {
		return String(string);
	}

	async integer(integer) {
		integer = parseInt(integer);
		if (Number.isInteger(integer)) return integer;
		return null;
	}

	async float(number) {
		number = parseFloat(number);
		if (!isNaN(number)) return number;
		return null;
	}

	async url(hyperlink) {
		const res = url.parse(hyperlink);
		if (res.protocol && res.hostname) return hyperlink;
		return null;
	}

}

Resolver.regex = {
	userOrMember: new RegExp('^(?:<@!?)?(\\d{17,19})>?$'),
	channel: new RegExp('^(?:<#)?(\\d{17,19})>?$'),
	role: new RegExp('^(?:<@&)?(\\d{17,19})>?$'),
	snowflake: new RegExp('^(\\d{17,19})$')
};

module.exports = Resolver;