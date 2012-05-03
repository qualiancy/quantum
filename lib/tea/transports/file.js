var fs = require('fs')
  , join = require('path').join
  , Promise = require('oath')
  , reporters = require('../reporters')
  , _ = require('../utils');

module.exports = function (path, spec) {
  spec = spec || {};

  return function (logger) {
    var defer = new Promise();

    // recursively make directories to log file
    _.mkdir(path, 0755, function (err) {
      if (err) return defer.reject(err);
      var filename = spec.filename || logger.namespace + '.log'
        , file = join(path, filename)
        , stream = fs.createWriteStream(file, { flags: 'a' } )
        , useLevels = spec.levels || Object.keys(logger.levels.levels)
        , stringify = reporters[spec.reporter || 'json'];

      // mount listenings
      useLevels.forEach(function (name) {
        logger.on([ 'log', '*', name ], function (msg, data, tokens) {
          var str = stringify(logger, name, msg, data, tokens);
          stream.write(str);
        });
      });

      defer.resolve();
    });

    return defer.promise;
  }
};
