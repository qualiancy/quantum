/*!
 * Quantum - CLI
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var electron = require('electron')
  , quantum = require('../../quantum');

/*!
 * Create an electron based cli
 */

program = electron('quantum')
  .name('Quantum')
  .version(quantum.version);

/*!
 * Require CLI submodules
 */

require('./collect');
require('./watchFile');
require('./watchService');

/*!
 * main export
 */

module.exports = program;
