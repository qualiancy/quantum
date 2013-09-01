/*!
 * Quantum - CRUD levels definition
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

var level = module.exports = new LevelSet('crud');

/*!
 * Level Definition
 */

level.push('create', 'green');
level.push('read', 'blue');
level.push('update', 'magenta');
level.push('delete', 'red');
