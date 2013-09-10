/*!
 * Quantum
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module Dependancies
 */

var fs = require('fs')
  , path = require('path');

/*!
 * Quantum Dependancies
 */

var Logger = require('./quantum/logger');

/*!
 * Main Export
 */

var exports = module.exports = function (namespace, opts) {
  return new Logger(namespace, opts);
};

/*!
 * Module Version
 */

exports.version = '0.4.0';

/**
 * Logger Constructor Export
 */

exports.Logger = Logger;

/**
 * Expose Utils for Custom Themes
 */

exports.utils = require('./quantum/utils');

exports.streams = require('./quantum/streams');
