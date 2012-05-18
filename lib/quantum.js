/*!
 * Quantum
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fs')
  , path = require('path')

/*!
 * Quantum dependancies
 */

var Logger = require('./quantum/logger');

/*!
 * Main Export
 */

var exports = module.exports = function (namespace, opts) {
  return new Logger(namespace, opts);
};

/*!
 * Tea version
 */

exports.version = '0.1.7';

/**
 * Logger constructor export
 */

exports.Logger = Logger;

/**
 * Service constructor export
 */

exports.Service = require('./quantum/service');

/**
 * # createService
 *
 * Create a new Service instance and mount a
 * specified logger for which inbound log events
 * will be proxied.
 *
 * @param {Logger} constructed logger
 * @api public
 */

exports.createService = function (logger) {
  return new exports.Service(logger);
};

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
