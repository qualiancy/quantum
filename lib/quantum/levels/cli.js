/*!
 * Quantum - cli levels definition
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Internal dependances
 */

var LevelSet = require('../levelset');

/*!
 * Primary exports
 */

var level = module.exports = new LevelSet('cli');

/*!
 * Level Definition
 */

level.push('debug', 'blue');
level.push('info', 'green');
level.push('help', 'yellow');
level.push('prompt', 'gray');
level.push('warn', 'red');
level.push('error', 'red');
