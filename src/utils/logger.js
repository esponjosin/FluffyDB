const util = require('util');

module.exports = {
    log: (...args) => console.log(`[FluffyDB] ${util.format( ...args)}`),
    warn: (...args) => console.log(`[WARN FluffyDB] ${util.format(...args)}`),
    error: (...args) => console.log(`[ERROR FluffyDB] ${util.format(...args)}`),
}