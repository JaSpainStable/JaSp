const { applyClass } = require('../util/util');

class Piece {

    /**
     * Cargar esta pieza
     * @since 0.0.1
     * @returns {Piece} La nueva pieza recargada
     */
    async load() {
        const piece = this.client[`${this.type}s`].load(this.dir, this.file);
        await piece.init();
        return piece;
    }

    disable() {
        this.enabled = false;
        return this;
    }

    enable() {
        this.enabled = false;
        return this;
    }

    toString() {
        return this.name;
    }

    static applyClass(structure, skips) {
        applyClass(Piece, structure, skips);
    }
}

module.exports = Piece;