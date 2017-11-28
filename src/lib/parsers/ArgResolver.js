const Resolver = require('./Resolver');

class ArgResolver extends Resolver {
    
        async piece(arg, currentUsage, possible, repeat, msg) {
            for (const store of this.client.pieceStores.values()) {
                const piece = store.get(arg);
                if (piece) return piece;
            }
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'piece');
        }

        async store(arg, currentUsage, possible, repeat, msg) {
            const store = this.client.pieceStores.get(arg);
            if (store) return store;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'store');
        }

        async command(...args) {
            return this.cmd(...args);
        }

        async cmd(arg, currentUsage, possible, repeat, msg) {
            const command = this.client.commands.get(arg);
            if (command) return command;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'command');
        }

        async event(arg, currentUsage, possible, repeat, msg) {
            const event = this.client.events.get(arg);
            if (event) return event;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'event');
        }

        async monitor(arg, currentUsage, possible, repeat, msg) {
            const monitor = this.client.monitors.get(arg);
            if (monitor) return monitor;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'monitor');
        }

        async language(arg, currentUsage, possible, repeat, msg) {
            this.client.emit('log', 'si');
            const language = this.client.languages.get(arg);
            if (language) return language;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'language');
        }

        message(...args) {
            return this.msg(...args);
        }

        async msg(arg, currentUsage, possible, repeat, msg) {
            const message = await super.msg(arg, msg.channel);
            if (message) return message;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_MSG', currentUsage.possibles[possible].name);
        }

        mention(...args) {
            return this.user(...args);
        }

        async user(arg, currentUsage, possible, repeat, msg) {
            const user = await super.user(arg);
            if (user) return user;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_USER', currentUsage.possibles[possible].name);
        }

        async member(arg, currentUsage, possible, repeat, msg) {
            const member = await super.member(arg, msg.guild);
            if (member) return member;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_MEMBER', currentUsage.possibles[possible].name);
        }

        async channel(arg, currentUsage, possible, repeat, msg) {
            const channel = await super.channel(arg);
            if (channel) return channel;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_CHANNEL', currentUsage.possibles[possible].name);
        }

        async guild(arg, currentUsage, possible, repeat, msg) {
            const guild = await super.guild(arg);
            if (guild) return guild;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_GUILD', currentUsage.possibles[possible].name);
        }

        async role(arg, currentUsage, possible, repeat, msg) {
            const role = await super.role(arg, msg.guild);
            if (role) return role;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_ROLE', currentUsage.possibles[possible].name);
        }

        async literal(arg, currentUsage, possible, repeat, msg) {
            if (arg.toLowerCase() === currentUsage.possibles[possible].name.toLowerCase()) return arg.toLowerCase();
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_LITERAL', currentUsage.possibles[possible].name);
        }

        boolean(...args) {
            return this.bool(...args);
        }

        async bool(arg, currentUsage, possible, repeat, msg) {
            const boolean = await super.boolean(arg);
            if (boolean !== null) return boolean;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_BOOL', currentUsage.possibles[possible].name);
        }

        string(...args) {
            return this.str(...args);
        }

        async str(arg, currentUsage, possible, repeat, msg) {
            const { min, max } = currentUsage.possibles[possible];
            if (this.constructor.minOrMax(arg.length, min, max, currentUsage, possible, repeat, msg, msg.client.languages.default.get('RESOLVER_STRING_SUFFIX'))) return arg;
            return null;
        }

        integer(...args) {
            return this.int(...args);
        }

        async int(arg, currentUsage, possible, repeat, msg) {
            const { min, max } = currentUsage.possibles[possible];
            arg = await super.integer(arg);
            if (arg === null) {
                if (currentUsage.type === 'optional' && !repeat) return null;
                throw msg.language.get('RESOLVER_INVALID_INT', currentUsage.possibles[possible].name);
            }
            if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat, msg)) return arg;
            return null;
        }

        num(...args) {
            return this.float(...args);
        }

        number(...args) {
            return this.float(...args);
        }

        async float(arg, currentUsage, possible, repeat, msg) {
            const { min, max } = currentUsage.possibles[possible];
            arg = await super.float(arg);
            if (arg === null) {
                if (currentUsage.type === 'optional' && !repeat) return null;
                throw msg.language.get('RESOLVER_INVALID_FLOAT', currentUsage.possibles[possible].name);
            }
            if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat, msg)) return arg;
            return null;
        }

        async reg(arg, currentUsage, possible, repeat, msg) {
            const results = currentUsage.possibles[possible].regex.exec(arg);
            if (results !== null) return results;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_REGEX_MATCH', currentUsage.possibles[possible].name, currentUsage.possibles[possible].regex.toString());
        }

        regex(...args) {
            return this.reg(...args);
        }

        regexp(...args) {
            return this.reg(...args);
        }

        async url(arg, currentUsage, possible, repeat, msg) {
            const hyperlink = await super.url(arg);
            if (hyperlink !== null) return hyperlink;
            if (currentUsage.type === 'optional' && !repeat) return null;
            throw msg.language.get('RESOLVER_INVALID_URL', currentUsage.possibles[possible].name);
        }
    
        static minOrMax(value, min, max, currentUsage, possible, repeat, msg, suffix = '') {
            if (min && max) {
                if (value >= min && value <= max) return true;
                if (currentUsage.type === 'optional' && !repeat) return false;
                if (min === max) throw msg.language.get('RESOLVER_MINMAX_EXACTLY', currentUsage.possibles[possible].name, min, suffix);
                throw msg.language.get('RESOLVER_MINMAX_BOTH', currentUsage.possibles[possible].name, min, max, suffix);
            } else if (min) {
                if (value >= min) return true;
                if (currentUsage.type === 'optional' && !repeat) return false;
                throw msg.language.get('RESOLVER_MINMAX_MIN', currentUsage.possibles[possible].name, min, suffix);
            } else if (max) {
                if (value <= max) return true;
                if (currentUsage.type === 'optional' && !repeat) return false;
                throw msg.language.get('RESOLVER_MINMAX_MAX', currentUsage.possibles[possible].name, max, suffix);
            }
            return true;
        }
    
    }
    
    module.exports = ArgResolver;