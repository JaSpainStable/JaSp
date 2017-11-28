const zws = String.fromCharCode(8203);
const { promisify } = require('util');
const { exec } = require('child_process');
let sensPat;

/**
 * Clase que contiene funciones estaticas de utilidad
 */
class Util {

    /**
     * Esta clase no tiene que ser iniciada con new
     * @since 0.0.1
     */
    constructor() {
        throw new Error('Esta clase no se inicializa con new');
    }

    /**
     * Hace que una cadena se marque como un Codeblock
     * @param {string} language El lenguage del Codeblock
     * @param {string} expression La expresion a la cual envolver el Codeblock
     * @returns {string}
     */
    static codeBlock(language, expression) {
        return `\`\`\`${language}\n${expression || zws}\`\`\``;
    }

    /**
     * Limpia la informacion sensible de un string
     * @since 0.0.1
     * @param {string} text El texto a limpiar
     * @returns {string}
     */
    static clean(text) {
        if(typeof text === 'string') return text.replace(sensPat, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
        return text;
    }

    /**
     * Inicia un patron sensible para clean()
     * @since 0.0.1
     * @private
     * @param  {JaSpClient} client El cliente de JaSp
     */
    static initSensitive(client) {
        const patt = [];
        if (client.token) patt.push(client.token);
        if (client.user.email) patt.push(client.user.email);
        if (client.password) patt.push(client.password);
        sensPat = new RegExp(patt.join('|'), 'gi');
    }
    /**
     * Convierte un string en un Title Case
     * @since 0.0.1
     * @param  {string} string El string para convertir
     * @returns {string}
     */
    static toCaseTitle(string) {
        return str.replace(/\w\S*/g, (txt) => text.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    /**
     * @param  {Error} error Objeto de error
     * @param  {number} code El codigo de estado a asignar a el error
     * @returns {Error}
     */
    static newError(error, code) {
        if (error.status) {
            this.statusCode = error.response.res.statusCode;
            this.statusMessage = error.response.res.statusMessage;
            this.code = error.response.body.code;
            this.message = error.response.body.message;
            return this;
        }
        this.code = code || null;
        this.message = error;
        this.stack = error.stack || null;
        return this;
    }
    /**
     * Limpia un string the injerciones de regex
     * @since 0.0.1
     * @param  {string} string
     * @returns {string}
     */
    static regExpEsc(string) {
        return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    /**
     * aplica una interfaz a una clase
     * @param  {Object} base La interfaz la cual aplicar a la estructura
     * @param  {Object} structure la estructura que aplicar a la clase
     * @param  {string[]} [skips=[]] Los metodos para saltar cunado se aplica esta interfaz
     */
    static applyClass(base, structure, skips = []) {
        for (const method of Object.getOwnPropertyNames(base.prototype)) {
            if (!skips.includes(method)) Object.defineProperty(structure.prototype, method, Object.getOwnPropertyDescriptor(base.prototype, method));
        }
    }
}

/**
 * @typedef {Object} execOptions
 * @memberOf {Util}
 * @property {string} [cwd=process.cwd()] El directorio para los procesos
 * @property {Object} [env={}] Parejas de Valor-clave de entorno
 * @property {string} [encoding='utf8'] El encoding a usar
 * @property {string} [shell=os === unix ? '/bin/sh' : process.env.ComSpec] La terminal donde ejecutar comandos
 * @property {number} [timeout=0]
 * @property {number} [maxBuffer=200*1024] Maximo valor en datos permitidos en stdout o stderr. Si lo excede el proceso hijo se termina.
 * @property {string|number} [killSignal='SIGTERM'] <string> | <integer> (Por defecto: 'SIGTERM')
 * @property {number} [uid] Establece la identidad del usuario en el proceso
 * @property {number} [gid] Establece la identidad del grupo en el proceso
 */

/**
 * Version promisified de child_process.exec para usar con await
 * @method
 * @since 0.0.1
 * @param {string} command El comando a ejecutar
 * @param {execOptions} options Las opciones que pasar a la ejecucion
 * @returns {string}
 */
Util.exec = promisify(exec);

/**
 * Vesion promisified de setTimeout para usar con await
 * @since 0.0.1
 * @param {number} delay La cantidad de tiempo en milisegundos de delay
 * @param {any} args Cualquier argumento para pasar al .then
 * @returns {Promise<any>} Los valores de los argumentos pasados en el
 */
Util.sleep = promisify(setTimeout);

module.exports = Util;