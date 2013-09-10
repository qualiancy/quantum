/*!
 * Quantum - syslog levels definition
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

var level = module.exports = new LevelSet('syslog');

/*!
 * Level Definition
 */

level.push('debug', 'blue');
level.push('info', 'green');
level.push('notice', 'yellow');
level.push('warn', 'red');
level.push('error', 'red');
level.push('crit', 'red');
level.push('alert', 'yellow');
level.push('emerg', 'red');
