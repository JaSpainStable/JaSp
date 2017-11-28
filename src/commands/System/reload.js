const { Command, Stopwatch } = require('../../index');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permLevel: 10,
            description: 'Recarga una pieza o todas la piezas de un Store',
            usage: '<Store:store|Piece:piece>'
        });
    }

    async run(msg, [piece]) {
        if (piece instanceof this.client.methods.Collection) {
            const timer = new Stopwatch();
            await piece.loadAll();
            await piece.init();
            return msg.send(`${msg.client.languages.default.get('COMMAND_RELOAD_ALL', piece)} (Took: ${timer.stop()})`);
        }
        return piece.load()
            .then(itm => msg.send(msg.client.languages.default.get('COMMAND_RELOAD', itm.type, itm.name)))
            .catch(err => {
                this.client[`${piece.type}s`].set(piece);
                msg.send(`🚫 ${err}`);
            });
    }
};