const { applyClass } = require('../util/util');
const fs = require('fs-nextra');
const { join } = require('path');

class Store {

    init() {
        return Promise.all(this.map(piece => piece.enabled ? piece.init() : true));
    }

    load(dir, file) {
        const lco = Array.isArray(file) ? join(dir, ...file) : join(dir, file);
        let piece = null;
        try {
            piece = this.set(new (require(lco))(this.client, dir, file));
        } catch (err) {
            this.client.emit('log', err);
            const error = err.message.endsWith('not a constructor') ? new TypeError(`Exported Structure Not A Class`) : err;
        }
        delete require.cache[lco];
        return piece;
    }

    async loadAll() {
        this.clear();
        if (this.coreDir) {
            const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(); });
            if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
        }
        const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(); });
        if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
        return this.size;
    }

    resolve(name) {
        if (name instanceof this.holds) return name;
        return this.get(name);
    }

    toString() {
        return this.name;
    }

    static applyClass(structure, skips) {
        applyClass(Store, structure, skips);
    }
}

module.exports = Store;