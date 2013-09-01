/*!
 * Quantum - http levels definition
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

level.push('get', 'green');
level.push('post', 'blue');
level.push('put', 'magenta');
level.push('head', 'yellow');
level.push('delete', 'red');
level.push('options', 'yellow');
level.push('trace', 'blue');
level.push('copy', 'cyan');
level.push('lock', 'gray');
level.push('mkcol', 'gray');
level.push('move', 'magenta');
level.push('propfind', 'cyan');
level.push('proppatch', 'blue');
level.push('unlock', 'default');
level.push('report', 'yellow');
level.push('mkactivity', 'gray');
level.push('checkout', 'green');
level.push('merge', 'yellow');
level.push('msearch', 'blue');
level.push('notify', 'cyan');
