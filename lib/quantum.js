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

exports.version = '0.3.1';

/**
 * Logger Constructor Export
 */

exports.Logger = Logger;

/**
 * Expose Utils for Custom Themes
 */

exports.utils = require('./quantum/utils');

/*!
 * For each transport, provide getter on export that
 * will lazy-load the transport for use.
 */

exports.transports = {};

fs.readdirSync(__dirname + '/quantum/transports')
  .forEach(function (filename) {
    if (!/\.js$/.test(filename)) return;
    var name = path.basename(filename, '.js');
    function load () {
      return require('./quantum/transports/' + name);
    }
    Object.defineProperty(exports, name, { get: load });
    Object.defineProperty(exports.transports, name, { get: load, enumerable: true });
  });
