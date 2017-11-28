const { Command, Stopwatch } = require('../../index');
const { inspect } = require('util');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            permLevel: 10,
            description: 'Ejecuta y evalua codigo Javascript',
            usage: '<expression:str>'
        });
    }

    async run(msg, [code]) {
        try {
            var timer = new Stopwatch();
            let evaled = eval(code);
            timer = timer.stop();
            if (evaled instanceof Promise) evaled = await evaled;
            if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: 0 });
            msg.send(`Executed in ${timer.toUP()} | 🔍 **Inspect:**`);
            msg.sendCode('js', this.client.methods.util.clean(evaled));
        } catch (err) {
            msg.send(` \`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(err))}`);
            if (err.stack) this.client.emit('error', err.stack);
        }
    }
}