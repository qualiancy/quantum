var fs = require('fs')
  , path = require('path')
  , Service = require('./tea/service');

exports.version = '0.0.13';

exports.Logger = require('./tea/logger');

exports.createService = function (logger) {
  return new Service(logger);
};

fs.readdirSync(__dirname + '/tea/transports').forEach(function (filename) {
  if (!/\.js$/.test(filename)) return;
  var name = path.basename(filename, '.js');
  function load () {
    return require('./tea/transports/' + name);
  }
  Object.defineProperty(exports, name, { get: load });
});
