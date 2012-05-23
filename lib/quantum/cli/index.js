/*!
 * Quantum - CLI
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var electron = require('electron');

/*!
 * Create an electron based cli
 */

program = electron('quantum');

/*!
 * main export
 */

module.exports = program;
