var fs = require('fs')
  , join = require('path').join
  , Promise = require('oath')
  , _ = require('../utils');

module.exports = function logFile (path, spec) {
  spec = spec || {};
  var theme = require('../themes')[spec.reporter || 'json'];

  return function logFile (logger) {
    var defer = new Promise();

    // recursively make directories to log file
    _.mkdir(path, 0755, function (err) {
      if (err) return defer.reject(err);
      var filename = spec.filename || logger.namespace + '.log'
        , file = join(path, filename)
        , stream = fs.createWriteStream(file, { flags: 'a' } )
        , useLevels = spec.levels || Object.keys(logger.levels.levels);

      // mount listenings
      useLevels.forEach(function (name) {
        logger.on([ 'log', '*', name ], function (event) {
          var str = theme(logger, event);
          stream.write(str);
        });
      });

      defer.resolve();
    });

    return defer.promise;
  };
};
