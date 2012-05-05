/*!
 * tea
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fs')
  , path = require('path')

/*!
 * Tea dependancies
 */

var Logger = require('./tea/logger');

/*!
 * Main Export
 */

var exports = module.exports = function (namespace, opts) {
  return new Logger(namespace, opts);
};

/*!
 * Tea version
 */

exports.version = '0.0.13';

/**
 * Logger constructor export
 */

exports.Logger = Logger;

/**
 * Service constructor export
 */

exports.Service = require('./tea/service');

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

fs.readdirSync(__dirname + '/tea/transports')
  .forEach(function (filename) {
    if (!/\.js$/.test(filename)) return;
    var name = path.basename(filename, '.js');
    function load () {
      return require('./tea/transports/' + name);
    }
    Object.defineProperty(exports, name, { get: load });
  });
